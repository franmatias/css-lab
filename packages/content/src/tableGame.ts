import { z } from 'zod'

export const tableColumns = ['Estudiante', 'HTML', 'CSS', 'Proyecto']
export const tableRows = [
  { name: 'Ana', values: ['8', '9', '8'] },
  { name: 'Luis', values: ['7', '8', '9'] },
  { name: 'Sara', values: ['9', '10', '9'] },
  { name: 'Omar', values: ['8', '7', '10'] },
]
export const tableHtml = `<table class="calificaciones">
  <caption>Calificaciones del taller</caption>
  <thead>
    <tr>${tableColumns.map((name) => `<th scope="col">${name}</th>`).join('')}</tr>
  </thead>
  <tbody>
${tableRows
  .map(
    (row, r) => `    <tr id="fila-${r + 1}">
      <th id="celda-${r + 1}-1" scope="row">${row.name}</th>
${row.values.map((value, c) => `      <td id="celda-${r + 1}-${c + 2}">${value}</td>`).join('\n')}
    </tr>`,
  )
  .join('\n')}
  </tbody>
</table>`
const schema = z.object({
  id: z.string(),
  title: z.string(),
  goal: z.string(),
  solution: z.string(),
  level: z.number().int().min(1).max(3),
  explanation: z.string(),
  requiredPseudos: z.array(z.string()).min(1),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  interaction: z.enum(['static', 'cell', 'row', 'css-column']).default('static'),
})
export type TableMission = z.infer<typeof schema>
const seeds: [string, string, string, string, number, string, TableMission['interaction']?][] = [
  [
    'celda',
    'Una celda concreta',
    'Selecciona la nota de CSS de Luis: segunda fila del cuerpo y tercera celda de esa fila.',
    'tbody > tr:nth-child(2) > td:nth-child(3)',
    1,
    ':nth-child(2) encuentra la segunda fila de tbody. La cabecera th de Luis ocupa la primera posición: CSS es la tercera celda.',
  ],
  [
    'primera-fila',
    'La primera fila',
    'Selecciona el elemento tr de la primera fila del cuerpo, la de Ana.',
    'tbody > tr:first-child',
    1,
    ':first-child se refiere a la posición dentro de tbody. No incluye la fila de thead.',
  ],
  [
    'columna',
    'La columna de CSS',
    'Selecciona las cuatro celdas de datos de CSS, sin incluir la cabecera de columna.',
    'tbody > tr > td:nth-child(3)',
    1,
    'Cada fila vuelve a contar sus hijos desde 1. La celda th del nombre también cuenta para nth-child.',
  ],
  [
    'ultima-fila',
    'La última fila',
    'Selecciona el elemento tr de la última fila del cuerpo, la de Omar.',
    'tbody > tr:last-child',
    1,
    ':last-child selecciona el último hermano dentro de tbody.',
  ],
  [
    'pares',
    'Un ritmo de filas pares',
    'Selecciona los elementos tr de las filas pares del cuerpo: Luis y Omar.',
    'tbody > tr:nth-child(even)',
    2,
    'even equivale a 2n: las posiciones 2 y 4 de este tbody. La cabecera de thead se cuenta por separado.',
  ],
  [
    'nombres',
    'Las cabeceras de fila',
    'Selecciona los nombres de los cuatro estudiantes, las celdas th del cuerpo.',
    'tbody > tr > th:first-child',
    1,
    'Las cabeceras de fila son th con scope="row". Aquí ocupan la primera posición de cada tr.',
  ],
  [
    'ultima-columna',
    'La columna del proyecto',
    'Selecciona la última celda de cada fila del cuerpo, sin incluir la cabecera de columna.',
    'tbody > tr > td:last-child',
    2,
    ':last-child se aplica a cada fila, por eso encuentra una celda por estudiante.',
  ],
  [
    'primer-dato',
    'Primero de su tipo',
    'Selecciona las cuatro notas de HTML usando :first-of-type. Son las primeras td de cada fila, después de la th.',
    'tbody > tr > td:first-of-type',
    2,
    'td:first-child no coincide porque antes hay una th. td:first-of-type cuenta solo las celdas td.',
  ],
  [
    'rango',
    'Un tramo de la columna',
    'Selecciona solo las notas de CSS de Luis y Sara, en las filas 2 y 3 del cuerpo.',
    'tbody > tr:nth-child(n+2):nth-child(-n+3) > td:nth-child(3)',
    3,
    'n+2 empieza en la posición 2 y -n+3 limita el conjunto hasta la 3. Ambas condiciones se aplican a la misma fila.',
  ],
  [
    'hover-celda',
    'La celda bajo el puntero',
    'Escribe un selector con :hover que seleccione solo la celda del cuerpo bajo el puntero. Pasa por varias celdas para probarlo.',
    'tbody > tr > :is(th, td):hover',
    2,
    ':hover pertenece a la celda recorrida. Acota el selector al cuerpo para excluir la cabecera.',
    'cell',
  ],
  [
    'hover-fila',
    'La fila bajo el puntero',
    'Escribe un selector con :hover que seleccione el tr del cuerpo sobre el que pasas. Prueba distintas filas.',
    'tbody > tr:hover',
    2,
    'Un ancestro también está en :hover cuando el puntero está sobre un descendiente: recorrer una celda activa su tr.',
    'row',
  ],
  [
    'hover-columna',
    'Una columna que responde',
    'Con :has() y :hover, selecciona las cuatro notas de CSS solo mientras el puntero recorre una celda de esa columna.',
    '.calificaciones:has(tbody > tr > td:nth-child(3):hover) tbody > tr > td:nth-child(3)',
    3,
    ':has() comprueba si una nota de CSS está bajo el puntero; el resto del selector encuentra toda esa columna.',
    'css-column',
  ],
]
export const tableMissions = seeds.map(
  ([id, title, goal, solution, level, explanation, interaction]) =>
    schema.parse({
      id: `tabla-${id}`,
      title,
      goal,
      solution,
      level,
      explanation,
      interaction,
      requiredPseudos:
        id === 'primera-fila' || id === 'nombres'
          ? [':first-child']
          : id === 'ultima-fila' || id === 'ultima-columna'
            ? [':last-child']
            : id === 'primer-dato'
              ? [':first-of-type']
              : id === 'hover-columna'
                ? [':has', ':hover', ':nth-child']
                : id.startsWith('hover-')
                  ? [':hover']
                  : [':nth-child'],
      hints: [
        explanation,
        'tbody contiene cuatro tr. Cada tr contiene una th y tres td; nth-child cuenta todos ellos.',
        `Una solución posible: ${solution}`,
      ],
    }),
)
export const tableGameBadges = [
  {
    id: 'primera-tabla',
    name: 'Una celda, una idea',
    description: 'Completa una misión del juego de tablas.',
    metric: 'tableGames',
    threshold: 1,
  },
  {
    id: 'tabla-completa',
    name: 'Domina la tabla',
    description: 'Completa las doce misiones del juego de tablas.',
    metric: 'tableGames',
    threshold: 12,
  },
]
