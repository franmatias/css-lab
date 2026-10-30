import { z } from 'zod'
import { gameBadges } from './game'
import { workshopBadges } from './designProgress'
export { gameLevels, planets, galaxyHtml } from './game'
export type { GameLevel } from './game'

export const entrySchema = z.object({
  id: z.string(),
  module: z.number().int().min(1).max(9),
  name: z.string(),
  syntax: z.string(),
  description: z.string(),
  html: z.string(),
  selector: z.string(),
  kind: z.enum(['selector', 'state', 'pseudo', 'cascade']).default('selector'),
  detail: z.string(),
  mistake: z.string(),
})
export type Entry = z.infer<typeof entrySchema>
type Seed = [string, string, string, string, string, string, Entry['kind']?]
const seeds: Seed[][] = [
  [
    [
      'universal',
      'Universal',
      '*',
      'Selecciona todos los elementos, independientemente de su etiqueta.',
      '<section><p>Uno</p><p>Dos</p></section>',
      '*',
    ],
    [
      'tipo',
      'Tipo',
      'p',
      'Selecciona todos los elementos de una etiqueta HTML.',
      '<div><p>Texto</p><span>Etiqueta</span><p>Otro texto</p></div>',
      'p',
    ],
    [
      'clase',
      'Clase',
      '.destacado',
      'Selecciona los elementos que comparten una clase.',
      '<div><p class="destacado">Especial</p><p>Normal</p></div>',
      '.destacado',
    ],
    [
      'id',
      'Identificador',
      '#principal',
      'Selecciona el elemento con ese identificador único.',
      '<div><p id="principal">Principal</p><p>Otro</p></div>',
      '#principal',
    ],
  ],
  [
    [
      'lista',
      'Lista de selectores',
      'h2, p',
      'La coma reúne los resultados de varios selectores.',
      '<article><h2>Título</h2><p>Texto</p><a>Enlace</a></article>',
      'h2, p',
    ],
    [
      'compuesto',
      'Selector compuesto',
      'p.destacado',
      'Sin espacio, todas las condiciones se aplican al mismo elemento.',
      '<div><p class="destacado">Sí</p><span class="destacado">No</span></div>',
      'p.destacado',
    ],
    [
      'clases',
      'Varias clases',
      '.tarjeta.activa',
      'Exige que un mismo elemento tenga las dos clases.',
      '<div><p class="tarjeta activa">Sí</p><p class="tarjeta">No</p></div>',
      '.tarjeta.activa',
    ],
  ],
  [
    [
      'presencia',
      'Atributo presente',
      '[title]',
      'Busca elementos que tengan el atributo, sea cual sea su valor.',
      '<div><a title="Ayuda">Ayuda</a><a>Inicio</a></div>',
      '[title]',
    ],
    [
      'igual',
      'Valor exacto',
      '[type="email"]',
      'El valor completo del atributo debe coincidir.',
      '<form><input type="email" aria-label="Correo"><input type="text" aria-label="Nombre"></form>',
      '[type="email"]',
    ],
    [
      'palabra',
      'Palabra de un atributo',
      '[class~="tag"]',
      'Encuentra una palabra completa en una lista separada por espacios.',
      '<div><p class="tag nueva">Sí</p><p class="tag-nueva">No</p></div>',
      '[class~="tag"]',
    ],
    [
      'idioma',
      'Prefijo de idioma',
      '[lang|="es"]',
      'Coincide con el valor exacto o seguido de un guion.',
      '<div><p lang="es">Hola</p><p lang="es-MX">Qué tal</p><p lang="en">Hello</p></div>',
      '[lang|="es"]',
    ],
    [
      'inicio',
      'Empieza por',
      '[href^="https"]',
      'Comprueba el comienzo del valor de un atributo.',
      '<nav><a href="https://example.org">Web</a><a href="#inicio">Local</a></nav>',
      '[href^="https"]',
    ],
    [
      'final',
      'Termina en',
      '[href$=".pdf"]',
      'Comprueba el final del valor de un atributo.',
      '<nav><a href="guia.pdf">PDF</a><a href="guia.html">HTML</a></nav>',
      '[href$=".pdf"]',
    ],
    [
      'contiene',
      'Contiene texto',
      '[href*="guia"]',
      'Busca una secuencia en cualquier posición del atributo.',
      '<nav><a href="/mi-guia.html">Guía</a><a href="/inicio">Inicio</a></nav>',
      '[href*="guia"]',
    ],
  ],
  [
    [
      'descendiente',
      'Descendiente',
      '.menu li',
      'El espacio selecciona descendientes a cualquier profundidad.',
      '<ul class="menu"><li>Inicio</li><li>Más<ul><li>Submenú</li></ul></li></ul>',
      '.menu li',
    ],
    [
      'hijo',
      'Hijo directo',
      '.menu > li',
      'El signo mayor que exige una relación de padre e hijo inmediata.',
      '<ul class="menu"><li>Inicio</li><li>Más<ul><li>Submenú</li></ul></li></ul>',
      '.menu > li',
    ],
    [
      'adyacente',
      'Hermano adyacente',
      'h2 + p',
      'Selecciona el hermano que aparece inmediatamente después.',
      '<article><h2>Título</h2><p>Primero</p><p>Segundo</p></article>',
      'h2 + p',
    ],
    [
      'hermanos',
      'Hermanos posteriores',
      'h2 ~ p',
      'Selecciona todos los hermanos posteriores que cumplan la condición.',
      '<article><h2>Título</h2><p>Uno</p><span>Pausa</span><p>Dos</p></article>',
      'h2 ~ p',
    ],
  ],
  [
    [
      'raiz',
      'Raíz',
      ':root',
      'Selecciona la raíz del documento, normalmente html.',
      '<main><p>Documento</p></main>',
      ':root',
    ],
    [
      'vacio',
      'Vacío',
      ':empty',
      'Selecciona elementos sin hijos ni nodos de texto.',
      '<section><p></p><p>Texto</p></section>',
      'p:empty',
    ],
    [
      'primero',
      'Primer hijo',
      ':first-child',
      'El elemento ocupa el primer lugar entre todos sus hermanos.',
      '<ul><li>Uno</li><li>Dos</li></ul>',
      'li:first-child',
    ],
    [
      'ultimo',
      'Último hijo',
      ':last-child',
      'El elemento ocupa el último lugar entre sus hermanos.',
      '<ul><li>Uno</li><li>Dos</li></ul>',
      'li:last-child',
    ],
    [
      'unico',
      'Hijo único',
      ':only-child',
      'Coincide si el elemento no tiene hermanos de ningún tipo.',
      '<div><section><p>Único</p></section><section><p>Uno</p><p>Dos</p></section></div>',
      'p:only-child',
    ],
    [
      'posicion',
      'Posición',
      ':nth-child(2n)',
      'Cuenta todos los hermanos desde 1 y aplica la fórmula an+b.',
      '<ul><li>Uno</li><li>Dos</li><li>Tres</li><li>Cuatro</li></ul>',
      'li:nth-child(2n)',
    ],
    [
      'desde-final',
      'Posición desde el final',
      ':nth-last-child(2)',
      'Cuenta desde el último hermano hacia el primero.',
      '<ul><li>Uno</li><li>Dos</li><li>Tres</li></ul>',
      'li:nth-last-child(2)',
    ],
    [
      'primer-tipo',
      'Primero de su tipo',
      ':first-of-type',
      'Solo cuenta los hermanos con la misma etiqueta.',
      '<article><h2>Título</h2><p>Uno</p><p>Dos</p></article>',
      'p:first-of-type',
    ],
    [
      'posicion-tipo',
      'Posición por tipo',
      ':nth-of-type(2)',
      'Cuenta únicamente los hermanos de la misma etiqueta.',
      '<article><h2>Título</h2><p>Uno</p><span>Pausa</span><p>Dos</p></article>',
      'p:nth-of-type(2)',
    ],
  ],
  [
    [
      'hover',
      'Puntero encima',
      ':hover',
      'Se activa mientras el puntero está sobre el elemento.',
      '<div><button class="sim-hover">Puntero aquí</button><button>Otro</button></div>',
      'button:hover',
      'state',
    ],
    [
      'active',
      'Activación',
      ':active',
      'Se activa durante la pulsación del elemento.',
      '<div><button class="sim-active">Pulsado</button><button>Otro</button></div>',
      'button:active',
      'state',
    ],
    [
      'focus',
      'Foco',
      ':focus',
      'Selecciona el elemento que recibe la entrada del teclado.',
      '<form><input class="sim-focus" aria-label="Con foco"><input aria-label="Sin foco"></form>',
      'input:focus',
      'state',
    ],
    [
      'focus-visible',
      'Foco visible',
      ':focus-visible',
      'El navegador muestra el foco cuando resulta útil, por ejemplo con el teclado.',
      '<div><button class="sim-focus-visible">Tabulador aquí</button><button>Otro</button></div>',
      'button:focus-visible',
      'state',
    ],
    [
      'focus-within',
      'Foco dentro',
      ':focus-within',
      'Coincide con un contenedor cuando él o un descendiente tiene el foco.',
      '<section><form class="sim-focus-within"><input aria-label="Con foco"></form><form><input aria-label="Otro"></form></section>',
      'form:focus-within',
      'state',
    ],
    [
      'checked',
      'Marcado',
      ':checked',
      'Selecciona casillas, radios y opciones seleccionadas.',
      '<form><input type="checkbox" checked aria-label="Marcado"><input type="checkbox" aria-label="Sin marcar"></form>',
      'input:checked',
    ],
    [
      'disabled',
      'Deshabilitado',
      ':disabled',
      'Coincide con controles que no admiten interacción.',
      '<form><button disabled>Deshabilitado</button><button>Disponible</button></form>',
      'button:disabled',
    ],
    [
      'invalid',
      'Valor inválido',
      ':invalid',
      'El valor del control incumple sus restricciones HTML.',
      '<form><input type="email" value="sin-arroba" aria-label="Inválido"><input type="email" value="a@example.org" aria-label="Válido"></form>',
      'input:invalid',
    ],
  ],
  [
    [
      'not',
      'Negación',
      ':not(.agotado)',
      'Excluye los elementos que cumplen el selector de su argumento.',
      '<ul><li>Disponible</li><li class="agotado">Agotado</li></ul>',
      'li:not(.agotado)',
    ],
    [
      'is',
      'Alternativas',
      ':is(h2, h3)',
      'Agrupa alternativas; toma la mayor especificidad de sus argumentos.',
      '<article><h2>Título</h2><h3>Subtítulo</h3><p>Texto</p></article>',
      ':is(h2, h3)',
    ],
    [
      'where',
      'Alternativas sin peso',
      ':where(h2, h3)',
      'Agrupa alternativas con especificidad cero.',
      '<article><h2>Título</h2><h3>Subtítulo</h3><p>Texto</p></article>',
      ':where(h2, h3)',
    ],
    [
      'has',
      'Relación con descendientes',
      'article:has(img)',
      'Selecciona un elemento si existe una relación con lo indicado dentro.',
      '<section><article><img alt="Ejemplo"></article><article>Sin imagen</article></section>',
      'article:has(img)',
    ],
  ],
  [
    [
      'before',
      'Antes del contenido',
      'p::before',
      'Genera una caja al principio del contenido; necesita content.',
      '<div><p>Texto</p><span>Otro</span></div>',
      'p::before',
      'pseudo',
    ],
    [
      'after',
      'Después del contenido',
      'p::after',
      'Genera una caja al final del contenido; necesita content.',
      '<div><p>Texto</p><span>Otro</span></div>',
      'p::after',
      'pseudo',
    ],
    [
      'first-letter',
      'Primera letra',
      'p::first-letter',
      'Da estilo a la primera letra de un bloque.',
      '<div><p>Una historia</p><span>Otro</span></div>',
      'p::first-letter',
      'pseudo',
    ],
    [
      'first-line',
      'Primera línea',
      'p::first-line',
      'Da estilo a la primera línea según el ancho disponible.',
      '<div><p>Un párrafo con varias palabras.</p></div>',
      'p::first-line',
      'pseudo',
    ],
    [
      'marker',
      'Marcador de lista',
      'li::marker',
      'Selecciona la viñeta o numeración de un elemento de lista.',
      '<ul><li>Uno</li><li>Dos</li></ul>',
      'li::marker',
      'pseudo',
    ],
    [
      'selection',
      'Selección del usuario',
      'p::selection',
      'Da estilo al texto seleccionado por el usuario.',
      '<article><p>Selecciona este texto</p></article>',
      'p::selection',
      'pseudo',
    ],
    [
      'placeholder',
      'Texto de ayuda',
      'input::placeholder',
      'Da estilo al texto provisional de un control vacío.',
      '<form><input placeholder="Tu nombre" aria-label="Nombre"></form>',
      'input::placeholder',
      'pseudo',
    ],
  ],
  [
    [
      'peso',
      'Especificidad',
      '(a, b, c)',
      'Compara IDs, clases y tipos de izquierda a derecha; no sumes las columnas.',
      '<p id="inicio" class="nota">Texto</p>',
      '#inicio',
      'cascade',
    ],
    [
      'orden',
      'Orden de aparición',
      'p { color: red } p { color: blue }',
      'Con igual prioridad y especificidad, gana la declaración posterior.',
      '<p>Texto</p>',
      'p',
      'cascade',
    ],
    [
      'herencia',
      'Herencia',
      'color: inherit',
      'Algunas propiedades se heredan del padre si el hijo no tiene valor propio.',
      '<div><p>Texto heredado</p></div>',
      'p',
      'cascade',
    ],
    [
      'important',
      'Declaración importante',
      'color: red !important',
      'La importancia se compara antes que la especificidad.',
      '<p>Texto</p>',
      'p',
      'cascade',
    ],
    [
      'layer',
      'Capas de cascada',
      '@layer base, tema;',
      'Las capas ordenan grupos: la última gana para declaraciones normales; con important se invierte.',
      '<p>Texto</p>',
      'p',
      'cascade',
    ],
  ],
]

export const entries: Entry[] = seeds.flatMap((group, index) =>
  group.map(([id, name, syntax, description, html, selector, kind]) =>
    entrySchema.parse({
      id: `m${index + 1}-${id}`,
      module: index + 1,
      name,
      syntax,
      description,
      html,
      selector,
      kind: kind ?? 'selector',
      detail: `${description} Observa el HTML del ejemplo y cambia una condición para comprobar cómo cambia el conjunto seleccionado.`,
      mistake:
        index === 3
          ? 'No confundas descendientes con hijos directos: un espacio permite cualquier profundidad y > solo un nivel.'
          : index === 7
            ? 'Un pseudoelemento no es un nodo HTML: selecciona una parte del elemento de origen.'
            : 'Revisa espacios, signos y mayúsculas: una clase lleva punto y un identificador lleva #.',
    }),
  ),
)

export const moduleNames = [
  'HTML, DOM y reglas CSS',
  'Fundamentos',
  'Composición',
  'Atributos',
  'Combinadores',
  'Pseudoclases estructurales',
  'Estado y formularios',
  'Lógicas y relacionales',
  'Pseudoelementos',
  'Especificidad y cascada',
]
export const lessons = moduleNames.map((name, module) => ({
  id: `m${module}`,
  module,
  name,
  minutes: module === 0 ? 5 : 8,
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

const explanations = [
  'HTML describe la estructura y CSS su presentación. El navegador convierte las etiquetas HTML en un árbol DOM: cada elemento tiene un padre y puede tener hijos y hermanos. En p { color: blue; }, p es el selector, color es la propiedad y blue es el valor. Las llaves delimitan el bloque y el punto y coma separa declaraciones. Una regla puede coincidir con muchos elementos o con ninguno. Inspecciona el HTML antes de elegir un selector: la apariencia no cambia las relaciones del árbol. Prueba cambiar p por h2 y observa que cambia el conjunto seleccionado, no la estructura.',
  'Los selectores básicos responden a cuatro preguntas. * encuentra todos los elementos; p encuentra una etiqueta; .destacado encuentra una clase; #principal encuentra un identificador. Una clase puede repetirse y un elemento puede tener varias clases separadas por espacios. Un ID debe ser único en el documento. En HTML escribes class="destacado", pero en CSS escribes .destacado: el punto no forma parte del nombre de la clase. Es preferible usar clases para estilos reutilizables. El selector universal puede ser útil para reinicios, pero normalmente debes acotar qué quieres cambiar. Prueba cada selector sobre el mismo HTML y cuenta las coincidencias.',
  'Una coma significa alternativas: h2, p selecciona títulos h2 y párrafos. Sin espacio, p.destacado exige las dos condiciones en el mismo elemento. .tarjeta.activa exige ambas clases, sin importar su orden en class. En cambio .tarjeta .activa busca un descendiente: el espacio cambia por completo el significado. No necesitas escribir una clase por cada regla: puedes combinar condiciones existentes. Construye primero un selector amplio y añade una condición cada vez. Comprueba los distractores: seleccionar todos los objetivos no basta si tu selector también incluye elementos que no deberían estar.',
  'Los atributos describen datos y estados en HTML. [title] comprueba su presencia; [type="email"] exige un valor exacto. Los operadores ^=, $= y *= buscan al principio, al final o en cualquier posición del valor. ~= encuentra una palabra completa en una lista separada por espacios, de modo que tag no es lo mismo que tag-nueva. |= coincide con el valor exacto o seguido por guion, útil para códigos de idioma como es y es-MX. Las comillas evitan ambigüedades. Puedes combinar varios filtros: a[title][href$=".pdf"]. Fíjate en la diferencia entre ausencia del atributo y atributo presente con valor vacío.',
  'Los combinadores describen relaciones entre elementos. El espacio llega a cualquier descendiente; > solo a hijos directos. + selecciona el hermano inmediato posterior y ~ todos los hermanos posteriores que coincidan. Los hermanos deben compartir padre y el orden del HTML importa; el orden visual impuesto por CSS no cambia estas relaciones. El selector se interpreta buscando los elementos de su extremo derecho que satisfacen toda la cadena. .menu > li selecciona li, no menu. Dibuja el árbol e identifica padre, hijo y hermano antes de escribir. Prueba añadir un nivel de anidamiento para comprobar si necesitas espacio o >.',
  'Las pseudoclases estructurales observan la posición en el DOM. :first-child y :last-child cuentan todos los hermanos, no solo los de la misma etiqueta. :first-of-type y :nth-of-type() cuentan únicamente elementos del mismo tipo. Los índices empiezan en 1. En :nth-child(2n), n recorre 0, 1, 2… y solo se aceptan posiciones positivas: el resultado son las posiciones pares. :nth-child(2n+1) encuentra las impares. :nth-last-child() cuenta desde el final. :empty exige que no haya hijos ni nodos de texto, por lo que un espacio puede impedir la coincidencia. :root selecciona la raíz del documento, normalmente html.',
  'Las pseudoclases de estado responden a la interacción. :hover sigue al puntero; :active dura durante la pulsación; :focus indica quién recibe entrada y :focus-visible permite al navegador decidir cuándo mostrar el foco. :focus-within también puede seleccionar el contenedor de un control enfocado. No elimines el contorno de foco sin sustituto: permite navegar con teclado. :checked, :disabled y :invalid dependen del estado real de los controles y de sus restricciones HTML. En estos ejercicios los estados de interacción se simulan con clases sim-…, para obtener resultados estables sin mover realmente el puntero. Los controles conservan sus estados HTML reales.',
  'Las pseudoclases lógicas permiten reunir condiciones con menos repetición. :is(h2, h3) ofrece alternativas y toma la mayor especificidad de sus argumentos. :where() selecciona de manera similar, pero todos sus argumentos aportan especificidad cero, ideal para estilos fáciles de sobrescribir. :not(.agotado) excluye una condición. :has(img) mira una relación con descendientes; :has(> img) exige un hijo directo y :has(+ p) puede observar el hermano siguiente. El elemento seleccionado sigue siendo el que aparece fuera del paréntesis. article:has(img) selecciona el artículo, no la imagen. Usa relaciones concretas para que la intención sea fácil de comprender.',
  'Los pseudoelementos representan partes de un elemento o cajas generadas. Se escriben con dos puntos dobles para distinguirlos de las pseudoclases. ::before y ::after necesitan content para generar su caja; úsala para decoración, no como única fuente de información esencial. ::first-letter y ::first-line afectan partes del texto y admiten un conjunto limitado de propiedades. La primera línea cambia si cambia el ancho. ::marker controla viñetas, ::selection el texto seleccionado y ::placeholder el texto provisional de un campo. No son nodos que querySelectorAll devuelva directamente: el laboratorio señala el elemento de origen y el evaluador comprueba también el nombre del pseudoelemento.',
  'La cascada decide qué declaración se aplica cuando varias coinciden. Primero importan el origen y la importancia; dentro de un mismo origen se consideran las capas, después la especificidad y finalmente el orden. La especificidad compara tres columnas: IDs, clases/atributos/pseudoclases y tipos/pseudoelementos. No conviertas las columnas en un número decimal: un ID gana a cualquier número de clases. :where() pesa cero; :is(), :not() y :has() toman la mayor especificidad de sus argumentos. En declaraciones normales, las reglas sin capa ganan a las de capas; entre capas gana la última. !important invierte el orden de las capas. La herencia aporta valores cuando no existe una declaración propia aplicable.',
]
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
  lesson.explanation = explanations[i]!
  const [question, options, answer] = checks[i]!
  lesson.quiz[0] = { question, options: [...options], answer }
})

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

export const badgeDefinitions = [
  ['primer-selector', 'Primer selector', 'Resuelve tu primer reto.', 'challenges', 1],
  ...[5, 10, 25, 40, 50, 62].map((n) => [
    `retos-${n}`,
    `${n} retos`,
    `Resuelve ${n} retos.`,
    'challenges',
    n,
  ]),
  ['primera-leccion', 'Primer concepto', 'Completa una lección.', 'lessons', 1],
  ...Array.from({ length: 9 }, (_, i) => [
    `maestria-${i + 1}`,
    `Maestría M${i + 1}`,
    `Completa los retos del módulo ${i + 1} sin pistas.`,
    'module',
    i + 1,
  ]),
  ...[3, 7, 30, 100].map((n) => [
    `racha-${n}`,
    `Racha de ${n}`,
    `Practica ${n} días seguidos.`,
    'streak',
    n,
  ]),
  ['semana', 'Semana perfecta', 'Practica siete días seguidos.', 'streak', 7],
  ['regreso', 'De vuelta', 'Practica tras una pausa de al menos dos días.', 'return', 1],
  ['catalogo', 'Explorador', 'Visita veinte fichas del catálogo.', 'visits', 20],
  ['favoritos', 'Tu biblioteca', 'Guarda cinco favoritos.', 'favorites', 5],
  ['noctambulo', 'Modo noctámbulo', 'Prueba el tema oscuro.', 'dark', 1],
  ['compartir', 'Comparte lo aprendido', 'Crea un enlace del laboratorio.', 'share', 1],
  ['sin-pistas', 'Sin pistas ×5', 'Resuelve cinco retos sin pistas.', 'clean', 5],
  ['universal', 'Todo conectado', 'Prueba * en el laboratorio.', 'universal', 1],
  ['has', 'Visión relacional', 'Resuelve un reto de :has().', 'has', 1],
  ['madrugada', 'Una idea de madrugada', 'Resuelve un reto entre las 0 y las 5.', 'night', 1],
].map(([id, name, description, metric, threshold]) => ({
  id: String(id),
  name: String(name),
  description: String(description),
  metric: String(metric),
  threshold: Number(threshold),
}))
badgeDefinitions.push(...gameBadges)
badgeDefinitions.push(...workshopBadges)
