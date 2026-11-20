import Link from 'next/link'
import Fecha from '@/components/Fecha'
import Morse from '@/components/Morse'
import { SECCIONES } from '@/lib/secciones'

/** Cabecera de todas las páginas públicas: nombre del diario, fecha y secciones. */
export default function Cabecera({ seccionActual }: { seccionActual?: string }) {
  return (
    <>
      <header className="bg-tinta-honda text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2.5 font-sans text-xs text-white/65 sm:text-[0.8rem]">
            <Fecha />
            <div className="flex items-center gap-5">
              <span className="hidden sm:inline">Diario digital de Entre Ríos</span>
              <Link
                href="/admin/login"
                className="rounded border border-oro/60 px-2.5 py-1 font-medium text-oro transition-colors hover:bg-oro hover:text-tinta-honda"
              >
                Redacción
              </Link>
            </div>
          </div>

          <Link
            href="/"
            aria-label="El Telégrafo de Los Charrúas, ir a la portada"
            className="flex flex-col items-center pt-8 pb-8 text-center sm:pt-12 sm:pb-10"
          >
            <img src="/logo.png" alt="" width={56} height={56} className="mb-4 h-11 w-11 sm:mb-5 sm:h-14 sm:w-14" />
            <span className="font-display text-[3.1rem] leading-[0.9] font-medium tracking-[-0.035em] sm:text-[6.5rem] lg:text-[8rem]">
              El Telégrafo
            </span>
            <span className="mt-3 font-display text-lg text-oro italic sm:mt-4 sm:text-2xl">de Los Charrúas</span>
          </Link>

          {/* "El Telégrafo de Los Charrúas", en Morse */}
          <div className="pb-6 text-oro sm:pb-8">
            <Morse texto="El Telegrafo de Los Charruas" anchoCompleto className="morse-transmite hidden sm:block" />
            {/* En pantallas chicas, solo "El Telégrafo" para que el trazo no quede finito */}
            <Morse texto="El Telegrafo" anchoCompleto className="morse-transmite block sm:hidden" />
          </div>
        </div>
      </header>

      <nav aria-label="Secciones" className="sticky top-0 z-30 border-t border-white/10 bg-tinta-honda/95 backdrop-blur">
        <ul className="mx-auto flex max-w-7xl gap-x-7 overflow-x-auto px-4 font-sans text-[0.95rem] font-medium whitespace-nowrap sm:justify-center sm:px-8">
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
    </>
  )
}
