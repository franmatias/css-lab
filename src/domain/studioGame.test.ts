import { expect, it } from 'vitest'
import { studioMissions, studioModes } from '../../packages/content/src/studioGames'
import { checkStudioGame } from './studioGame'
import { badgeDefinitions } from '../../packages/content/src'
import { badgeProgress } from './badges'
import { learningSchema } from './progress'
import { badgeArtwork, badgeDestination, medalArt } from '@/features/badges/badgeArt'
it('ships six distinct missions per mode and semantic references select exact sets', () => {
  expect(studioMissions).toHaveLength(24)
  expect(new Set(studioMissions.map((m) => m.id)).size).toBe(24)
  for (const mode of studioModes)
    expect(studioMissions.filter((m) => m.mode === mode)).toHaveLength(6)
  for (const mission of studioMissions.filter((m) => m.mode === 'semantica')) {
    expect(checkStudioGame(mission, mission.solution).correct).toBe(true)
    expect(checkStudioGame(mission, '*').correct).toBe(false)
    expect(checkStudioGame(mission, '').missing).toBeGreaterThan(0)
  }
})
it('gives every badge its own emblem, a valid distinction and a working destination', () => {
  expect(badgeDefinitions).toHaveLength(50)
  expect(Object.keys(badgeArtwork).sort()).toEqual(badgeDefinitions.map((b) => b.id).sort())
  expect(new Set(Object.values(badgeArtwork).map((a) => a.icon)).size).toBe(50)
  for (const badge of badgeDefinitions) {
    expect([1, 2, 3, 4]).toContain(medalArt(badge).tier)
    expect(badgeDestination(badge)).toMatch(/^\//)
  }
})
it('caps a first-mission medal at its target after completing the whole journey', () => {
  const data = learningSchema.parse({})
  for (const mission of studioMissions.filter((m) => m.mode === 'grid'))
    data.games[mission.id] = { attempts: 1, hintsUsed: 0, status: 'completed', bestScore: 100 }
  const first = badgeDefinitions.find((b) => b.id === 'grid-inicio')!
  expect(badgeProgress(first, data, [])).toEqual({ current: 1, target: 1 })
})
