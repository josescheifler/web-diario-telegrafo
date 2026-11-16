'use client'

import { useState } from 'react'

/** Enlaces para compartir la nota. La dirección se toma del navegador al hacer clic. */
export default function Compartir({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false)

  const abrir = (armar: (url: string, texto: string) => string) => {
    const url = encodeURIComponent(window.location.href)
    window.open(armar(url, encodeURIComponent(titulo)), '_blank', 'noopener,noreferrer')
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      /* el navegador no permite copiar: no se muestra nada */
    }
  }

  const claseBoton =
    'rounded border border-linea px-3 py-1.5 font-sans text-sm font-medium text-tinta hover:border-tinta'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-sans text-sm text-gris">Compartir</span>
      <button type="button" className={claseBoton} onClick={() => abrir((u, t) => `https://wa.me/?text=${t}%20${u}`)}>
        WhatsApp
      </button>
      <button type="button" className={claseBoton} onClick={() => abrir((u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)}>
        Facebook
      </button>
      <button type="button" className={claseBoton} onClick={() => abrir((u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)}>
        X
      </button>
      <button type="button" className={claseBoton} onClick={copiar} aria-live="polite">
        {copiado ? 'Enlace copiado' : 'Copiar enlace'}
      </button>
    </div>
  )
}
