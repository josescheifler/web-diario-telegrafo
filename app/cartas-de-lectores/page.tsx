'use client'

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