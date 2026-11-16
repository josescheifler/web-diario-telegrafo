'use client'

import { useCallback, useEffect, useState } from 'react'
import { borrarMensaje, getMensajes, marcarMensajeLeido } from '../actions'

type Mensaje = {
  id: string
  kind: string
  name: string
  email: string | null
  locality: string | null
  subject: string | null
  body: string
  read: boolean
  createdAt: Date
}

type Filtro = 'TODOS' | 'CONTACTO' | 'CARTA'

const fechaHora = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  timeZone: 'America/Argentina/Buenos_Aires',
})

/** Bandeja de mensajes y cartas que envían los lectores desde el sitio. */
export default function MensajesTab({ onSinLeer }: { onSinLeer: (cantidad: number) => void }) {
  const [mensajes, setMensajes] = useState<Mensaje[] | null>(null)
  const [filtro, setFiltro] = useState<Filtro>('TODOS')
  const [error, setError] = useState('')

  const cargar = useCallback(() => {
    getMensajes()
      .then((lista) => {
        setMensajes(lista)
        onSinLeer(lista.filter((m) => !m.read).length)
        setError('')
      })
      .catch(() => setError('No se pudieron leer los mensajes. Probá recargar la página.'))
  }, [onSinLeer])

  useEffect(() => {
    cargar()
  }, [cargar])

  const marcar = async (m: Mensaje) => {
    await marcarMensajeLeido(m.id, !m.read)
    cargar()
  }

  const borrar = async (m: Mensaje) => {
    if (confirm(`¿Seguro que querés borrar el mensaje de ${m.name}? No se puede recuperar.`)) {
      await borrarMensaje(m.id)
      cargar()
    }
  }

  const visibles = (mensajes ?? []).filter((m) => filtro === 'TODOS' || m.kind === filtro)
  const filtros: { valor: Filtro; nombre: string }[] = [
    { valor: 'TODOS', nombre: 'Todos' },
    { valor: 'CONTACTO', nombre: 'Mensajes a la redacción' },
    { valor: 'CARTA', nombre: 'Cartas de lectores' },
  ]

  return (
    <div className="bg-white p-6 border border-gray-300 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 mb-4">
        <h2 className="text-lg font-bold">Mensajes de lectores</h2>
        <div className="flex border border-gray-300 text-sm font-bold">
          {filtros.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => setFiltro(f.valor)}
              className={`px-3 py-1.5 ${filtro === f.valor ? 'bg-[#0d1e32] text-white' : 'bg-white text-gray-500'}`}
            >
              {f.nombre}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 p-3 border-l-4 border-red-700 bg-red-50 text-sm font-bold text-red-700">{error}</p>}

      {mensajes === null && !error ? (
        <p className="text-sm text-gray-400">Cargando mensajes…</p>
      ) : visibles.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay mensajes. Los que envíen los lectores desde &ldquo;Escribir a la redacción&rdquo; y &ldquo;Cartas de lectores&rdquo; aparecen acá.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visibles.map((m) => (
            <li key={m.id} className={`border p-4 ${m.read ? 'border-gray-200 bg-gray-50' : 'border-[#d3ad3e] bg-white'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase text-[#7a5c0e]">
                    {m.kind === 'CARTA' ? 'Carta de lectores' : 'Mensaje a la redacción'}
                    {!m.read && <span className="ml-2 bg-[#d3ad3e] px-1.5 py-0.5 text-[#0d1e32]">Sin leer</span>}
                  </p>
                  <p className="mt-1 font-bold">
                    {m.name}
                    {m.locality && <span className="font-normal text-gray-600">, {m.locality}</span>}
                  </p>
                  <p className="text-xs text-gray-500">
                    {m.email && <a href={`mailto:${m.email}`} className="underline">{m.email}</a>}
                    {m.email && ' · '}
                    {fechaHora.format(new Date(m.createdAt))}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 text-xs">
                  <button type="button" onClick={() => marcar(m)} className="border border-gray-300 px-2 py-1 font-bold hover:bg-gray-50 transition">
                    {m.read ? 'Marcar sin leer' : 'Marcar leído'}
                  </button>
                  <button type="button" onClick={() => borrar(m)} className="bg-red-700 text-white px-2 py-1 hover:bg-red-800 transition">
                    Borrar
                  </button>
                </div>
              </div>
              {m.subject && <p className="mt-3 text-sm font-bold">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{m.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
