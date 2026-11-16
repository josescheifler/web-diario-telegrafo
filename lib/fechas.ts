// Fechas siempre en hora argentina, sin depender del servidor ni del navegador.
const ZONA = 'America/Argentina/Buenos_Aires'

/** "16 de noviembre de 2026" */
export function fechaLarga(fecha: Date): string {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: ZONA }).format(fecha)
}

/** "16 nov 2026" */
export function fechaCorta(fecha: Date): string {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: ZONA })
    .format(fecha)
    .replace(/\./g, '')
}

/** "16 de noviembre de 2026, 18:45" */
export function fechaYHora(fecha: Date): string {
  const hora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA }).format(fecha)
  return `${fechaLarga(fecha)}, ${hora}`
}
