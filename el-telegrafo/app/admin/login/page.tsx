'use client'

import { useActionState } from 'react'
import { loginAdmin } from '@/app/actions'
import Link from 'next/link'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  return (
    <div className="min-h-screen bg-[#0a192f] flex flex-col justify-center items-center p-4 font-serif">
      <div className="w-full max-w-md bg-white p-8 border-2 border-[#D4AF37] shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src="/favicon.ico" alt="El Telégrafo" className="w-12 h-12 mb-3 object-contain" />
          <h1 className="text-2xl font-black text-[#0a192f] tracking-widest uppercase font-[family-name:var(--font-cinzel)] text-center">
            El Telégrafo
          </h1>
          <p className="text-xs text-gray-500 font-sans tracking-widest uppercase mt-1">
            Acceso a Redacción y Administración
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 border-l-4 border-red-700 p-3 mb-4 text-xs font-sans text-red-700 font-bold">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4 font-sans">
          <div>
            <label className="block text-xs uppercase font-bold text-[#0a192f] mb-1">
              Contraseña de Acceso
            </label>
            <input 
              name="password" 
              type="password" 
              placeholder="Ingresá la contraseña" 
              required 
              className="w-full p-3 border border-gray-300 outline-none focus:border-[#D4AF37] text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition text-sm tracking-wider uppercase mt-2 disabled:opacity-50"
          >
            {isPending ? 'Verificando...' : 'Ingresar al Panel'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center font-sans">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#0a192f] transition">
            ← Volver a la portada del diario
          </Link>
        </div>
      </div>
    </div>
  )
}