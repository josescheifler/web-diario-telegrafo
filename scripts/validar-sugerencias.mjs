// Uso: npm run validar-sugerencias
// Revisa contenido/sugerencias.json y termina con error si algo está mal armado.
import { readFileSync } from 'node:fs'
import { validarSugerencias } from '../lib/validar-sugerencias.mjs'

const ruta = new URL('../contenido/sugerencias.json', import.meta.url)
let datos
try {
  datos = JSON.parse(readFileSync(ruta, 'utf8'))
} catch (error) {
  console.error(`contenido/sugerencias.json no es un JSON válido: ${error.message}`)
  process.exit(1)
}

const { notas, retiradas, errores } = validarSugerencias(datos)
if (errores.length > 0) {
  console.error(`Hay ${errores.length} problema(s):`)
  for (const error of errores) console.error(`- ${error}`)
  process.exit(1)
}

const porFecha = {}
for (const nota of notas) porFecha[nota.fecha] = (porFecha[nota.fecha] ?? 0) + 1
console.log(`OK: ${notas.length} sugerencias válidas${retiradas.length ? ` y ${retiradas.length} retirada(s)` : ''}.`)
for (const [fecha, cantidad] of Object.entries(porFecha).sort().reverse()) console.log(`  ${fecha}: ${cantidad}`)
