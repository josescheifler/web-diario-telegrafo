import type { Metadata } from 'next'
import PaginaInstitucional from '@/components/PaginaInstitucional'
import FormularioMensaje from '@/components/FormularioMensaje'

export const metadata: Metadata = {
  title: 'Cartas de lectores',
  description: 'Enviá tu carta a El Telégrafo de Los Charrúas: opiniones, reclamos y respuestas a notas publicadas.',
}

export default function CartasDeLectoresPage() {
  return (
    <PaginaInstitucional
      titulo="Cartas de lectores"
      bajada="Un espacio para opinar, reclamar o responder a una nota publicada en el diario."
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <FormularioMensaje tipo="CARTA" />
        </div>

        <aside className="font-sans text-[0.95rem] leading-relaxed text-tinta/85 md:col-span-5 md:border-l md:border-linea md:pl-10">
          <h2 className="titular text-3xl text-tinta">Antes de enviar</h2>
          <ul className="mt-4 space-y-3">
            <li>Firmá con tu nombre, tu apellido y tu localidad: las cartas se publican firmadas.</li>
            <li>Tratá de no pasar las 500 palabras.</li>
            <li>La redacción decide qué cartas publica y puede acortarlas sin cambiarles el sentido.</li>
            <li>No se publican cartas con insultos ni acusaciones sin sustento.</li>
            <li>Tu correo es solo para que podamos contactarte. No se publica.</li>
          </ul>
        </aside>
      </div>
    </PaginaInstitucional>
  )
}
