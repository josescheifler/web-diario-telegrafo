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
import { nombreSeccion, urlSeccion } from '@/lib/secciones'
import ProgresoLectura from '@/components/ProgresoLectura'
import TituloSeccion from '@/components/TituloSeccion'
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
    <main>
      <ProgresoLectura />

      <article>
        {/* Encabezado de la nota, sobre el azul de la cabecera */}
        <header className="bg-tinta-honda text-white">
          <div className="mx-auto max-w-4xl px-4 pt-8 pb-28 text-center sm:px-8 sm:pt-10 sm:pb-40">
            <Volanta seccion={article.section} oscuro />
            <h1 className="titular mt-4 text-[2.6rem] leading-[0.98] sm:text-7xl">{article.title}</h1>
            <p className="mx-auto mt-7 max-w-[58ch] font-serif text-xl leading-relaxed text-white/75 sm:text-2xl sm:leading-relaxed">
              {article.header}
            </p>
          </div>
        </header>

        {/* La foto se monta sobre el encabezado */}
        <div className="mx-auto -mt-20 max-w-6xl px-4 sm:-mt-28 sm:px-8">
          {article.featuredImage ? (
            <figure className="bg-niebla shadow-[0_30px_60px_-30px_rgb(8_20_36/0.55)]">
              <img src={article.featuredImage} alt="" className="max-h-[680px] w-full object-cover" />
            </figure>
          ) : (
            <div className="h-20 sm:h-28" />
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-[44rem] flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-linea px-4 pb-6 sm:px-0">
          <div className="flex items-center gap-3">
            {article.author?.profilePic && (
              <img src={article.author.profilePic} alt="" className="h-12 w-12 rounded-full object-cover" />
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

        {/* El HTML se limpia siempre antes de mostrarse (ver lib/sanitize.ts) */}
        <div
          className="cuerpo-nota cuerpo-nota-publicada mx-auto mt-10 max-w-[44rem] px-4 font-serif text-[1.25rem] text-tinta sm:px-0"
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
        />

        {/* Cierre: "fin de mensaje" en Morse */}
        <div className="mt-12 flex justify-center text-oro" title="Fin de mensaje, en código Morse">
          <Morse senal={FIN_DE_MENSAJE} alto={7} />
        </div>
      </article>

      <AdSlot location="NOTA" className="mx-auto mt-14 max-w-[44rem] border-t border-linea px-4 pt-8 sm:px-0" />

      {relacionadas.length > 0 && (
        <section aria-labelledby="mas-notas" className="mt-20 bg-niebla">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
            <TituloSeccion id="mas-notas" nombre={`Más de ${nombreSeccion(article.section)}`} href={urlSeccion(article.section)} />
            <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
              {relacionadas.map((nota) => (
                <TarjetaNota key={nota.id} nota={nota} sinSeccion />
              ))}
            </div>
          </div>
        </section>
      )}

      {relacionadas.length === 0 && <div className="h-20" />}
    </main>
  )
}

export default function NotaPage({ params }: Params) {
  return (
    <>
      <Cabecera />
      {/* Suspense aísla la carga de datos del renderizado estático */}
      <Suspense fallback={<div className="bg-tinta-honda py-40 text-center font-sans text-white/60">Cargando la nota…</div>}>
        <DetalleNota params={params} />
      </Suspense>
    </>
  )
}
