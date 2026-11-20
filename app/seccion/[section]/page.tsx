import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { sincronizarSugerencias } from '@/lib/sugerencias'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Cabecera from '@/components/Cabecera'
import AdSlot from '@/components/AdSlot'
import Morse from '@/components/Morse'
import TarjetaNota from '@/components/TarjetaNota'
import { SECCIONES, seccionPorSlug } from '@/lib/secciones'

type Params = { params: Promise<{ section: string }> }

// Le decimos a Next.js exactamente qué URLs existen
export function generateStaticParams() {
  return SECCIONES.map((s) => ({ section: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params
  const seccion = seccionPorSlug(section)
  if (!seccion) return {}
  return {
    title: seccion.nombre,
    description: `Noticias de ${seccion.nombre} en El Telégrafo de Los Charrúas.`,
  }
}

async function NotasDeSeccion({ slug }: { slug: string }) {
  const seccion = seccionPorSlug(slug)
  if (!seccion) return notFound()

  await sincronizarSugerencias()
  const notas = await prisma.article.findMany({
    where: { section: seccion.valor, published: true },
    orderBy: { createdAt: 'desc' },
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
      <p className="titular py-20 text-center text-3xl text-gris">
        Todavía no hay notas publicadas en {seccion.nombre}.
      </p>
    )
  }

  const [primera, ...resto] = notas

  return (
    <>
      <TarjetaNota nota={primera} formato="apertura" sinSeccion />
      {resto.length > 0 && (
        <div className="mt-14 border-t border-tinta pt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {resto.map((nota) => (
            <TarjetaNota key={nota.id} nota={nota} sinSeccion />
          ))}
        </div>
      )}
    </>
  )
}

async function ContenidoSeccion({ params }: Params) {
  const { section } = await params
  const seccion = seccionPorSlug(section)
  if (!seccion) return notFound()

  return (
    <>
      <Cabecera seccionActual={seccion.slug} />

      <div className="bg-tinta-honda text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 pt-4 pb-12 text-center sm:px-8 sm:pb-16">
          <Morse texto={seccion.nombre} alto={5} className="text-oro" />
          <h1 className="font-display text-6xl leading-none font-medium tracking-[-0.035em] italic sm:text-8xl">
            {seccion.nombre}
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <AdSlot location="CABECERA" className="mb-12" />
        <Suspense fallback={<p className="py-20 text-center font-sans text-gris">Cargando noticias…</p>}>
          <NotasDeSeccion slug={seccion.slug} />
        </Suspense>
      </main>
    </>
  )
}

// Los parámetros de la URL se leen dentro de Suspense: así la página nunca
// bloquea su armado (ni al compilar ni cuando el panel la actualiza).
export default function SeccionPage({ params }: Params) {
  return (
    <Suspense
      fallback={
        <>
          <Cabecera />
          <div className="bg-tinta-honda py-24" />
        </>
      }
    >
      <ContenidoSeccion params={params} />
    </Suspense>
  )
}
