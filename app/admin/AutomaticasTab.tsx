'use client'

import { useCallback, useEffect, useState } from 'react'
import { getSugerencias, quitarAutomatica, republicarAutomatica } from '../actions'
import { nombreSeccion } from '@/lib/secciones'

type Automatica = Awaited<ReturnType<typeof getSugerencias>>[number]

const fechaLarga = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${fecha}T12:00:00Z`)
  )

/** Las notas con más de 3 días ya no se publican solas (ver lib/sugerencias.ts). */
const esVieja = (fecha: string) => fecha < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

/** Texto listo para pegar en Instagram. */
function textoParaInstagram(nota: Automatica): string {
  const sitio = typeof window !== 'undefined' ? window.location.host : 'El Telégrafo'
  const etiqueta = nombreSeccion(nota.seccion).replace(/\s+/g, '')
  return `${nota.titulo}\n\n${nota.bajada}\n\nLa nota completa, en ${sitio} (link en la bio).\n\n#LosCharrúas #EntreRíos #${etiqueta}`
}

/** Notas que redacta la búsqueda diaria y se publican solas. */
export default function AutomaticasTab({ onEditar }: { onEditar: (id: string) => void }) {
  const [notas, setNotas] = useState<Automatica[] | null>(null)
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [copiada, setCopiada] = useState<string | null>(null)

  const cargar = useCallback(() => {
    getSugerencias()
      .then(setNotas)
      .catch(() => setAviso({ tipo: 'error', texto: 'No se pudieron leer las notas automáticas. Probá recargar la página.' }))
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const ejecutar = async (accion: () => Promise<{ ok: boolean; error?: string }>, exito: string) => {
    try {
      const r = await accion()
      setAviso(r.ok ? { tipo: 'ok', texto: exito } : { tipo: 'error', texto: r.error ?? 'No se pudo completar.' })
    } catch {
      setAviso({ tipo: 'error', texto: 'Ocurrió un error inesperado. Probá de nuevo.' })
    }
    cargar()
  }

  const copiar = async (nota: Automatica) => {
    try {
      await navigator.clipboard.writeText(textoParaInstagram(nota))
      setCopiada(nota.id)
      setTimeout(() => setCopiada((actual) => (actual === nota.id ? null : actual)), 2500)
    } catch {
      setAviso({ tipo: 'error', texto: 'El navegador no dejó copiar el texto.' })
    }
  }

  const porFecha = new Map<string, Automatica[]>()
  for (const nota of notas ?? []) porFecha.set(nota.fecha, [...(porFecha.get(nota.fecha) ?? []), nota])

  const boton = 'border border-gray-300 px-2 py-1 font-bold hover:bg-gray-50 transition text-center'

  return (
    <div className="bg-white p-6 border border-gray-300 shadow-sm">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-lg font-bold">Notas automáticas</h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Todas las mañanas se buscan noticias en otros medios y se redactan notas propias que se publican solas, firmadas por
          &ldquo;Redacción El Telégrafo&rdquo; y con la fuente al pie. Si una tiene un error, editala; si no la querés, quitala del sitio.
        </p>
      </div>

      {aviso && (
        <p
          role="status"
          className={`mb-4 p-3 border-l-4 text-sm font-bold ${aviso.tipo === 'ok' ? 'bg-green-50 border-green-700 text-green-800' : 'bg-red-50 border-red-700 text-red-700'}`}
        >
          {aviso.texto}
        </p>
      )}

      {notas === null ? (
        <p className="text-sm text-gray-400">Cargando notas…</p>
      ) : notas.length === 0 ? (
        <p className="text-sm text-gray-500">Todavía no hay notas automáticas. La primera tanda llega con la próxima búsqueda diaria.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {[...porFecha.entries()].map(([fecha, delDia]) => (
            <section key={fecha}>
              <h3 className="text-sm font-bold text-gray-500 mb-3 first-letter:uppercase">{fechaLarga(fecha)}</h3>
              <ul className="flex flex-col gap-3">
                {delDia.map((n) => (
                  <li key={n.id} className={`border p-4 flex flex-wrap gap-4 justify-between ${n.estado === 'PUBLICADA' ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="min-w-0 flex-1 basis-80">
                      <p className="text-[11px] font-bold uppercase text-[#7a5c0e]">
                        {nombreSeccion(n.seccion)}
                        {n.estado === 'DESCARTADA' && <span className="ml-2 bg-gray-200 px-1.5 py-0.5 text-gray-600">Quitada del sitio</span>}
                        {n.estado === 'PENDIENTE' && (
                          <span className="ml-2 bg-[#d3ad3e] px-1.5 py-0.5 text-[#0d1e32]">
                            {esVieja(n.fecha) ? 'No se publicó: llegó con más de 3 días' : 'Se publica en unos minutos'}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 font-bold leading-snug">{n.titulo}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Fuente:{' '}
                        {n.fuentes.map((f, i) => (
                          <span key={f.url}>
                            {i > 0 && ', '}
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline">{f.medio}</a>
                          </span>
                        ))}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-2 text-xs">
                      {n.estado === 'PUBLICADA' && n.articleId && (
                        <>
                          <a href={`/nota/${n.articleId}`} target="_blank" rel="noopener noreferrer" className={boton}>Ver</a>
                          <button type="button" onClick={() => onEditar(n.articleId as string)} className={boton}>Editar</button>
                          <a href={`/nota/${n.articleId}/instagram`} target="_blank" rel="noopener noreferrer" className={boton}>Imagen para Instagram</a>
                          <button type="button" onClick={() => copiar(n)} className={boton}>
                            {copiada === n.id ? 'Texto copiado' : 'Copiar texto para Instagram'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Quitar del sitio "${n.titulo}"?`)) ejecutar(() => quitarAutomatica(n.id), 'Nota quitada del sitio.')
                            }}
                            className="bg-red-700 text-white px-2 py-1 hover:bg-red-800 transition"
                          >
                            Quitar del sitio
                          </button>
                        </>
                      )}
                      {n.estado === 'DESCARTADA' && (
                        <button type="button" onClick={() => ejecutar(() => republicarAutomatica(n.id), 'Nota publicada de nuevo.')} className={boton}>
                          Volver a publicar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
