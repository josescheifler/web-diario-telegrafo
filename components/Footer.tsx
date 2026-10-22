'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [year, setYear] = useState('2026')

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  const secciones = ['ECONOMÍA', 'LOCAL', 'REGIONAL', 'MUNDO', 'PAÍS', 'POLÍTICA', 'SOCIEDAD']

  return (
    <footer className="bg-[#0a192f] text-white border-t-4 border-[#D4AF37] mt-20 font-serif">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#D4AF37]/30">
          
          {/* Identidad del Diario */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-3">
              <img src="/favicon.ico" alt="El Telégrafo" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-black text-[#D4AF37] tracking-widest uppercase font-[family-name:var(--font-cinzel)]">
                El Telégrafo
              </span>
            </Link>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Diario digital. Periodismo independiente, riguroso y comprometido con la actualidad.
            </p>
          </div>

          {/* Secciones */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-3 font-sans border-b border-[#D4AF37]/20 pb-1">
              Secciones
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-sans text-gray-300">
              {secciones.map(s => {
                const url = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                return (
                  <li key={s}>
                    <Link href={`/seccion/${url}`} className="hover:text-[#D4AF37] transition-colors">
                      {s}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Institucional (Enlaces activos) */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-3 font-sans border-b border-[#D4AF37]/20 pb-1">
              Institucional
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-sans text-gray-300">
              <li><Link href="/contacto" className="hover:text-[#D4AF37]">Redacción y Contacto</Link></li>
              <li><Link href="/cartas-de-lectores" className="hover:text-[#D4AF37]">Cartas de Lectores</Link></li>
              <li><Link href="/publicidad" className="hover:text-[#D4AF37]">Publicidad y Tarifas</Link></li>
              <li><Link href="/terminos-y-privacidad" className="hover:text-[#D4AF37]">Términos y Privacidad</Link></li>
            </ul>
          </div>

          {/* Redes y Canales (Pendientes) */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-3 font-sans border-b border-[#D4AF37]/20 pb-1">
              Redes y Canales
            </h4>
            <div className="flex flex-col gap-2 text-xs font-sans text-gray-400">
              <span>X / Twitter (Próximamente)</span>
              <span>Instagram (Próximamente)</span>
              <span>Facebook (Próximamente)</span>
              <span>Canal de WhatsApp (Próximamente)</span>
            </div>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-sans gap-4">
          <p suppressHydrationWarning>
            © {year} El Telégrafo. Todos los derechos reservados.
          </p>
          
          <Link 
            href="/admin" 
            title="Acceso Redacción" 
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors p-2 border border-transparent hover:border-[#D4AF37]/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18 10h-1.26V7a4.74 4.74 0 0 0-9.48 0v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-8.74-3a2.74 2.74 0 1 1 5.48 0v3H9.26zm8.74 13H6v-8h12z"/>
            </svg>
            <span className="text-[10px] tracking-widest uppercase font-bold">Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}