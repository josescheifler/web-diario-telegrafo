import Link from 'next/link'
import { SECCIONES } from '@/lib/secciones'

export default function Footer() {
  return (
    <footer className="mt-auto bg-tinta-honda font-sans text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-4 py-16 sm:px-8 md:grid-cols-4">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="" width={48} height={48} className="h-12 w-12" />
            <span className="flex flex-col">
              <span className="font-display text-4xl leading-none font-medium tracking-[-0.03em]">El Telégrafo</span>
              <span className="mt-1.5 font-display text-base text-oro italic">de Los Charrúas</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            Diario digital de Los Charrúas, con noticias de la localidad y de toda la provincia de Entre Ríos.
          </p>
        </div>

        <nav aria-label="Secciones del diario">
          <h2 className="mb-3 text-sm font-semibold text-oro">Secciones</h2>
          <ul className="space-y-2 text-sm text-white/80">
            {SECCIONES.map((s) => (
              <li key={s.slug}>
                <Link href={`/seccion/${s.slug}`} className="hover:text-white hover:underline">{s.nombre}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="El diario">
          <h2 className="mb-3 text-sm font-semibold text-oro">El diario</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/contacto" className="hover:text-white hover:underline">Escribir a la redacción</Link></li>
            <li><Link href="/cartas-de-lectores" className="hover:text-white hover:underline">Cartas de lectores</Link></li>
            <li><Link href="/publicidad" className="hover:text-white hover:underline">Publicidad</Link></li>
            <li><Link href="/terminos-y-privacidad" className="hover:text-white hover:underline">Términos y privacidad</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-8">
          <p>El Telégrafo de Los Charrúas. Los Charrúas, Entre Ríos, Argentina.</p>
          <Link href="/admin/login" className="font-medium text-oro hover:underline">Acceso a la redacción</Link>
        </div>
      </div>
    </footer>
  )
}
