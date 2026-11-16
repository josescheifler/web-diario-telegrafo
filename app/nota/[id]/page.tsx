import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Cabecera from '@/components/Cabecera'
import AdSlot from '@/components/AdSlot'
import Compartir from '@/components/Compartir'
import Morse, { FIN_DE_MENSAJE } from '@/components/Morse'
import TarjetaNota, { Volanta } from '@/components/TarjetaNota'
import { fechaYHora } from '@/lib/fechas'
import { nombreSeccion } from '@/lib/secciones'
import { sanitizeArticleHtml } from '@/lib/sanitize'

type Params = { params: Promise<{ id: string }> }

// Título, descripción e imagen para buscadores y para cuando se comparte en WhatsApp o redes
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const nota = await prisma.article
    .findUnique({ where: { id }, select: { title: true, header: true, featuredImage: true, published: true } })
    .catch(() => null)
  if (!nota || !nota.published) return {}

  return {
    title: nota.title,
    description: nota.header,
    openGraph: {
      type: 'article',
      title: nota.title,
      description: nota.header,
      images: nota.featuredImage ? [nota.featuredImage] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

async function DetalleNota({ params }: Params) {
  const { id } = await params

  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true },
  })

  if (!article || !article.published) return notFound()

  const relacionadas = await prisma.article.findMany({
    where: { section: article.section, published: true, id: { not: article.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdSlot location="CABECERA" className="mb-10" />

      <article>
        <header className="mx-auto max-w-3xl">
          <Volanta seccion={article.section} />
          <h1 className="mt-2 font-serif text-4xl leading-[1.06] font-semibold tracking-[-0.02em] text-balance sm:text-[3.4rem]">
            {article.title}
          </h1>
          <p className="mt-5 font-serif text-xl leading-relaxed text-tinta/80 sm:text-2xl sm:leading-relaxed">
            {article.header}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-y border-linea py-4">
            <div className="flex items-center gap-3">
              {article.author?.profilePic && (
                <img src={article.author.profilePic} alt="" className="h-11 w-11 rounded-full object-cover" />
              )}
              <p className="font-sans text-sm leading-snug">
                <span className="block font-semibold">{article.author?.name || 'Redacción'}</span>
                <time dateTime={article.createdAt.toISOString()} className="text-gris">
                  {fechaYHora(article.createdAt)}
                </time>
              </p>
            </div>
            <Compartir titulo={article.title} />
          </div>
        </header>

        {article.featuredImage && (
          <figure className="mx-auto mt-8 max-w-5xl bg-niebla">
            <img src={article.featuredImage} alt="" className="max-h-[640px] w-full object-cover" />
          </figure>
        )}

        {/* El HTML se limpia siempre antes de mostrarse (ver lib/sanitize.ts) */}
        <div
          className="cuerpo-nota cuerpo-nota-publicada mx-auto mt-10 max-w-[42rem] font-serif text-[1.2rem] text-tinta"
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
        />

        {/* Cierre: "fin de mensaje" en Morse */}
        <div className="mx-auto mt-10 flex max-w-[42rem] justify-center text-oro" title="Fin de mensaje, en código Morse">
          <Morse senal={FIN_DE_MENSAJE} alto={6} />
        </div>
      </article>

      <AdSlot location="NOTA" className="mx-auto mt-12 max-w-[42rem] border-t border-linea pt-8" />

      {relacionadas.length > 0 && (
        <section aria-labelledby="mas-notas" className="mt-16">
          <h2 id="mas-notas" className="mb-6 border-t-2 border-tinta pt-3 font-serif text-3xl font-semibold tracking-[-0.01em]">
            Más de {nombreSeccion(article.section)}
          </h2>
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {relacionadas.map((nota) => (
              <TarjetaNota key={nota.id} nota={nota} sinSeccion />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default function NotaPage({ params }: Params) {
  return (
    <>
      <Cabecera />
      {/* Suspense aísla la carga de datos del renderizado estático */}
      <Suspense fallback={<p className="py-24 text-center font-sans text-gris">Cargando la nota…</p>}>
        <DetalleNota params={params} />
      </Suspense>
    </>
  )
}
