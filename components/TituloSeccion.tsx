import Link from 'next/link'
import Morse from '@/components/Morse'

/** Título de un bloque: el nombre en cursiva grande y, al lado, el mismo nombre en Morse. */
export default function TituloSeccion({
  id,
  nombre,
  href,
  oscuro = false,
}: {
  id: string
  nombre: string
  href?: string
  oscuro?: boolean
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div className="flex min-w-0 items-center gap-5">
        <h2 id={id} className="font-display text-4xl leading-none font-medium tracking-[-0.03em] italic sm:text-5xl">
          {href ? <Link href={href} className="titulo-enlace">{nombre}</Link> : nombre}
        </h2>
        <Morse texto={nombre} alto={4} className={`hidden sm:block ${oscuro ? 'text-oro' : 'text-oro'}`} />
      </div>
      {href && (
        <Link
          href={href}
          className={`shrink-0 pb-1 font-sans text-sm font-medium hover:underline ${oscuro ? 'text-oro-claro' : 'text-oro-viejo'}`}
        >
          Ver todas las notas
        </Link>
      )}
    </div>
  )
}
