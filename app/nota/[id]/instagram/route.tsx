import { ImageResponse } from 'next/og'
import { connection } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import prisma from '@/lib/prisma'
import { CODIGO } from '@/components/Morse'
import { nombreSeccion } from '@/lib/secciones'
import { sincronizarSugerencias } from '@/lib/sugerencias'

// Imagen para Instagram (1080 × 1350, formato vertical) de una nota publicada:
// /nota/<id>/instagram. Se descarga desde el panel o la usa la publicación automática.

const ANCHO = 1080
const ALTO = 1350
const TINTA = '#081424'
const ORO = '#d3ad3e'

const fuente = (archivo: string) => readFile(join(process.cwd(), 'assets/fuentes', archivo))
const fuentes = Promise.all([
  fuente('bodoni-moda-latin-500-normal.woff'),
  fuente('bodoni-moda-latin-500-italic.woff'),
  fuente('archivo-latin-500-normal.woff'),
  fuente('archivo-latin-600-normal.woff'),
])

/**
 * Los bancos de fotos sirven el original (varios MB) si no se pide un tamaño, y la imagen
 * no llega a armarse a tiempo. Se pide una versión de 1080 px de ancho en JPG.
 */
function versionLiviana(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname === 'images.pexels.com') {
      u.search = '?auto=compress&cs=tinysrgb&w=1080&fm=jpg'
    } else if (u.hostname === 'images.unsplash.com') {
      u.searchParams.set('w', '1080')
      u.searchParams.set('q', '80')
      u.searchParams.set('fm', 'jpg')
    } else if (u.hostname === 'upload.wikimedia.org' && !u.pathname.includes('/thumb/')) {
      // /wikipedia/commons/a/ab/Archivo.jpg -> /wikipedia/commons/thumb/a/ab/Archivo.jpg/1080px-Archivo.jpg
      const partes = u.pathname.split('/')
      const archivo = partes.pop()
      if (archivo && partes.length >= 5) {
        u.pathname = [...partes.slice(0, 3), 'thumb', ...partes.slice(3), archivo, `1080px-${archivo}`].join('/')
      }
    }
    return u.toString()
  } catch {
    return url
  }
}

/** Trae la foto de la nota como data URL; si no se puede, la placa sale sin foto. */
async function fotoComoDataUrl(url: string): Promise<string | null> {
  if (!/^https?:\/\//.test(url)) return null
  try {
    const respuesta = await fetch(versionLiviana(url), { signal: AbortSignal.timeout(5000) })
    const tipo = respuesta.headers.get('content-type') ?? ''
    if (!respuesta.ok || !/^image\/(jpeg|png)/.test(tipo)) return null
    const datos = Buffer.from(await respuesta.arrayBuffer())
    if (datos.length > 8 * 1024 * 1024) return null
    return `data:${tipo.split(';')[0]};base64,${datos.toString('base64')}`
  } catch {
    return null
  }
}

/** "El Telégrafo" en Morse, como fila de puntos y rayas dorados que ocupa el ancho disponible. */
function FiletMorse({ ancho }: { ancho: number }) {
  const palabras = 'EL TELEGRAFO'.split(' ').map((p) => [...p].map((l) => CODIGO[l]))
  // Medidas en "puntos": raya = 3, entre señales 1, entre letras 3, entre palabras 7
  const signos: { largo: number; antes: number }[] = []
  palabras.forEach((letras, p) =>
    letras.forEach((codigo, l) =>
      [...codigo].forEach((signo, s) => {
        signos.push({ largo: signo === '-' ? 3 : 1, antes: s > 0 ? 1 : l > 0 ? 3 : p > 0 ? 7 : 0 })
      })
    )
  )
  const unidades = signos.reduce((total, s) => total + s.largo + s.antes, 0)
  const punto = Math.floor(ancho / unidades)
  return (
    <div style={{ display: 'flex' }}>
      {signos.map((s, i) => (
        <div key={i} style={{ width: s.largo * punto, height: punto, marginLeft: s.antes * punto, borderRadius: punto / 2, background: ORO }} />
      ))}
    </div>
  )
}

function recortar(texto: string, maximo: number): string {
  if (texto.length <= maximo) return texto
  return texto.slice(0, maximo).replace(/\s+\S*$/, '') + '…'
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params

  await sincronizarSugerencias()
  const nota = await prisma.article.findUnique({
    where: { id },
    select: { title: true, header: true, section: true, featuredImage: true, content: true, published: true },
  })
  if (!nota || !nota.published) return new Response('No existe esa nota', { status: 404 })

  const [bodoni, bodoniItalica, archivo, archivoSemi] = await fuentes
  const foto = nota.featuredImage ? await fotoComoDataUrl(nota.featuredImage) : null

  // Las fotos de bancos libres llevan su crédito al pie de la nota ("Foto ilustrativa: …"): se repite en la imagen
  const credito = foto ? nota.content.match(/Foto ilustrativa: ([^<]+?)\.?<\/em>/)?.[1]?.trim() ?? null : null

  const largo = nota.title.length
  const tamTitulo = foto ? (largo <= 60 ? 84 : largo <= 100 ? 70 : 58) : largo <= 60 ? 96 : largo <= 100 ? 80 : 66

  // Pie común: crédito de la foto, filete en Morse y nombre del diario
  const pie = (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 80px 64px' }}>
      {credito && (
        <div style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 22 }}>
          Foto ilustrativa: {recortar(credito, 80)}
        </div>
      )}
      <FiletMorse ancho={ANCHO - 160} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 30 }}>
        <div style={{ fontFamily: 'Bodoni', fontSize: 52, letterSpacing: -1.5 }}>El Telégrafo</div>
        <div style={{ fontFamily: 'Bodoni', fontStyle: 'italic', fontSize: 34, color: ORO }}>de Los Charrúas</div>
      </div>
    </div>
  )

  const seccion = (
    <div style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 32, color: ORO }}>{nombreSeccion(nota.section)}</div>
  )
  const titulo = (
    <div style={{ marginTop: 22, fontFamily: 'Bodoni', fontSize: tamTitulo, lineHeight: 1.04, letterSpacing: -tamTitulo * 0.025 }}>
      {recortar(nota.title, 150)}
    </div>
  )

  return new ImageResponse(
    foto ? (
      // Con foto: la foto ocupa todo el fondo y el texto va abajo, sobre un degradé oscuro
      <div style={{ width: ANCHO, height: ALTO, display: 'flex', position: 'relative', background: TINTA, color: '#ffffff' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} alt="" width={ANCHO} height={ALTO} style={{ position: 'absolute', top: 0, left: 0, width: ANCHO, height: ALTO, objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: ANCHO,
            height: ALTO,
            backgroundImage:
              'linear-gradient(to bottom, rgba(8,20,36,0.35) 0%, rgba(8,20,36,0.10) 22%, rgba(8,20,36,0.55) 48%, rgba(8,20,36,0.93) 70%, rgba(8,20,36,1) 100%)',
          }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: ANCHO, height: ALTO, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0 80px 48px' }}>
            {seccion}
            {titulo}
          </div>
          {pie}
        </div>
      </div>
    ) : (
      // Sin foto: fondo azul con el título y la bajada
      <div style={{ width: ANCHO, height: ALTO, display: 'flex', flexDirection: 'column', background: TINTA, color: '#ffffff' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
          {seccion}
          {titulo}
          <div style={{ marginTop: 40, fontFamily: 'Archivo', fontWeight: 500, fontSize: 34, lineHeight: 1.4, color: 'rgba(255,255,255,0.72)' }}>
            {recortar(nota.header, 200)}
          </div>
        </div>
        {pie}
      </div>
    ),
    {
      width: ANCHO,
      height: ALTO,
      fonts: [
        { name: 'Bodoni', data: bodoni, style: 'normal', weight: 500 },
        { name: 'Bodoni', data: bodoniItalica, style: 'italic', weight: 500 },
        { name: 'Archivo', data: archivo, style: 'normal', weight: 500 },
        { name: 'Archivo', data: archivoSemi, style: 'normal', weight: 600 },
      ],
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Disposition': `inline; filename="telegrafo-${id}.png"`,
      },
    }
  )
}
