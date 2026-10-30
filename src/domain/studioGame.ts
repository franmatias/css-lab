import type { StudioMission } from '../../packages/content/src/studioGames'
import { evaluateVisualGame } from './visualGame'
import { checkWorkshop } from './designWorkshop'
export function checkStudioGame(mission: StudioMission, answer: string) {
  if (!answer.trim())
    return {
      correct: false,
      error: false,
      checks: [] as boolean[],
      extra: 0,
      missing:
        mission.mode === 'semantica'
          ? evaluateVisualGame(mission.html, mission.solution, mission.solution).selectedIds.length
          : 0,
    }
  if (mission.mode === 'semantica') {
    const verdict = evaluateVisualGame(mission.html, mission.solution, answer)
    return { ...verdict, checks: [] as boolean[] }
  }
  const verdict = checkWorkshop({ checks: mission.checks, correct: 0 }, answer, '0')
  return {
    correct: verdict.declarations.every(Boolean),
    error: false,
    checks: verdict.declarations,
    extra: 0,
    missing: 0,
  }
}
