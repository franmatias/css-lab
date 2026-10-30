import type { LearningData } from './progress'
import type { Challenge } from '../../packages/content/src'
import { workshopIds } from '../../packages/content/src/designProgress'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  metric: string
  threshold: number
}
export function badgeProgress(badge: BadgeDefinition, data: LearningData, challenges: Challenge[]) {
  const completed = Object.values(data.challenges).filter(
    (result) => result.status === 'completed',
  ).length
  const games = Object.values(data.games).filter((result) => result.status === 'completed')
  const metrics: Record<string, number> = {
    challenges: completed,
    lessons: Object.keys(data.lessons).length,
    streak: data.streak.current,
    visits: data.visits.length,
    favorites: data.favorites.length,
    clean: challenges.filter(
      (c) =>
        data.challenges[c.id]?.status === 'completed' && data.challenges[c.id]?.hintsUsed === 0,
    ).length,
    games: games.length,
    workshops: workshopIds.filter((id) => data.workshops[id]?.completedAt).length,
    gameClean: games.filter((result) => result.hintsUsed === 0).length,
  }
  if (badge.metric === 'module') {
    const group = challenges.filter((c) => c.module === badge.threshold)
    return {
      current: group.filter(
        (c) =>
          data.challenges[c.id]?.status === 'completed' && data.challenges[c.id]?.hintsUsed === 0,
      ).length,
      target: Math.max(1, group.length),
    }
  }
  return {
    current: Math.min(
      badge.threshold,
      metrics[badge.metric] ?? (data.flags.includes(badge.metric) ? 1 : 0),
    ),
    target: badge.threshold,
  }
}
export function badgeFamily(metric: string): string {
  if (metric === 'workshops') return 'Diseño CSS'
  if (['games', 'gameClean', 'gameOwl'].includes(metric)) return 'Juego visual'
  if (metric === 'module' || metric === 'clean') return 'Maestría'
  if (metric === 'streak' || metric === 'return') return 'Constancia'
  if (metric === 'challenges' || metric === 'lessons') return 'Aprendizaje'
  return 'Exploración'
}
