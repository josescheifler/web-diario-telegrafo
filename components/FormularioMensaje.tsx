'use client'

import { useState } from 'react'
import { enviarMensaje } from '@/app/actions'
import { LIMITES, MOTIVOS_CONTACTO, type TipoMensaje } from '@/lib/mensajes'

type Estado = { tipo: 'inicial' | 'enviando' | 'enviado' } | { tipo: 'error'; texto: string }

/** Formulario de "Escribir a la redacción" y de "Cartas de lectores". Los mensajes se leen en el panel. */
export default function FormularioMensaje({ tipo }: { tipo: TipoMensaje }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'inicial' })
  const esCarta = tipo === 'CARTA'

  if (estado.tipo === 'enviado') {
    return (
      <div role="status" className="border-l-4 border-oro bg-niebla p-6 font-sans">
        <h2 className="font-serif text-2xl font-semibold">{esCarta ? 'Recibimos tu carta' : 'Recibimos tu mensaje'}</h2>
        <p className="mt-2 text-tinta/80">
          {esCarta
            ? 'La redacción la va a leer. Si se publica, te avisamos al correo que dejaste.'
            : 'La redacción lo va a leer y, si hace falta, te responde al correo que dejaste.'}
        </p>
        <button type="button" className="boton mt-5" onClick={() => setEstado({ tipo: 'inicial' })}>
          {esCarta ? 'Enviar otra carta' : 'Enviar otro mensaje'}
        </button>
      </div>
    )
  }

  const enviando = estado.tipo === 'enviando'

  return (
    <form
      className="flex flex-col gap-5 font-sans"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        setEstado({ tipo: 'enviando' })
        try {
          const resultado = await enviarMensaje(new FormData(form))
          if (resultado.ok) {
            form.reset()
            setEstado({ tipo: 'enviado' })
          } else {
            setEstado({ tipo: 'error', texto: resultado.error })
          }
        } catch {
          setEstado({ tipo: 'error', texto: 'No pudimos enviar el mensaje. Revisá tu conexión y probá de nuevo.' })
        }
      }}
    >
      <input type="hidden" name="kind" value={tipo} />
      {/* Campo trampa contra robots: oculto para las personas */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>No completar <input type="text" name="sitio" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="msg-name" className="mb-1.5 block text-sm font-semibold">Nombre y apellido</label>
          <input id="msg-name" name="name" type="text" required maxLength={LIMITES.nombre} autoComplete="name" className="campo" />
        </div>
        <div>
          <label htmlFor="msg-email" className="mb-1.5 block text-sm font-semibold">Correo electrónico</label>
          <input id="msg-email" name="email" type="email" required maxLength={LIMITES.email} autoComplete="email" className="campo" />
        </div>
      </div>

      {esCarta ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="msg-locality" className="mb-1.5 block text-sm font-semibold">Localidad</label>
            <input id="msg-locality" name="locality" type="text" required maxLength={LIMITES.localidad} placeholder="Ej: Los Charrúas" className="campo" />
          </div>
          <div>
            <label htmlFor="msg-subject" className="mb-1.5 block text-sm font-semibold">
              Título <span className="font-normal text-gris">(opcional)</span>
            </label>
            <input id="msg-subject" name="subject" type="text" maxLength={LIMITES.asunto} className="campo" />
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="msg-subject" className="mb-1.5 block text-sm font-semibold">Motivo</label>
          <select id="msg-subject" name="subject" required defaultValue="" className="campo">
            <option value="" disabled>Elegí un motivo</option>
            {MOTIVOS_CONTACTO.map((motivo) => (
              <option key={motivo} value={motivo}>{motivo}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="msg-body" className="mb-1.5 block text-sm font-semibold">{esCarta ? 'Tu carta' : 'Mensaje'}</label>
        <textarea id="msg-body" name="body" required rows={esCarta ? 10 : 6} maxLength={LIMITES.mensaje} className="campo font-serif text-lg" />
      </div>

      {estado.tipo === 'error' && (
        <p role="alert" className="border-l-4 border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800">{estado.texto}</p>
      )}

      <div>
        <button type="submit" disabled={enviando} className="boton">
          {enviando ? 'Enviando…' : esCarta ? 'Enviar carta' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  )
}
