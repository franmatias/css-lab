import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { theoryVisual } from './theoryVisuals'

it('links focused diagrams to relevant lessons and ships valid, labelled SVG documents', () => {
  expect(theoryVisual('m17')?.interactive).toBe('box')
  expect(theoryVisual('m16')?.interactive).toBe('responsive')
  expect(theoryVisual('m23')?.interactive).toBe('motion')
  expect(theoryVisual('m39')?.diagram).toBe('box-model')
  expect(theoryVisual('m35')).toBeUndefined()
  expect(theoryVisual('m999')).toBeUndefined()
  const names = new Set(['responsive'])
  for (let index = 0; index < 100; index++) {
    const visual = theoryVisual('m' + index)
    if (visual) {
      expect(visual.points.length).toBeGreaterThanOrEqual(3)
      names.add(visual.diagram)
    }
  }
  for (const name of names) {
    const svg = readFileSync(
      resolve(process.cwd(), `public/illustrations/theory/${name}.svg`),
      'utf8',
    )
    const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml')
    expect(parsed.querySelector('parsererror'), name).toBeNull()
    expect(parsed.querySelector('title')?.textContent, name).toBeTruthy()
    expect(parsed.querySelector('desc')?.textContent, name).toBeTruthy()
    expect(parsed.querySelector('script, foreignObject'), name).toBeNull()
  }
})
