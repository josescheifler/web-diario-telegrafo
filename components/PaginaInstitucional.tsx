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
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <header className="mb-10 border-t-2 border-tinta pt-3">
          <h1 className="font-serif text-5xl font-semibold tracking-[-0.02em] text-balance">{titulo}</h1>
          {bajada && <p className="mt-4 max-w-[60ch] font-serif text-xl leading-relaxed text-tinta/80">{bajada}</p>}
        </header>
        {children}
      </main>
    </>
  )
}
