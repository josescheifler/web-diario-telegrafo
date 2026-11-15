import sanitizeHtml from 'sanitize-html'

/** Escapa texto para insertarlo dentro de HTML o de un atributo. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Acepta solo URLs absolutas http(s). Devuelve la URL normalizada o null. */
export function parseHttpUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

const linkTransform = sanitizeHtml.simpleTransform('a', {
  target: '_blank',
  rel: 'noopener noreferrer',
})

/**
 * Limpia el cuerpo de una nota: deja solo el formato que produce el editor
 * (negrita, cursiva, títulos, listas, citas, enlaces) y elimina scripts,
 * iframes, atributos on* y cualquier otro HTML peligroso.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre',
      'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a',
    ],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: { a: linkTransform },
  })
}

/**
 * Limpia un anuncio que se muestra directamente en la página (imagen con
 * enlace o HTML simple). Los anuncios con <script> o <iframe> no pasan por
 * acá: se muestran aislados dentro de un iframe (ver components/AdSlot.tsx).
 */
export function sanitizeAdHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['a', 'img', 'div', 'span', 'p', 'br', 'strong', 'b', 'em', 'i'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer sponsored',
      }),
    },
  })
}
