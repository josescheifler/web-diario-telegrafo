// El nombre del diario, escrito en código Morse. Se usa como filete bajo la
// cabecera y, con la señal "fin de mensaje", como cierre de cada nota.

const CODIGO: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',
  J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
}

/** "fin de mensaje" (AR): la señal con la que un telegrafista cierra una transmisión */
export const FIN_DE_MENSAJE = '.-.-.'

type Props = {
  /** Texto a codificar (solo letras y espacios) */
  texto?: string
  /** O directamente una secuencia de puntos y rayas */
  senal?: string
  /** Alto del trazo en píxeles */
  alto?: number
  /** Estira la señal para que ocupe todo el ancho disponible */
  anchoCompleto?: boolean
  className?: string
}

export default function Morse({ texto, senal, alto = 4, anchoCompleto = false, className = '' }: Props) {
  const palabras = senal
    ? [[senal]]
    : (texto ?? '')
        .toUpperCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .split(/\s+/)
        .map((palabra) => [...palabra].map((letra) => CODIGO[letra]).filter(Boolean))

  // Proporciones del Morse: raya = 3 puntos, 1 entre señales, 3 entre letras, 7 entre palabras
  const u = alto
  const formas: { x: number; ancho: number }[] = []
  let x = 0
  palabras.forEach((letras, p) => {
    if (p > 0) x += u * 7
    letras.forEach((codigo, l) => {
      if (l > 0) x += u * 3
      ;[...codigo].forEach((signo, s) => {
        if (s > 0) x += u
        const ancho = signo === '-' ? u * 3 : u
        formas.push({ x, ancho })
        x += ancho
      })
    })
  })

  return (
    <svg
      aria-hidden="true"
      width={anchoCompleto ? undefined : x}
      height={anchoCompleto ? undefined : u}
      viewBox={`0 0 ${x} ${u}`}
      className={`shrink-0 fill-current ${anchoCompleto ? 'h-auto w-full' : ''} ${className}`}
    >
      {formas.map((f, i) => (
        <rect key={i} x={f.x} y={0} width={f.ancho} height={u} rx={u / 2} />
      ))}
    </svg>
  )
}
