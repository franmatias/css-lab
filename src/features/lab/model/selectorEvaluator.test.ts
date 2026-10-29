import { beforeEach, describe, expect, it } from 'vitest'
import { evaluateSelector, createPreviewDocument } from './selectorEvaluator'
import type { LabDraft } from '@/infrastructure/storage/appStorage'

const draft: LabDraft = {
  html: '<p class="note">Uno</p><section><p class="note">Dos</p></section><script>window.pwned = true</script><img src=x onerror="alert(1)">',
  css: '.note { color: red; }',
  selector: 'section > .note',
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('evaluateSelector', () => {
  it('sanitizes HTML and maps matching nodes to their positions', () => {
    const result = evaluateSelector(draft)

    expect(result.error).toBeNull()
    expect(result.matchedElementIds).toEqual([5])
    expect(result.specificity).toEqual({ a: 0, b: 1, c: 1 })
    expect(result.sanitizedHtml).not.toContain('<script')
    expect(result.sanitizedHtml).not.toContain('onerror')
  })

  it('calculates maximum specificity for selector lists and modern pseudo-classes', () => {
    const result = evaluateSelector({ ...draft, selector: ':where(main) :is(.note, #featured)' })

    expect(result.specificity).toEqual({ a: 1, b: 0, c: 0 })
  })

  it('rejects invalid selectors with a friendly result', () => {
    expect(evaluateSelector({ ...draft, selector: 'main >' }).error).toBe('invalid-selector')
  })

  it('enforces input and node limits before evaluation', () => {
    expect(evaluateSelector({ ...draft, html: 'x'.repeat(12_001) }).error).toBe('html-too-long')
    expect(
      evaluateSelector({
        ...draft,
        html: `<div>${'<span></span>'.repeat(121)}</div>`,
      }).error,
    ).toBe('too-many-elements')
  })

  it('escapes style-tag terminators and marks only matching nodes in the preview', () => {
    const evaluation = evaluateSelector(draft)
    const preview = createPreviewDocument(evaluation, 'p { content: "</style><script>"; }')

    expect(preview).not.toContain('</style><script>')
    expect(preview.match(/data-csslab-match/g)).toHaveLength(2)
    expect(preview).toContain('default-src')
  })
})
