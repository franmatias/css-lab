import { expect, it } from 'vitest'
import {
  buildPlayground,
  initialPlaygroundValues,
  lessonPlaygrounds,
  normalizePlaygroundValues,
  playgroundDefinitions,
  type PlaygroundKind,
} from './propertyPlaygrounds'
import { formatCode } from '@/features/lab/model/formatCode'

it('bounds numeric controls, keeps discrete steps and rejects CSS injected through choices or colors', () => {
  expect(normalizePlaygroundValues('grid', { columns: 99, gap: -2, span: 2.7 }).columns).toBe(4)
  expect(normalizePlaygroundValues('grid', { columns: 99, gap: -2, span: 2.7 }).span).toBe(3)
  const values = normalizePlaygroundValues('gradient', {
    first: 'red; background:url(x)',
    type: 'invalid',
    angle: NaN,
    stop: Infinity,
  })
  expect(values).toMatchObject({ first: '#4338ca', type: 'linear', angle: 90, stop: 15 })
  const first = initialPlaygroundValues('gradient')
  first.angle = 180
  expect(initialPlaygroundValues('gradient').angle).toBe(90)
})

it('all generated scenes and CSS can be formatted and remain within laboratory limits', async () => {
  for (const kind of Object.keys(playgroundDefinitions) as PlaygroundKind[]) {
    const result = buildPlayground(kind, initialPlaygroundValues(kind))
    expect(result.html.length).toBeLessThan(12_000)
    expect((result.baseCss + result.previewCss).length).toBeLessThan(12_000)
    expect(result.css).not.toMatch(/NaN|undefined/)
    expect(await formatCode(result.css, 'css', { useTabs: true, tabWidth: 2 })).toContain('{')
    expect(await formatCode(result.html, 'html', { useTabs: true, tabWidth: 2 })).toContain(
      'muestra',
    )
    expect(
      new DOMParser().parseFromString(result.html, 'text/html').querySelector('.muestra'),
    ).not.toBeNull()
  }
})

it('explains clamp and every unit using the correct reference', () => {
  expect(buildPlayground('functions', { viewport: 768 }).observation).toContain('30.72px')
  expect(buildPlayground('functions', { viewport: 320 }).observation).toContain('resultado 24px')
  for (const [unit, expected] of [
    ['px', 2],
    ['rem', 40],
    ['em', 48],
    ['%', 6.4],
    ['vw', 12],
    ['vh', 10.4],
  ])
    expect(
      buildPlayground('units', {
        amount: 2,
        unit,
        root: 20,
        parentFont: 24,
        parentWidth: 320,
        viewport: 600,
      }).observation,
    ).toContain(`= ${expected}px`)
})

it('caps spans, distinguishes position references and embeds only the owned background drawing', () => {
  expect(buildPlayground('grid', { columns: 1, span: 4 }).css).toContain('grid-column: span 1')
  expect(buildPlayground('position', { position: 'static' }).observation).toContain('los ignora')
  expect(buildPlayground('position', { position: 'fixed' }).observation).toContain(
    'viewport del ejemplo',
  )
  const background = buildPlayground('background', {})
  expect(background.css).toContain('url("paisaje.svg")')
  expect(background.previewCss).toContain('url("data:image/svg+xml,')
  expect(background.previewCss).not.toContain('https:')
})

it('does not autoplay and maps lessons to purposeful experiment types', () => {
  expect(buildPlayground('animation', {}).css).toContain('animation-play-state: paused')
  expect(buildPlayground('animation', {}, true).css).toContain('animation-play-state: running')
  expect(buildPlayground('animation', { delay: -1 }).observation).toContain('1s ya transcurridos')
  expect(lessonPlaygrounds('m18')).toEqual(['typography', 'gradient', 'background'])
  expect(lessonPlaygrounds('m19')).toEqual(['position'])
  expect(lessonPlaygrounds('m35')).toEqual(['functions', 'units'])
  expect(lessonPlaygrounds('m999')).toEqual([])
})
