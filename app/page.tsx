import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'
import Cabecera from '@/components/Cabecera'
import AdSlot from '@/components/AdSlot'
import TarjetaNota from '@/components/TarjetaNota'
import { SECCIONES } from '@/lib/secciones'

// Cuántas notas recientes se traen para armar la portada
const NOTAS_EN_PORTADA = 60
// Cuántas notas muestra cada bloque de sección
const NOTAS_POR_SECCION = 4

function EspacioPublicitario() {
  return (
    <Link
      href="/publicidad"
      className="flex h-[250px] flex-col items-center justify-center gap-1 border border-dashed border-linea bg-niebla p-6 text-center font-sans"
    >
      <span className="text-sm font-semibold text-tinta">Su aviso puede estar acá</span>
      <span className="text-xs text-gris">Conocé los espacios disponibles</span>
    </Link>
  )
}

async function Portada() {
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
      <div className="py-24 text-center">
        <p className="font-serif text-2xl">Todavía no hay noticias publicadas.</p>
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

  return (
    <>
      {/* Apertura: la nota más reciente y las tres siguientes */}
      <section aria-label="Noticias principales" className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TarjetaNota nota={principal} formato="destacada" />
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-4 lg:border-l lg:border-linea lg:pl-10">
          {destacadas.length > 0 && (
            <div>
              <h2 className="mb-5 font-sans text-sm font-semibold text-gris">Además</h2>
              <div className="flex flex-col divide-y divide-linea">
                {destacadas.map((nota) => (
                  <div key={nota.id} className="py-5 first:pt-0 last:pb-0">
                    <TarjetaNota nota={nota} formato="lista" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publicidad lateral (se administra desde el panel → Publicidad) */}
          <AdSlot location="LATERAL" fallback={<EspacioPublicitario />} />
        </aside>
      </section>

      {/* Una franja por sección */}
      {bloques.map(({ seccion, notas: notasDeSeccion }) => {
        const [primera, ...otras] = notasDeSeccion
        return (
          <section key={seccion.slug} aria-labelledby={`seccion-${seccion.slug}`} className="mt-16">
            <div className="mb-6 flex items-baseline justify-between gap-4 border-t-2 border-tinta pt-3">
              <h2 id={`seccion-${seccion.slug}`} className="font-serif text-3xl font-semibold tracking-[-0.01em]">
                <Link href={`/seccion/${seccion.slug}`} className="titulo-enlace">{seccion.nombre}</Link>
              </h2>
              <Link href={`/seccion/${seccion.slug}`} className="font-sans text-sm font-medium text-oro-viejo hover:underline">
                Ver todas las notas
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <TarjetaNota nota={primera} sinSeccion />
              </div>
              <div className="flex flex-col divide-y divide-linea lg:col-span-7">
                {otras.map((nota) => (
                  <div key={nota.id} className="py-5 first:pt-0 last:pb-0">
                    <TarjetaNota nota={nota} formato="lista" sinSeccion conBajada />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {sueltas.length > 0 && (
        <section aria-labelledby="mas-noticias" className="mt-16">
          <h2 id="mas-noticias" className="mb-6 border-t-2 border-tinta pt-3 font-serif text-3xl font-semibold tracking-[-0.01em]">
            Más noticias
          </h2>
          {sueltas.length === 1 ? (
            <TarjetaNota nota={sueltas[0]} formato="horizontal" />
          ) : (
            <div className={`grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 ${sueltas.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
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

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="sr-only">El Telégrafo de Los Charrúas: noticias de Los Charrúas y de Entre Ríos</h1>
        <AdSlot location="CABECERA" className="mb-10" />
        <Suspense fallback={<p className="py-24 text-center font-sans text-gris">Cargando la edición de hoy…</p>}>
          <Portada />
        </Suspense>
      </main>
    </>
  )
}
