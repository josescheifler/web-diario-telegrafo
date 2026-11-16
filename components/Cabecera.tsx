import Link from 'next/link'
import Fecha from '@/components/Fecha'
import Morse from '@/components/Morse'
import { SECCIONES } from '@/lib/secciones'

/** Cabecera de todas las páginas públicas: nombre del diario, fecha y secciones. */
export default function Cabecera({ seccionActual }: { seccionActual?: string }) {
  return (
    <header className="bg-papel">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 pt-6 pb-5 sm:pt-8">
          <Link href="/" className="group flex items-center gap-3 sm:gap-4" aria-label="El Telégrafo de Los Charrúas, ir a la portada">
            <img src="/logo.png" alt="" width={64} height={64} className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="flex flex-col">
              <span className="font-serif text-[2.1rem] leading-none font-semibold tracking-[-0.02em] text-tinta sm:text-6xl">
                El Telégrafo
              </span>
              <span className="mt-1 font-sans text-[0.8rem] font-medium tracking-[0.08em] text-gris sm:text-sm">
                de Los Charrúas
              </span>
            </span>
          </Link>

          <div className="hidden text-right font-sans text-sm text-gris md:block">
            <Fecha className="block font-medium text-tinta" />
            <span>Diario digital de Entre Ríos</span>
          </div>
        </div>

        {/* "El Telégrafo de Los Charrúas", en Morse */}
        <div className="text-oro">
          <Morse texto="El Telegrafo de Los Charruas" anchoCompleto className="hidden sm:block" />
          {/* En pantallas chicas, solo "El Telégrafo" para que el trazo no quede finito */}
          <Morse texto="El Telegrafo" anchoCompleto className="sm:hidden" />
        </div>
      </div>

      <nav aria-label="Secciones" className="sticky top-0 z-20 mt-4 border-y border-linea bg-papel/95 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-x-6 overflow-x-auto px-4 font-sans text-[0.95rem] font-medium whitespace-nowrap sm:px-6">
          <li>
            <Link href="/" className={`enlace-menu ${seccionActual === 'portada' ? 'enlace-menu-activo' : ''}`}>
              Portada
            </Link>
          </li>
          {SECCIONES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/seccion/${s.slug}`}
                aria-current={seccionActual === s.slug ? 'page' : undefined}
                className={`enlace-menu ${seccionActual === s.slug ? 'enlace-menu-activo' : ''}`}
              >
                {s.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="border-b border-linea px-4 py-2 text-center font-sans text-xs text-gris md:hidden">
        <Fecha />
      </p>
    </header>
  )
}
