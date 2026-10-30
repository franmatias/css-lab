import { describe, expect, it } from 'vitest'
import { entries, lessons, challenges, badgeDefinitions } from '../../packages/content/src'
import {
  challengeScore,
  dailyIndex,
  dayDistance,
  evaluateChallenge,
  localDate,
  resolveSelector,
} from './challenges'

describe('content integrity', () => {
  it('ships the specified quantities with unique stable IDs and bounded HTML', () => {
    expect(entries).toHaveLength(51)
    expect(lessons).toHaveLength(17)
    expect(challenges).toHaveLength(62)
    expect(badgeDefinitions.length).toBeGreaterThanOrEqual(31)
    for (const collection of [entries, lessons, challenges, badgeDefinitions])
      expect(new Set(collection.map((item) => item.id)).size).toBe(collection.length)
    for (const c of challenges)
      expect(
        new DOMParser().parseFromString(c.html, 'text/html').querySelectorAll('*').length,
      ).toBeLessThanOrEqual(25)
  })
  it('has existing prerequisites and no cycles', () => {
    for (const challenge of challenges) {
      const seen = new Set<string>()
      let current: typeof challenge | undefined = challenge
      while (current) {
        expect(seen.has(current.id)).toBe(false)
        seen.add(current.id)
        if (!current.prerequisite) break
        const next = challenges.find((c) => c.id === current!.prerequisite)
        expect(next).toBeDefined()
        current = next
      }
    }
  })
})

describe('challenge domain', () => {
  const challenge = challenges.find((c) => c.entryId === 'm1-clase')!
  const document = new DOMParser().parseFromString(challenge.html, 'text/html')
  it('compares exact node sets and diagnoses extra and missing elements', () => {
    expect(evaluateChallenge(challenge, '.destacado', document).correct).toBe(true)
    expect(evaluateChallenge(challenge, 'p', document).extra).toBe(1)
    expect(evaluateChallenge(challenge, '#ausente', document).missing).toBe(1)
    expect(evaluateChallenge(challenge, 'p[', document).correct).toBe(false)
    expect(evaluateChallenge(challenge, '', document).correct).toBe(false)
  })
  it('resolves simulated states and requires the correct pseudoelement', () => {
    expect(resolveSelector('button:hover').selector).toBe('button.sim-hover')
    const pseudo = challenges.find((c) => c.entryId === 'm8-before')!
    const doc = new DOMParser().parseFromString(pseudo.html, 'text/html')
    expect(evaluateChallenge(pseudo, 'p', doc).correct).toBe(false)
    expect(evaluateChallenge(pseudo, 'p::before', doc).correct).toBe(true)
    expect(evaluateChallenge(pseudo, 'p::after', doc).correct).toBe(false)
  })
  it('scores hints without punishing failed attempts and uses local calendar dates', () => {
    expect(challengeScore(1, 0)).toBe(70)
    expect(challengeScore(1, 3)).toBe(20)
    expect(localDate(new Date(2026, 9, 29, 0, 1))).toBe('2026-10-29')
    expect(dayDistance('2026-10-28', '2026-10-29')).toBe(1)
    expect(dailyIndex('2026-10-29', 9)).toBe(dailyIndex('2026-10-29', 9))
  })
})
