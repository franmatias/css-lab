export interface GameVerdict {
  correct: boolean
  selectedIds: string[]
  containers: number
  extra: number
  missing: number
  error: boolean
}
export function evaluateVisualGame(
  html: string,
  targetSelector: string,
  answer: string,
): GameVerdict {
  const empty = {
    correct: false,
    selectedIds: [],
    containers: 0,
    extra: 0,
    missing: 0,
    error: false,
  }
  if (!answer.trim()) return empty
  if (answer.length > 160) return { ...empty, error: true }
  const document = new DOMParser().parseFromString(html, 'text/html')
  try {
    const target = new Set(document.body.querySelectorAll(targetSelector))
    const selected = new Set(document.body.querySelectorAll(answer))
    const extra = [...selected].filter((node) => !target.has(node)).length
    const missing = [...target].filter((node) => !selected.has(node)).length
    const selectedIds = [...selected].map((node) => node.id).filter(Boolean)
    return {
      correct: target.size > 0 && extra === 0 && missing === 0,
      selectedIds,
      containers: selected.size - selectedIds.length,
      extra,
      missing,
      error: false,
    }
  } catch {
    return { ...empty, error: true }
  }
}
export function visualGameScore(level: number, hints: number): number {
  return Math.max(20, 60 + level * 40 - Math.min(3, Math.max(0, hints)) * 20)
}
