import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaInstitucional from '@/components/PaginaInstitucional'

export const metadata: Metadata = {
  title: 'Términos y privacidad',
  description: 'Condiciones de uso del sitio y tratamiento de los datos personales en El Telégrafo de Los Charrúas.',
}

const claseEnlace = 'font-semibold underline decoration-oro underline-offset-2'

export default function TerminosPrivacidadPage() {
  return (
    <PaginaInstitucional titulo="Términos y privacidad">
      <div className="mx-auto max-w-[68ch] space-y-10 font-sans text-base leading-relaxed text-tinta/85">
        <section>
          <h2 className="mb-3 titular text-3xl text-tinta">Uso de los contenidos</h2>
          <p>
            Las notas, fotografías y gráficos de El Telégrafo de Los Charrúas pertenecen al diario o a sus autores. Podés
            citar o reproducir parte de una nota si mencionás la fuente y enlazás a la publicación original.
          </p>
        </section>

        <section>
          <h2 className="mb-3 titular text-3xl text-tinta">Datos personales</h2>
          <p>
            Cuando escribís a la redacción o enviás una carta de lectores guardamos lo que completás en el formulario:
            nombre, correo electrónico, localidad (en las cartas) y el texto. Lo usamos únicamente para leer tu mensaje,
            responderte y, en el caso de las cartas, publicarlas con tu firma.
          </p>
          <p className="mt-3">
            No vendemos ni cedemos esos datos. Si querés que borremos un mensaje tuyo, pedilo desde el{' '}
            <Link href="/contacto" className={claseEnlace}>formulario de contacto</Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 titular text-3xl text-tinta">Cookies</h2>
          <p>
            El sitio no usa cookies para seguir a los lectores ni herramientas de medición de audiencia. La única cookie
            propia es la que mantiene abierta la sesión de quienes administran el diario. Los avisos publicitarios de
            terceros pueden usar sus propias cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 titular text-3xl text-tinta">Opiniones</h2>
          <p>
            Las columnas firmadas y las cartas de lectores expresan la opinión de sus autores, no necesariamente la del
            diario.
          </p>
        </section>
      </div>
    </PaginaInstitucional>
  )
}
