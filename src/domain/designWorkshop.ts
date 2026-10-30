import type { Workshop } from '../../packages/content/src/design'

const normalized = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([>,+~():])\s*/g, '$1')

/** Checks the requested declarations, not the whole computed cascade or visual quality. */
export function checkWorkshop(
  workshop: Pick<Workshop, 'checks' | 'correct'>,
  css: string,
  answer: string,
) {
  if (css.length > 20_000) return { declarations: workshop.checks.map(() => false), quiz: false }
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  const declarations = workshop.checks.map((check) => {
    const expected = new CSSStyleSheet()
    expected.replaceSync(`.expected { ${check.property}: ${check.value}; }`)
    const expectedValue = (expected.cssRules[0] as CSSStyleRule)?.style.getPropertyValue(
      check.property,
    )
    if (!expectedValue) return false
    let actual = ''
    let important = false
    function visit(rules: CSSRuleList, media = '') {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSMediaRule && !media) visit(rule.cssRules, rule.conditionText)
        if (!(rule instanceof CSSStyleRule) || normalized(media) !== normalized(check.media ?? ''))
          continue
        if (normalized(rule.selectorText) !== normalized(check.selector)) continue
        const value = rule.style.getPropertyValue(check.property)
        const priority = rule.style.getPropertyPriority(check.property) === 'important'
        if (value && (!important || priority)) {
          actual = value
          important = priority
        }
      }
    }
    visit(sheet.cssRules)
    return normalized(actual) === normalized(expectedValue)
  })
  return { declarations, quiz: answer === String(workshop.correct) }
}
