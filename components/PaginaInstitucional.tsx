import type { ReactNode } from 'react'
import Cabecera from '@/components/Cabecera'

/** Marco común de las páginas de contacto, cartas, publicidad y términos. */
export default function PaginaInstitucional({
  titulo,
  bajada,
  children,
}: {
  titulo: string
  bajada?: string
  children: ReactNode
}) {
  return (
    <>
      <Cabecera />
      <div className="bg-tinta-honda text-white">
        <div className="mx-auto max-w-4xl px-4 pt-6 pb-12 text-center sm:px-8 sm:pb-16">
          <h1 className="font-display text-5xl leading-[0.95] font-medium tracking-[-0.035em] text-balance italic sm:text-7xl">
            {titulo}
          </h1>
          {bajada && (
            <p className="mx-auto mt-6 max-w-[52ch] font-serif text-xl leading-relaxed text-white/75">{bajada}</p>
          )}
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-8 sm:py-16">{children}</main>
    </>
  )
}
