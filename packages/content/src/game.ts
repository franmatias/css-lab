import { z } from 'zod'

export const planets = [
  {
    id: 'mercurio',
    name: 'Mercurio',
    kind: 'rocoso',
    orbit: 'interior',
    moons: '0',
    habitable: false,
  },
  { id: 'venus', name: 'Venus', kind: 'rocoso', orbit: 'interior', moons: '0', habitable: false },
  { id: 'tierra', name: 'Tierra', kind: 'rocoso', orbit: 'interior', moons: '1', habitable: true },
  {
    id: 'jupiter',
    name: 'Júpiter',
    kind: 'gaseoso',
    orbit: 'exterior',
    moons: 'muchas',
    habitable: false,
  },
  {
    id: 'saturno',
    name: 'Saturno',
    kind: 'gaseoso',
    orbit: 'exterior',
    moons: 'muchas',
    habitable: false,
  },
  {
    id: 'neptuno',
    name: 'Neptuno',
    kind: 'gaseoso',
    orbit: 'exterior',
    moons: 'muchas',
    habitable: false,
  },
] as const

export const galaxyHtml = `<main class="galaxia">
${['interior', 'exterior']
  .map(
    (orbit) => `  <section class="orbita ${orbit}">
${planets
  .filter((p) => p.orbit === orbit)
  .map(
    (p) =>
      `    <article id="${p.id}" class="planeta ${p.kind}${p.habitable ? ' habitable' : ''}" data-lunas="${p.moons}">${p.name}</article>`,
  )
  .join('\n')}
  </section>`,
  )
  .join('\n')}
</main>`

const levelSchema = z.object({
  id: z.string(),
  title: z.string(),
  goal: z.string(),
  solution: z.string(),
  level: z.number().int().min(1).max(3),
  explanation: z.string(),
  hints: z.tuple([z.string(), z.string(), z.string()]),
})
export type GameLevel = z.infer<typeof levelSchema>
const seeds: [string, string, string, string, number, string][] = [
  [
    'rocosos',
    'Señal entre las rocas',
    'Selecciona los tres planetas rocosos.',
    '.rocoso',
    1,
    'La clase rocoso reúne Mercurio, Venus y Tierra.',
  ],
  [
    'habitable',
    'Un hogar en el cosmos',
    'Selecciona solo el planeta habitable.',
    '.planeta.habitable',
    1,
    'Las dos clases se exigen en el mismo elemento, sin espacio entre ellas.',
  ],
  [
    'sin-lunas',
    'Sin compañía',
    'Selecciona los planetas cuyo atributo data-lunas vale 0.',
    '[data-lunas="0"]',
    1,
    'El atributo exacto distingue Mercurio y Venus de los demás.',
  ],
  [
    'interior',
    'La órbita interior',
    'Selecciona los planetas hijos directos de la órbita interior.',
    '.interior > .planeta',
    2,
    '> selecciona hijos directos; el contenedor no forma parte del resultado.',
  ],
  [
    'vecino',
    'Justo después de Venus',
    'Selecciona el planeta inmediatamente posterior a Venus.',
    '#venus + .planeta',
    2,
    '+ mira al hermano inmediatamente posterior: Tierra.',
  ],
  [
    'posteriores',
    'Más allá de Mercurio',
    'Selecciona todos los planetas hermanos posteriores a Mercurio.',
    '#mercurio ~ .planeta',
    2,
    '~ encuentra los hermanos posteriores del mismo padre: Venus y Tierra.',
  ],
  [
    'pares',
    'Segundo de cada órbita',
    'Selecciona el segundo planeta de cada órbita.',
    '.planeta:nth-child(2)',
    2,
    ':nth-child(2) cuenta dentro de cada padre y empieza en 1.',
  ],
  [
    'negacion',
    'Gigantes sin rocas',
    'Selecciona los planetas que no sean rocosos.',
    '.planeta:not(.rocoso)',
    2,
    ':not() excluye los rocosos, manteniendo los tres gaseosos.',
  ],
  [
    'buho',
    'El vuelo del búho',
    'Selecciona todos los planetas que tengan un hermano anterior en su órbita.',
    '.orbita > * + *',
    3,
    'El patrón búho * + * selecciona un elemento cuando tiene un hermano anterior. Al acotarlo a hijos de orbita deja fuera el primero de cada grupo.',
  ],
  [
    'has',
    'Vecinos de un mundo habitable',
    'Selecciona los planetas de la órbita que contiene un planeta habitable.',
    '.orbita:has(.habitable) > .planeta',
    3,
    ':has() identifica la órbita interior; > selecciona después sus planetas.',
  ],
  [
    'alternativas',
    'Dos mundos lejanos',
    'Selecciona únicamente Tierra y Neptuno.',
    '.planeta:is(#tierra, #neptuno)',
    3,
    ':is() reúne alternativas sin repetir el selector de planeta.',
  ],
  [
    'integrador',
    'Constelación completa',
    'Selecciona los planetas gaseosos que no sean el primero de su órbita.',
    '.exterior > .gaseoso:not(:first-child)',
    3,
    'La combinación acota la órbita, exige la clase gaseoso y excluye el primer hijo.',
  ],
]
const concepts = [
  'Una clase puede identificar varios planetas a la vez.',
  'Puedes exigir dos clases en un mismo elemento.',
  'Los atributos se consultan con corchetes.',
  'Busca una relación de padre e hijo.',
  'Hay un combinador para el hermano inmediatamente posterior.',
  'Hay un combinador que admite varios hermanos posteriores.',
  'La posición se cuenta desde 1 dentro de cada padre.',
  'Puedes excluir una condición con una pseudoclase.',
  'El patrón búho combina dos selectores universales y un hermano adyacente.',
  'Puedes seleccionar un contenedor en función de lo que contiene.',
  'Una lista de alternativas permite reunir dos identidades.',
  'Combina órbita, clase y una condición de posición.',
]
export const gameLevels = seeds.map(([id, title, goal, solution, level, explanation], index) =>
  levelSchema.parse({
    id: `galaxia-${id}`,
    title,
    goal,
    solution,
    level,
    explanation,
    hints: [concepts[index]!, explanation, `Una solución posible: ${solution}`],
  }),
)

export const gameBadges = [
  ['primera-mision', 'Primer contacto', 'Resuelve una misión de la galaxia.', 'games', 1],
  ['tres-misiones', 'Navegante CSS', 'Resuelve tres misiones visuales.', 'games', 3],
  ['seis-misiones', 'Cartógrafo del DOM', 'Resuelve seis misiones visuales.', 'games', 6],
  [
    'galaxia-completa',
    'Maestro de la galaxia',
    'Completa las doce misiones visuales.',
    'games',
    12,
  ],
  [
    'juego-sin-pistas',
    'Pulso de precisión',
    'Resuelve tres misiones visuales sin pistas.',
    'gameClean',
    3,
  ],
  ['vuelo-buho', 'El vuelo del búho', 'Supera la misión del selector búho.', 'gameOwl', 1],
].map(([id, name, description, metric, threshold]) => ({
  id: String(id),
  name: String(name),
  description: String(description),
  metric: String(metric),
  threshold: Number(threshold),
}))
