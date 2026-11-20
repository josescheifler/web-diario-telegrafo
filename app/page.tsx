import Link from 'next/link'
import prisma from '@/lib/prisma'
import { sincronizarSugerencias } from '@/lib/sugerencias'
import { Suspense } from 'react'
import Cabecera from '@/components/Cabecera'
import AdSlot from '@/components/AdSlot'
import TarjetaNota from '@/components/TarjetaNota'
import TituloSeccion from '@/components/TituloSeccion'
import { SECCIONES } from '@/lib/secciones'

// Cuántas notas recientes se traen para armar la portada
const NOTAS_EN_PORTADA = 60
// Cuántas notas muestra cada bloque de sección
const NOTAS_POR_SECCION = 4

function EspacioPublicitario() {
  return (
    <Link
      href="/publicidad"
      className="flex min-h-[250px] flex-col items-center justify-center gap-2 bg-niebla p-6 text-center"
    >
      <span className="font-display text-2xl leading-tight font-medium italic text-tinta">Su aviso puede estar acá</span>
      <span className="font-sans text-xs text-gris">Conocé los espacios disponibles</span>
    </Link>
  )
}

async function Portada() {
  await sincronizarSugerencias()
  const notas = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: NOTAS_EN_PORTADA,
    select: {
      id: true,
      title: true,
      header: true,
      featuredImage: true,
      section: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  })

  if (notas.length === 0) {
    return (
      <div className="px-4 py-32 text-center">
        <p className="titular text-4xl">Todavía no hay noticias publicadas.</p>
        <p className="mt-2 font-sans text-gris">La redacción las carga desde el panel de administración.</p>
      </div>
    )
  }

  const [principal, ...resto] = notas
  const destacadas = resto.slice(0, 3)
  const yaMostradas = new Set([principal.id, ...destacadas.map((n) => n.id)])

  // Un bloque por cada sección que tenga al menos dos notas sin mostrar;
  // las notas sueltas de las demás secciones van juntas en "Más noticias"
  const porSeccion = SECCIONES.map((seccion) => ({
    seccion,
    notas: notas.filter((n) => n.section === seccion.valor && !yaMostradas.has(n.id)).slice(0, NOTAS_POR_SECCION),
  }))
  const bloques = porSeccion.filter((bloque) => bloque.notas.length >= 2)
  const sueltas = porSeccion
    .filter((bloque) => bloque.notas.length === 1)
    .map((bloque) => bloque.notas[0])
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const contenedor = 'mx-auto max-w-7xl px-4 sm:px-8'

  return (
    <>
      {/* Apertura: la nota más reciente */}
      <section aria-label="Noticia principal" className={`${contenedor} pt-10 pb-14 sm:pt-14 sm:pb-20`}>
        <AdSlot location="CABECERA" className="mb-12" />
        <TarjetaNota nota={principal} formato="apertura" />
      </section>

      {/* Las tres siguientes y el aviso lateral */}
      <section aria-label="Noticias destacadas" className={contenedor}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 border-t border-tinta pt-10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {destacadas.map((nota) => (
            <TarjetaNota key={nota.id} nota={nota} />
          ))}
          {/* Publicidad lateral (se administra desde el panel → Publicidad) */}
          <AdSlot location="LATERAL" fallback={<EspacioPublicitario />} />
        </div>
      </section>

      {/* Una franja por sección. La de Entre Ríos va sobre azul. */}
      {bloques.map(({ seccion, notas: notasDeSeccion }) => {
        const [primera, ...otras] = notasDeSeccion
        const oscuro = seccion.valor === 'REGIONAL'
        return (
          <section
            key={seccion.slug}
            aria-labelledby={`seccion-${seccion.slug}`}
            className={oscuro ? 'bg-tinta-honda text-white' : ''}
          >
            <div className={`${contenedor} ${oscuro ? 'py-16 sm:py-20' : 'border-t border-linea py-14 sm:py-16'}`}>
              <TituloSeccion
                id={`seccion-${seccion.slug}`}
                nombre={seccion.nombre}
                href={`/seccion/${seccion.slug}`}
                oscuro={oscuro}
              />

              <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <TarjetaNota nota={primera} sinSeccion oscuro={oscuro} />
                </div>
                <div className={`flex flex-col divide-y lg:col-span-7 ${oscuro ? 'divide-white/15' : 'divide-linea'}`}>
                  {otras.map((nota) => (
                    <div key={nota.id} className="py-6 first:pt-0 last:pb-0">
                      <TarjetaNota nota={nota} formato="lista" sinSeccion conBajada oscuro={oscuro} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {sueltas.length > 0 && (
        <section aria-labelledby="mas-noticias" className={`${contenedor} border-t border-linea py-14 sm:py-16`}>
          <TituloSeccion id="mas-noticias" nombre="Más noticias" />
          {sueltas.length === 1 ? (
            <TarjetaNota nota={sueltas[0]} formato="horizontal" />
          ) : (
            <div className={`grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 ${sueltas.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
              {sueltas.map((nota) => (
                <TarjetaNota key={nota.id} nota={nota} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}

export default function Home() {
  return (
    <>
      <Cabecera seccionActual="portada" />

      <main>
        <h1 className="sr-only">El Telégrafo de Los Charrúas: noticias de Los Charrúas y de Entre Ríos</h1>
        <Suspense fallback={<p className="py-32 text-center font-sans text-gris">Cargando la edición de hoy…</p>}>
          <Portada />
        </Suspense>
      </main>
    </>
  )
}
