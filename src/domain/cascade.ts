import parser from 'postcss-selector-parser'
import { selectorSpecificity } from '@csstools/selector-specificity'

export interface CascadeRule {
  selector: string
  value: string
  important: boolean
  layer: number | null
  order: number
  specificity: { a: number; b: number; c: number }
}
export function specificity(selector: string) {
  return (
    parser()
      .astSync(selector)
      .nodes.map((node) => selectorSpecificity(node))
      .sort((a, b) => b.a - a.a || b.b - a.b || b.c - a.c)[0] ?? { a: 0, b: 0, c: 0 }
  )
}
export function compareCascade(a: CascadeRule, b: CascadeRule): number {
  if (a.important !== b.important) return Number(a.important) - Number(b.important)
  const layer = (rule: CascadeRule) =>
    rule.important
      ? rule.layer === null
        ? -1
        : 10000 - rule.layer
      : rule.layer === null
        ? 10000
        : rule.layer
  return (
    layer(a) - layer(b) ||
    a.specificity.a - b.specificity.a ||
    a.specificity.b - b.specificity.b ||
    a.specificity.c - b.specificity.c ||
    a.order - b.order
  )
}
export function cascadeReason(a: CascadeRule, b: CascadeRule): string {
  if (a.important !== b.important) return 'La declaración !important tiene prioridad.'
  if (a.layer !== b.layer)
    return a.important
      ? 'Con !important se invierte el orden de las capas.'
      : 'Las declaraciones normales sin capa ganan a las capas; entre capas gana la última.'
  if (
    a.specificity.a !== b.specificity.a ||
    a.specificity.b !== b.specificity.b ||
    a.specificity.c !== b.specificity.c
  )
    return 'Gana la mayor especificidad: se comparan IDs, clases y tipos, en ese orden.'
  return 'A igualdad de prioridad y especificidad, gana la última declaración.'
}
