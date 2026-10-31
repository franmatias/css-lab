import type { PropertyExercise } from '../../packages/content/src/properties'
import { sanitizeLabHtml } from '@/features/lab/model/selectorEvaluator'

export interface PropertyCheck {
  label: string
  correct: boolean
  actual: string
  expected: string
}
/** Compare browser-computed styles in scriptless, isolated documents at the same viewport. */
export async function checkProperty(
  exercise: PropertyExercise,
  css: string,
): Promise<PropertyCheck[]> {
  if (css.length > 12_000 || /@import|url\s*\(/i.test(css))
    throw new Error(
      'Usa CSS local de hasta 12 000 caracteres, sin importaciones ni recursos externos.',
    )
  const frames: HTMLIFrameElement[] = []
  async function render(answer: string): Promise<Document> {
    const frame = document.createElement('iframe')
    frames.push(frame)
    frame.setAttribute('sandbox', 'allow-same-origin')
    frame.setAttribute('aria-hidden', 'true')
    frame.tabIndex = -1
    frame.style.cssText =
      'position:fixed;left:-10000px;top:0;width:768px;height:600px;visibility:hidden;pointer-events:none;border:0'
    const loaded = new Promise<Document>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new Error('No se ha podido comprobar. Vuelve a intentarlo.')),
        4000,
      )
      frame.onload = () => {
        window.clearTimeout(timeout)
        if (frame.contentDocument) resolve(frame.contentDocument)
        else reject(new Error('No se ha podido leer el resultado.'))
      }
    })
    const safeCss = (
      exercise.baseCss +
      '\n' +
      answer +
      '\n* { animation-play-state: paused !important; }'
    ).replace(/</g, '\\3C ')
    frame.srcdoc = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'"><style>${safeCss}</style></head><body>${sanitizeLabHtml(exercise.html)}</body></html>`
    document.body.append(frame)
    return loaded
  }
  try {
    const [actual, reference] = await Promise.all([render(css), render(exercise.solution)])
    const results = exercise.checks.map((check) => {
      const elements = Array.from(actual.querySelectorAll(check.selector))
      const expectedElements = Array.from(reference.querySelectorAll(check.selector))
      const values = elements.map((el) =>
        actual.defaultView!.getComputedStyle(el, check.pseudo).getPropertyValue(check.property),
      )
      const expected = expectedElements.map((el) =>
        reference.defaultView!.getComputedStyle(el, check.pseudo).getPropertyValue(check.property),
      )
      return {
        label: check.property,
        correct:
          values.length > 0 &&
          values.length === expected.length &&
          values.every((value, i) => value === expected[i]),
        actual: values.join(' · '),
        expected: expected.join(' · '),
      }
    })
    if (exercise.keyframes) {
      const rules = Array.from(actual.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules))
      const frames = rules.filter(
        (rule): rule is CSSKeyframesRule =>
          rule.type === CSSRule.KEYFRAMES_RULE &&
          (rule as CSSKeyframesRule).name === exercise.keyframes,
      )
      const last = frames.at(-1)
      for (const [offset, value] of [
        ['0%', '0'],
        ['100%', '1'],
      ]) {
        const frame = last
          ? Array.from(last.cssRules)
              .map((rule) => rule as CSSKeyframeRule)
              .filter((rule) =>
                rule.keyText
                  .split(',')
                  .map((s) => s.trim())
                  .includes(offset!),
              )
              .at(-1)
          : undefined
        const actualValue = frame?.style.getPropertyValue('opacity') ?? ''
        results.push({
          label: `@keyframes ${exercise.keyframes} ${offset}`,
          correct: actualValue === value,
          actual: actualValue,
          expected: value!,
        })
      }
    }
    return results
  } finally {
    frames.forEach((frame) => frame.remove())
  }
}
