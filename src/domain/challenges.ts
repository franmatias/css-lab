import parser from 'postcss-selector-parser'
import type { Challenge } from '../../packages/content/src'

export interface Verdict {
  correct: boolean
  extra: number
  missing: number
  message: string
}

// State classes belong to trusted exercise data; they never execute student code.
export function resolveSelector(selector: string): { selector: string; pseudo: string } {
  let pseudo = ''
  const ast = parser().astSync(selector)
  ast.walkPseudos((node) => {
    if (node.value.startsWith('::')) {
      pseudo = node.value
      node.remove()
    } else if (
      [':hover', ':active', ':focus', ':focus-visible', ':focus-within'].includes(node.value)
    ) {
      node.replaceWith(parser.className({ value: `sim-${node.value.slice(1)}` }))
    }
  })
  return { selector: ast.toString() || '*', pseudo }
}

function evaluateSelectorAnswer(challenge: Challenge, answer: string, document: Document): Verdict {
  const fail = (message: string): Verdict => ({ correct: false, extra: 0, missing: 0, message })
  if (!answer.trim()) return fail('Escribe una respuesta antes de comprobar.')
  if (answer.length > 160) return fail('El selector supera el límite de 160 caracteres.')
  if (challenge.type === 'specificity' || challenge.type === 'multiple-choice') {
    const correct = answer === challenge.solution
    return {
      correct,
      extra: 0,
      missing: 0,
      message: correct
        ? challenge.explanation
        : 'Revisa la prioridad de las reglas y vuelve a probar. Puedes abrir una pista.',
    }
  }
  try {
    const expected = resolveSelector(challenge.solution)
    const actual = resolveSelector(answer)
    if (expected.pseudo !== actual.pseudo)
      return fail(
        `Selecciona también la parte correcta del elemento: ${expected.pseudo || 'el elemento de origen'}.`,
      )
    const target = new Set(document.querySelectorAll(expected.selector))
    const selected = new Set(document.querySelectorAll(actual.selector))
    const extra = [...selected].filter((node) => !target.has(node)).length
    const missing = [...target].filter((node) => !selected.has(node)).length
    const correct = extra === 0 && missing === 0
    return {
      correct,
      extra,
      missing,
      message: correct
        ? `¡Eso es! ${challenge.explanation}${challenge.type === 'shortest' ? ` Tu solución tiene ${answer.length} caracteres; la referencia, ${challenge.solution.length}.` : ''}`
        : `Casi: sobran ${extra} elementos y faltan ${missing}. Revisa la relación entre los nodos.`,
    }
  } catch {
    return fail(
      'La sintaxis no es válida. Comprueba que hayas cerrado corchetes y paréntesis, y que no quede un combinador sin elemento.',
    )
  }
}

export type ChallengeEvaluator = (
  challenge: Challenge,
  answer: string,
  document: Document,
) => Verdict

const evaluateStyle: ChallengeEvaluator = (challenge, answer, fixture) => {
  const fail = (message: string): Verdict => ({ correct: false, extra: 0, missing: 0, message })
  if (!challenge.styleTarget || answer.length > 12_000 || !answer.trim())
    return fail('Escribe una regla CSS con selector, llaves, propiedad y valor.')
  // Only ordinary style rules are accepted here. No imports, URLs or animations.
  if (/@|url\s*\(|animation|transition/i.test(answer))
    return fail('En este reto usa reglas simples, sin recursos externos, animaciones ni reglas @.')
  const host = globalThis.document.createElement('div')
  host.style.cssText =
    'position:fixed;left:-10000px;top:0;contain:strict;width:300px;height:200px;visibility:hidden'
  try {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(answer)
    if (!sheet.cssRules.length)
      return fail('No se reconoce una regla CSS válida. Revisa las llaves y los dos puntos.')
    const shadow = host.attachShadow({ mode: 'closed' })
    shadow.adoptedStyleSheets = [sheet]
    const fragment = globalThis.document.importNode(fixture.body, true)
    shadow.append(fragment)
    globalThis.document.body.append(host)
    const targets = Array.from(shadow.querySelectorAll(challenge.styleTarget.selector))
    const target = challenge.styleTarget
    const wrong = targets.filter(
      (node) => getComputedStyle(node).getPropertyValue(target.property).trim() !== target.value,
    )
    const correct = targets.length > 0 && wrong.length === 0
    return {
      correct,
      extra: 0,
      missing: wrong.length,
      message: correct
        ? `¡Eso es! ${challenge.explanation}`
        : `El color de ${wrong.length} elementos todavía no coincide con ${target.value}. Comprueba el selector y la declaración.`,
    }
  } catch {
    return fail('Revisa la sintaxis de la regla CSS y vuelve a probar.')
  } finally {
    host.remove()
  }
}

const evaluators = new Map<Challenge['type'], ChallengeEvaluator>([
  ['select-target', evaluateSelectorAnswer],
  ['fill', evaluateSelectorAnswer],
  ['fix', evaluateSelectorAnswer],
  ['shortest', evaluateSelectorAnswer],
  ['specificity', evaluateSelectorAnswer],
  ['multiple-choice', evaluateSelectorAnswer],
  ['apply-style', evaluateStyle],
])

export function registerEvaluator(type: Challenge['type'], evaluator: ChallengeEvaluator): void {
  evaluators.set(type, evaluator)
}
export function evaluateChallenge(
  challenge: Challenge,
  answer: string,
  document: Document,
): Verdict {
  const evaluator = evaluators.get(challenge.type)
  return evaluator
    ? evaluator(challenge, answer, document)
    : { correct: false, extra: 0, missing: 0, message: 'Este tipo de reto aún no tiene evaluador.' }
}

export function challengeScore(level: number, hints: number): number {
  return Math.max(10, level * 50 - hints * 10 + (hints === 0 ? 20 : 0))
}

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function dayDistance(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000)
}

export function dailyIndex(date: string, count: number): number {
  return [...date].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 0) % count
}
