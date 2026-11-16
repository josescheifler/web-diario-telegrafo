import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Cabecera from '@/components/Cabecera'
import AdSlot from '@/components/AdSlot'
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
      <p className="py-20 text-center font-serif text-xl text-gris">
        Todavía no hay notas publicadas en {seccion.nombre}.
      </p>
    )
  }

  const [primera, ...resto] = notas

  return (
    <>
      <div className="border-b border-linea pb-10">
        <TarjetaNota nota={primera} formato="destacada" sinSeccion />
      </div>
      {resto.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {resto.map((nota) => (
            <TarjetaNota key={nota.id} nota={nota} sinSeccion />
          ))}
        </div>
      )}
    </>
  )
}

export default async function SeccionPage({ params }: Params) {
  const { section } = await params
  const seccion = seccionPorSlug(section)
  if (!seccion) return notFound()

  return (
    <>
      <Cabecera seccionActual={seccion.slug} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AdSlot location="CABECERA" className="mb-10" />
        <h1 className="mb-8 border-t-2 border-tinta pt-3 font-serif text-5xl font-semibold tracking-[-0.02em]">
          {seccion.nombre}
        </h1>

        <Suspense fallback={<p className="py-20 text-center font-sans text-gris">Cargando noticias…</p>}>
          <NotasDeSeccion slug={seccion.slug} />
        </Suspense>
      </main>
    </>
  )
}
