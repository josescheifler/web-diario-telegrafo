'use client'
import { useSyncExternalStore } from 'react'

const sinSuscripcion = () => () => {}

function hoy() {
  const texto = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** La fecha de hoy. Se calcula en el navegador para que nunca quede vieja en una página guardada. */
export default function Fecha({ className = '' }: { className?: string }) {
  const fecha = useSyncExternalStore(sinSuscripcion, hoy, () => '')
  return <span className={className} suppressHydrationWarning>{fecha || ' '}</span>
}
