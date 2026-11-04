import parser from 'postcss-selector-parser'
import { selectorSpecificity } from '@csstools/selector-specificity'

export interface CascadeRule {
  selector: string
  value: string
  important: boolean
  layer: number | null
  order: number
  specificity: { a: number; b: number; c: number }
  origin?: 'ua' | 'user' | 'author' | 'animation' | 'transition'
  inline?: boolean
  inherited?: boolean
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
  if (Boolean(a.inherited) !== Boolean(b.inherited)) return a.inherited ? -1 : 1
  const priority = (rule: CascadeRule) => {
    const origin = rule.origin ?? 'author'
    if (origin === 'transition') return 100
    if (rule.important)
      return { ua: 90, user: 80, author: 70, animation: 60, transition: 100 }[origin]
    return { ua: 10, user: 20, author: 40, animation: 50, transition: 100 }[origin]
  }
  if (priority(a) !== priority(b)) return priority(a) - priority(b)
  if (Boolean(a.inline) !== Boolean(b.inline)) return a.inline ? 1 : -1
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
  if (Boolean(a.inherited) !== Boolean(b.inherited))
    return 'Una declaración aplicada directamente gana a un valor heredado, incluso con menor especificidad.'
  if ((a.origin ?? 'author') === 'transition' || (b.origin ?? 'author') === 'transition')
    return 'Una transición activa tiene prioridad temporal sobre las demás declaraciones.'
  if (a.important !== b.important) return 'La declaración !important tiene prioridad.'
  if ((a.origin ?? 'author') !== (b.origin ?? 'author'))
    return 'La importancia y el origen se comparan antes que las capas y la especificidad.'
  if (Boolean(a.inline) !== Boolean(b.inline))
    return 'El estilo en línea gana dentro del mismo origen e importancia.'
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
