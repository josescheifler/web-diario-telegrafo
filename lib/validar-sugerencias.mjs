// Valida el archivo contenido/sugerencias.json.
// Lo usan el sitio (para descartar entradas mal armadas sin romper el panel) y
// el script `npm run validar-sugerencias` (que corre la búsqueda diaria antes de subir).
// El formato está explicado en PAUTAS-SUGERENCIAS.md.

/** Valores de sección válidos. Deben coincidir con lib/secciones.ts. */
export const SECCIONES_VALIDAS = ['LOCAL', 'REGIONAL', 'PAIS', 'MUNDO', 'POLITICA', 'ECONOMIA', 'SOCIEDAD']

const ETIQUETAS_PERMITIDAS = new Set(['p', 'strong', 'em', 'b', 'i', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'br'])
const MAX_NOTAS = 150

function esUrlHttp(valor) {
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function esFecha(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false
  const fecha = new Date(`${valor}T12:00:00Z`)
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
}

function largo(valor, min, max) {
  return typeof valor === 'string' && valor.trim().length >= min && valor.trim().length <= max
}

/** Devuelve el primer problema del HTML del cuerpo, o null si está bien. */
function problemaDelCuerpo(html) {
  if (typeof html !== 'string') return 'el cuerpo no es texto'
  for (const [, cierre, nombre, atributos] of html.matchAll(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g)) {
    const etiqueta = nombre.toLowerCase()
    if (!ETIQUETAS_PERMITIDAS.has(etiqueta)) return `etiqueta no permitida <${etiqueta}>`
    const attrs = atributos.trim().replace(/\/$/, '').trim()
    if (cierre || etiqueta !== 'a') {
      if (attrs) return `<${etiqueta}> no puede llevar atributos`
    } else {
      const href = attrs.match(/^href="([^"]+)"$/)
      if (!href || !esUrlHttp(href[1])) return 'los enlaces deben ser <a href="https://...">'
    }
  }
  const texto = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (texto.length < 700) return `el cuerpo es muy corto (${texto.length} caracteres, mínimo 700)`
  if (texto.length > 7000) return `el cuerpo es muy largo (${texto.length} caracteres, máximo 7000)`
  if ((html.match(/<p>/g) ?? []).length < 3) return 'el cuerpo debe tener al menos 3 párrafos <p>'
  return null
}

/**
 * Revisa el contenido del archivo de sugerencias.
 * @param {unknown} datos
 * @returns {{ notas: Array<{ id: string, fecha: string, seccion: string, titulo: string, bajada: string, cuerpo: string, fuentes: Array<{ medio: string, url: string }> }>, errores: string[] }}
 */
export function validarSugerencias(datos) {
  const errores = []
  const notas = []

  if (!datos || typeof datos !== 'object' || !Array.isArray(datos.notas)) {
    return { notas, errores: ['el archivo debe tener la forma { "notas": [ ... ] }'] }
  }
  if (datos.notas.length > MAX_NOTAS) {
    errores.push(`hay ${datos.notas.length} notas; el máximo es ${MAX_NOTAS} (borrá las más viejas)`)
  }

  const ids = new Set()
  datos.notas.forEach((nota, i) => {
    const nombre = nota && typeof nota.id === 'string' ? nota.id : `nota ${i + 1}`
    const problemas = []

    if (!nota || typeof nota !== 'object') {
      errores.push(`${nombre}: no es un objeto`)
      return
    }
    if (typeof nota.id !== 'string' || !/^[a-z0-9][a-z0-9-]{3,80}$/.test(nota.id)) problemas.push('id inválido (solo minúsculas, números y guiones)')
    else if (ids.has(nota.id)) problemas.push('id repetido')
    if (!esFecha(nota.fecha)) problemas.push('fecha inválida (AAAA-MM-DD)')
    if (!SECCIONES_VALIDAS.includes(nota.seccion)) problemas.push(`sección inválida (${SECCIONES_VALIDAS.join(', ')})`)
    if (!largo(nota.titulo, 15, 160)) problemas.push('el título debe tener entre 15 y 160 caracteres')
    if (!largo(nota.bajada, 30, 400)) problemas.push('la bajada debe tener entre 30 y 400 caracteres')
    const cuerpo = problemaDelCuerpo(nota.cuerpo)
    if (cuerpo) problemas.push(cuerpo)
    if (!Array.isArray(nota.fuentes) || nota.fuentes.length < 1 || nota.fuentes.length > 5) {
      problemas.push('debe tener entre 1 y 5 fuentes')
    } else if (!nota.fuentes.every((f) => f && largo(f.medio, 2, 80) && esUrlHttp(f.url))) {
      problemas.push('cada fuente necesita "medio" y una "url" http(s)')
    }

    if (problemas.length > 0) {
      errores.push(`${nombre}: ${problemas.join('; ')}`)
      return
    }
    ids.add(nota.id)
    notas.push({
      id: nota.id,
      fecha: nota.fecha,
      seccion: nota.seccion,
      titulo: nota.titulo.trim(),
      bajada: nota.bajada.trim(),
      cuerpo: nota.cuerpo.trim(),
      fuentes: nota.fuentes.map((f) => ({ medio: f.medio.trim(), url: f.url.trim() })),
    })
  })

  return { notas, errores }
}
