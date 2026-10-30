import type { BadgeDefinition } from '@/domain/badges'
export type MedalTier = 1 | 2 | 3 | 4
export const medalTiers = { 1: 'Esencial', 2: 'Especial', 3: 'Épica', 4: 'Legendaria' } as const
export const badgeArtwork: Record<string, { icon: string; tier: MedalTier }> = {
  'semantica-inicio': { icon: 'LayoutTemplate', tier: 1 },
  'semantica-completo': { icon: 'Landmark', tier: 4 },
  'flexbox-inicio': { icon: 'MoveHorizontal', tier: 1 },
  'flexbox-completo': { icon: 'MoveVertical', tier: 4 },
  'grid-inicio': { icon: 'Grid2X2', tier: 1 },
  'grid-completo': { icon: 'LayoutGrid', tier: 4 },
  'responsive-inicio': { icon: 'Smartphone', tier: 1 },
  'responsive-completo': { icon: 'MonitorSmartphone', tier: 4 },
  'primer-selector': { icon: 'MousePointer2', tier: 1 },
  'retos-5': { icon: 'Zap', tier: 1 },
  'retos-10': { icon: 'Target', tier: 2 },
  'retos-25': { icon: 'ShieldCheck', tier: 3 },
  'retos-40': { icon: 'Trophy', tier: 3 },
  'retos-50': { icon: 'Gem', tier: 4 },
  'retos-62': { icon: 'Crown', tier: 4 },
  'primera-leccion': { icon: 'BookOpen', tier: 1 },
  'maestria-1': { icon: 'Braces', tier: 3 },
  'maestria-2': { icon: 'Layers', tier: 3 },
  'maestria-3': { icon: 'ListFilter', tier: 3 },
  'maestria-4': { icon: 'GitBranch', tier: 3 },
  'maestria-5': { icon: 'Binary', tier: 3 },
  'maestria-6': { icon: 'Crosshair', tier: 3 },
  'maestria-7': { icon: 'Network', tier: 3 },
  'maestria-8': { icon: 'WandSparkles', tier: 3 },
  'maestria-9': { icon: 'Scale', tier: 4 },
  'racha-3': { icon: 'Flame', tier: 1 },
  'racha-7': { icon: 'Sunrise', tier: 2 },
  'racha-30': { icon: 'Sun', tier: 3 },
  'racha-100': { icon: 'Milestone', tier: 4 },
  semana: { icon: 'CalendarCheck', tier: 2 },
  regreso: { icon: 'RotateCcw', tier: 1 },
  catalogo: { icon: 'Compass', tier: 2 },
  favoritos: { icon: 'Bookmark', tier: 1 },
  noctambulo: { icon: 'MoonStar', tier: 1 },
  compartir: { icon: 'Share2', tier: 2 },
  'sin-pistas': { icon: 'Swords', tier: 3 },
  universal: { icon: 'Sparkles', tier: 1 },
  has: { icon: 'Eye', tier: 3 },
  madrugada: { icon: 'AlarmClock', tier: 2 },
  'primera-mision': { icon: 'Rocket', tier: 1 },
  'tres-misiones': { icon: 'Orbit', tier: 2 },
  'seis-misiones': { icon: 'Telescope', tier: 3 },
  'galaxia-completa': { icon: 'Satellite', tier: 4 },
  'juego-sin-pistas': { icon: 'Focus', tier: 3 },
  'vuelo-buho': { icon: 'Bird', tier: 3 },
  'primer-diseno': { icon: 'Palette', tier: 1 },
  'seis-disenos': { icon: 'Paintbrush', tier: 3 },
  'todos-disenos': { icon: 'GraduationCap', tier: 4 },
  'primera-tabla': { icon: 'Table2', tier: 1 },
  'tabla-completa': { icon: 'TableProperties', tier: 4 },
}
export function medalArt(badge: BadgeDefinition) {
  return badgeArtwork[badge.id] ?? { icon: 'Medal', tier: 1 as MedalTier }
}
export function medalPalette(metric: string): string {
  if (metric === 'studio-semantica') return 'indigo'
  if (metric === 'studio-flexbox') return 'ember'
  if (metric === 'studio-grid') return 'emerald'
  if (metric === 'studio-responsive') return 'ocean'
  if (['games', 'gameClean', 'gameOwl'].includes(metric)) return 'cosmos'
  if (metric === 'tableGames') return 'ocean'
  if (metric === 'workshops') return 'rose'
  if (['streak', 'return', 'night'].includes(metric)) return 'ember'
  if (['module', 'clean'].includes(metric)) return 'emerald'
  if (['challenges', 'lessons'].includes(metric)) return 'indigo'
  return 'amber'
}
export function badgeDestination(badge: BadgeDefinition): string {
  if (badge.metric.startsWith('studio-')) return `/juego/${badge.metric.slice(7)}`
  if (badge.metric === 'module') return `/retos/m${badge.threshold}`
  if (['games', 'gameClean', 'gameOwl'].includes(badge.metric))
    return badge.metric === 'gameOwl' ? '/juego/galaxia-buho' : '/juego'
  if (badge.metric === 'tableGames') return '/juego/tablas'
  if (badge.metric === 'workshops') return '/talleres'
  if (['visits', 'favorites'].includes(badge.metric)) return '/catalogo'
  if (badge.metric === 'lessons') return '/teoria'
  if (['share', 'universal'].includes(badge.metric)) return '/laboratorio'
  if (badge.metric === 'dark') return '/progreso'
  if (badge.metric === 'has') return '/retos/m7'
  return '/retos'
}
