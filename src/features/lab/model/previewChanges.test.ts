import { expect, it } from 'vitest'
import { detectPreviewChanges } from './previewChanges'
import { createPreviewDocument, evaluateSelector } from './selectorEvaluator'

it('identifies content, attributes, additions and removals in inert HTML', () => {
  const old = '<main><p>Antes</p><span>Eliminar</span></main>'
  const evaluation = evaluateSelector({
    html: '<main><p class="nota">Después</p></main>',
    css: '',
    selector: 'p',
  })
  const result = detectPreviewChanges(old, evaluation, '', '')
  expect(result.modified).toBe(1)
  expect(result.removed).toBe(1)
  expect(result.ids).toEqual(evaluation.matchedElementIds)
  expect(detectPreviewChanges('<main></main>', evaluation, '', '').added).toBe(1)
})
it('marks targets of changed CSS rules and keeps visual helpers optional', () => {
  const evaluation = evaluateSelector({
    html: '<p class="nota">Hola</p>',
    css: '',
    selector: '.nota',
  })
  const changes = detectPreviewChanges(
    evaluation.sanitizedHtml,
    evaluation,
    '.nota{color:red}',
    '.nota{color:blue}',
  )
  expect(changes.ids).toEqual(evaluation.matchedElementIds)
  const preview = createPreviewDocument(evaluation, '', { highlight: 'none', animations: false })
  expect(preview).not.toContain('outline: 2px dashed')
  expect(preview).not.toContain('@keyframes')
  const animated = createPreviewDocument(evaluation, '', {
    highlight: 'border',
    animations: true,
    changedIds: changes.ids,
  })
  expect(animated).toContain('data-csslab-changed')
  expect(animated).toContain('csslab-change')
  expect(animated).toContain('prefers-reduced-motion')
  expect(animated).not.toContain('allow-scripts')
})
