import type { LearningData } from './progress'
import { gameLevels, type Challenge } from '../../packages/content/src'
import { tableMissions } from '../../packages/content/src/tableGame'
import { workshopIds } from '../../packages/content/src/designProgress'
import { studioMissions } from '../../packages/content/src/studioGames'

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
  const games = gameLevels
    .filter((game) => data.games[game.id]?.status === 'completed')
    .map((game) => data.games[game.id]!)
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
    tableGames: tableMissions.filter((game) => data.games[game.id]?.status === 'completed').length,
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
  if (badge.metric.startsWith('studio-'))
    return {
      current: Math.min(
        badge.threshold,
        studioMissions.filter(
          (mission) =>
            `studio-${mission.mode}` === badge.metric &&
            data.games[mission.id]?.status === 'completed',
        ).length,
      ),
      target: badge.threshold,
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
  const studio: Record<string, string> = {
    'studio-semantica': 'Semántica',
    'studio-flexbox': 'Flexbox',
    'studio-grid': 'CSS Grid',
    'studio-responsive': 'Responsive',
  }
  if (studio[metric]) return studio[metric]
  if (metric === 'tableGames') return 'Juego de tablas'
  if (metric === 'workshops') return 'Diseño CSS'
  if (['games', 'gameClean', 'gameOwl'].includes(metric)) return 'Juego visual'
  if (metric === 'module' || metric === 'clean') return 'Maestría'
  if (metric === 'streak' || metric === 'return') return 'Constancia'
  if (metric === 'challenges' || metric === 'lessons') return 'Aprendizaje'
  return 'Exploración'
}
