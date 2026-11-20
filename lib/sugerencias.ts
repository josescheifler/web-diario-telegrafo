import { connection } from 'next/server'
import prisma from '@/lib/prisma'
import datos from '@/contenido/sugerencias.json'
import { validarSugerencias } from '@/lib/validar-sugerencias.mjs'
import { escapeHtml, sanitizeArticleHtml } from '@/lib/sanitize'
import { SECCIONES } from '@/lib/secciones'
import type { Section } from '@prisma/client'

// Notas automáticas: la búsqueda diaria (ver PAUTAS-SUGERENCIAS.md) las escribe en
// contenido/sugerencias.json y el sitio las publica solo. La tabla SuggestionStatus
// guarda cuáles ya se publicaron (o se quitaron), para no cargarlas dos veces.

/** Si es false, las notas automáticas no se publican solas (quedan solo en el archivo). */
export const PUBLICAR_AUTOMATICAMENTE = true

/** Solo se publican las notas de los últimos días: una vieja que no entró, ya no sirve. */
const DIAS_VIGENCIA = 3

export type Fuente = { medio: string; url: string; citar: boolean }
export type Foto = { url: string; credito: string }

export type Sugerencia = {
  id: string
  fecha: string
  seccion: string
  titulo: string
  bajada: string
  cuerpo: string
  fuentes: Fuente[]
  foto: Foto | null
}

export type EstadoSugerencia = 'PENDIENTE' | 'PUBLICADA' | 'DESCARTADA'

let cache: Sugerencia[] | null = null

/** Las notas válidas del archivo. Las mal armadas se omiten (y se avisa en el log). */
export function leerSugerencias(): Sugerencia[] {
  if (cache) return cache
  const { notas, errores } = validarSugerencias(datos as unknown)
  if (errores.length > 0) console.warn('Notas automáticas omitidas por estar mal armadas:', errores)
  cache = notas
  return cache
}

/**
 * Párrafo final con las fuentes que se citan y el crédito de la foto.
 * Las fuentes con "citar": false no se nombran (se usan solo como referencia interna).
 */
export function htmlDeFuentes(fuentes: Fuente[], foto: Foto | null = null): string {
  const citadas = fuentes.filter((f) => f.citar)
  const partes: string[] = []
  if (citadas.length > 0) {
    const enlaces = citadas.map((f) => `<a href="${escapeHtml(f.url)}">${escapeHtml(f.medio)}</a>`).join(', ')
    partes.push(`${citadas.length > 1 ? 'Fuentes' : 'Fuente'}: ${enlaces}.`)
  }
  if (foto) partes.push(`Foto ilustrativa: ${escapeHtml(foto.credito)}.`)
  return partes.length > 0 ? `<p><em>${partes.join(' ')}</em></p>` : ''
}

// La tabla se agregó después de crear la base. Para no depender de que alguien
// corra `prisma db push`, se crea sola antes de la primera consulta.
let tablaLista: Promise<void> | null = null

export function asegurarTablaSugerencias(): Promise<void> {
  if (tablaLista) return tablaLista

  const creando: Promise<void> = prisma
    .$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "SuggestionStatus" (
        "id" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "articleId" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SuggestionStatus_pkey" PRIMARY KEY ("id")
      )`
    )
    .then(() => undefined)
    .catch((error: unknown) => {
      tablaLista = null // se reintenta en la próxima consulta
      throw error
    })

  tablaLista = creando
  return creando
}

/** Autor con el que se firman las notas automáticas. */
async function autorRedaccion(): Promise<string> {
  const nombre = 'Redacción El Telégrafo'
  const existente = await prisma.author.findFirst({ where: { name: nombre }, select: { id: true } })
  if (existente) return existente.id
  const nuevo = await prisma.author.create({ data: { name: nombre, bio: 'Equipo editorial' } })
  return nuevo.id
}

function esVigente(fecha: string): boolean {
  const limite = new Date(Date.now() - DIAS_VIGENCIA * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return fecha >= limite
}

function esClaveDuplicada(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'P2002'
}

let ultimaSincronizacion = 0
let sincronizando: Promise<void> | null = null

/** Hace que la próxima sincronización corra enseguida (por ejemplo, después de "Volver a publicar"). */
export function forzarSincronizacion() {
  ultimaSincronizacion = 0
}

/**
 * Publica las notas automáticas nuevas del archivo. Se llama al abrir la portada,
 * una sección, una nota o el panel; corre como mucho una vez por minuto y nunca
 * hace fallar la página que la llamó.
 */
export async function sincronizarSugerencias(): Promise<void> {
  if (!PUBLICAR_AUTOMATICAMENTE) return
  // Siempre en el momento de la visita, nunca al compilar el sitio
  await connection()
  if (sincronizando) return sincronizando
  if (Date.now() - ultimaSincronizacion < 60_000) return

  sincronizando = (async () => {
    try {
      const vigentes = leerSugerencias().filter((s) => esVigente(s.fecha))
      if (vigentes.length === 0) return

      await asegurarTablaSugerencias()
      const conEstado = await prisma.suggestionStatus.findMany({
        where: { id: { in: vigentes.map((s) => s.id) } },
        select: { id: true },
      })
      const yaVistas = new Set(conEstado.map((e) => e.id))

      // Las más viejas primero; dentro del día, Local al final para que quede como la más reciente
      const orden = SECCIONES.map((s) => s.valor as string)
      const pendientes = vigentes
        .filter((s) => !yaVistas.has(s.id))
        .sort((a, b) => a.fecha.localeCompare(b.fecha) || orden.indexOf(b.seccion) - orden.indexOf(a.seccion) || b.id.localeCompare(a.id))
      if (pendientes.length === 0) return

      const autorId = await autorRedaccion()
      const base = Date.now() - pendientes.length * 1000

      for (const [i, s] of pendientes.entries()) {
        // Se reserva primero: si otra visita llegó antes, esta la saltea
        try {
          await prisma.suggestionStatus.create({ data: { id: s.id, status: 'PUBLICADA', articleId: s.id } })
        } catch {
          continue
        }

        try {
          await prisma.article.create({
            data: {
              id: s.id, // la nota queda en /nota/<id>, una dirección que la búsqueda diaria conoce de antemano
              title: s.titulo,
              header: s.bajada,
              section: s.seccion as Section,
              featuredImage: s.foto?.url ?? '',
              content: sanitizeArticleHtml(s.cuerpo + htmlDeFuentes(s.fuentes, s.foto)),
              authorId: autorId,
              published: true,
              createdAt: new Date(base + i * 1000),
            },
          })
        } catch (error) {
          if (esClaveDuplicada(error)) continue // la nota ya existía: queda como publicada
          await prisma.suggestionStatus.deleteMany({ where: { id: s.id } }) // se reintenta más tarde
          console.error(`No se pudo publicar la nota automática ${s.id}:`, error)
        }
      }
    } catch (error) {
      console.error('No se pudieron publicar las notas automáticas:', error)
    } finally {
      ultimaSincronizacion = Date.now()
      sincronizando = null
    }
  })()

  return sincronizando
}
