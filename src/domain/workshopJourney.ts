import type { Workshop } from '../../packages/content/src/design'

export function workshopSteps(workshop: Pick<Workshop, 'checks' | 'steps'>) {
  return [
    {
      id: 'brief',
      title: 'Explora el punto de partida',
      description:
        'Lee el objetivo, observa el HTML y compara la vista previa con las instrucciones. Cuando lo tengas claro, comienza a construir.',
      kind: 'brief' as const,
    },
    ...workshop.checks.map((rule, index) => ({
      id: `rule-${index}`,
      title: `Aplica ${rule.property}`,
      description: `En ${rule.selector}, escribe ${rule.property}: ${rule.value};${rule.media ? ` dentro de @media ${rule.media}.` : '.'} Observa cómo cambia el resultado y comprueba este paso.`,
      kind: 'rule' as const,
      ruleIndex: index,
    })),
    {
      id: 'responsive',
      title: 'Comprueba distintos tamaños',
      description:
        'Prueba los botones de móvil y escritorio. Observa qué se adapta y si aparece algún desbordamiento. Después confirma que has revisado ambas vistas.',
      kind: 'responsive' as const,
    },
    {
      id: 'quiz',
      title: 'Explica tu decisión',
      description:
        'Responde la pregunta final y comprueba el taller. Para completarlo, conserva las declaraciones solicitadas y termina los pasos anteriores.',
      kind: 'quiz' as const,
    },
  ]
}
export function completedWorkshopSteps(
  workshop: Pick<Workshop, 'checks' | 'steps'>,
  saved?: { completedAt?: string; steps?: string[] },
) {
  const ids = workshopSteps(workshop).map((step) => step.id)
  return saved?.completedAt ? ids : ids.filter((id) => saved?.steps?.includes(id))
}
