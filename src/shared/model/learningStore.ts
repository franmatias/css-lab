import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { learningSchema, type LearningData } from '@/domain/progress'
import {
  badgeDefinitions,
  challenges,
  gameLevels,
  type Challenge,
} from '../../../packages/content/src'
import { badgeProgress } from '@/domain/badges'
import { visualGameScore } from '@/domain/visualGame'
import { workshopIds } from '../../../packages/content/src/designProgress'
import { propertyIds } from '../../../packages/content/src/propertyProgress'
import { tableMissions } from '../../../packages/content/src/tableGame'
import { studioMissions, type StudioMode } from '../../../packages/content/src/studioGames'
const allGameLevels = [...gameLevels, ...tableMissions, ...studioMissions]
import { challengeScore, dayDistance, localDate } from '@/domain/challenges'
import {
  readLearningData,
  writeLearningData,
  STORAGE_KEY,
} from '@/infrastructure/storage/appStorage'

function read(): LearningData {
  const raw = readLearningData()
  const parsed = learningSchema.safeParse(raw)
  return parsed.success ? parsed.data : learningSchema.parse({})
}

export const useLearningStore = defineStore('learning', () => {
  const data = ref<LearningData>(read())
  const notice = ref('')
  const saveFailed = ref(false)
  const completed = computed(
    () => Object.values(data.value.challenges).filter((c) => c.status === 'completed').length,
  )
  const gamesCompleted = computed(
    () => gameLevels.filter((game) => data.value.games[game.id]?.status === 'completed').length,
  )
  const tableGamesCompleted = computed(
    () => tableMissions.filter((game) => data.value.games[game.id]?.status === 'completed').length,
  )
  function studioCompleted(mode: StudioMode): number {
    return studioMissions.filter(
      (mission) => mission.mode === mode && data.value.games[mission.id]?.status === 'completed',
    ).length
  }
  function saveStudioDraft(id: string, draft: string): void {
    const mission = studioMissions.find((mission) => mission.id === id)
    if (!mission || draft.length > (mission.mode === 'semantica' ? 160 : 20_000)) return
    gameResult(id)
    data.value.games[id]!.draft = draft
  }
  const workshopsCompleted = computed(
    () => workshopIds.filter((id) => data.value.workshops[id]?.completedAt).length,
  )
  const propertiesCompleted = computed(
    () => propertyIds.filter((id) => data.value.properties[id]?.completedAt).length,
  )
  function saveProperty(id: string, css: string): void {
    if (!propertyIds.some((known) => known === id) || css.length > 12_000) return
    data.value.properties[id] = {
      ...data.value.properties[id],
      attempts: data.value.properties[id]?.attempts ?? 0,
      css,
    }
  }
  function attemptProperty(id: string, correct: boolean): number {
    if (!propertyIds.some((known) => known === id)) return 0
    const result = data.value.properties[id]
    if (!result) return 0
    result.attempts++
    if (!correct || result.completedAt) return 0
    result.completedAt = new Date().toISOString()
    data.value.xp += 60
    markActivity()
    unlockBadges()
    return 60
  }
  function saveWorkshop(id: string, css: string, answer: string): void {
    if (
      !workshopIds.some((known) => known === id) ||
      css.length > 20_000 ||
      !['', '0', '1', '2'].includes(answer)
    )
      return
    data.value.workshops[id] = {
      ...data.value.workshops[id],
      steps: data.value.workshops[id]?.steps ?? [],
      css,
      answer,
    }
  }
  function saveWorkshopSteps(id: string, steps: string[]): void {
    const result = data.value.workshops[id]
    if (!result || !workshopIds.some((known) => known === id)) return
    result.steps = [...new Set(steps)]
      .filter((step) => /^(brief|rule-\d|responsive|quiz)$/.test(step))
      .slice(0, 32)
  }
  function completeWorkshop(id: string): number {
    if (!workshopIds.some((known) => known === id)) return 0
    const result = data.value.workshops[id]
    if (!result || result.completedAt) return 0
    result.completedAt = new Date().toISOString()
    data.value.xp += 100
    markActivity()
    unlockBadges()
    return 100
  }
  const level = computed(() =>
    data.value.xp < 300
      ? 'Aprendiz'
      : data.value.xp < 1000
        ? 'Explorador'
        : data.value.xp < 2500
          ? 'Selector'
          : 'Maestro de la cascada',
  )
  const todayCount = computed(() => data.value.activity[localDate()] ?? 0)
  const mastery = computed(() =>
    Array.from({ length: 9 }, (_, i) => {
      const group = challenges.filter((c) => c.module === i + 1)
      return (
        group.reduce((sum, c) => {
          const result = data.value.challenges[c.id]
          return (
            sum +
            (result?.status === 'completed'
              ? Math.max(0.3, 1 - result.hintsUsed * 0.15 - Math.max(0, result.attempts - 1) * 0.03)
              : 0)
          )
        }, 0) / group.length
      )
    }),
  )
  let applyingRemote = false
  watch(
    data,
    (current) => {
      document.documentElement.dataset.contrast = current.settings.contrast ? 'more' : ''
      document.documentElement.dataset.font = current.settings.readingFont ? 'reading' : ''
      if (!applyingRemote) saveFailed.value = !writeLearningData(current)
    },
    { deep: true, flush: 'sync', immediate: true },
  )
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    applyingRemote = true
    data.value = read()
    applyingRemote = false
  })

  function markActivity(): void {
    const today = localDate()
    const streak = data.value.streak
    if (today > streak.lastActiveDate) {
      const gap = streak.lastActiveDate ? dayDistance(streak.lastActiveDate, today) : 1
      const week = String(Math.floor(Date.parse(`${today}T12:00:00Z`) / (7 * 86_400_000)))
      if (gap > 1) flag('return')
      if (gap === 1 || (gap === 2 && streak.graceWeek !== week)) {
        streak.current += 1
        if (gap === 2) streak.graceWeek = week
      } else streak.current = 1
      streak.best = Math.max(streak.best, streak.current)
      streak.lastActiveDate = today
      data.value.xp += 10
    }
    data.value.activity[today] = (data.value.activity[today] ?? 0) + 1
  }
  function unlockBadges(): void {
    const d = data.value
    for (const badge of badgeDefinitions) {
      const progress = badgeProgress(badge, d, challenges)
      const achieved = progress.current >= progress.target
      if (achieved && !d.badges[badge.id]) {
        d.badges[badge.id] = new Date().toISOString()
        if (d.settings.celebrations) notice.value = `Insignia conseguida: ${badge.name}`
      }
    }
  }
  function flag(name: string): void {
    if (!data.value.flags.includes(name)) data.value.flags.push(name)
  }
  function gameResult(id: string) {
    if (!allGameLevels.some((level) => level.id === id)) throw new Error('Misión desconocida.')
    return (data.value.games[id] ??= {
      attempts: 0,
      hintsUsed: 0,
      status: 'in_progress',
      bestScore: 0,
    })
  }
  function gameHint(id: string): void {
    const result = gameResult(id)
    if (result.status !== 'completed') result.hintsUsed = Math.min(3, result.hintsUsed + 1)
  }
  function playGame(id: string, correct: boolean): number {
    const level = allGameLevels.find((level) => level.id === id)
    if (!level) return 0
    const result = gameResult(id)
    if (result.status === 'completed') return 0
    result.attempts++
    if (!correct) return 0
    const score = visualGameScore(level.level, result.hintsUsed)
    result.status = 'completed'
    result.bestScore = score
    result.completedAt = new Date().toISOString()
    data.value.xp += score
    markActivity()
    if (id === 'galaxia-buho') flag('gameOwl')
    unlockBadges()
    return score
  }
  function explore(name: string): void {
    flag(name)
    unlockBadges()
  }
  function completeLesson(id: string): void {
    if (data.value.lessons[id]) return
    data.value.lessons[id] = new Date().toISOString()
    data.value.xp += 40
    markActivity()
    unlockBadges()
  }
  function resultFor(id: string) {
    return (data.value.challenges[id] ??= {
      attempts: 0,
      hintsUsed: 0,
      status: 'in_progress',
      bestScore: 0,
      reviewBox: 1,
      nextReviewAt: '',
    })
  }
  function attempt(challenge: Challenge, correct: boolean): void {
    const result = resultFor(challenge.id)
    if (result.status === 'completed') {
      // Review never awards the completion XP twice.
      const due = !result.nextReviewAt || result.nextReviewAt <= localDate()
      if (due) {
        result.reviewBox = correct ? Math.min(5, result.reviewBox + 1) : 1
        const next = new Date()
        next.setDate(next.getDate() + [1, 3, 7, 14, 30][result.reviewBox - 1]!)
        result.nextReviewAt = localDate(next)
        if (correct) {
          markActivity()
          unlockBadges()
        }
      }
      return
    }
    result.attempts++
    if (!correct) return
    result.status = 'completed'
    result.completedAt = new Date().toISOString()
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + 1)
    result.reviewBox = 1
    result.nextReviewAt = localDate(nextReview)
    result.bestScore = challengeScore(challenge.level, result.hintsUsed)
    data.value.xp += result.bestScore
    markActivity()
    if (challenge.entryId === 'm7-has') flag('has')
    if (new Date().getHours() < 5) flag('night')
    unlockBadges()
  }
  function hint(id: string): void {
    const r = resultFor(id)
    if (r.status !== 'completed') r.hintsUsed = Math.min(3, r.hintsUsed + 1)
  }
  function skip(id: string): void {
    const r = resultFor(id)
    if (r.attempts >= 3 && r.status !== 'completed') r.status = 'skipped'
  }
  function available(c: Challenge): boolean {
    return (
      !c.prerequisite ||
      ['completed', 'skipped'].includes(data.value.challenges[c.prerequisite]?.status ?? '') ||
      Boolean(data.value.challenges[c.id])
    )
  }
  function favorite(id: string): void {
    const list = data.value.favorites
    data.value.favorites = list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
    unlockBadges()
  }
  function visit(id: string): void {
    if (!data.value.visits.includes(id)) data.value.visits.push(id)
    unlockBadges()
  }
  function importData(raw: string): boolean {
    if (raw.length > 1_000_000) return false
    try {
      const input: unknown = JSON.parse(raw)
      if (
        !input ||
        typeof input !== 'object' ||
        !['xp', 'lessons', 'challenges', 'settings', 'streak'].every((key) => key in input)
      )
        return false
      const parsed = learningSchema.safeParse(input)
      if (!parsed.success) return false
      data.value = parsed.data
      return true
    } catch {
      return false
    }
  }
  function reset(): void {
    data.value = learningSchema.parse({})
    notice.value = 'Tu progreso se ha reiniciado.'
  }
  return {
    data,
    notice,
    saveFailed,
    completed,
    gamesCompleted,
    tableGamesCompleted,
    studioCompleted,
    saveStudioDraft,
    workshopsCompleted,
    propertiesCompleted,
    saveProperty,
    attemptProperty,
    saveWorkshop,
    saveWorkshopSteps,
    completeWorkshop,
    level,
    todayCount,
    mastery,
    completeLesson,
    attempt,
    hint,
    skip,
    available,
    favorite,
    visit,
    importData,
    reset,
    explore,
    gameHint,
    playGame,
    refreshBadges: unlockBadges,
  }
})
