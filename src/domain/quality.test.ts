// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { challenges } from '../../packages/content/src'
import { workshops } from '../../packages/content/src/design'
import { studioMissions } from '../../packages/content/src/studioGames'
import { checkWorkshop } from './designWorkshop'
import { completedWorkshopSteps, workshopSteps } from './workshopJourney'
import { checkStudioGame } from './studioGame'
import { badgeFamily, badgeProgress } from './badges'
import { learningSchema } from './progress'
import { cascadeReason, compareCascade, specificity, type CascadeRule } from './cascade'
import { evaluateChallenge } from './challenges'

afterEach(() => vi.restoreAllMocks())

describe('workshop declaration grading', () => {
  const workshop = {
    checks: [{ selector: '.card > p', property: 'color', value: 'red' }],
    correct: 1,
  }
  it('normalizes spacing, respects priority and checks the quiz independently', () => {
    expect(
      checkWorkshop(workshop, '.card>p { color: red !important } .card>p {color:blue}', '1'),
    ).toEqual({ declarations: [true], quiz: true })
    expect(checkWorkshop(workshop, '.card>p {color:red} .card>p {color:blue}', '0')).toEqual({
      declarations: [false],
      quiz: false,
    })
    expect(
      checkWorkshop(workshop, '.card>p {color:blue!important} .card>p {color:red!important}', '1')
        .declarations,
    ).toEqual([true])
    expect(checkWorkshop(workshop, '.other {color:red}', '1').declarations).toEqual([false])
    expect(checkWorkshop(workshop, ' '.repeat(20_001), '1').quiz).toBe(false)
  })
  it('requires the requested media context and a valid expected declaration', () => {
    const responsive = {
      ...workshop,
      checks: [{ ...workshop.checks[0]!, media: '(max-width: 600px)' }],
    }
    expect(checkWorkshop(responsive, '.card>p {color:red}', '1').declarations).toEqual([false])
    expect(
      checkWorkshop(responsive, '@media (max-width:600px) {.card>p{color:red}}', '1').declarations,
    ).toEqual([true])
    expect(
      checkWorkshop(
        { ...workshop, checks: [{ selector: '.card', property: 'color', value: '' }] },
        '',
        '1',
      ).declarations,
    ).toEqual([false])
  })
  it('accepts supported CSSOM workshop and CSS game references (all references also run in browser E2E)', () => {
    for (const item of workshops.filter((item) =>
      ['listas', 'tablas', 'formularios', 'flexbox', 'grid'].includes(item.id),
    )) {
      expect(
        checkWorkshop(item, item.solution, String(item.correct)).declarations,
        item.id,
      ).not.toContain(false)
    }
    for (const mission of studioMissions.filter((item) =>
      ['flexbox', 'grid'].includes(item.mode),
    )) {
      expect(checkStudioGame(mission, '').correct).toBe(false)
      expect(checkStudioGame(mission, mission.solution).correct, mission.id).toBe(true)
      expect(checkStudioGame(mission, '.wrong {color:red}').correct, mission.id).toBe(false)
    }
  })
})

it('restores only known workshop steps and migrates a completed legacy workshop', () => {
  const workshop = workshops[0]!
  const steps = workshopSteps(workshop)
  expect(steps).toHaveLength(workshop.checks.length + 3)
  expect(new Set(steps.map((step) => step.id)).size).toBe(steps.length)
  expect(completedWorkshopSteps(workshop)).toEqual([])
  expect(completedWorkshopSteps(workshop, { steps: ['unknown', 'brief', 'brief'] })).toEqual([
    'brief',
  ])
  expect(completedWorkshopSteps(workshop, { completedAt: '2026-11-02' })).toEqual(
    steps.map((step) => step.id),
  )
  const responsive = workshops.find((item) => item.checks.some((rule) => rule.media))!
  expect(
    workshopSteps(responsive).some((step) => step.description.includes('dentro de @media')),
  ).toBe(true)
})

it('explains every badge family and prevents empty modules or flags from awarding medals', () => {
  const metrics = [
    'studio-semantica',
    'studio-flexbox',
    'studio-grid',
    'studio-responsive',
    'tableGames',
    'workshops',
    'games',
    'gameClean',
    'gameOwl',
    'module',
    'clean',
    'streak',
    'return',
    'challenges',
    'lessons',
    'unknown',
  ]
  const families = metrics.map(badgeFamily)
  expect(families).toContain('Exploración')
  expect(new Set(families).size).toBe(11)
  const badge = { id: 'test', name: 'Test', description: 'Test', metric: 'module', threshold: 99 }
  const data = learningSchema.parse({})
  expect(badgeProgress(badge, data, challenges)).toEqual({ current: 0, target: 1 })
  expect(
    badgeProgress({ ...badge, metric: 'unknown', threshold: 1 }, data, challenges).current,
  ).toBe(0)
  data.flags.push('unknown')
  expect(
    badgeProgress({ ...badge, metric: 'unknown', threshold: 1 }, data, challenges).current,
  ).toBe(1)
})

it('orders cascade layers, important declarations, specificity and source order', () => {
  const rule: CascadeRule = {
    selector: 'p',
    value: 'red',
    important: false,
    layer: 0,
    order: 0,
    specificity: { a: 0, b: 0, c: 1 },
  }
  const cases: [Partial<CascadeRule>, Partial<CascadeRule>, string][] = [
    [{ important: true }, {}, '!important tiene prioridad'],
    [{ layer: null }, {}, 'normales sin capa'],
    [{ important: true, layer: 0 }, { important: true, layer: 1 }, 'invierte'],
    [{ important: true }, { important: true, layer: null }, 'invierte'],
    [{ specificity: { a: 1, b: 0, c: 0 } }, {}, 'especificidad'],
    [{ specificity: { a: 0, b: 1, c: 0 } }, {}, 'especificidad'],
    [{ specificity: { a: 0, b: 0, c: 2 } }, {}, 'especificidad'],
    [{ order: 2 }, {}, 'última declaración'],
  ]
  for (const [a, b, reason] of cases) {
    expect(compareCascade({ ...rule, ...a }, { ...rule, ...b })).toBeGreaterThan(0)
    expect(cascadeReason({ ...rule, ...a }, { ...rule, ...b })).toContain(reason)
  }
  expect(compareCascade(rule, rule)).toBe(0)
  expect(specificity(':where(#id) p, #id')).toEqual({ a: 1, b: 0, c: 0 })
})

it('handles bounded answers, choice mistakes, shortest feedback and CSS evaluator failures', () => {
  const fixture = new DOMParser().parseFromString('<p class="destacado">Hello</p>', 'text/html')
  const base = challenges.find((item) => item.entryId === 'm1-clase')!
  expect(evaluateChallenge(base, 'p'.repeat(161), fixture).message).toContain('160')
  for (const type of ['specificity', 'multiple-choice'] as const) {
    expect(evaluateChallenge({ ...base, type }, base.solution, fixture).correct).toBe(true)
    expect(evaluateChallenge({ ...base, type }, 'wrong', fixture).correct).toBe(false)
  }
  expect(
    evaluateChallenge({ ...base, type: 'shortest' }, base.solution, fixture).message,
  ).toContain('caracteres')
  const style = {
    ...base,
    type: 'apply-style' as const,
    styleTarget: { selector: 'p', property: 'color', value: 'rgb(255, 0, 0)' },
  }
  for (const answer of ['', '@import "x";', 'p {background:url(x)}', 'p {animation: none}'])
    expect(evaluateChallenge(style, answer, fixture).correct).toBe(false)
  expect(evaluateChallenge(style, '', fixture).message).toContain('Escribe una regla')
  expect(evaluateChallenge(style, '/* empty */', fixture).message).toContain('No se reconoce')
  expect(evaluateChallenge(style, 'p {color:blue}', fixture).correct).toBe(false)
  vi.spyOn(CSSStyleSheet.prototype, 'replaceSync').mockImplementation(() => {
    throw new Error('CSSOM unavailable')
  })
  expect(evaluateChallenge(style, 'p{color:red}', fixture).message).toContain('Revisa la sintaxis')
  expect(document.body.children).toHaveLength(0)
})
