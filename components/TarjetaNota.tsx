import Link from 'next/link'
import { fechaCorta } from '@/lib/fechas'
import { nombreSeccion, urlSeccion } from '@/lib/secciones'

export type NotaResumen = {
  id: string
  title: string
  header: string
  featuredImage: string
  section: string
  createdAt: Date
  author: { name: string } | null
}

type Props = {
  nota: NotaResumen
  /** destacada: imagen grande y título grande · media: imagen arriba · horizontal: imagen al costado · lista: sin imagen */
  formato?: 'destacada' | 'media' | 'horizontal' | 'lista'
  /** En las páginas de sección no hace falta repetir el nombre de la sección */
  sinSeccion?: boolean
  /** En formato lista, muestra también la bajada */
  conBajada?: boolean
}

export function Volanta({ seccion }: { seccion: string }) {
  return (
    <Link href={urlSeccion(seccion)} className="font-sans text-[0.8rem] font-semibold text-oro-viejo hover:underline">
      {nombreSeccion(seccion)}
    </Link>
  )
}

export default function TarjetaNota({ nota, formato = 'media', sinSeccion = false, conBajada = false }: Props) {
  const href = `/nota/${nota.id}`
  const firma = (
    <p className="mt-3 font-sans text-xs text-gris">
      {nota.author?.name ? `Por ${nota.author.name}, ` : ''}
      <time dateTime={nota.createdAt.toISOString()}>{fechaCorta(nota.createdAt)}</time>
    </p>
  )

  if (formato === 'destacada') {
    return (
      <article>
        <Link href={href} className="block overflow-hidden bg-niebla">
          <img src={nota.featuredImage} alt="" className="aspect-[16/9] w-full object-cover" />
        </Link>
        <div className="mt-5">
          {!sinSeccion && <Volanta seccion={nota.section} />}
          <h2 className="mt-1 font-serif text-[2rem] leading-[1.08] font-semibold tracking-[-0.015em] text-balance sm:text-5xl">
            <Link href={href} className="titulo-enlace">{nota.title}</Link>
          </h2>
          <p className="mt-4 max-w-[62ch] font-serif text-lg leading-relaxed text-tinta/80 sm:text-xl">{nota.header}</p>
          {firma}
        </div>
      </article>
    )
  }

  if (formato === 'lista') {
    return (
      <article>
        {!sinSeccion && <Volanta seccion={nota.section} />}
        <h3 className="mt-0.5 font-serif text-xl leading-snug font-semibold text-balance">
          <Link href={href} className="titulo-enlace">{nota.title}</Link>
        </h3>
        {conBajada && (
          <p className="mt-2 line-clamp-2 font-serif text-base leading-relaxed text-tinta/75">{nota.header}</p>
        )}
        {firma}
      </article>
    )
  }

  if (formato === 'horizontal') {
    return (
      <article className="grid grid-cols-1 items-start gap-x-8 gap-y-4 sm:grid-cols-12">
        <Link href={href} className="block overflow-hidden bg-niebla sm:col-span-5">
          <img src={nota.featuredImage} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
        </Link>
        <div className="sm:col-span-7">
          {!sinSeccion && <Volanta seccion={nota.section} />}
          <h3 className="mt-0.5 font-serif text-[1.7rem] leading-[1.15] font-semibold text-balance sm:text-3xl">
            <Link href={href} className="titulo-enlace">{nota.title}</Link>
          </h3>
          <p className="mt-3 max-w-[58ch] font-serif text-lg leading-relaxed text-tinta/75">{nota.header}</p>
          {firma}
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col">
      <Link href={href} className="block overflow-hidden bg-niebla">
        <img src={nota.featuredImage} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
      </Link>
      <div className="mt-4">
        {!sinSeccion && <Volanta seccion={nota.section} />}
        <h3 className="mt-0.5 font-serif text-[1.45rem] leading-[1.18] font-semibold text-balance">
          <Link href={href} className="titulo-enlace">{nota.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 font-serif text-base leading-relaxed text-tinta/75">{nota.header}</p>
        {firma}
      </div>
    </article>
  )
}
