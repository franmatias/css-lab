export function challengeScore(level: number, hints: number): number {
  return Math.max(10, level * 50 - hints * 10 + (hints === 0 ? 20 : 0))
}

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function dayDistance(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000)
}

export function dailyIndex(date: string, count: number): number {
  return [...date].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 0) % count
}

export function visualGameScore(level: number, hints: number): number {
  return Math.max(20, 60 + level * 40 - Math.min(3, Math.max(0, hints)) * 20)
}
