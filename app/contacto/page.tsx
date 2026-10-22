'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-[#0a192f] font-serif">
      <div className="border-b-4 border-[#D4AF37] pb-4 mb-8">
        <span className="text-xs uppercase font-sans tracking-widest text-[#D4AF37] font-bold block mb-1">
          El Telégrafo • Mesa de Entradas
        </span>
        <h1 className="text-4xl md:text-5xl font-bold uppercase font-[family-name:var(--font-cinzel)]">
          Redacción y Contacto
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Info editorial */}
        <div className="md:col-span-5 font-sans space-y-6 text-sm">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0a192f] border-b pb-1 mb-2">
              Sede Central de Redacción
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Edificio Central de Prensa<br />
              Atención editorial: Lunes a Viernes de 08:00 a 20:00 hs.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#0a192f] border-b pb-1 mb-2">
              Casillas Editoriales
            </h3>
            <ul className="space-y-1 text-gray-600">
              <li><strong>Noticias y Primicias:</strong> redaccion@eltelegrafo.com</li>
              <li><strong>Editor General:</strong> mesaeditorial@eltelegrafo.com</li>
              <li><strong>Mesa de Ayuda Técnica:</strong> soporte@eltelegrafo.com</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-100 border-l-4 border-[#D4AF37]">
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong>Protección de Fuentes:</strong> Toda información confidencial, documentación o denuncias remitidas a este medio son resguardadas bajo secreto periodístico profesional.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="md:col-span-7">
          {enviado ? (
            <div className="p-8 bg-gray-50 border-2 border-[#D4AF37] text-center font-sans">
              <h3 className="text-xl font-bold text-[#0a192f] mb-2 font-serif">Mensaje Recibido</h3>
              <p className="text-sm text-gray-600 mb-6">
                Su comunicación ha sido remitida a la mesa de edición correspondiente.
              </p>
              <button 
                onClick={() => setEnviado(false)} 
                className="bg-[#0a192f] text-white text-xs uppercase tracking-wider px-4 py-2 border border-[#D4AF37]"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-sm">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Nombre y Apellido</label>
                <input required type="text" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37]" />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37]" />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Área de Destino</label>
                <select required className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] bg-white">
                  <option value="">Seleccione un área...</option>
                  <option value="redaccion">Redacción / Envío de Noticias</option>
                  <option value="opinion">Columnas y Opinión</option>
                  <option value="correccion">Fe de Erratas / Aclaraciones</option>
                  <option value="general">Consultas Generales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Mensaje o Denuncia</label>
                <textarea required rows={5} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37]" />
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
  )
}