import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaInstitucional from '@/components/PaginaInstitucional'
import FormularioMensaje from '@/components/FormularioMensaje'

export const metadata: Metadata = {
  title: 'Escribir a la redacción',
  description: 'Enviá una noticia, un dato o una consulta a la redacción de El Telégrafo de Los Charrúas.',
}

export default function ContactoPage() {
  return (
    <PaginaInstitucional
      titulo="Escribir a la redacción"
      bajada="¿Pasó algo en tu barrio o en tu localidad? ¿Encontraste un error en una nota? Contanos."
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <FormularioMensaje tipo="CONTACTO" />
        </div>

        <aside className="font-sans text-[0.95rem] leading-relaxed text-tinta/85 md:col-span-5 md:border-l md:border-linea md:pl-10">
          <h2 className="font-serif text-2xl font-semibold text-tinta">Qué pasa con tu mensaje</h2>
          <ul className="mt-4 space-y-3">
            <li>Llega directo a la redacción del diario, que lo lee desde su panel.</li>
            <li>Si hace falta, te respondemos al correo que dejes.</li>
            <li>No publicamos tu nombre ni tu correo sin preguntarte antes.</li>
          </ul>

          <h2 className="mt-10 font-serif text-2xl font-semibold text-tinta">Otras formas de participar</h2>
          <ul className="mt-4 space-y-3">
            <li>
              Para opinar sobre un tema y que se publique con tu firma, mandá una{' '}
              <Link href="/cartas-de-lectores" className="font-semibold underline decoration-oro underline-offset-2">carta de lectores</Link>.
            </li>
            <li>
              Para anunciar en el diario, mirá los{' '}
              <Link href="/publicidad" className="font-semibold underline decoration-oro underline-offset-2">espacios de publicidad</Link>.
            </li>
          </ul>
        </aside>
      </div>
    </PaginaInstitucional>
  )
}
