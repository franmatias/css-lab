import { z } from 'zod'
import { entries } from './selectorContent'
export const challengeSchema = z.object({
  id: z.string(),
  module: z.number(),
  title: z.string(),
  entryId: z.string(),
  type: z.enum([
    'select-target',
    'fill',
    'fix',
    'specificity',
    'multiple-choice',
    'shortest',
    'apply-style',
  ]),
  level: z.number().min(1).max(3),
  html: z.string(),
  solution: z.string(),
  alternatives: z.array(z.string()),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  explanation: z.string(),
  prerequisite: z.string().optional(),
  integrator: z.boolean(),
  options: z.array(z.string()).optional(),
  initial: z.string().default(''),
  prompt: z.string().default(''),
  styleTarget: z
    .object({ selector: z.string(), property: z.string(), value: z.string() })
    .optional(),
})
export type Challenge = z.infer<typeof challengeSchema>
const counts = [0, 5, 4, 8, 7, 10, 8, 6, 6, 8]
export const challenges: Challenge[] = counts.flatMap((count, module) => {
  const group = entries.filter((e) => e.module === module)
  return Array.from({ length: count }, (_, index) => {
    const entry = group[index % group.length]!
    const id = `m${module}-${entry.id.slice(3)}-${String(index + 1).padStart(2, '0')}`
    const type =
      module === 9
        ? index % 2 === 0
          ? 'specificity'
          : 'multiple-choice'
        : index === count - 1
          ? 'shortest'
          : index % 3 === 1
            ? 'fill'
            : index % 3 === 2
              ? 'fix'
              : 'select-target'
    return challengeSchema.parse({
      id,
      module,
      title: `${index === count - 1 ? 'Integrador · ' : ''}${entry.name}`,
      entryId: entry.id,
      type,
      level: index === count - 1 ? 3 : (index % 2) + 1,
      html: entry.html,
      solution:
        type === 'specificity' ? '#principal' : type === 'multiple-choice' ? '1' : entry.selector,
      alternatives: [],
      hints: [
        entry.description,
        `Fíjate en esta sintaxis: ${entry.syntax}.`,
        type === 'specificity'
          ? 'Un ID pesa más que cualquier número de clases.'
          : type === 'multiple-choice'
            ? 'La segunda respuesta respeta la cascada.'
            : `Prueba ${entry.selector}`,
      ],
      explanation:
        type === 'specificity'
          ? 'El ID ocupa la primera columna: (1,0,0) supera a (0,2,0).'
          : entry.description,
      prerequisite: index
        ? `m${module}-${group[(index - 1) % group.length]!.id.slice(3)}-${String(index).padStart(2, '0')}`
        : undefined,
      integrator: index === count - 1,
      options:
        type === 'specificity'
          ? ['.tarjeta.activa', '#principal', 'article p']
          : type === 'multiple-choice'
            ? [
                'Siempre gana la regla con más clases.',
                entry.description,
                'Siempre gana la primera regla.',
              ]
            : undefined,
      initial:
        type === 'fill'
          ? entry.selector.replace(/[.#]/, '___')
          : type === 'fix'
            ? `${entry.selector}]`
            : '',
    })
  })
})

// Curated variations replace repeated seeds while retaining all persistent IDs.
const capstones: Record<number, { html: string; solution: string; prompt: string }> = {
  1: {
    html: '<section><p class="destacado">Uno</p><span>Dos</span><p class="destacado">Tres</p></section>',
    solution: '.destacado',
    prompt: 'Selecciona los dos elementos que comparten la clase destacado.',
  },
  2: {
    html: '<section><p class="tarjeta activa">Elegido</p><p class="tarjeta">Normal</p><span class="activa">Otro</span></section>',
    solution: 'p.tarjeta.activa',
    prompt: 'Selecciona solo el párrafo que tiene las clases tarjeta y activa.',
  },
  3: {
    html: '<nav><a href="guia.pdf" title="Guía">Guía</a><a href="nota.pdf">Nota</a><a title="Inicio" href="index.html">Inicio</a></nav>',
    solution: 'a[title][href$=".pdf"]',
    prompt: 'Selecciona el enlace que tiene título y cuyo destino termina en .pdf.',
  },
  4: {
    html: '<section class="panel"><h2>Noticias</h2><p class="nota">Elegido</p><div><p class="nota">Anidado</p></div><p>Otro</p></section>',
    solution: '.panel > h2 + p.nota',
    prompt:
      'Dentro de panel, selecciona la nota hija directa inmediatamente posterior al título h2.',
  },
  5: {
    html: '<ul class="menu"><li>A</li><li class="activo">B</li><li>C</li><li class="activo">D</li></ul>',
    solution: '.menu > li.activo:nth-child(2n)',
    prompt: 'Selecciona los hijos li de menu que son activos y ocupan posiciones pares.',
  },
  6: {
    html: '<form class="alta"><input type="checkbox" checked aria-label="Uno"><input type="checkbox" checked disabled aria-label="Dos"><input type="checkbox" aria-label="Tres"></form>',
    solution: '.alta input:checked:not(:disabled)',
    prompt: 'Selecciona las casillas marcadas del formulario alta que no estén deshabilitadas.',
  },
  7: {
    html: '<section><article class="tarjeta"><img alt="Foto"></article><article class="tarjeta agotado"><img alt="Foto"></article><article class="tarjeta">Sin foto</article></section>',
    solution: 'article.tarjeta:has(img):not(.agotado)',
    prompt: 'Selecciona la tarjeta que contiene una imagen y no está agotada.',
  },
  8: {
    html: '<ul class="menu"><li>Inicio</li><li>Guía</li><li>Ayuda</li></ul>',
    solution: '.menu > li:first-child::marker',
    prompt: 'Selecciona el marcador del primer hijo li de la lista menu.',
  },
}
for (const [module, capstone] of Object.entries(capstones)) {
  const challenge = challenges.find((c) => c.module === Number(module) && c.integrator)!
  Object.assign(challenge, capstone, {
    initial: '',
    type: 'shortest',
    alternatives: [],
    hints: [
      'Combina las condiciones del enunciado sobre el mismo HTML.',
      'Primero identifica los nodos y después añade las restricciones una a una.',
      `Una solución es ${capstone.solution}`,
    ],
    explanation: `La solución ${capstone.solution} reúne todas las condiciones y excluye los distractores.`,
  })
}
const cascadeCases = [
  {
    prompt: '¿Qué selector tiene más especificidad?',
    options: ['.tarjeta.activa', '#principal', 'article p'],
    solution: '#principal',
    explanation: '(1,0,0) gana a (0,2,0) y (0,0,2): los IDs se comparan primero.',
  },
  {
    prompt: 'p { color: red } p { color: blue }: ¿qué color gana?',
    options: ['Rojo', 'Azul', 'Ambos a la vez'],
    solution: '1',
    explanation: 'Con igual prioridad y especificidad gana la declaración posterior: azul.',
  },
  {
    prompt: 'div tiene color rojo y su hijo p no declara color. ¿Qué ocurre?',
    options: ['p hereda rojo', 'p siempre es negro', 'La herencia necesita !important'],
    solution: 'p hereda rojo',
    explanation:
      'color se hereda del padre cuando el hijo no tiene una declaración propia aplicable.',
  },
  {
    prompt:
      '.nota { color: red !important } #principal { color: blue }: ¿qué gana si ambas coinciden?',
    options: ['Azul por el ID', 'Rojo por !important', 'El orden siempre decide'],
    solution: '1',
    explanation: 'La importancia se compara antes de la especificidad: gana rojo.',
  },
  {
    prompt: '¿Qué selector aporta especificidad cero?',
    options: [':where(#principal)', ':is(#principal)', '#principal'],
    solution: ':where(#principal)',
    explanation: ':where() y todos sus argumentos aportan especificidad cero.',
  },
  {
    prompt: '@layer base, tema; ambas capas declaran color sin !important. ¿Cuál gana?',
    options: ['base siempre', 'tema, la última capa', 'La capa con el nombre más largo'],
    solution: '1',
    explanation:
      'Entre capas de un mismo origen, la última tiene prioridad para declaraciones normales.',
  },
  {
    prompt: 'En @layer base, tema, ambas capas usan !important. ¿Cuál tiene prioridad?',
    options: ['base, la primera capa', 'tema, la última capa', 'Ninguna capa tiene prioridad'],
    solution: 'base, la primera capa',
    explanation: '!important invierte el orden de las capas: la primera gana.',
  },
  {
    prompt:
      'Una regla normal sin capa compite con una regla normal de una capa y mismo origen. ¿Cuál tiene prioridad?',
    options: [
      'La de la capa por su especificidad',
      'La regla sin capa',
      'La que se descargue antes',
    ],
    solution: '1',
    explanation:
      'Las declaraciones normales sin capa tienen prioridad sobre las declaraciones normales de capas.',
  },
]
challenges
  .filter((c) => c.module === 9)
  .forEach((challenge, i) => {
    const item = cascadeCases[i]!
    Object.assign(challenge, item, {
      hints: [
        'Recorre la cascada en orden: importancia, capas, especificidad y orden.',
        item.explanation,
        `Respuesta: ${item.options.includes(item.solution) ? item.solution : item.options[Number(item.solution)]}`,
      ],
    })
  })
// Styling is evaluated from computed browser styles in an isolated shadow tree.
const styling = challenges.find((c) => c.module === 2 && c.integrator)!
Object.assign(styling, {
  type: 'apply-style',
  solution: 'p.tarjeta.activa { color: rgb(79, 70, 229); }',
  prompt: 'Aplica color rgb(79, 70, 229) al párrafo con las clases tarjeta y activa.',
  styleTarget: { selector: 'p.tarjeta.activa', property: 'color', value: 'rgb(79, 70, 229)' },
  explanation: 'El selector compuesto reúne la etiqueta y las dos clases antes de aplicar color.',
  hints: [
    'El selector debe exigir las dos clases en el mismo párrafo.',
    'Usa p.tarjeta.activa y la propiedad color.',
    'p.tarjeta.activa { color: rgb(79, 70, 229); }',
  ],
})
challenges.forEach((challenge) => challengeSchema.parse(challenge))
