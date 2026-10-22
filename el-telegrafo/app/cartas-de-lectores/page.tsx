'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CartasLectoresPage() {
  const [enviada, setEnviada] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Cabecera Clásica */}
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo" className="w-8 h-8 object-contain" />
          <h2 className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 text-[#0a192f] font-serif bg-white">
        <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
          <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
            Opinión Pública • Participación Ciudadana
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)] text-[#0a192f]">
            Cartas de Lectores
          </h1>
        </div>

        <p className="text-gray-700 mb-10 text-base leading-relaxed font-sans">
          La sección <em>Cartas de Lectores</em> constituye un espacio de libre expresión ciudadana. Las opiniones vertidas son de exclusiva responsabilidad de sus autores y no reflejan necesariamente la línea editorial de <strong>El Telégrafo</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Normas a la izquierda */}
          <div className="md:col-span-5 font-sans text-xs bg-gray-50 p-6 border border-gray-300 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#0a192f] uppercase border-b border-gray-300 pb-2">
              Normas de Publicación
            </h3>
            <ul className="space-y-2 list-disc pl-4 text-gray-600 leading-relaxed">
              <li><strong>Identificación obligatoria:</strong> Se exige nombre real y documento.</li>
              <li><strong>Extensión:</strong> Máximo 400 palabras para facilitar diagramación.</li>
              <li><strong>Criterio:</strong> La redacción se reserva el derecho de titular.</li>
              <li><strong>Respeto:</strong> No se admiten descalificaciones ni anónimos.</li>
            </ul>
          </div>

          {/* Formulario a la derecha */}
          <div className="md:col-span-7">
            {enviada ? (
              <div className="p-8 bg-gray-50 border-2 border-[#D4AF37] text-center font-sans">
                <h3 className="text-xl font-bold text-[#0a192f] mb-2 font-serif">Carta Recibida</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Su escrito ha sido ingresado al proceso de revisión editorial.
                </p>
                <button 
                  onClick={() => setEnviada(false)} 
                  className="bg-[#0a192f] text-white text-xs uppercase tracking-wider px-4 py-2 border border-[#D4AF37]"
                >
                  Enviar otra carta
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setEnviada(true); }} className="flex flex-col gap-4 font-sans text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Nombre Completo</label>
                    <input required type="text" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">DNI / Cédula</label>
                    <input required type="text" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Correo Electrónico</label>
                    <input required type="email" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Ciudad / Localidad</label>
                    <input required type="text" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Título de la Carta</label>
                  <input required type="text" placeholder="Asunto central del escrito" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Texto del Escrito</label>
                  <textarea required rows={6} placeholder="Escriba aquí su carta..." className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white text-[#0a192f]" />
                </div>

                <button 
                  type="submit" 
                  className="bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition uppercase tracking-wider text-xs"
                >
                  Enviar a Revisión Editorial
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}