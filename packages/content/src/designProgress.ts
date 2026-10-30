export const workshopIds = [
  'tablas',
  'formularios',
  'listas',
  'flexbox',
  'grid',
  'responsive',
  'bem',
  'smacss',
  'variables',
  'clamp',
  'calc',
  'proyecto',
] as const
export const workshopBadges = [
  {
    id: 'primer-diseno',
    name: 'Del selector al diseño',
    description: 'Completa un taller de diseño CSS.',
    metric: 'workshops',
    threshold: 1,
  },
  {
    id: 'seis-disenos',
    name: 'Construye interfaces',
    description: 'Completa seis talleres de diseño CSS.',
    metric: 'workshops',
    threshold: 6,
  },
  {
    id: 'todos-disenos',
    name: 'Diseño de principio a fin',
    description: 'Completa los doce talleres de diseño CSS.',
    metric: 'workshops',
    threshold: 12,
  },
]
