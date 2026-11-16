import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaInstitucional from '@/components/PaginaInstitucional'
import { AD_LOCATIONS } from '@/lib/ads'

export const metadata: Metadata = {
  title: 'Publicidad',
  description: 'Espacios de publicidad disponibles en El Telégrafo de Los Charrúas.',
}

export default function PublicidadPage() {
  return (
    <PaginaInstitucional
      titulo="Publicidad"
      bajada="Comercios, empresas e instituciones pueden anunciar en el diario. Estos son los espacios disponibles."
    >
      <ul className="divide-y divide-linea border-y border-linea">
        {AD_LOCATIONS.map((espacio) => (
          <li key={espacio.value} className="grid grid-cols-1 gap-1 py-6 sm:grid-cols-12 sm:gap-6">
            <h2 className="titular text-3xl sm:col-span-4">{espacio.label}</h2>
            <p className="font-sans text-base leading-relaxed text-tinta/85 sm:col-span-8">{espacio.hint}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-[65ch] font-sans text-[0.95rem] leading-relaxed text-tinta/85">
        El aviso puede ser una imagen con un enlace a tu sitio, tu Instagram o tu WhatsApp. Todos los avisos se muestran
        con la leyenda &ldquo;Publicidad&rdquo;, separados de las noticias.
      </p>

      <div className="mt-10 border-l-4 border-oro bg-niebla p-6 sm:p-8">
        <h2 className="titular text-3xl">Consultar precios y disponibilidad</h2>
        <p className="mt-2 max-w-[60ch] font-sans text-base leading-relaxed text-tinta/85">
          Escribinos desde el formulario de contacto eligiendo el motivo &ldquo;Publicidad&rdquo; y contanos qué querés anunciar.
          Te respondemos al correo que dejes.
        </p>
        <Link href="/contacto" className="boton mt-5">Escribir a la redacción</Link>
      </div>
    </PaginaInstitucional>
  )
}
