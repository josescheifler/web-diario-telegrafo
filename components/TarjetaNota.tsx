import Link from 'next/link'
import Morse from '@/components/Morse'
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
  /** apertura: la nota principal de la portada · destacada: imagen grande · media: imagen arriba ·
   *  horizontal: imagen al costado · lista: sin imagen */
  formato?: 'apertura' | 'destacada' | 'media' | 'horizontal' | 'lista'
  /** En las páginas de sección no hace falta repetir el nombre de la sección */
  sinSeccion?: boolean
  /** En formato lista, muestra también la bajada */
  conBajada?: boolean
  /** Para bloques con fondo azul */
  oscuro?: boolean
}

/** Foto de la nota o, si no tiene, una placa azul con el nombre de la sección. */
function Foto({ nota, aspecto, lazy = false }: { nota: NotaResumen; aspecto: string; lazy?: boolean }) {
  if (nota.featuredImage) {
    return <img src={nota.featuredImage} alt="" loading={lazy ? 'lazy' : undefined} className={`foto ${aspecto} w-full object-cover`} />
  }
  const seccion = nombreSeccion(nota.section)
  return (
    <div className={`foto ${aspecto} flex w-full flex-col items-center justify-center gap-4 bg-tinta-honda px-6 text-center`}>
      <span className="font-display text-3xl leading-none font-medium tracking-[-0.03em] text-white italic sm:text-4xl">{seccion}</span>
      <Morse texto={seccion} alto={4} className="text-oro" />
    </div>
  )
}

export function Volanta({ seccion, oscuro = false }: { seccion: string; oscuro?: boolean }) {
  return (
    <Link
      href={urlSeccion(seccion)}
      className={`font-sans text-[0.82rem] font-semibold hover:underline ${oscuro ? 'text-oro' : 'text-oro-viejo'}`}
    >
      {nombreSeccion(seccion)}
    </Link>
  )
}

export default function TarjetaNota({ nota, formato = 'media', sinSeccion = false, conBajada = false, oscuro = false }: Props) {
  const href = `/nota/${nota.id}`
  const tenue = oscuro ? 'text-white/70' : 'text-tinta/75'
  const meta = oscuro ? 'text-white/55' : 'text-gris'
  const fondoFoto = oscuro ? 'bg-white/5' : 'bg-niebla'

  const firma = (
    <p className={`mt-3 font-sans text-xs ${meta}`}>
      {nota.author?.name ? `Por ${nota.author.name}, ` : ''}
      <time dateTime={nota.createdAt.toISOString()}>{fechaCorta(nota.createdAt)}</time>
    </p>
  )
  const volanta = !sinSeccion && <Volanta seccion={nota.section} oscuro={oscuro} />

  if (formato === 'apertura') {
    return (
      <article className="grid grid-cols-1 items-center gap-x-14 gap-y-7 lg:grid-cols-2">
        <Link href={href} className={`block overflow-hidden lg:order-2 ${fondoFoto}`}>
          <Foto nota={nota} aspecto="aspect-[4/3]" />
        </Link>
        <div className="lg:order-1">
          {volanta}
          <h2 className="titular mt-2 text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-[4rem]">
            <Link href={href} className="titulo-enlace">{nota.title}</Link>
          </h2>
          <p className={`mt-6 font-serif text-xl leading-relaxed sm:text-[1.35rem] ${tenue}`}>{nota.header}</p>
          {firma}
        </div>
      </article>
    )
  }

  if (formato === 'destacada') {
    return (
      <article>
        <Link href={href} className={`block overflow-hidden ${fondoFoto}`}>
          <Foto nota={nota} aspecto="aspect-[16/9]" />
        </Link>
        <div className="mt-6 max-w-4xl">
          {volanta}
          <h2 className="titular mt-1 text-4xl leading-[1.02] sm:text-6xl">
            <Link href={href} className="titulo-enlace">{nota.title}</Link>
          </h2>
          <p className={`mt-5 max-w-[62ch] font-serif text-xl leading-relaxed ${tenue}`}>{nota.header}</p>
          {firma}
        </div>
      </article>
    )
  }

  if (formato === 'lista') {
    return (
      <article>
        {volanta}
        <h3 className="titular mt-1 text-[1.45rem] leading-[1.12]">
          <Link href={href} className="titulo-enlace">{nota.title}</Link>
        </h3>
        {conBajada && <p className={`mt-2 line-clamp-2 font-serif text-[1.05rem] leading-relaxed ${tenue}`}>{nota.header}</p>}
        {firma}
      </article>
    )
  }

  if (formato === 'horizontal') {
    return (
      <article className="grid grid-cols-1 items-center gap-x-10 gap-y-5 sm:grid-cols-12">
        <Link href={href} className={`block overflow-hidden sm:col-span-6 ${fondoFoto}`}>
          <Foto nota={nota} aspecto="aspect-[3/2]" lazy />
        </Link>
        <div className="sm:col-span-6">
          {volanta}
          <h3 className="titular mt-1 text-3xl leading-[1.05] sm:text-[2.6rem]">
            <Link href={href} className="titulo-enlace">{nota.title}</Link>
          </h3>
          <p className={`mt-4 max-w-[58ch] font-serif text-lg leading-relaxed ${tenue}`}>{nota.header}</p>
          {firma}
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col">
      <Link href={href} className={`block overflow-hidden ${fondoFoto}`}>
        <Foto nota={nota} aspecto="aspect-[3/2]" lazy />
      </Link>
      <div className="mt-5">
        {volanta}
        <h3 className="titular mt-1 text-[1.75rem] leading-[1.08]">
          <Link href={href} className="titulo-enlace">{nota.title}</Link>
        </h3>
        <p className={`mt-3 line-clamp-3 font-serif text-[1.05rem] leading-relaxed ${tenue}`}>{nota.header}</p>
        {firma}
      </div>
    </article>
  )
}
