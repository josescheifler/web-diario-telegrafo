import { Suspense, type ReactNode } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { connection } from 'next/server'
import prisma from '@/lib/prisma'
import { isEmbedAd, type AdLocation } from '@/lib/ads'
import { sanitizeAdHtml } from '@/lib/sanitize'

// Alto reservado para los anuncios con código propio (se muestran en un iframe)
const EMBED_HEIGHT: Record<AdLocation, number> = {
  CABECERA: 90,
  LATERAL: 250,
  NOTA: 90,
}

type Props = {
  location: AdLocation
  className?: string
  /** Qué mostrar si no hay anuncios activos en esta ubicación. */
  fallback?: ReactNode
}

async function Anuncios({ location, className = '', fallback = null }: Props) {
  let anuncios: { id: string; name: string; adCode: string }[] = []

  try {
    // La publicidad se consulta en cada visita (no al compilar el sitio),
    // así los cambios del panel se ven al instante
    await connection()
    anuncios = await prisma.advertisement.findMany({
      where: { location, isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, adCode: true },
    })
  } catch (error) {
    // Un problema con la publicidad nunca debe tirar abajo la página
    unstable_rethrow(error)
    console.error('No se pudo cargar la publicidad:', error)
  }

  if (anuncios.length === 0) return fallback

  return (
    <aside aria-label="Publicidad" className={`anuncios flex flex-col items-center gap-4 ${className}`}>
      <span className="text-[10px] text-gray-400 tracking-widest uppercase font-sans">
        Publicidad
      </span>
      {anuncios.map((anuncio) =>
        isEmbedAd(anuncio.adCode) ? (
          // Código de terceros: corre aislado, sin acceso a la página ni a las cookies del sitio
          <iframe
            key={anuncio.id}
            title={anuncio.name}
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            srcDoc={`<!doctype html><html><head><base target="_blank"><style>html,body{margin:0;overflow:hidden;display:flex;justify-content:center}</style></head><body>${anuncio.adCode}</body></html>`}
            loading="lazy"
            className="w-full max-w-[970px] border-0"
            style={{ height: EMBED_HEIGHT[location] }}
          />
        ) : (
          <div
            key={anuncio.id}
            className="anuncio w-full"
            dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(anuncio.adCode) }}
          />
        )
      )}
    </aside>
  )
}

/** Muestra los anuncios activos de una ubicación. Se administran desde /admin. */
export default function AdSlot(props: Props) {
  return (
    <Suspense fallback={null}>
      <Anuncios {...props} />
    </Suspense>
  )
}
