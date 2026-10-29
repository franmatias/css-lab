import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { challenges } from '../../../packages/content/src'
import { useLearningStore } from './learningStore'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 9, 29, 12))
})
afterEach(() => {
  vi.useRealTimers()
})

it('awards completion only once and counts daily activity and unlocks the next challenge', () => {
  const store = useLearningStore()
  const challenge = challenges[0]!
  expect(store.available(challenges[1]!)).toBe(false)
  store.attempt(challenge, true)
  expect(store.data.xp).toBe(80)
  expect(store.data.streak.current).toBe(1)
  expect(store.available(challenges[1]!)).toBe(true)
  expect(store.data.badges['primer-selector']).toBeDefined()
  store.attempt(challenge, true)
  expect(store.data.xp).toBe(80)
  store.completeLesson('m0')
  store.completeLesson('m0')
  expect(store.data.xp).toBe(120)
})
it('tracks hints and failures, allows skipping after three attempts and awards no skip XP', () => {
  const store = useLearningStore()
  const challenge = challenges[0]!
  store.hint(challenge.id)
  store.hint(challenge.id)
  for (let i = 0; i < 3; i++) store.attempt(challenge, false)
  store.skip(challenge.id)
  expect(store.data.xp).toBe(0)
  expect(store.available(challenges[1]!)).toBe(true)
  store.attempt(challenge, true)
  expect(store.data.xp).toBe(40)
  expect(store.data.challenges[challenge.id]?.attempts).toBe(4)
})
it('rejects invalid imports without losing progress and backs up malformed persisted state', () => {
  const store = useLearningStore()
  store.completeLesson('m0')
  const original = JSON.stringify(store.data)
  expect(store.importData('{}')).toBe(false)
  expect(store.importData('{"xp":-1}')).toBe(false)
  expect(JSON.stringify(store.data)).toBe(original)
  store.reset()
  expect(store.importData(original)).toBe(true)
  expect(store.data.xp).toBe(50)
  localStorage.setItem('csslab:v1', '{"theme":"dark","progress":{"xp":-1}}')
  setActivePinia(createPinia())
  const recovered = useLearningStore()
  expect(recovered.data.xp).toBe(0)
  expect(localStorage.getItem('csslab:v1:backup')).toContain('"xp":-1')
})
it('spaces reviews, grants daily practice only once and protects streaks from clock rollback', () => {
  const store = useLearningStore()
  const challenge = challenges[0]!
  store.attempt(challenge, true)
  vi.setSystemTime(new Date(2026, 9, 30, 12))
  store.attempt(challenge, true)
  expect(store.data.challenges[challenge.id]?.reviewBox).toBe(2)
  expect(store.data.challenges[challenge.id]?.nextReviewAt).toBe('2026-11-02')
  expect(store.data.xp).toBe(90)
  expect(store.data.streak.current).toBe(2)
  vi.setSystemTime(new Date(2026, 9, 28, 12))
  store.completeLesson('m0')
  expect(store.data.streak.current).toBe(2)
  expect(store.data.streak.lastActiveDate).toBe('2026-10-30')
})
