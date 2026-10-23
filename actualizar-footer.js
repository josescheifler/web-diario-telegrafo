const fs = require('fs');
const path = require('path');

const files = {
  'components/Footer.tsx': `import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a192f] text-white border-t-4 border-[#D4AF37] font-serif mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Identidad */}
        <div className="md:col-span-1 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-3 mb-3">
            <img 
              src="/favicon.ico" 
              alt="El Telégrafo de Los Charrúas" 
              className="w-10 h-10 object-contain" 
            />
            <span className="text-lg md:text-xl font-black text-[#D4AF37] tracking-wider uppercase font-[family-name:var(--font-cinzel)] leading-tight">
              El Telégrafo <br />
              <span className="text-xs font-sans tracking-widest text-gray-300">De Los Charrúas</span>
            </span>
          </Link>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Diario digital independiente al servicio de Los Charrúas y la región.
          </p>
        </div>

        {/* Secciones */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] font-sans mb-3 border-b border-[#D4AF37]/30 pb-1">
            Secciones
          </h4>
          <ul className="text-xs space-y-2 font-sans text-gray-300">
            <li><Link href="/seccion/economia" className="hover:text-white transition">Economía</Link></li>
            <li><Link href="/seccion/local" className="hover:text-white transition">Local</Link></li>
            <li><Link href="/seccion/regional" className="hover:text-white transition">Regional</Link></li>
            <li><Link href="/seccion/politica" className="hover:text-white transition">Política</Link></li>
            <li><Link href="/seccion/sociedad" className="hover:text-white transition">Sociedad</Link></li>
          </ul>
        </div>

        {/* Institucional */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] font-sans mb-3 border-b border-[#D4AF37]/30 pb-1">
            Institucional
          </h4>
          <ul className="text-xs space-y-2 font-sans text-gray-300">
            <li><Link href="/contacto" className="hover:text-white transition">Redacción y Contacto</Link></li>
            <li><Link href="/cartas-de-lectores" className="hover:text-white transition">Cartas de Lectores</Link></li>
            <li><Link href="/publicidad" className="hover:text-white transition">Publicidad y Tarifas</Link></li>
            <li><Link href="/terminos-y-privacidad" className="hover:text-white transition">Términos y Privacidad</Link></li>
          </ul>
        </div>

        {/* Redacción y Ubicación */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] font-sans mb-3 border-b border-[#D4AF37]/30 pb-1">
            Redacción Central
          </h4>
          <p className="text-xs font-sans text-gray-300 leading-relaxed mb-2">
            Los Charrúas, Entre Ríos, Argentina.
          </p>
          <p className="text-xs font-sans text-gray-300">
            <strong>Contacto:</strong> redaccion@eltelegrafo.com
          </p>
        </div>
      </div>

      {/* Franja Inferior */}
      <div className="border-t border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 font-sans gap-2">
          <p suppressHydrationWarning>
            © {year} El Telégrafo de Los Charrúas. Todos los derechos reservados.
          </p>
          <Link 
            href="/admin/login" 
            className="hover:text-[#D4AF37] transition flex items-center gap-1 opacity-60 hover:opacity-100"
            title="Acceso Redacción"
          >
            <span>🔒</span> Acceso Redacción
          </Link>
        </div>
      </div>
    </footer>
  )
}
`,

  'app/contacto/page.tsx': `'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-white text-[#0a192f]">
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo de Los Charrúas" className="w-8 h-8 object-contain" />
          <h2 className="text-xl md:text-2xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo de Los Charrúas
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 font-serif bg-white text-[#0a192f]">
        <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
          <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
            El Telégrafo de Los Charrúas • Mesa de Entradas
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)] text-[#0a192f]">
            Redacción y Contacto
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 font-sans space-y-6 text-sm">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0a192f] border-b border-gray-300 pb-1 mb-2">
                Sede de Redacción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Los Charrúas, Entre Ríos, República Argentina.<br />
                Atención editorial: Lunes a Viernes de 08:00 a 20:00 hs.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#0a192f] border-b border-gray-300 pb-1 mb-2">
                Casillas Electrónicas
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li><strong>Noticias y Primicias:</strong> redaccion@eltelegrafo.com</li>
                <li><strong>Mesa Editorial:</strong> mesaeditorial@eltelegrafo.com</li>
                <li><strong>Mesa Técnica:</strong> soporte@eltelegrafo.com</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border-l-4 border-[#D4AF37] border border-gray-200">
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong>Protección de Fuentes:</strong> Toda información confidencial o denuncias remitidas son resguardadas bajo estricto secreto periodístico profesional.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            {enviado ? (
              <div className="p-8 bg-gray-50 border-2 border-[#D4AF37] text-center font-sans">
                <h3 className="text-xl font-bold text-[#0a192f] mb-2 font-serif">Mensaje Recibido</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Su comunicación ha sido remitida a la mesa de edición de El Telégrafo de Los Charrúas.
                </p>
                <button 
                  onClick={() => setEnviado(false)} 
                  className="bg-[#0a192f] text-white text-xs uppercase tracking-wider px-4 py-2 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-sm">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Nombre y Apellido</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f] placeholder:text-gray-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Correo Electrónico</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f] placeholder:text-gray-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Área de Destino</label>
                  <select 
                    required 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]"
                  >
                    <option value="">Seleccione un área...</option>
                    <option value="redaccion">Redacción / Envío de Noticias</option>
                    <option value="opinion">Columnas y Opinión</option>
                    <option value="correccion">Fe de Erratas / Aclaraciones</option>
                    <option value="general">Consultas Generales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Mensaje o Denuncia</label>
                  <textarea 
                    required 
                    rows={5} 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f] placeholder:text-gray-400" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition uppercase tracking-wider text-xs"
                >
                  Despachar Comunicación
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
`,

  'app/cartas-de-lectores/page.tsx': `'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CartasDeLectoresPage() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-white text-[#0a192f]">
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo de Los Charrúas" className="w-8 h-8 object-contain" />
          <h2 className="text-xl md:text-2xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo de Los Charrúas
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 font-serif bg-white text-[#0a192f]">
        <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
          <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
            El Telégrafo de Los Charrúas • Tribuna Abierta
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)] text-[#0a192f]">
            Cartas de Lectores
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 font-sans space-y-4 text-sm text-gray-700">
            <h3 className="font-serif text-lg font-bold text-[#0a192f] border-b border-gray-300 pb-1">
              Normas de Publicación
            </h3>
            <p className="leading-relaxed">
              Las cartas dirigidas a la Dirección deben reflejar opiniones, denuncias de interés público o réplicas a contenidos publicados en esta casa editorial.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
              <li>Longitud máxima aconsejada: 500 palabras.</li>
              <li>Es condición indispensable consignar nombre, apellido y DNI verídico.</li>
              <li>La Dirección se reserva el derecho de resumir o editar los textos por razones de espacio sin alterar su sentido.</li>
            </ul>
          </div>

          <div className="md:col-span-7">
            {enviado ? (
              <div className="p-8 bg-gray-50 border-2 border-[#D4AF37] text-center font-sans">
                <h3 className="text-xl font-bold text-[#0a192f] mb-2 font-serif">Carta Recibida</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Su texto ha sido derivado a la secretaría de redacción para su evaluación en las próximas ediciones.
                </p>
                <button 
                  onClick={() => setEnviado(false)} 
                  className="bg-[#0a192f] text-white text-xs uppercase tracking-wider px-4 py-2 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition"
                >
                  Enviar otra carta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-sm">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Nombre y Apellido</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">DNI / Documento</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Localidad de Residencia</label>
                    <input 
                      required 
                      type="text" 
                      defaultValue="Los Charrúas"
                      className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Correo Electrónico</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Título de la Carta</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Texto de la Carta</label>
                  <textarea 
                    required 
                    rows={6} 
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition uppercase tracking-wider text-xs"
                >
                  Enviar a Mesa Editorial
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
`,

  'app/publicidad/page.tsx': `import Link from 'next/link'

export default function PublicidadPage() {
  const formatos = [
    { nombre: 'Banner Principal Superior', medidas: '970 x 250 px / 728 x 90 px', ubicacion: 'Cabecera visible en todas las páginas' },
    { nombre: 'Lateral Sticky (Sidebar)', medidas: '300 x 250 px / 300 x 600 px', ubicacion: 'Columna fija en portada y artículos' },
    { nombre: 'In-Article Banner', medidas: '728 x 90 px / Nativo', ubicacion: 'Insertado en el cuerpo de las noticias' },
    { nombre: 'Nota Patrocinada / Branded', medidas: 'Contenido Editorial + Imagen', ubicacion: 'Publicación destacada en sección afín' }
  ]

  return (
    <div className="min-h-screen bg-white text-[#0a192f]">
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo de Los Charrúas" className="w-8 h-8 object-contain" />
          <h2 className="text-xl md:text-2xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo de Los Charrúas
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 font-serif bg-white text-[#0a192f]">
        <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
          <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
            El Telégrafo de Los Charrúas • Departamento Comercial
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)] text-[#0a192f]">
            Publicidad y Tarifas
          </h1>
        </div>

        <p className="text-gray-700 mb-10 text-base leading-relaxed font-sans">
          <strong>El Telégrafo de Los Charrúas</strong> ofrece soluciones de comunicación directa para empresas, comercios e instituciones que buscan visibilidad en una audiencia calificada de la localidad y la región.
        </p>

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

        <div className="bg-gray-50 border-2 border-[#D4AF37] p-8 font-sans">
          <h3 className="font-serif text-2xl font-bold text-[#0a192f] mb-2 uppercase">
            Contrataciones y Tarifario
          </h3>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Para solicitar nuestro tarifario publicitario o propuestas personalizadas de auspicio, contacte a la gerencia comercial:
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
`,

  'app/terminos-y-privacidad/page.tsx': `import Link from 'next/link'

export default function TerminosPrivacidadPage() {
  return (
    <div className="min-h-screen bg-white text-[#0a192f]">
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo de Los Charrúas" className="w-8 h-8 object-contain" />
          <h2 className="text-xl md:text-2xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo de Los Charrúas
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 font-serif bg-white text-[#0a192f]">
        <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
          <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
            El Telégrafo de Los Charrúas • Marco Institucional
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
              Todos los artículos, notas, fotografías y elementos gráficos de <strong>El Telégrafo de Los Charrúas</strong> son propiedad exclusiva del medio o de sus redactores colaboradores. Queda prohibida la reproducción total o parcial sin mención fehaciente de la fuente y enlace directo a la publicación original.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              2. Protección de Datos Personales
            </h2>
            <p>
              La información facilitada en formularios de contacto o cartas de lectores es tratada bajo estricta confidencialidad y no será comercializada ni cedida a terceros bajo ningún concepto, salvo requerimiento judicial expreso.
            </p>
          </section>

          <section className="border-b border-gray-200 pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              3. Uso de Cookies
            </h2>
            <p>
              Este sitio utiliza cookies técnicas indispensables para asegurar la sesión de usuario, optimizar la navegación y medir métricas anónimas de audiencia que permiten mejorar el servicio informativo.
            </p>
          </section>

          <section className="pb-6">
            <h2 className="font-serif text-xl font-bold text-[#0a192f] mb-3 uppercase">
              4. Límites de Responsabilidad
            </h2>
            <p>
              Las opiniones expresadas en columnas firmadas y cartas de lectores corresponden estrictamente a la visión de sus respectivos autores y no comprometen la postura institucional de <strong>El Telégrafo de Los Charrúas</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`✓ Actualizado: ${relativePath}`);
}

console.log('\\nTodos los archivos del footer fueron actualizados exitosamente.');