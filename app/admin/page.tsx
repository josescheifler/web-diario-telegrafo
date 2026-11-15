'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  crearNota, getAutores, crearAutor, getNotas, borrarNota, borrarAutor, logoutAdmin,
  getAnuncios, guardarAnuncio, cambiarEstadoAnuncio, borrarAnuncio,
  type ActionResult,
} from '../actions'
import { AD_LOCATIONS, adLocationLabel, isEmbedAd } from '@/lib/ads'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Evita que TipTap y Math.random() choquen con el pre-renderizado de Next.js
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false })

type Autor = { id: string; name: string; bio: string | null; profilePic: string | null }
type Nota = { id: string; title: string; section: string; author: { name: string } | null }
type Anuncio = { id: string; name: string; adCode: string; location: string; isActive: boolean }
type Tab = 'notas' | 'autores' | 'publicidad'
type Mensaje = { tipo: 'ok' | 'error'; texto: string }
type ModoAnuncio = 'imagen' | 'codigo'

type FormAnuncio = {
  id: string
  name: string
  location: string
  mode: ModoAnuncio
  imageUrl: string
  linkUrl: string
  adCode: string
  isActive: boolean
}

const ANUNCIO_VACIO: FormAnuncio = {
  id: '',
  name: '',
  location: AD_LOCATIONS[0].value,
  mode: 'imagen',
  imageUrl: '',
  linkUrl: '',
  adCode: '',
  isActive: true,
}

// Si el anuncio es una imagen (con o sin enlace), recupera sus URLs para editarlo cómodamente
function leerAnuncioDeImagen(adCode: string): { imageUrl: string; linkUrl: string } | null {
  const doc = new DOMParser().parseFromString(adCode, 'text/html')
  const elementos = Array.from(doc.body.children)
  if (elementos.length !== 1 || doc.body.textContent?.trim()) return null

  const raiz = elementos[0]
  const img = raiz.tagName === 'IMG' ? raiz : raiz.tagName === 'A' && raiz.children.length === 1 ? raiz.children[0] : null
  if (!img || img.tagName !== 'IMG') return null

  return {
    imageUrl: img.getAttribute('src') ?? '',
    linkUrl: raiz.tagName === 'A' ? raiz.getAttribute('href') ?? '' : '',
  }
}

const inputClass = 'p-3 border border-gray-300 outline-none focus:border-[#D4AF37]'
const primaryButtonClass =
  'bg-[#0a192f] text-white font-bold py-3 px-6 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a192f] transition'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('notas')
  const [contenido, setContenido] = useState('')
  const [editorKey, setEditorKey] = useState(0)
  const [autores, setAutores] = useState<Autor[]>([])
  const [notas, setNotas] = useState<Nota[]>([])
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [anuncio, setAnuncio] = useState<FormAnuncio>(ANUNCIO_VACIO)
  const [mensaje, setMensaje] = useState<Mensaje | null>(null)

  const cargarDatos = useCallback(() => {
    getAutores().then(setAutores).catch(() => {})
    getNotas().then(setNotas).catch(() => {})
    getAnuncios().then(setAnuncios).catch(() => {
      setMensaje({
        tipo: 'error',
        texto: 'No se pudo leer la publicidad. Verificá que la tabla Advertisement exista en la base de datos (npx prisma db push).',
      })
    })
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [activeTab, cargarDatos])

  // Ejecuta una acción del servidor y muestra el resultado. Devuelve true si salió bien.
  const ejecutar = async (accion: () => Promise<ActionResult>, exito: string): Promise<boolean> => {
    try {
      const resultado = await accion()
      if (!resultado.ok) {
        setMensaje({ tipo: 'error', texto: resultado.error })
        return false
      }
      setMensaje({ tipo: 'ok', texto: exito })
      cargarDatos()
      return true
    } catch {
      setMensaje({ tipo: 'error', texto: 'Ocurrió un error inesperado. Probá de nuevo.' })
      return false
    }
  }

  const cambiarTab = (tab: Tab) => {
    setActiveTab(tab)
    setMensaje(null)
  }

  const handleBorrarNota = async (id: string) => {
    if (confirm('¿Seguro que querés eliminar esta nota?')) {
      await ejecutar(() => borrarNota(id), 'Nota eliminada.')
    }
  }

  const handleBorrarAutor = async (id: string) => {
    if (confirm('¿Seguro que querés borrar este autor? (Las notas asociadas se deben borrar primero)')) {
      await ejecutar(() => borrarAutor(id), 'Autor eliminado.')
    }
  }

  const handleBorrarAnuncio = async (a: Anuncio) => {
    if (confirm(`¿Seguro que querés eliminar el anuncio "${a.name}"?`)) {
      const ok = await ejecutar(() => borrarAnuncio(a.id), 'Anuncio eliminado.')
      if (ok && anuncio.id === a.id) setAnuncio(ANUNCIO_VACIO)
    }
  }

  const handleEditarAnuncio = (a: Anuncio) => {
    const imagen = leerAnuncioDeImagen(a.adCode)
    setAnuncio({
      id: a.id,
      name: a.name,
      location: a.location,
      isActive: a.isActive,
      mode: imagen ? 'imagen' : 'codigo',
      imageUrl: imagen?.imageUrl ?? '',
      linkUrl: imagen?.linkUrl ?? '',
      adCode: imagen ? '' : a.adCode,
    })
    setMensaje(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const ubicacionElegida = AD_LOCATIONS.find((l) => l.value === anuncio.location)

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
          onClick={() => cambiarTab('notas')}
          className={`py-4 ${activeTab === 'notas' ? 'border-b-2 border-[#D4AF37] text-[#0a192f]' : 'text-gray-400'}`}
        >
          Notas ({notas.length})
        </button>
        <button
          onClick={() => cambiarTab('autores')}
          className={`py-4 ${activeTab === 'autores' ? 'border-b-2 border-[#D4AF37] text-[#0a192f]' : 'text-gray-400'}`}
        >
          Autores ({autores.length})
        </button>
        <button
          onClick={() => cambiarTab('publicidad')}
          className={`py-4 ${activeTab === 'publicidad' ? 'border-b-2 border-[#D4AF37] text-[#0a192f]' : 'text-gray-400'}`}
        >
          Publicidad ({anuncios.length})
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full">

        {/* Aviso del resultado de la última acción */}
        {mensaje && (
          <div
            role="status"
            className={`mb-6 p-3 border-l-4 text-sm font-bold flex justify-between items-start gap-4 ${
              mensaje.tipo === 'ok'
                ? 'bg-green-50 border-green-700 text-green-800'
                : 'bg-red-50 border-red-700 text-red-700'
            }`}
          >
            <span>{mensaje.texto}</span>
            <button onClick={() => setMensaje(null)} aria-label="Cerrar aviso" className="shrink-0">✕</button>
          </div>
        )}

        {/* TAB NOTAS */}
        {activeTab === 'notas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Formulario de Redacción */}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const ok = await ejecutar(() => crearNota(new FormData(form), contenido), 'Nota publicada con éxito.')
                if (ok) {
                  form.reset()
                  setContenido('')
                  setEditorKey((k) => k + 1) // vacía el editor
                }
              }}
              className="lg:col-span-7 flex flex-col gap-4 bg-white p-6 border border-gray-300 shadow-sm"
            >
              <h2 className="text-lg font-bold border-b pb-2">Redactar Nueva Nota</h2>

              <input
                name="title"
                type="text"
                placeholder="Título de la nota"
                required
                className={inputClass}
              />
              <input
                name="header"
                type="text"
                placeholder="Encabezado / Bajada"
                required
                className={inputClass}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <select name="section" required className="p-3 border border-gray-300 sm:w-1/3 outline-none bg-white">
                  <option value="">Sección...</option>
                  <option value="ECONOMIA">Economía</option>
                  <option value="LOCAL">Local</option>
                  <option value="REGIONAL">Regional</option>
                  <option value="PAIS">País</option>
                  <option value="MUNDO">Mundo</option>
                  <option value="POLITICA">Política</option>
                  <option value="SOCIEDAD">Sociedad</option>
                </select>

                <select name="authorId" required className="p-3 border border-gray-300 sm:w-1/3 outline-none bg-white">
                  <option value="">Autor...</option>
                  {autores.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>

                <input
                  name="featuredImage"
                  type="url"
                  placeholder="URL Imagen Principal"
                  required
                  className="p-3 border border-gray-300 sm:w-1/3 outline-none"
                />
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Cuerpo de la Nota:</p>
                <Editor key={editorKey} content={contenido} onChange={setContenido} />
              </div>

              <button type="submit" className={`${primaryButtonClass} mt-4`}>
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
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const ok = await ejecutar(() => crearAutor(new FormData(form)), 'Autor creado con éxito.')
                  if (ok) form.reset()
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
                  type="url"
                  placeholder="URL Foto de perfil"
                  className="p-3 border border-gray-300 outline-none"
                />
                <textarea
                  name="bio"
                  placeholder="Biografía breve"
                  className="p-3 border border-gray-300 outline-none h-24"
                />
                <button type="submit" className={primaryButtonClass}>
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

        {/* TAB PUBLICIDAD */}
        {activeTab === 'publicidad' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Alta y edición de anuncios */}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const ok = await ejecutar(
                  () => guardarAnuncio(new FormData(form)),
                  anuncio.id ? 'Anuncio actualizado.' : 'Anuncio creado con éxito.'
                )
                if (ok) setAnuncio(ANUNCIO_VACIO)
              }}
              className="lg:col-span-6 flex flex-col gap-4 bg-white p-6 border border-gray-300 shadow-sm self-start"
            >
              <h2 className="text-lg font-bold border-b pb-2">
                {anuncio.id ? 'Editar Anuncio' : 'Nuevo Anuncio'}
              </h2>

              <input type="hidden" name="id" value={anuncio.id} />
              <input type="hidden" name="mode" value={anuncio.mode} />

              <div>
                <label htmlFor="ad-name" className="block text-xs uppercase font-bold mb-1">Nombre / Anunciante</label>
                <input
                  id="ad-name"
                  name="name"
                  type="text"
                  placeholder="Ej: Ferretería San Martín"
                  required
                  value={anuncio.name}
                  onChange={(e) => setAnuncio({ ...anuncio, name: e.target.value })}
                  className={`${inputClass} w-full`}
                />
              </div>

              <div>
                <label htmlFor="ad-location" className="block text-xs uppercase font-bold mb-1">Ubicación</label>
                <select
                  id="ad-location"
                  name="location"
                  required
                  value={anuncio.location}
                  onChange={(e) => setAnuncio({ ...anuncio, location: e.target.value })}
                  className="p-3 border border-gray-300 w-full outline-none bg-white"
                >
                  {AD_LOCATIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                  {/* Ubicación guardada con otro valor (anuncios cargados fuera del panel) */}
                  {!ubicacionElegida && <option value={anuncio.location}>{anuncio.location}</option>}
                </select>
                {ubicacionElegida && (
                  <p className="text-xs text-gray-500 mt-1">{ubicacionElegida.hint}</p>
                )}
              </div>

              <div>
                <span className="block text-xs uppercase font-bold mb-1">Tipo de anuncio</span>
                <div className="flex border border-gray-300 text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setAnuncio({ ...anuncio, mode: 'imagen' })}
                    className={`flex-1 py-2 ${anuncio.mode === 'imagen' ? 'bg-[#0a192f] text-white' : 'bg-white text-gray-500'}`}
                  >
                    Imagen con enlace
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnuncio({ ...anuncio, mode: 'codigo' })}
                    className={`flex-1 py-2 ${anuncio.mode === 'codigo' ? 'bg-[#0a192f] text-white' : 'bg-white text-gray-500'}`}
                  >
                    Código HTML
                  </button>
                </div>
              </div>

              {anuncio.mode === 'imagen' ? (
                <>
                  <div>
                    <label htmlFor="ad-image" className="block text-xs uppercase font-bold mb-1">URL de la imagen</label>
                    <input
                      id="ad-image"
                      name="imageUrl"
                      type="url"
                      placeholder="https://..."
                      required
                      value={anuncio.imageUrl}
                      onChange={(e) => setAnuncio({ ...anuncio, imageUrl: e.target.value })}
                      className={`${inputClass} w-full`}
                    />
                  </div>
                  <div>
                    <label htmlFor="ad-link" className="block text-xs uppercase font-bold mb-1">
                      Enlace al hacer clic <span className="font-normal normal-case text-gray-500">(opcional)</span>
                    </label>
                    <input
                      id="ad-link"
                      name="linkUrl"
                      type="url"
                      placeholder="https://... (web, Instagram o WhatsApp del anunciante)"
                      value={anuncio.linkUrl}
                      onChange={(e) => setAnuncio({ ...anuncio, linkUrl: e.target.value })}
                      className={`${inputClass} w-full`}
                    />
                  </div>
                  {/^https?:\/\//.test(anuncio.imageUrl) && (
                    <div>
                      <span className="block text-xs uppercase font-bold mb-1">Vista previa</span>
                      <div className="border border-dashed border-gray-300 p-3 bg-gray-50">
                        <img src={anuncio.imageUrl} alt="Vista previa del anuncio" className="max-w-full h-auto mx-auto" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label htmlFor="ad-code" className="block text-xs uppercase font-bold mb-1">Código del anuncio</label>
                  <textarea
                    id="ad-code"
                    name="adCode"
                    required
                    rows={7}
                    placeholder="Pegá acá el código HTML que te dio el anunciante o la red de publicidad"
                    value={anuncio.adCode}
                    onChange={(e) => setAnuncio({ ...anuncio, adCode: e.target.value })}
                    className={`${inputClass} w-full font-mono text-xs`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si el código incluye scripts o iframes se muestra aislado del resto del sitio, en un recuadro de alto fijo.
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm font-bold">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={anuncio.isActive}
                  onChange={(e) => setAnuncio({ ...anuncio, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                Mostrar en el sitio
              </label>

              <div className="flex gap-3 mt-2">
                <button type="submit" className={`${primaryButtonClass} flex-1`}>
                  {anuncio.id ? 'Guardar Cambios' : 'Crear Anuncio'}
                </button>
                {anuncio.id && (
                  <button
                    type="button"
                    onClick={() => setAnuncio(ANUNCIO_VACIO)}
                    className="py-3 px-6 border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {/* Lista de anuncios, agrupada por ubicación */}
            <div className="lg:col-span-6 bg-white p-6 border border-gray-300 shadow-sm">
              <h2 className="text-lg font-bold border-b pb-2 mb-4">Anuncios Cargados</h2>
              {anuncios.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No hay anuncios cargados. Mientras tanto, el lateral de la portada muestra el cartel &quot;Espacio Publicitario&quot;.
                </p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[700px] overflow-y-auto">
                  {anuncios.map((a) => {
                    const imagen = leerAnuncioDeImagen(a.adCode)
                    return (
                      <div key={a.id} className={`p-3 border flex gap-3 ${a.isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="w-20 h-16 shrink-0 border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                          {imagen ? (
                            <img src={imagen.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-mono text-gray-400">
                              {isEmbedAd(a.adCode) ? '<script>' : 'HTML'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{adLocationLabel(a.location)}</span>
                          <h4 className="font-bold text-sm leading-snug truncate">{a.name}</h4>
                          <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 ${a.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                            {a.isActive ? 'Activo' : 'Pausado'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0 text-xs">
                          <button
                            onClick={() => ejecutar(
                              () => cambiarEstadoAnuncio(a.id, !a.isActive),
                              a.isActive ? 'Anuncio pausado.' : 'Anuncio activado.'
                            )}
                            className="border border-gray-300 px-2 py-1 font-bold hover:bg-gray-50 transition"
                          >
                            {a.isActive ? 'Pausar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleEditarAnuncio(a)}
                            className="border border-gray-300 px-2 py-1 font-bold hover:bg-gray-50 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleBorrarAnuncio(a)}
                            className="bg-red-700 text-white px-2 py-1 hover:bg-red-800 transition"
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
