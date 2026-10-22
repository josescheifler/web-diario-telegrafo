'use client'

import { useState, useEffect } from 'react'
import { crearNota, getAutores, crearAutor, getNotas, borrarNota, borrarAutor, logoutAdmin } from '../actions'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Evita que TipTap y Math.random() choquen con el pre-renderizado de Next.js
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false })

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('notas')
  const [contenido, setContenido] = useState('')
  const [autores, setAutores] = useState<any[]>([])
  const [notas, setNotas] = useState<any[]>([])

  const cargarDatos = () => {
    getAutores().then(setAutores)
    getNotas().then(setNotas)
  }

  useEffect(() => {
    cargarDatos()
  }, [activeTab])

  const handleBorrarNota = async (id: string) => {
    if (confirm('¿Seguro que querés eliminar esta nota?')) {
      await borrarNota(id)
      cargarDatos()
    }
  }

  const handleBorrarAutor = async (id: string) => {
    if (confirm('¿Seguro que querés borrar este autor? (Las notas asociadas se deben borrar primero)')) {
      try {
        await borrarAutor(id)
        cargarDatos()
      } catch (err) {
        alert('No se puede borrar un autor que tiene notas publicadas. Borrá sus notas primero.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-[#0a192f] font-sans">
      {/* Header del Panel Admin */}
      <div className="bg-[#0a192f] p-4 text-white flex justify-between items-center border-b-2 border-[#D4AF37]">
        <Link href="/" className="flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo" className="w-8 h-8 object-contain" />
          <h1 className="text-[#D4AF37] font-bold text-xl uppercase font-[family-name:var(--font-cinzel)]">
            El Telégrafo - Panel Admin
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs hover:text-[#D4AF37] border border-gray-600 px-3 py-1 font-bold">
            Ver Portada
          </Link>
          <button 
            onClick={() => logoutAdmin()} 
            className="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1 font-bold transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex px-6 bg-white border-b border-gray-300 gap-6 font-bold">
        <button 
          onClick={() => setActiveTab('notas')} 
          className={`py-4 ${activeTab === 'notas' ? 'border-b-2 border-[#D4AF37] text-[#0a192f]' : 'text-gray-400'}`}
        >
          Notas ({notas.length})
        </button>
        <button 
          onClick={() => setActiveTab('autores')} 
          className={`py-4 ${activeTab === 'autores' ? 'border-b-2 border-[#D4AF37] text-[#0a192f]' : 'text-gray-400'}`}
        >
          Autores ({autores.length})
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full">
        
        {/* TAB NOTAS */}
        {activeTab === 'notas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Formulario de Redacción */}
            <form 
              action={async (formData) => {
                await crearNota(formData, contenido);
                alert('Nota publicada con éxito');
                setContenido(''); 
                cargarDatos();
              }} 
              className="lg:col-span-7 flex flex-col gap-4 bg-white p-6 border border-gray-300 shadow-sm"
            >
              <h2 className="text-lg font-bold border-b pb-2">Redactar Nueva Nota</h2>
              
              <input 
                name="title" 
                type="text" 
                placeholder="Título de la nota" 
                required 
                className="p-3 border border-gray-300 outline-none focus:border-[#D4AF37]" 
              />
              <input 
                name="header" 
                type="text" 
                placeholder="Encabezado / Bajada" 
                required 
                className="p-3 border border-gray-300 outline-none focus:border-[#D4AF37]" 
              />
              
              <div className="flex gap-4">
                <select name="section" required className="p-3 border border-gray-300 w-1/3 outline-none bg-white">
                  <option value="">Sección...</option>
                  <option value="ECONOMIA">Economía</option>
                  <option value="LOCAL">Local</option>
                  <option value="REGIONAL">Regional</option>
                  <option value="PAIS">País</option>
                  <option value="MUNDO">Mundo</option>
                  <option value="POLITICA">Política</option>
                  <option value="SOCIEDAD">Sociedad</option>
                </select>
                
                <select name="authorId" required className="p-3 border border-gray-300 w-1/3 outline-none bg-white">
                  <option value="">Autor...</option>
                  {autores.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>

                <input 
                  name="featuredImage" 
                  type="text" 
                  placeholder="URL Imagen Principal" 
                  required 
                  className="p-3 border border-gray-300 w-1/3 outline-none" 
                />
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-2">Cuerpo de la Nota:</p>
                <Editor content={contenido} onChange={setContenido} />
              </div>
              
              <button 
                type="submit" 
                className="bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition mt-4"
              >
                Publicar Nota
              </button>
            </form>

            {/* Lista y Borrado de Notas */}
            <div className="lg:col-span-5 bg-white p-6 border border-gray-300 shadow-sm">
              <h2 className="text-lg font-bold border-b pb-2 mb-4">Notas Publicadas</h2>
              <div className="flex flex-col gap-3 max-h-[700px] overflow-y-auto">
                {notas.length === 0 ? (
                  <p className="text-sm text-gray-400">No hay notas redactadas aún.</p>
                ) : (
                  notas.map((n) => (
                    <div key={n.id} className="p-3 border border-gray-200 flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{n.section}</span>
                        <h4 className="font-bold text-sm leading-snug">{n.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Por {n.author?.name || 'Redacción'}</p>
                      </div>
                      <button 
                        onClick={() => handleBorrarNota(n.id)}
                        className="bg-red-700 text-white text-xs px-2 py-1 hover:bg-red-800 transition shrink-0"
                      >
                        Borrar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB AUTORES */}
        {activeTab === 'autores' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white p-6 border border-gray-300 shadow-sm">
              <h2 className="text-lg font-bold border-b pb-2 mb-4">Registrar Nuevo Autor</h2>
              <form 
                action={async (formData) => {
                  await crearAutor(formData);
                  alert('Autor creado con éxito');
                  cargarDatos();
                }} 
                className="flex flex-col gap-4"
              >
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Nombre completo" 
                  required 
                  className="p-3 border border-gray-300 outline-none" 
                />
                <input 
                  name="profilePic" 
                  type="text" 
                  placeholder="URL Foto de perfil" 
                  className="p-3 border border-gray-300 outline-none" 
                />
                <textarea 
                  name="bio" 
                  placeholder="Biografía breve" 
                  className="p-3 border border-gray-300 outline-none h-24" 
                />
                <button 
                  type="submit" 
                  className="bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition"
                >
                  Crear Autor
                </button>
              </form>
            </div>

            {/* Lista y Borrado de Autores */}
            <div className="lg:col-span-6 bg-white p-6 border border-gray-300 shadow-sm">
              <h2 className="text-lg font-bold border-b pb-2 mb-4">Autores Existentes</h2>
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                {autores.length === 0 ? (
                  <p className="text-sm text-gray-400">No hay autores cargados.</p>
                ) : (
                  autores.map((a) => (
                    <div key={a.id} className="p-3 border border-gray-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {a.profilePic && (
                          <img src={a.profilePic} alt={a.name} className="w-10 h-10 object-cover border border-[#D4AF37]" />
                        )}
                        <div>
                          <h4 className="font-bold text-sm">{a.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{a.bio || 'Sin biografía'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBorrarAutor(a.id)}
                        className="bg-red-700 text-white text-xs px-2 py-1 hover:bg-red-800 transition"
                      >
                        Borrar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}