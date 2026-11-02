import { afterEach, expect, it, vi } from 'vitest'
import { Window } from 'happy-dom'
import { checkProperty } from './propertyExercise'
import type { PropertyExercise } from '../../packages/content/src/properties'

const exercise: PropertyExercise = {
  id: 'test',
  title: 'Test',
  category: 'Color',
  description: 'Change color',
  theory: 'm1',
  html: '<p class="sample">Example</p>',
  baseCss: '.sample {color:blue}',
  starter: '',
  solution: '.sample {color:red}',
  hint: 'Use color',
  checks: [{ selector: '.sample', property: 'color' }],
}
const windows: Window[] = []
afterEach(async () => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.replaceChildren()
  await Promise.all(windows.splice(0).map((window) => window.happyDOM.close()))
})

/** Test the iframe lifecycle against real CSSOM documents; full browser grading is covered in E2E. */
function loadFrames(mode: 'load' | 'unreadable' | 'timeout' | 'partial' = 'load') {
  const seen: HTMLIFrameElement[] = []
  vi.spyOn(document.body, 'append').mockImplementation((...nodes) => {
    for (const node of nodes) {
      if (!(node instanceof HTMLIFrameElement)) continue
      seen.push(node)
      const frameWindow = new Window()
      windows.push(frameWindow)
      frameWindow.document.write(node.srcdoc)
      Object.defineProperty(node, 'contentDocument', {
        configurable: true,
        value: mode === 'unreadable' || mode === 'partial' ? null : frameWindow.document,
      })
      if (mode !== 'timeout' && (mode !== 'partial' || seen.length === 1))
        queueMicrotask(() => node.onload?.(new Event('load')))
    }
  })
  return seen
}

it('compares all targets, rejects overrides and removes isolated frames after grading', async () => {
  const frames = loadFrames()
  expect((await checkProperty(exercise, exercise.solution))[0]?.correct).toBe(true)
  expect(
    (await checkProperty(exercise, '.sample {color:red} .sample {color:green}'))[0]?.correct,
  ).toBe(false)
  expect(
    (
      await checkProperty(
        { ...exercise, checks: [{ selector: '.absent', property: 'color' }] },
        exercise.solution,
      )
    )[0]?.correct,
  ).toBe(false)
  expect(document.querySelectorAll('iframe')).toHaveLength(0)
  for (const frame of frames) {
    expect(frame.getAttribute('sandbox')).toBe('allow-same-origin')
    expect(frame.srcdoc).toContain("default-src 'none'")
    expect(frame.tabIndex).toBe(-1)
    expect(frame.isConnected).toBe(false)
  }
})

it('checks the latest named keyframes and both opacity endpoints', async () => {
  loadFrames()
  const animated = { ...exercise, keyframes: 'entry' }
  const valid = '.sample{color:red} @keyframes entry {0% {opacity:0} 100% {opacity:1}}'
  expect((await checkProperty(animated, valid)).map((result) => result.correct)).toEqual([
    true,
    true,
    true,
  ])
  expect(
    (await checkProperty(animated, exercise.solution)).map((result) => result.correct),
  ).toEqual([true, false, false])
  const overridden = valid + ' @keyframes entry {0% {opacity:1} 100% {opacity:0}}'
  expect((await checkProperty(animated, overridden)).map((result) => result.correct)).toEqual([
    true,
    false,
    false,
  ])
})

it('rejects external resources and oversize input before creating any frames', async () => {
  for (const css of ['x'.repeat(12_001), '@import "x.css";', 'p {background: URL (x)}'])
    await expect(checkProperty(exercise, css)).rejects.toThrow('CSS local')
  expect(document.querySelectorAll('iframe')).toHaveLength(0)
})

it('cleans up when an iframe cannot be read', async () => {
  loadFrames('unreadable')
  await expect(checkProperty(exercise, exercise.solution)).rejects.toThrow('leer el resultado')
  expect(document.querySelectorAll('iframe')).toHaveLength(0)
})

it('cancels the other iframe timer when one document fails early', async () => {
  vi.useFakeTimers()
  const frames = loadFrames('partial')
  await expect(checkProperty(exercise, exercise.solution)).rejects.toThrow('leer el resultado')
  expect(vi.getTimerCount()).toBe(0)
  expect(frames.every((frame) => frame.onload === null)).toBe(true)
})

it('times out without leaving hidden frames behind', async () => {
  vi.useFakeTimers()
  loadFrames('timeout')
  const pending = expect(checkProperty(exercise, '')).rejects.toThrow('Vuelve a intentarlo')
  await vi.advanceTimersByTimeAsync(4000)
  await pending
  expect(document.querySelectorAll('iframe')).toHaveLength(0)
})
