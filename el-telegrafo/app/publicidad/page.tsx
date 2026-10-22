import Link from 'next/link'

export default function PublicidadPage() {
  const formatos = [
    { nombre: 'Banner Principal Superior', medidas: '970 x 250 px / 728 x 90 px', ubicacion: 'Cabecera visible en todas las páginas' },
    { nombre: 'Lateral Sticky (Sidebar)', medidas: '300 x 250 px / 300 x 600 px', ubicacion: 'Columna fija en portada y artículos' },
    { nombre: 'In-Article Banner', medidas: '728 x 90 px / Nativo', ubicacion: 'Insertado en el cuerpo de las noticias' },
    { nombre: 'Nota Patrocinada / Branded', medidas: 'Contenido Editorial + Imagen', ubicacion: 'Publicación destacada en sección afín' }
  ]

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
            Departamento Comercial • Media Kit
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)] text-[#0a192f]">
            Publicidad y Tarifas
          </h1>
        </div>

        <p className="text-gray-700 mb-10 text-base leading-relaxed font-sans">
          <strong>El Telégrafo</strong> ofrece soluciones de comunicación directa para empresas e instituciones que buscan visibilidad en una audiencia calificada de lectores de actualidad.
        </p>

        {/* Tabla de Espacios */}
        <div className="mb-12">
          <h3 className="text-xl font-bold uppercase font-sans tracking-wide text-[#0a192f] border-b border-gray-300 pb-2 mb-4">
            Espacios y Formatos Disponibles
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm border border-gray-300 bg-white">
              <thead className="bg-[#0a192f] text-white uppercase text-xs">
                <tr>
                  <th className="p-3 border-r border-gray-700">Espacio</th>
                  <th className="p-3 border-r border-gray-700">Dimensiones</th>
                  <th className="p-3">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-[#0a192f]">
                {formatos.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-bold border-r border-gray-200">{f.nombre}</td>
                    <td className="p-3 text-gray-700 border-r border-gray-200">{f.medidas}</td>
                    <td className="p-3 text-gray-700">{f.ubicacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Módulo de Contrataciones */}
        <div className="bg-gray-50 border-2 border-[#D4AF37] p-8 font-sans">
          <h3 className="font-serif text-2xl font-bold text-[#0a192f] mb-2 uppercase">
            Contrataciones y Tarifario
          </h3>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Para solicitar nuestro tarifario completo y métricas de lectores mensuales, contacte directamente a la gerencia comercial:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold">
            <div className="p-4 bg-white border border-gray-300 text-[#0a192f]">
              <span className="text-xs text-gray-500 block uppercase font-sans">Vía Correo</span>
              comercial@eltelegrafo.com
            </div>
            <div className="p-4 bg-white border border-gray-300 text-[#0a192f]">
              <span className="text-xs text-gray-500 block uppercase font-sans">Mesa Comercial</span>
              Lunes a Viernes • 09:00 a 18:00 hs.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}