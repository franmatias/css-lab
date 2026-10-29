import { expect, it } from 'vitest'
import { compareCascade, specificity, type CascadeRule } from './cascade'
const rule = (selector: string, changes: Partial<CascadeRule> = {}): CascadeRule => ({
  selector,
  value: 'red',
  important: false,
  layer: null,
  order: 0,
  specificity: specificity(selector),
  ...changes,
})
it('compares importance, layers, specificity and source order in that order', () => {
  expect(compareCascade(rule('#id'), rule('.a', { important: true }))).toBeLessThan(0)
  expect(compareCascade(rule('#id', { layer: 0 }), rule('p', { layer: null }))).toBeLessThan(0)
  expect(
    compareCascade(
      rule('p', { important: true, layer: 0 }),
      rule('#id', { important: true, layer: 1 }),
    ),
  ).toBeGreaterThan(0)
  expect(compareCascade(rule('#id'), rule('.a.b.c'))).toBeGreaterThan(0)
  expect(compareCascade(rule('.a'), rule('.b', { order: 1 }))).toBeLessThan(0)
  expect(specificity(':where(#id)')).toEqual({ a: 0, b: 0, c: 0 })
  expect(specificity(':is(p, #id)')).toEqual({ a: 1, b: 0, c: 0 })
})
