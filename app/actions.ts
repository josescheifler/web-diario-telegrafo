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

export async function crearNota(formData: FormData, content: string): Promise<ActionResult> {
  await requireAdmin()

  const title = text(formData, 'title')
  const header = text(formData, 'header')
  const section = text(formData, 'section')
  const featuredImage = parseHttpUrl(text(formData, 'featuredImage'))
  let authorId = text(formData, 'authorId')

  if (!title || !header) return fail('El título y la bajada son obligatorios.')
  if (!isSection(section)) return fail('Elegí una sección válida.')
  if (!featuredImage) return fail('La imagen principal debe ser una URL que empiece con http:// o https://')

  // El cuerpo se limpia en el servidor: nunca se guarda HTML peligroso
  const cleanContent = sanitizeArticleHtml(typeof content === 'string' ? content : '')
  if (!cleanContent.replace(/<[^>]*>/g, '').trim()) {
    return fail('El cuerpo de la nota está vacío.')
  }

  if (authorId) {
    const author = await prisma.author.findUnique({ where: { id: authorId } })
    if (!author) return fail('El autor elegido ya no existe.')
  } else {
    let fallbackAuthor = await prisma.author.findFirst()
    if (!fallbackAuthor) {
      fallbackAuthor = await prisma.author.create({
        data: { name: 'Redacción El Telégrafo', bio: 'Equipo editorial' }
      })
    }
    authorId = fallbackAuthor.id
  }

  await prisma.article.create({
    data: {
      title,
      header,
      section,
      featuredImage,
      content: cleanContent,
      authorId,
      published: true
    }
  })

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
