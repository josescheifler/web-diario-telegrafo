'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [year, setYear] = useState<number>(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

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
          <p>
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