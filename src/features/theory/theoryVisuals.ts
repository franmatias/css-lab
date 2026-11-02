import { curriculumSlugs } from '../../../packages/content/src/curriculumIds'

export type TheoryDiagram =
  | 'box-model'
  | 'responsive'
  | 'flexbox'
  | 'grid'
  | 'cascade'
  | 'fluid-functions'
  | 'selector-relations'
  | 'motion'
  | 'table'
  | 'transforms'
export interface TheoryVisual {
  diagram: TheoryDiagram
  title: string
  description: string
  points: string[]
  interactive?: 'box' | 'responsive' | 'motion'
}
const diagrams: Record<TheoryDiagram, TheoryVisual> = {
  'box-model': {
    diagram: 'box-model',
    title: 'Las cuatro capas de una caja',
    description:
      'El contenido está rodeado por padding, border y margin. Cada capa tiene una función y afecta de manera distinta al espacio que ocupa la caja.',
    points: [
      'Padding separa el contenido del borde; margin separa la caja de sus vecinas.',
      'Con content-box, width solo mide el contenido. Se suman padding y bordes.',
      'Con border-box, width incluye contenido, padding y bordes. El margen siempre queda fuera.',
    ],
    interactive: 'box',
  },
  responsive: {
    diagram: 'responsive',
    title: 'Una página que cambia de distribución',
    description:
      'El mismo HTML puede organizarse de otra forma según el espacio disponible. Observa cómo pasan las tarjetas de tres columnas a dos y después a una.',
    points: [
      'La demostración usa @media con puntos de cambio a 600 y 900 px del viewport.',
      'El ancho indicado es el viewport real del ejemplo, aunque se reduzca su escala para caber en el panel.',
      'Cambiar la distribución no debe alterar el orden de lectura del HTML.',
    ],
    interactive: 'responsive',
  },
  flexbox: {
    diagram: 'flexbox',
    title: 'Dos ejes, una dirección principal',
    description:
      'Flexbox distribuye elementos sobre un eje principal. La dirección de escritura y flex-direction determinan cómo leer los ejes del diagrama.',
    points: [
      'En row y escritura horizontal de izquierda a derecha, el eje principal avanza hacia la derecha.',
      'justify-content trabaja en el eje principal; align-items, en el transversal.',
      'Al usar column cambian los ejes. El orden visual no modifica el orden del DOM.',
    ],
  },
  grid: {
    diagram: 'grid',
    title: 'Una cuadrícula de filas y columnas',
    description:
      'Grid permite coordinar dos dimensiones: cada elemento puede ocupar una o varias pistas y gap conserva los espacios entre ellas.',
    points: [
      'Las líneas delimitan pistas: tres columnas necesitan cuatro líneas verticales.',
      'grid-column: span 2 ocupa dos columnas, incluido el espacio que queda entre ellas.',
      'Prueba más abajo cómo una media query cambia el número de columnas sin cambiar el HTML.',
    ],
    interactive: 'responsive',
  },
  cascade: {
    diagram: 'cascade',
    title: 'La prioridad se decide por etapas',
    description:
      'La especificidad no es el primer criterio. Este esquema resume el recorrido de las reglas del inspector de cascada de la lección.',
    points: [
      'Entre reglas del mismo origen y contexto se compara importancia y prioridad de capa antes de la especificidad.',
      'Las reglas normales sin capa superan a las normales de capas. Con !important se invierte la prioridad de capas.',
      'El orden de aparición resuelve empates. El esquema simplifica casos como @scope, estilos inline, animaciones y transiciones.',
    ],
  },
  'fluid-functions': {
    diagram: 'fluid-functions',
    title: 'Un valor fluido con límites',
    description:
      'La línea muestra el resultado de clamp(24px, 4vw, 48px): primero mantiene el mínimo, después crece y finalmente alcanza el máximo.',
    points: [
      '4vw equivale al 4 % del ancho del viewport: a 600 px produce 24 px y a 1200 px produce 48 px.',
      'clamp elige el preferido cuando está entre mínimo y máximo; no suma los tres valores.',
      'Para texto ampliable conviene combinar rem y una parte flexible, y comprobar el zoom del navegador.',
    ],
  },
  'selector-relations': {
    diagram: 'selector-relations',
    title: 'Lee el HTML como un árbol',
    description:
      'Los elementos tienen padres, hijos y hermanos. Seguir esas relaciones ayuda a construir selectores que describan exactamente el objetivo.',
    points: [
      'nav > ul exige que ul sea hijo directo de nav.',
      'nav li permite que li esté a cualquier profundidad dentro de nav.',
      'li + li selecciona el li inmediatamente posterior a otro li: en este árbol, el segundo.',
    ],
  },
  motion: {
    diagram: 'motion',
    title: 'Del estado inicial al estado final',
    description:
      'Los fotogramas definen estados; el navegador calcula los intermedios. Duración y curva de ritmo determinan cómo se recorre la secuencia.',
    points: [
      'Una transición comienza cuando cambia el valor de una propiedad animable.',
      'Una animación con @keyframes puede definir estados al 0 %, 50 % y 100 %.',
      'La muestra se reproduce solo cuando lo pides, una vez y con opción de pausa. Con movimiento reducido conserva una explicación estática.',
    ],
    interactive: 'motion',
  },
  table: {
    diagram: 'table',
    title: 'La anatomía de una tabla',
    description:
      'Las cabeceras dan significado a los datos. Dar formato no debe borrar la relación entre fila, columna y encabezado.',
    points: [
      'thead y tbody agrupan filas; tr contiene las celdas th o td.',
      'tbody > tr:nth-child(2) selecciona la segunda fila de datos, sin contar la cabecera del thead.',
      'Para una columna selecciona las celdas de esa posición en cada fila; conserva th y scope cuando corresponda.',
    ],
  },
  transforms: {
    diagram: 'transforms',
    title: 'La imagen se mueve; su hueco permanece',
    description:
      'Una transformación modifica la representación visual. El contorno discontinuo conserva el lugar que la caja ocupa en el flujo normal.',
    points: [
      'translate desplaza; rotate gira; scale cambia la escala visual.',
      'El contenido transformado puede solaparse con sus vecinos aunque conserve su hueco original.',
      'El orden de las funciones y transform-origin cambian el resultado.',
    ],
  },
}

const foundation: Record<string, TheoryDiagram> = {
  m0: 'selector-relations',
  m4: 'selector-relations',
  m5: 'table',
  m9: 'cascade',
  m10: 'fluid-functions',
  m11: 'selector-relations',
  m12: 'selector-relations',
  m13: 'table',
  m15: 'flexbox',
  m16: 'grid',
  m17: 'box-model',
  m21: 'motion',
  m22: 'transforms',
  m23: 'motion',
}
const groups: Partial<Record<TheoryDiagram, string[]>> = {
  'box-model': ['caja-contenido', 'relleno-logico', 'borde-logico'],
  flexbox: [
    'flex-columna',
    'flex-crecimiento',
    'flex-contraccion',
    'flex-base',
    'flex-individual',
    'flex-transversal',
    'flex-lineas',
    'orden-visual',
  ],
  grid: [
    'separacion-filas',
    'separacion-columnas',
    'filas-implicitas',
    'flujo-grid',
    'ocupar-columnas',
    'ocupar-filas',
    'alineacion-grid',
    'subrejilla',
  ],
  motion: [
    'transiciones-multiples',
    'relleno-animacion',
    'pasos-animacion',
    'retardo-negativo',
    'movimiento-reducido',
  ],
  transforms: ['inclinacion', 'cara-posterior', 'perspectiva', 'espacio-3d'],
  cascade: ['capas-cascada'],
}
export function theoryVisual(id: string): TheoryVisual | undefined {
  if (foundation[id]) return diagrams[foundation[id]!]
  const slug = curriculumSlugs[Number(id.slice(1)) - 25]
  if (!slug) return undefined
  const found = Object.entries(groups).find(([, slugs]) => slugs?.includes(slug))
  if (!found) return undefined
  const diagram = diagrams[found[0] as TheoryDiagram]
  // Extended Grid lessons keep the focused image; the complete responsive demo belongs to m16.
  return {
    ...diagram,
    interactive: diagram.interactive === 'responsive' ? undefined : diagram.interactive,
  }
}
