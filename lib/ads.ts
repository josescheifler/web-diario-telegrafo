// Ubicaciones de publicidad disponibles en el sitio.
// Se guardan en el campo `location` del modelo Advertisement.

export const AD_LOCATIONS = [
  {
    value: 'CABECERA',
    label: 'Banner superior',
    hint: 'Arriba del contenido en portada, secciones y notas. Recomendado: 970 × 250 o 728 × 90 px.',
  },
  {
    value: 'LATERAL',
    label: 'Lateral de portada',
    hint: 'Columna derecha de la portada. Recomendado: 300 × 250 o 300 × 600 px.',
  },
  {
    value: 'NOTA',
    label: 'Dentro de la nota',
    hint: 'Al final del cuerpo de cada noticia. Recomendado: 728 × 90 px.',
  },
] as const

export type AdLocation = (typeof AD_LOCATIONS)[number]['value']

export function isAdLocation(value: unknown): value is AdLocation {
  return AD_LOCATIONS.some((l) => l.value === value)
}

export function adLocationLabel(value: string): string {
  return AD_LOCATIONS.find((l) => l.value === value)?.label ?? value
}

/** Los anuncios con scripts o iframes se muestran aislados en un iframe. */
export function isEmbedAd(adCode: string): boolean {
  return /<\s*(script|iframe)\b/i.test(adCode)
}
