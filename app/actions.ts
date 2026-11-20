'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { Section } from '@prisma/client'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/lib/session'
import { escapeHtml, parseHttpUrl, sanitizeArticleHtml } from '@/lib/sanitize'
import { isAdLocation } from '@/lib/ads'
import { LIMITES, MOTIVOS_CONTACTO, asegurarTablaMensajes } from '@/lib/mensajes'
import {
  asegurarTablaSugerencias, forzarSincronizacion, leerSugerencias, sincronizarSugerencias, type EstadoSugerencia,
} from '@/lib/sugerencias'
import { SECCIONES } from '@/lib/secciones'

export type ActionResult = { ok: true } | { ok: false; error: string }

const fail = (error: string): ActionResult => ({ ok: false, error })

function text(formData: FormData, field: string): string {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

function isSection(value: string): value is Section {
  return Object.values(Section).includes(value as Section)
}

// --- AUTENTICACIÓN ADMIN ---

// Comparación en tiempo constante para no filtrar información por tiempos de respuesta
function samePassword(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export async function loginAdmin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get('password')
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  // Verificación estricta: lee la variable de Netlify sin texto plano en el código
  if (!ADMIN_PASSWORD) {
    return { error: 'ADMIN_PASSWORD no está configurada en las variables de entorno.' }
  }

  if (typeof password !== 'string' || !samePassword(password, ADMIN_PASSWORD)) {
    // Pequeña demora para frenar intentos automáticos de adivinar la contraseña
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { error: 'Contraseña incorrecta' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE, // Sesión por 7 días
    path: '/',
  })
  redirect('/admin')
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

// --- AUTORES ---

export async function getAutores() {
  await requireAdmin()
  return await prisma.author.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function crearAutor(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const name = text(formData, 'name')
  const bio = text(formData, 'bio')
  const profilePicRaw = text(formData, 'profilePic')

  if (!name) return fail('El nombre del autor es obligatorio.')

  let profilePic: string | null = null
  if (profilePicRaw) {
    profilePic = parseHttpUrl(profilePicRaw)
    if (!profilePic) return fail('La foto de perfil debe ser una URL que empiece con http:// o https://')
  }

  await prisma.author.create({
    data: { name, bio: bio || null, profilePic }
  })

  revalidatePath('/admin')
  return { ok: true }
}

export async function borrarAutor(id: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Autor inválido.')

  const notas = await prisma.article.count({ where: { authorId: id } })
  if (notas > 0) {
    return fail('No se puede borrar un autor que tiene notas publicadas. Borrá sus notas primero.')
  }

  await prisma.author.deleteMany({ where: { id } })

  revalidatePath('/admin')
  return { ok: true }
}

// --- NOTAS / ARTÍCULOS ---

export async function getNotas() {
  await requireAdmin()
  await sincronizarSugerencias()
  return await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      section: true,
      author: { select: { name: true } },
    },
  })
}

type DatosArticulo = {
  title: string
  header: string
  section: Section
  featuredImage: string
  content: string
  authorId: string
}

/** Valida los campos de una nota y resuelve el autor. Lo usan crearNota y actualizarNota. */
async function prepararArticulo(
  formData: FormData,
  content: string
): Promise<{ ok: false; error: string } | { ok: true; datos: DatosArticulo }> {
  const title = text(formData, 'title')
  const header = text(formData, 'header')
  const section = text(formData, 'section')
  const imagenTexto = text(formData, 'featuredImage')
  // La imagen es opcional: sin foto, el sitio muestra una placa con el nombre de la sección
  const featuredImage = imagenTexto ? parseHttpUrl(imagenTexto) : ''
  let authorId = text(formData, 'authorId')

  if (!title || !header) return { ok: false, error: 'El título y la bajada son obligatorios.' }
  if (!isSection(section)) return { ok: false, error: 'Elegí una sección válida.' }
  if (featuredImage === null) {
    return { ok: false, error: 'La imagen principal debe ser una URL que empiece con http:// o https://' }
  }

  // El cuerpo se limpia en el servidor: nunca se guarda HTML peligroso
  const cleanContent = sanitizeArticleHtml(typeof content === 'string' ? content : '')
  if (!cleanContent.replace(/<[^>]*>/g, '').trim()) {
    return { ok: false, error: 'El cuerpo de la nota está vacío.' }
  }

  if (authorId) {
    const author = await prisma.author.findUnique({ where: { id: authorId } })
    if (!author) return { ok: false, error: 'El autor elegido ya no existe.' }
  } else {
    let fallbackAuthor = await prisma.author.findFirst()
    if (!fallbackAuthor) {
      fallbackAuthor = await prisma.author.create({
        data: { name: 'Redacción El Telégrafo', bio: 'Equipo editorial' }
      })
    }
    authorId = fallbackAuthor.id
  }

  return { ok: true, datos: { title, header, section, featuredImage, content: cleanContent, authorId } }
}

export async function crearNota(formData: FormData, content: string): Promise<ActionResult> {
  await requireAdmin()

  const preparado = await prepararArticulo(formData, content)
  if (!preparado.ok) return fail(preparado.error)

  await prisma.article.create({ data: { ...preparado.datos, published: true } })

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function borrarNota(id: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Nota inválida.')

  await prisma.article.deleteMany({ where: { id } })

  revalidatePath('/', 'layout')
  return { ok: true }
}

// --- PUBLICIDAD ---

export async function getAnuncios() {
  await requireAdmin()
  return await prisma.advertisement.findMany({
    orderBy: [{ location: 'asc' }, { name: 'asc' }]
  })
}

/** Crea un anuncio o, si el formulario trae `id`, actualiza el existente. */
export async function guardarAnuncio(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const id = text(formData, 'id')
  const name = text(formData, 'name')
  const location = text(formData, 'location')
  const mode = text(formData, 'mode')
  const isActive = formData.get('isActive') === 'on'

  if (!name) return fail('Poné un nombre para identificar el anuncio (por ejemplo, el anunciante).')
  if (!isAdLocation(location)) return fail('Elegí una ubicación válida.')

  let adCode: string

  if (mode === 'imagen') {
    // Imagen con enlace: el HTML se arma acá, con las URLs validadas
    const imageUrl = parseHttpUrl(text(formData, 'imageUrl'))
    const linkRaw = text(formData, 'linkUrl')
    const linkUrl = linkRaw ? parseHttpUrl(linkRaw) : null

    if (!imageUrl) return fail('La imagen del anuncio debe ser una URL que empiece con http:// o https://')
    if (linkRaw && !linkUrl) return fail('El enlace del anuncio debe ser una URL que empiece con http:// o https://')

    const img = `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" />`
    adCode = linkUrl ? `<a href="${escapeHtml(linkUrl)}">${img}</a>` : img
  } else {
    adCode = text(formData, 'adCode')
    if (!adCode) return fail('Pegá el código HTML del anuncio.')
    if (adCode.length > 20000) return fail('El código del anuncio es demasiado largo.')
  }

  if (id) {
    const result = await prisma.advertisement.updateMany({
      where: { id },
      data: { name, location, adCode, isActive }
    })
    if (result.count === 0) return fail('El anuncio ya no existe.')
  } else {
    await prisma.advertisement.create({
      data: { name, location, adCode, isActive }
    })
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function cambiarEstadoAnuncio(id: string, isActive: boolean): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Anuncio inválido.')

  await prisma.advertisement.updateMany({
    where: { id },
    data: { isActive: Boolean(isActive) }
  })

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function borrarAnuncio(id: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Anuncio inválido.')

  await prisma.advertisement.deleteMany({ where: { id } })

  revalidatePath('/', 'layout')
  return { ok: true }
}

// --- MENSAJES DE LECTORES ---

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Guarda un mensaje del formulario de contacto o una carta de lectores.
 * Es la única acción pública (sin sesión): por eso valida y limita todo.
 */
export async function enviarMensaje(formData: FormData): Promise<ActionResult> {
  // Campo trampa: las personas no lo ven; los robots lo completan
  if (text(formData, 'sitio')) return { ok: true }

  const kind = text(formData, 'kind') === 'CARTA' ? 'CARTA' : 'CONTACTO'
  const name = text(formData, 'name')
  const email = text(formData, 'email')
  const locality = text(formData, 'locality')
  const subject = text(formData, 'subject')
  const body = text(formData, 'body')

  if (!name) return fail('Escribí tu nombre y apellido.')
  if (!email || !EMAIL.test(email)) return fail('Escribí un correo electrónico válido para que podamos responderte.')
  if (!body) return fail(kind === 'CARTA' ? 'Falta el texto de la carta.' : 'Falta el mensaje.')
  if (kind === 'CARTA' && !locality) return fail('Indicá tu localidad.')
  if (kind === 'CONTACTO' && !(MOTIVOS_CONTACTO as readonly string[]).includes(subject)) {
    return fail('Elegí el motivo del mensaje.')
  }
  if (
    name.length > LIMITES.nombre || email.length > LIMITES.email || locality.length > LIMITES.localidad ||
    subject.length > LIMITES.asunto || body.length > LIMITES.mensaje
  ) {
    return fail('El mensaje es demasiado largo. Acortalo y volvé a enviarlo.')
  }

  try {
    await asegurarTablaMensajes()

    // Freno simple contra envíos masivos
    const ultimaHora = await prisma.message.count({
      where: { createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
    })
    if (ultimaHora >= 60) return fail('Estamos recibiendo muchos mensajes. Probá de nuevo en un rato.')

    await prisma.message.create({
      data: { kind, name, email, locality: locality || null, subject: subject || null, body },
    })
  } catch (error) {
    console.error('No se pudo guardar el mensaje:', error)
    return fail('No pudimos guardar tu mensaje. Probá de nuevo en unos minutos.')
  }

  return { ok: true }
}

export async function getMensajes() {
  await requireAdmin()
  await asegurarTablaMensajes()
  return await prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 300 })
}

export async function marcarMensajeLeido(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Mensaje inválido.')
  await asegurarTablaMensajes()
  await prisma.message.updateMany({ where: { id }, data: { read: Boolean(read) } })
  return { ok: true }
}

export async function borrarMensaje(id: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Mensaje inválido.')
  await asegurarTablaMensajes()
  await prisma.message.deleteMany({ where: { id } })
  return { ok: true }
}

// --- NOTAS AUTOMÁTICAS (búsqueda diaria) ---

export async function getSugerencias() {
  await requireAdmin()
  await sincronizarSugerencias()
  await asegurarTablaSugerencias()

  const sugerencias = leerSugerencias()
  const filas = sugerencias.length
    ? await prisma.suggestionStatus.findMany({ where: { id: { in: sugerencias.map((s) => s.id) } } })
    : []
  const estados = new Map(filas.map((f) => [f.id, f]))
  const orden = SECCIONES.map((s) => s.valor as string)

  return sugerencias
    .map((s) => ({
      id: s.id,
      fecha: s.fecha,
      seccion: s.seccion,
      titulo: s.titulo,
      bajada: s.bajada,
      fuentes: s.fuentes,
      estado: (estados.get(s.id)?.status ?? 'PENDIENTE') as EstadoSugerencia,
      articleId: estados.get(s.id)?.articleId ?? null,
    }))
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || orden.indexOf(a.seccion) - orden.indexOf(b.seccion))
}

/** Saca del sitio una nota automática y evita que se vuelva a cargar. */
export async function quitarAutomatica(id: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Nota inválida.')

  await asegurarTablaSugerencias()
  const estado = await prisma.suggestionStatus.findUnique({ where: { id } })
  if (estado?.articleId) await prisma.article.deleteMany({ where: { id: estado.articleId } })
  await prisma.suggestionStatus.upsert({
    where: { id },
    create: { id, status: 'DESCARTADA' },
    update: { status: 'DESCARTADA', articleId: null },
  })

  revalidatePath('/', 'layout')
  return { ok: true }
}

/** Vuelve a publicar una nota automática que se había quitado. */
export async function republicarAutomatica(id: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Nota inválida.')

  await asegurarTablaSugerencias()
  await prisma.suggestionStatus.deleteMany({ where: { id, status: 'DESCARTADA' } })
  forzarSincronizacion()
  await sincronizarSugerencias()

  revalidatePath('/', 'layout')
  return { ok: true }
}

// --- EDICIÓN DE NOTAS ---

export async function getNota(id: string) {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return null
  return await prisma.article.findUnique({
    where: { id },
    select: { id: true, title: true, header: true, section: true, featuredImage: true, content: true, authorId: true },
  })
}

export async function actualizarNota(id: string, formData: FormData, content: string): Promise<ActionResult> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return fail('Nota inválida.')

  const preparado = await prepararArticulo(formData, content)
  if (!preparado.ok) return fail(preparado.error)

  const resultado = await prisma.article.updateMany({ where: { id }, data: preparado.datos })
  if (resultado.count === 0) return fail('La nota ya no existe.')

  revalidatePath('/', 'layout')
  return { ok: true }
}
