import { z } from 'zod'

export const studioModes = ['semantica', 'flexbox', 'grid', 'responsive'] as const
export type StudioMode = (typeof studioModes)[number]
export const studioNames: Record<StudioMode, string> = {
  semantica: 'Semántica',
  flexbox: 'Flexbox',
  grid: 'CSS Grid',
  responsive: 'Responsive',
}
const checkSchema = z.object({
  selector: z.string(),
  property: z.string(),
  value: z.string(),
  media: z.string().optional(),
})
const missionSchema = z.object({
  id: z.string(),
  mode: z.enum(studioModes),
  title: z.string(),
  goal: z.string(),
  level: z.number().int().min(1).max(3),
  html: z.string(),
  baseCss: z.string(),
  solution: z.string(),
  checks: z.array(checkSchema),
  explanation: z.string(),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  width: z.enum(['375', '768', '1200']).default('375'),
})
export type StudioMission = z.infer<typeof missionSchema>
const base = `* { box-sizing: border-box; }
body { margin: 0; padding: 1rem; font: 16px/1.5 system-ui; color: #172554; background: #f8fafc; }
h1, h2, p { margin: 0 0 .75rem; }
header, footer, aside, article, .ficha { padding: 1rem; border: 1px solid #818cf8; border-radius: .6rem; background: #eef2ff; min-width: 0; }
a { color: #3730a3; }
nav { padding: .7rem; background: #e0e7ff; border-radius: .5rem; }
button { font: inherit; }
`
export const semanticHtml = `<header id="cabecera"><h1 id="marca">Revista CSS</h1><nav id="menu" aria-label="Secciones"><a id="enlace-inicio" href="#principal">Inicio</a><a id="enlace-noticias" href="#noticia-1">Noticias</a><a id="enlace-contacto" href="#pie">Contacto</a></nav></header>
<main id="principal"><article id="noticia-1"><h2 id="titulo-1">Diseñar para todas las pantallas</h2><p id="texto-1">El contenido marca el ritmo.</p></article><article id="noticia-2"><h2 id="titulo-2">El poder de una buena estructura</h2><p id="texto-2">Cada zona cumple una función.</p></article><aside id="lateral"><h2 id="titulo-lateral">Para seguir aprendiendo</h2><p id="recomendacion">Guías y recursos de CSS.</p></aside></main>
<footer id="pie"><p id="creditos">Una publicación de Aula CSS</p></footer>`
const semanticCss =
  base +
  `header,footer { margin-block: .5rem; }
nav { display: flex; flex-wrap: wrap; gap: 1rem; }
main { display: grid; gap: .8rem; margin-block: .8rem; }
aside { background: #fef3c7; border-color: #b45309; }
@media (min-width: 40rem) { main { grid-template-columns: 2fr 1fr; } aside { grid-column: 2; grid-row: 1 / 3; } }`
const semanticSeeds = [
  [
    'cabecera',
    'La cabecera del sitio',
    'Selecciona la cabecera principal que contiene la marca y la navegación.',
    'body > header',
    'header identifica contenido introductorio; aquí la cabecera principal es hija directa de body.',
  ],
  [
    'enlaces',
    'La navegación principal',
    'Selecciona solo los tres enlaces que pertenecen a nav.',
    'nav > a',
    'nav agrupa enlaces de navegación. El combinador > limita la selección a sus enlaces directos.',
  ],
  [
    'articulos',
    'Las noticias de la página',
    'Selecciona los dos artículos principales, sin incluir el contenido complementario.',
    'main > article',
    'article representa contenido independiente; aside cumple otra función y queda fuera.',
  ],
  [
    'complementario',
    'El contenido complementario',
    'Selecciona el bloque de recursos relacionados situado en aside.',
    'main > aside',
    'aside representa contenido relacionado de forma complementaria con el contenido principal.',
  ],
  [
    'pie',
    'El cierre de la página',
    'Selecciona el footer principal con los créditos de la publicación.',
    'body > footer',
    'footer reúne información de cierre. Un article también puede tener su propio footer, por eso aquí se acota a body.',
  ],
  [
    'titulos',
    'Los títulos de las noticias',
    'Selecciona solo los h2 de los artículos, sin marcar el título del bloque complementario.',
    'main > article > h2',
    'La cadena de combinadores exige que cada título pertenezca a un artículo del contenido principal.',
  ],
]
const tiles = `<section class="pista" aria-label="Tres fichas"><article class="ficha">A</article><article class="ficha ficha--principal">B</article><article class="ficha">C</article></section>`
const tileCss =
  base +
  `.pista { min-height: 160px; border: 2px dashed #94a3b8; padding: .75rem; }
.ficha { background: #e0e7ff; text-align: center; font-weight: 800; font-size: 1.3rem; }
.ficha--principal { background: #fde68a; border-color: #a16207; }`
type LayoutSeed = {
  id: string
  mode: Exclude<StudioMode, 'semantica'>
  title: string
  goal: string
  level: number
  html?: string
  css?: string
  solution: string
  checks: z.infer<typeof checkSchema>[]
  explanation: string
  width?: StudioMission['width']
}
const rule = (selector: string, property: string, value: string, media?: string) => ({
  selector,
  property,
  value,
  media,
})
const layoutSeeds: LayoutSeed[] = [
  {
    id: 'activar',
    mode: 'flexbox',
    title: 'Pon las fichas en movimiento',
    goal: 'En .pista declara display: flex para colocar las tres fichas en una fila.',
    level: 1,
    solution: '.pista {\n  display: flex;\n}',
    checks: [rule('.pista', 'display', 'flex')],
    explanation: 'display: flex convierte a los hijos directos en elementos flexibles.',
  },
  {
    id: 'repartir',
    mode: 'flexbox',
    title: 'Reparte el espacio',
    goal: 'En .pista declara justify-content: space-between para llevar A y C a los extremos.',
    level: 1,
    css: '.pista { display: flex; }',
    solution: '.pista {\n  justify-content: space-between;\n}',
    checks: [rule('.pista', 'justify-content', 'space-between')],
    explanation: 'justify-content reparte el espacio libre en el eje principal.',
  },
  {
    id: 'centrar',
    mode: 'flexbox',
    title: 'Encuentra el eje transversal',
    goal: 'En .pista declara align-items: center para centrar verticalmente fichas de distinta altura.',
    level: 2,
    css: '.pista { display:flex; gap: .7rem; height: 210px; } .ficha { height:56px; } .ficha--principal { height:100px; }',
    solution: '.pista {\n  align-items: center;\n}',
    checks: [rule('.pista', 'align-items', 'center')],
    explanation: 'Con flex-direction: row, align-items actúa sobre el eje vertical.',
  },
  {
    id: 'columna',
    mode: 'flexbox',
    title: 'Cambia la dirección',
    goal: 'En .pista declara flex-direction: column y gap: 1rem.',
    level: 2,
    css: '.pista { display:flex; }',
    solution: '.pista {\n  flex-direction: column;\n  gap: 1rem;\n}',
    checks: [rule('.pista', 'flex-direction', 'column'), rule('.pista', 'gap', '1rem')],
    explanation: 'column cambia el eje principal y gap separa las fichas sin márgenes adicionales.',
  },
  {
    id: 'envolver',
    mode: 'flexbox',
    title: 'Que ninguna ficha se escape',
    goal: 'En .pista declara flex-wrap: wrap. Prueba cómo se crean nuevas líneas al reducir el ancho.',
    level: 2,
    css: '.pista { display:flex; gap:.7rem; } .ficha { flex:0 0 9rem; }',
    solution: '.pista {\n  flex-wrap: wrap;\n}',
    checks: [rule('.pista', 'flex-wrap', 'wrap')],
    explanation:
      'wrap permite formar nuevas líneas cuando el tamaño base de los elementos no cabe.',
  },
  {
    id: 'crecer',
    mode: 'flexbox',
    title: 'Una ficha con más espacio',
    goal: 'En .ficha--principal declara flex: 1 para que B ocupe el espacio sobrante.',
    level: 3,
    css: '.pista { display:flex; gap:.7rem; } .ficha { flex:0 0 3.5rem; }',
    solution: '.ficha--principal {\n  flex: 1;\n}',
    checks: [rule('.ficha--principal', 'flex', '1')],
    explanation:
      'flex: 1 permite crecer y contraerse desde una base de cero; las otras fichas conservan su base fija.',
  },
  {
    id: 'columnas',
    mode: 'grid',
    title: 'Traza tres columnas',
    goal: 'En .pista declara display: grid y grid-template-columns: repeat(3, 1fr).',
    level: 1,
    solution: '.pista {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
    checks: [
      rule('.pista', 'display', 'grid'),
      rule('.pista', 'grid-template-columns', 'repeat(3, 1fr)'),
    ],
    explanation:
      'Grid coordina filas y columnas. 1fr distribuye el espacio disponible entre las tres pistas.',
  },
  {
    id: 'separacion',
    mode: 'grid',
    title: 'Dale aire a la rejilla',
    goal: 'En .pista declara gap: 1rem para separar filas y columnas.',
    level: 1,
    css: '.pista { display:grid; grid-template-columns: repeat(2, 1fr); }',
    solution: '.pista {\n  gap: 1rem;\n}',
    checks: [rule('.pista', 'gap', '1rem')],
    explanation: 'gap crea separación entre pistas sin añadirla al borde exterior de la rejilla.',
  },
  {
    id: 'expandir',
    mode: 'grid',
    title: 'Cruza dos columnas',
    goal: 'En .ficha--principal declara grid-column: span 2 para que B ocupe dos columnas.',
    level: 2,
    css: '.pista { display:grid; grid-template-columns:repeat(3,1fr); gap:.7rem; }',
    solution: '.ficha--principal {\n  grid-column: span 2;\n}',
    checks: [rule('.ficha--principal', 'grid-column', 'span 2')],
    explanation: 'span 2 ocupa dos pistas desde la posición automática de la ficha.',
  },
  {
    id: 'areas',
    mode: 'grid',
    title: 'Dibuja una página por áreas',
    goal: 'En .pagina declara grid-template-areas: "cabecera cabecera" "contenido lateral" "pie pie".',
    level: 3,
    html: '<div class="pagina"><header>Cabecera</header><main>Contenido</main><aside>Lateral</aside><footer>Pie</footer></div>',
    css: '.pagina { display:grid; grid-template-columns:2fr 1fr; gap:.7rem; } header { grid-area:cabecera; } main { grid-area:contenido; padding:1rem; background:#e0e7ff; } aside { grid-area:lateral; } footer { grid-area:pie; }',
    solution:
      '.pagina {\n  grid-template-areas: "cabecera cabecera" "contenido lateral" "pie pie";\n}',
    checks: [
      rule('.pagina', 'grid-template-areas', '"cabecera cabecera" "contenido lateral" "pie pie"'),
    ],
    explanation:
      'Cada cadena describe una fila. Las áreas con el mismo nombre forman regiones rectangulares.',
  },
  {
    id: 'alinear',
    mode: 'grid',
    title: 'Centra las filas de la rejilla',
    goal: 'En .pista declara align-content: center para centrar el conjunto de filas en el contenedor.',
    level: 2,
    css: '.pista { display:grid; grid-template-columns:repeat(2,1fr); grid-auto-rows:56px; height:280px; gap:.7rem; }',
    solution: '.pista {\n  align-content: center;\n}',
    checks: [rule('.pista', 'align-content', 'center')],
    explanation:
      'align-content distribuye el conjunto de pistas cuando sobra espacio en el contenedor.',
  },
  {
    id: 'autofit',
    mode: 'grid',
    title: 'Una galería que se reorganiza',
    goal: 'En .pista declara grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr)).',
    level: 3,
    css: '.pista { display:grid; gap:.7rem; }',
    solution:
      '.pista {\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr));\n}',
    checks: [
      rule('.pista', 'grid-template-columns', 'repeat(auto-fit, minmax(min(100%, 8rem), 1fr))'),
    ],
    explanation:
      'auto-fit crea las columnas que caben; minmax define sus límites y min evita que el mínimo desborde el contenedor.',
  },
  {
    id: 'tarjeta',
    mode: 'responsive',
    title: 'Una tarjeta que siempre cabe',
    goal: 'En .tarjeta declara width: min(100%, 24rem) para mantener el ancho dentro del contenedor.',
    level: 1,
    html: '<article class="tarjeta"><h1>Una idea que cabe</h1><p>El contenido se adapta al espacio, sin desplazamiento horizontal.</p></article>',
    css: '.tarjeta { width:40rem; margin-inline:auto; }',
    solution: '.tarjeta {\n  width: min(100%, 24rem);\n}',
    checks: [rule('.tarjeta', 'width', 'min(100%, 24rem)')],
    explanation: 'min elige la medida menor entre el ancho disponible y el límite de lectura.',
  },
  {
    id: 'tipografia',
    mode: 'responsive',
    title: 'Un título que crece contigo',
    goal: 'En .titular declara font-size: clamp(1.5rem, 1rem + 3vw, 3rem). Compara los tres anchos.',
    level: 2,
    html: '<main><h1 class="titular">Diseña para todas las pantallas</h1><p>Una tipografía fluida con límites claros.</p></main>',
    css: '.titular { font-size:1.5rem; line-height:1.15; }',
    solution: '.titular {\n  font-size: clamp(1.5rem, 1rem + 3vw, 3rem);\n}',
    checks: [rule('.titular', 'font-size', 'clamp(1.5rem, 1rem + 3vw, 3rem)')],
    explanation:
      'El valor preferido combina rem y vw; el mínimo y el máximo mantienen el tamaño dentro del intervalo.',
    width: '1200',
  },
  {
    id: 'dos-columnas',
    mode: 'responsive',
    title: 'Una página que cambia de composición',
    goal: 'Dentro de @media (min-width: 48rem), en .pagina declara grid-template-columns: 2fr 1fr.',
    level: 2,
    html: '<main class="pagina"><article><h1>La noticia principal</h1><p>Primero el contenido, luego la composición.</p></article><aside>Lecturas relacionadas</aside></main>',
    css: '.pagina { display:grid; grid-template-columns:1fr; gap:1rem; }',
    solution:
      '@media (min-width: 48rem) {\n  .pagina {\n    grid-template-columns: 2fr 1fr;\n  }\n}',
    checks: [rule('.pagina', 'grid-template-columns', '2fr 1fr', '(min-width: 48rem)')],
    explanation:
      'El CSS base conserva una columna en móvil. La media query añade la segunda al disponer de espacio.',
    width: '1200',
  },
  {
    id: 'navegacion',
    mode: 'responsive',
    title: 'Enlaces que encuentran su sitio',
    goal: 'En .menu declara flex-wrap: wrap para que la navegación forme varias líneas en móvil.',
    level: 2,
    html: '<nav class="menu" aria-label="Recursos"><a href="#">Inicio</a><a href="#">Lecciones</a><a href="#">Laboratorio</a><a href="#">Proyectos</a></nav>',
    css: '.menu { display:flex; gap:.5rem; } .menu > a { flex:0 0 8rem; padding:.5rem; border:1px solid #6366f1; border-radius:.4rem; }',
    solution: '.menu {\n  flex-wrap: wrap;\n}',
    checks: [rule('.menu', 'flex-wrap', 'wrap')],
    explanation:
      'Los enlaces mantienen su tamaño base y pasan a una nueva línea cuando dejan de caber.',
  },
  {
    id: 'contenedor',
    mode: 'responsive',
    title: 'Un ancho de lectura calculado',
    goal: 'En .lectura declara width: min(60rem, calc(100% - 2rem)).',
    level: 2,
    html: '<main class="lectura"><article><h1>Espacio para leer</h1><p>Una página centrada con márgenes fluidos y un ancho máximo.</p></article></main>',
    css: 'body { padding:0; } .lectura { margin:1rem auto; }',
    solution: '.lectura {\n  width: min(60rem, calc(100% - 2rem));\n}',
    checks: [rule('.lectura', 'width', 'min(60rem, calc(100% - 2rem))')],
    explanation:
      'calc resta espacio al bloque contenedor y min limita el máximo. margin-inline auto centra el conjunto.',
    width: '1200',
  },
  {
    id: 'pagina',
    mode: 'responsive',
    title: 'Tu primera página en tres tamaños',
    goal: 'En .pagina declara display: grid y gap: 1rem. Dentro de @media (min-width: 48rem), añade grid-template-columns: repeat(3, 1fr).',
    level: 3,
    html: '<header><h1>Aula CSS</h1><p>Una página que se adapta.</p></header><main class="pagina"><article><h2>Aprende</h2><p>Domina los fundamentos.</p></article><article><h2>Construye</h2><p>Da forma a tus ideas.</p></article><article><h2>Comparte</h2><p>Enseña lo que has creado.</p></article></main><footer>CSS para todas las pantallas</footer>',
    css: 'header,footer { margin-block:1rem; } .pagina { grid-template-columns:1fr; }',
    solution:
      '.pagina {\n  display: grid;\n  gap: 1rem;\n}\n@media (min-width: 48rem) {\n  .pagina {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}',
    checks: [
      rule('.pagina', 'display', 'grid'),
      rule('.pagina', 'gap', '1rem'),
      rule('.pagina', 'grid-template-columns', 'repeat(3, 1fr)', '(min-width: 48rem)'),
    ],
    explanation:
      'La composición parte de una columna y añade tres pistas con espacio suficiente. Revisa también el texto y el orden del teclado.',
    width: '1200',
  },
]
export const studioMissions: StudioMission[] = [
  ...semanticSeeds.map(([id, title, goal, solution, explanation], index) =>
    missionSchema.parse({
      id: `semantica-${id}`,
      mode: 'semantica',
      title,
      goal,
      solution,
      explanation,
      level: index < 3 ? 1 : 2,
      html: semanticHtml,
      baseCss: semanticCss,
      checks: [],
      width: '768',
      hints: [
        explanation,
        'Observa qué etiqueta tiene cada zona en el HTML.',
        `Una solución posible: ${solution}`,
      ],
    }),
  ),
  ...layoutSeeds.map((item) =>
    missionSchema.parse({
      ...item,
      id: `${item.mode}-${item.id}`,
      html: item.html ?? tiles,
      baseCss: tileCss + '\n' + (item.css ?? ''),
      hints: [
        item.explanation,
        'Escribe la regla con el selector, las propiedades y los valores del enunciado.',
        `Una solución posible:\n${item.solution}`,
      ],
    }),
  ),
]
export const studioGameBadges = studioModes.flatMap((mode) => [
  {
    id: `${mode}-inicio`,
    name: {
      semantica: 'Arquitecto del HTML',
      flexbox: 'Domador del eje',
      grid: 'Traza tu cuadrícula',
      responsive: 'Sin fronteras',
    }[mode],
    description: `Completa una misión de ${studioNames[mode]}.`,
    metric: `studio-${mode}`,
    threshold: 1,
  },
  {
    id: `${mode}-completo`,
    name: {
      semantica: 'Cada zona en su lugar',
      flexbox: 'Maestro de Flexbox',
      grid: 'Arquitectura de pistas',
      responsive: 'Diseña a cualquier escala',
    }[mode],
    description: `Completa las seis misiones de ${studioNames[mode]}.`,
    metric: `studio-${mode}`,
    threshold: 6,
  },
])
