import Link from 'next/link'

export default function TerminosPrivacidadPage() {
  return (
    <div className="min-h-screen bg-white text-[#0a192f]">
      {/* Cabecera Clásica */}
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo" className="w-8 h-8 object-contain" />
          <h2 className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 font-serif bg-white text-[#0a192f]">
        <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
          <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
            Marco Jurídico e Institucional
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)] text-[#0a192f]">
            Términos y Privacidad
          </h1>
        </div>

        <div className="space-y-8 text-sm font-sans leading-relaxed text-gray-700 bg-white">
          <section className="border-b border-gray-200 pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              1. Propiedad Intelectual
            </h2>
            <p>
              Todos los artículos, notas, fotografías y elementos gráficos de <strong>El Telégrafo</strong> son propiedad exclusiva del medio o de sus redactores colaboradores. Queda prohibida la reproducción total o parcial sin mención fehaciente de la fuente y enlace directo a la publicación original.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              2. Protección de Datos Personales
            </h2>
            <p>
              La información facilitada en formularios de contacto o cartas de lectores es tratada bajo estricta confidencialidad y no será comercializada, cedida ni transferida a terceros bajo ningún concepto, salvo requerimiento judicial expreso.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              3. Uso de Cookies
            </h2>
            <p>
              Este sitio utiliza cookies técnicas indispensables para asegurar la sesión de usuario, optimizar los tiempos de carga y medir métricas anónimas de audiencia que permiten mejorar la navegación.
            </p>
          </section>

          <section className="pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              4. Límites de Responsabilidad
            </h2>
            <p>
              Las opiniones expresadas en columnas firmadas y cartas de lectores corresponden estrictamente a la visión de sus respectivos autores y no comprometen la posición institucional de <strong>El Telégrafo</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}