import type { Section } from '@prisma/client'

// Secciones del diario, en el orden en que aparecen en el menú.
// `slug` es la URL (/seccion/<slug>), `valor` lo que se guarda en la base.
export const SECCIONES: { slug: string; valor: Section; nombre: string }[] = [
  { slug: 'local', valor: 'LOCAL', nombre: 'Local' },
  { slug: 'regional', valor: 'REGIONAL', nombre: 'Entre Ríos' },
  { slug: 'pais', valor: 'PAIS', nombre: 'País' },
  { slug: 'mundo', valor: 'MUNDO', nombre: 'Mundo' },
  { slug: 'politica', valor: 'POLITICA', nombre: 'Política' },
  { slug: 'economia', valor: 'ECONOMIA', nombre: 'Economía' },
  { slug: 'sociedad', valor: 'SOCIEDAD', nombre: 'Sociedad' },
]

export function seccionPorSlug(slug: string) {
  return SECCIONES.find((s) => s.slug === slug.toLowerCase())
}

export function seccionPorValor(valor: string) {
  return SECCIONES.find((s) => s.valor === valor)
}

export function nombreSeccion(valor: string): string {
  return seccionPorValor(valor)?.nombre ?? valor
}

export function urlSeccion(valor: string): string {
  return `/seccion/${seccionPorValor(valor)?.slug ?? valor.toLowerCase()}`
}
