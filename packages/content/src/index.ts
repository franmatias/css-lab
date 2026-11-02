import { lessonGuides } from './lessonGuides'
import { practicalLessons, type TheoryLesson } from './practicalTheory'
import { entries, moduleNames } from './selectorContent'
export { entries, moduleNames, entrySchema } from './selectorContent'
export type { Entry } from './selectorContent'
export { challenges, challengeSchema } from './challenges'
export type { Challenge } from './challenges'
export { badgeDefinitions } from './badges'
export { gameLevels, planets, galaxyHtml } from './game'
export type { GameLevel } from './game'

export const lessons: TheoryLesson[] = moduleNames.map((name, module) => ({
  id: `m${module}`,
  module,
  name,
  minutes: module === 0 ? 5 : 8,
  ideas: [] as string[],
  objective:
    module === 0
      ? 'Relacionar el árbol HTML con las partes de una regla CSS.'
      : `Usar ${name.toLowerCase()} para seleccionar exactamente lo que necesitas.`,
  explanation:
    module === 0
      ? 'HTML describe la estructura. El navegador la organiza en un árbol llamado DOM. Una regla CSS tiene un selector, seguido de declaraciones entre llaves. En p { color: blue; }, p es el selector, color la propiedad y blue el valor. El selector encuentra nodos; las declaraciones cambian su presentación.'
      : `Aprende ${name.toLowerCase()} con los ejemplos de abajo. Cada selector describe una condición. El navegador recorre el DOM y aplica la regla a los elementos que cumplen todas sus condiciones. Prueba un cambio cada vez y comprueba tanto los elementos que entran como los que quedan fuera.`,
  quiz: [
    {
      question:
        module === 0
          ? '¿Qué parte de p { color: blue; } selecciona los elementos?'
          : `¿Qué demuestra el ejemplo ${entries.find((e) => e.module === module)?.syntax ?? 'p'}?`,
      options:
        module === 0
          ? ['p', 'color', 'blue']
          : [
              entries.find((e) => e.module === module)?.description ?? '',
              'Todos los elementos siempre coinciden.',
              'El selector ejecuta JavaScript.',
            ],
      answer: 0,
    },
    {
      question: '¿Qué ocurre cuando ningún elemento cumple el selector?',
      options: [
        'Se elimina el documento.',
        'La regla no se aplica a ningún elemento.',
        'Se aplican los estilos a todos.',
      ],
      answer: 1,
    },
  ],
}))

const explanations = lessonGuides
const checks = [
  [
    '¿Qué representa el DOM?',
    ['El árbol de elementos del documento.', 'Una paleta de colores.', 'Un archivo CSS.'],
    0,
  ],
  ['¿Qué selector encuentra class="destacado"?', ['#destacado', '.destacado', 'destacado'], 1],
  [
    '¿Qué exige .tarjeta.activa?',
    ['Un descendiente activo.', 'Dos elementos hermanos.', 'Las dos clases en el mismo elemento.'],
    2,
  ],
  ['¿Qué operador comprueba el final de un atributo?', ['*=', '$=', '^='], 1],
  ['¿Qué combinador exige un hijo directo?', ['>', '~', 'Un espacio'], 0],
  ['¿Desde qué número cuenta :nth-child()?', ['0', '1', '-1'], 1],
  [
    '¿Qué pseudoclase puede indicar que un campo no cumple required?',
    [':hover', ':checked', ':invalid'],
    2,
  ],
  ['¿Qué pseudoclase tiene especificidad cero?', [':is()', ':where()', ':has()'], 1],
  ['¿Qué suele necesitar ::before para generar una caja?', ['content', 'Un ID', 'JavaScript'], 0],
  [
    'Con importancia, capa y especificidad iguales, ¿qué regla gana?',
    ['La primera.', 'La última.', 'La de selector más largo.'],
    1,
  ],
] as const
lessons.forEach((lesson, i) => {
  lesson.explanation = explanations[i]!.intro
  lesson.ideas = explanations[i]!.ideas
  const [question, options, answer] = checks[i]!
  lesson.quiz[0] = { question, options: [...options], answer }
})

lessons.push(...practicalLessons)
