import { expect, it } from 'vitest'
import { galaxyHtml, gameLevels, badgeDefinitions, challenges } from '../../packages/content/src'
import { recipes } from '../../packages/content/src/recipes'
import { evaluateVisualGame, visualGameScore } from './visualGame'
import { badgeProgress } from './badges'
import { learningSchema } from './progress'

it('compares exact node sets, accepts equivalent selectors and rejects helper-class shortcuts', () => {
  const level = gameLevels[0]!
  expect(evaluateVisualGame(galaxyHtml, level.solution, '.rocoso').correct).toBe(true)
  expect(evaluateVisualGame(galaxyHtml, level.solution, '#mercurio, #venus, #tierra').correct).toBe(
    true,
  )
  expect(evaluateVisualGame(galaxyHtml, level.solution, '.planeta').extra).toBe(3)
  expect(evaluateVisualGame(galaxyHtml, level.solution, '#mercurio').missing).toBe(2)
  expect(evaluateVisualGame(galaxyHtml, level.solution, '.target').correct).toBe(false)
  expect(evaluateVisualGame(galaxyHtml, level.solution, '*').containers).toBe(3)
  expect(evaluateVisualGame(galaxyHtml, level.solution, ':has(').error).toBe(true)
  expect(evaluateVisualGame(galaxyHtml, level.solution, 'x'.repeat(161)).error).toBe(true)
})
it('ships unique missions, practical recipes and meaningful badge thresholds', () => {
  expect(gameLevels).toHaveLength(12)
  expect(recipes).toHaveLength(12)
  expect(badgeDefinitions).toHaveLength(50)
  for (const items of [gameLevels, recipes, badgeDefinitions])
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
  expect(visualGameScore(1, 0)).toBe(100)
  expect(visualGameScore(1, 3)).toBe(40)
  const data = learningSchema.parse({})
  const firstBadge = badgeDefinitions.find((badge) => badge.id === 'primera-mision')!
  expect(badgeProgress(firstBadge, data, challenges)).toEqual({ current: 0, target: 1 })
  data.games['galaxia-rocosos'] = { attempts: 1, hintsUsed: 0, status: 'completed', bestScore: 100 }
  expect(badgeProgress(firstBadge, data, challenges)).toEqual({ current: 1, target: 1 })
})
