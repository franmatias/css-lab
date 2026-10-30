import { z } from 'zod'

export const theoryLessonSchema = z.object({
  id: z.string(),
  module: z.number().int().nonnegative(),
  name: z.string(),
  minutes: z.number().int().positive(),
  objective: z.string(),
  explanation: z.string(),
  ideas: z.array(z.string()).min(4),
  sections: z
    .array(
      z.object({ title: z.string(), paragraph: z.string(), points: z.array(z.string()).min(2) }),
    )
    .optional(),
  example: z
    .object({
      title: z.string(),
      html: z.string(),
      css: z.string(),
      selector: z.string().default('*'),
      steps: z.array(z.string()).min(3),
      pitfall: z.string(),
    })
    .optional(),
  links: z.array(z.object({ label: z.string(), to: z.string().startsWith('/') })).optional(),
  reference: z.string().url().optional(),
  quiz: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).length(3),
        answer: z.number().int().min(0).max(2),
      }),
    )
    .min(2),
})
export type TheoryLesson = z.infer<typeof theoryLessonSchema>
export type TheoryExample = NonNullable<TheoryLesson['example']>
const base = `* { box-sizing: border-box; }
body { margin: 0; padding: 1rem; font: 16px/1.6 system-ui, sans-serif; color: #172554; background: #f8fafc; }
h1, h2, p { margin: 0 0 1rem; }
a { color: #3730a3; }
button, input, select, textarea { font: inherit; }
a:focus-visible, button:focus-visible { outline: 3px solid #0e7490; outline-offset: 3px; }
`
const seeds: z.input<typeof theoryLessonSchema>[] = [
  {
    id: 'm10',
    module: 10,
    name: 'Variables y funciones CSS',
    minutes: 16,
    objective:
      'Definir tokens reutilizables y elegir entre var(), calc(), min(), max() y clamp() para construir medidas adaptables.',
    explanation:
      'Las propiedades personalizadas reúnen decisiones de diseño. Las funciones permiten calcular medidas y limitar cómo crecen sin repetir reglas para cada pantalla.',
    ideas: [
      'Declara una propiedad con --nombre y consúmela con var(--nombre). Participa en la cascada y normalmente se hereda.',
      ':root sirve para los valores generales; una clase de tema puede redefinirlos en una zona concreta.',
      'calc() combina medidas compatibles. Los operadores + y - requieren espacios alrededor.',
      'min() elige la menor medida y max() la mayor. El porcentaje depende de la propiedad y de su contexto.',
      'clamp(mínimo, preferido, máximo) limita un valor flexible. En tipografía, combina rem y vw y comprueba el zoom.',
    ],
    sections: [
      {
        title: '1. De los valores repetidos a los tokens',
        paragraph:
          'Un token representa una decisión con nombre: color de acento, separación o radio. El componente expresa qué necesita y el tema proporciona el valor.',
        points: [
          'Escribe :root { --acento: #4338ca; } y usa color: var(--acento). Los nombres de propiedades personalizadas distinguen mayúsculas y minúsculas.',
          'Redefine --acento en .tema-bosque para modificar esa rama del DOM. No necesitas duplicar todas las reglas de botones y enlaces.',
          'var(--acento, #4338ca) ofrece un respaldo cuando la propiedad no está disponible. No corrige automáticamente un valor definido con un tipo inadecuado.',
        ],
      },
      {
        title: '2. Calcular, comparar y limitar medidas',
        paragraph:
          'Cada función responde a una pregunta distinta. Primero identifica la relación entre el contenido, su contenedor y el espacio disponible.',
        points: [
          'calc(100% - 2rem) resta dos rem a la base porcentual. En width, esa base suele ser el ancho del bloque contenedor.',
          'min(60rem, calc(100% - 2rem)) impone un máximo y deja margen lateral. max(1rem, 2vw) garantiza una separación mínima de un rem.',
          'clamp(1.5rem, 1rem + 3vw, 3rem) permite un título fluido entre dos límites. En este patrón, mantén el mínimo por debajo del máximo.',
        ],
      },
      {
        title: '3. Comprobar la adaptación',
        paragraph:
          'Una fórmula válida no garantiza por sí sola un buen diseño. El contenido y las preferencias del lector siguen siendo parte de la prueba.',
        points: [
          'Prueba anchos pequeños, intermedios y grandes, no solo dos extremos. Comprueba que las palabras largas no desbordan.',
          'Amplía el texto y prueba zoom al 200 %. Evita depender exclusivamente de vw para el tamaño de letra.',
          'Si --espacio vale rojo, padding: var(--espacio, 1rem) resulta inválido: el respaldo no sustituye ese valor solo por ser del tipo equivocado.',
        ],
      },
    ],
    example: {
      title: 'Una tarjeta con tokens, tema local y tipografía fluida',
      html: '<main class="contenedor">\n  <article class="tarjeta">\n    <h1>Un diseño que respira</h1>\n    <p>Los colores, el espacio y el ancho se coordinan desde CSS.</p>\n    <a href="#">Explorar el curso</a>\n  </article>\n  <article class="tarjeta tema-bosque">\n    <h2>El mismo componente, otro tema</h2>\n    <p>Solo redefinimos el acento en esta tarjeta.</p>\n    <a href="#">Ver el itinerario</a>\n  </article>\n</main>',
      css:
        base +
        `:root { --acento: #4338ca; --espacio: 1rem; --radio: .8rem; }
.contenedor { width: min(60rem, calc(100% - 2rem)); margin-inline: auto; }
.tarjeta { padding: max(1rem, 2vw); border: 2px solid var(--acento); border-radius: var(--radio); background: white; }
.tarjeta + .tarjeta { margin-top: var(--espacio); }
.tarjeta h1 { font-size: clamp(1.5rem, 1rem + 3vw, 3rem); line-height: 1.15; }
.tarjeta a { color: var(--acento, #4338ca); font-weight: 700; }
.tema-bosque { --acento: #166534; }`,
      steps: [
        'Cambia --acento en :root y observa qué tarjeta conserva su tema local.',
        'Alterna los anchos de prueba y compara el título, el relleno y el ancho del contenedor.',
        'Prueba otro límite máximo en clamp() y amplía el navegador para comprobar la lectura.',
      ],
      pitfall:
        'El respaldo de var() no valida el tipo de la declaración. Tampoco debes mezclar longitudes y valores sin unidad en una suma incompatible.',
    },
    links: [
      { label: 'Taller de variables', to: '/diseno/variables' },
      { label: 'Taller de clamp()', to: '/diseno/clamp' },
      { label: 'Taller de calc() y min()', to: '/diseno/calc' },
      { label: 'Juego de tipografía responsive', to: '/juego/responsive/responsive-tipografia' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Values_and_units/Using_math_functions',
    quiz: [
      {
        question: '¿Qué permite redefinir --acento dentro de .tema-bosque?',
        options: [
          'Cambiar el token en esa zona y sus descendientes que lo hereden.',
          'Modificar todos los documentos abiertos.',
          'Evitar cualquier regla de cascada.',
        ],
        answer: 0,
      },
      {
        question:
          '¿Qué expresión limita un ancho a 60rem sin superar el espacio disponible menos 2rem?',
        options: ['max(60rem, 100%)', 'min(60rem, calc(100% - 2rem))', 'calc(60rem + 100%)'],
        answer: 1,
      },
      {
        question: '¿Por qué conviene combinar rem y vw en un título fluido?',
        options: [
          'Porque hace innecesaria cualquier prueba.',
          'Porque convierte el texto en una imagen.',
          'Porque combina una referencia al tamaño raíz con otra al viewport, que todavía debes probar con zoom.',
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 'm11',
    module: 11,
    name: 'Dar formato a listas',
    minutes: 12,
    objective:
      'Elegir listas semánticas y controlar sus marcadores, sangrías y espaciado con reglas reutilizables.',
    explanation:
      'Una lista conserva las relaciones entre sus elementos aunque cambie su apariencia. Empieza por el significado y después diseña su ritmo visual.',
    ideas: [
      'Usa ul si el orden no es significativo, ol si representa una secuencia y dl para términos y descripciones.',
      'list-style-type define la viñeta o numeración; list-style-position cambia dónde se coloca respecto al contenido.',
      '::marker permite dar estilo al marcador, por ejemplo a su color y peso tipográfico.',
      'Controla la sangría con padding-inline-start y separa elementos sin añadir un margen inicial innecesario.',
      'Una lista anidada debe ir dentro de un li. El estilo visual no sustituye una estructura HTML válida.',
    ],
    sections: [
      {
        title: '1. Elegir la estructura',
        paragraph:
          'La etiqueta comunica una relación. No elijas ol solo porque quieres ver números ni escribas manualmente los números dentro de párrafos.',
        points: [
          'Un procedimiento con pasos ordenados corresponde a ol. Un grupo de características puede ser ul.',
          'Una lista puede contener otra, pero la lista interior pertenece a un elemento li de la exterior.',
          'Mantener li permite añadir o quitar elementos sin rehacer la numeración a mano.',
        ],
      },
      {
        title: '2. Diseñar el ritmo',
        paragraph:
          'Distingue el espacio del marcador, la sangría de la lista y la distancia entre sus elementos.',
        points: [
          'list-style-position: outside mantiene el marcador fuera de la caja principal del contenido y alinea las líneas de un elemento largo.',
          'padding-inline-start se adapta a la dirección de escritura mejor que una sangría ligada siempre al lado izquierdo.',
          'La regla .pasos > li + li separa elementos consecutivos y deja al primero sin margen superior adicional.',
        ],
      },
      {
        title: '3. Personalizar sin perder claridad',
        paragraph:
          'Un marcador destacado ayuda a seguir una secuencia, pero el texto debe seguir comunicando el contenido por sí mismo.',
        points: [
          '::marker admite propiedades concretas, como color y font-weight; no es una caja general donde aplicar cualquier relleno o tamaño.',
          'Si retiras las viñetas, conserva una indicación clara de que los elementos pertenecen a una lista y revisa la semántica accesible.',
          'Prueba un elemento con varias líneas y una lista anidada: suelen revelar problemas que una lista de palabras cortas oculta.',
        ],
      },
    ],
    example: {
      title: 'Un itinerario con numeración y subtareas',
      html: '<section>\n  <h1>Prepara tu interfaz</h1>\n  <ol class="pasos">\n    <li>Organiza el contenido en HTML.</li>\n    <li>Diseña los componentes.\n      <ul><li>Define el espacio.</li><li>Comprueba el contraste y el foco.</li></ul>\n    </li>\n    <li>Prueba la página con texto largo y en una pantalla pequeña.</li>\n  </ol>\n</section>',
      css:
        base +
        `.pasos { list-style-type: decimal-leading-zero; list-style-position: outside; padding-inline-start: 2.4rem; max-width: 42rem; }
.pasos > li { padding-inline-start: .5rem; }
.pasos > li + li { margin-block-start: 1rem; }
.pasos > li::marker { color: #4338ca; font-weight: 800; }
.pasos ul { list-style-type: square; padding-inline-start: 1.4rem; margin-block: .5rem; }
.pasos ul li::marker { color: #0e7490; }`,
      steps: [
        'Añade un cuarto paso y comprueba que la numeración se actualiza.',
        'Cambia outside por inside y observa un elemento que tenga varias líneas.',
        'Modifica el margen entre pasos y el color de ::marker sin cambiar el HTML.',
      ],
      pitfall:
        'No añadas números como texto si la estructura ya es una lista ordenada. No esperes que propiedades como padding funcionen sobre ::marker.',
    },
    links: [
      { label: 'Taller de listas', to: '/diseno/listas' },
      { label: 'Receta de separadores', to: '/ejemplos/separadores' },
      { label: 'Practicar posiciones en una lista', to: '/retos/m5' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Styling_lists',
    quiz: [
      {
        question: '¿Qué estructura es adecuada para pasos cuyo orden importa?',
        options: [
          'Párrafos con números escritos a mano.',
          'Una lista ol con elementos li.',
          'Una tabla sin cabeceras.',
        ],
        answer: 1,
      },
      {
        question: '¿Qué pseudoelemento da estilo a una viñeta o numeración?',
        options: ['::placeholder', '::before en todos los casos', '::marker'],
        answer: 2,
      },
      {
        question: '¿Qué consigue .pasos > li + li?',
        options: [
          'Separar los li consecutivos sin seleccionar el primero.',
          'Seleccionar únicamente el primer li.',
          'Seleccionar todos los descendientes de cualquier profundidad.',
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'm12',
    module: 12,
    name: 'Crear un menú con listas',
    minutes: 14,
    objective:
      'Construir una navegación con nav, ul, li y enlaces, adaptable al espacio y utilizable con teclado.',
    explanation:
      'Una navegación es una colección de destinos. Su HTML puede seguir siendo una lista mientras Flexbox cambia la distribución de los enlaces.',
    ideas: [
      'nav identifica una zona de navegación; ul y li agrupan sus destinos sin imponer un orden de pasos.',
      'El enlace a representa un destino. Un botón representa una acción: no intercambies ambos solo por su apariencia.',
      'Flexbox y gap permiten distribuir los elementos; flex-wrap evita que la navegación se salga del contenedor.',
      'aria-current="page" comunica el enlace de la página actual y permite diseñar su estado.',
      'Los estados :hover y :focus-visible deben conservar la lectura y la navegación mediante teclado.',
    ],
    sections: [
      {
        title: '1. Separar estructura y presentación',
        paragraph:
          'Elimina el estilo de lista solo en la navegación que lo necesita. Una regla global sobre todos los ul también afectaría a las listas del contenido.',
        points: [
          'Usa un nombre de clase como .menu para acotar el componente. Si hay varias navegaciones, identifica cada nav con un nombre accesible.',
          'Los li agrupan enlaces. El contenedor ul es el que reparte el espacio con display: flex.',
          'No necesitas tablas ni espacios escritos a mano para alinear destinos.',
        ],
      },
      {
        title: '2. Diseñar los enlaces y sus estados',
        paragraph:
          'El área interactiva debe pertenecer al enlace completo, no solo al pequeño texto que contiene.',
        points: [
          'display: block y padding en el a amplían el área de interacción dentro de cada li.',
          'Aplica :hover y :focus-visible de manera coherente. No elimines el contorno de foco sin una señal equivalente.',
          'Un selector de atributo como a[aria-current="page"] diferencia el destino actual; CSS representa el estado, pero la aplicación debe actualizarlo al navegar.',
        ],
      },
      {
        title: '3. Adaptar el menú',
        paragraph:
          'En una pantalla pequeña los enlaces pueden saltar de línea o formar una columna. El contenido determina cuándo cambiar la composición.',
        points: [
          'flex-wrap: wrap mantiene todos los destinos disponibles cuando no caben en una fila.',
          'Una media query puede cambiar flex-direction a column, pero el orden de lectura debe seguir el orden del DOM.',
          'Un menú desplegable o una hamburguesa requiere también comportamiento y gestión de foco; una lista con CSS no resuelve por sí sola esas interacciones.',
        ],
      },
    ],
    example: {
      title: 'Una navegación que pasa de fila a columna',
      html: '<nav aria-label="Secciones del curso">\n  <ul class="menu" role="list">\n    <li><a href="#inicio" aria-current="page">Inicio</a></li>\n    <li><a href="#lecciones">Lecciones</a></li>\n    <li><a href="#laboratorio">Laboratorio</a></li>\n    <li><a href="#proyectos">Proyectos</a></li>\n  </ul>\n</nav>\n<p>Ejemplo de estados y distribución: recorre los enlaces con Tab.</p>',
      css:
        base +
        `.menu { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0 0 1rem; padding: 0; }
.menu > li > a { display: block; padding: .75rem 1rem; border: 1px solid #a5b4fc; border-radius: .5rem; text-decoration: none; }
.menu a:is(:hover, :focus-visible) { background: #e0e7ff; }
.menu a[aria-current="page"] { color: white; background: #4338ca; font-weight: 700; text-decoration: underline; }
@media (max-width: 30rem) { .menu { flex-direction: column; } }`,
      steps: [
        'Recorre la navegación con Tab y comprueba el foco de cada enlace.',
        'Alterna 375 y 768 px para observar la columna y la fila.',
        'Mueve aria-current="page" a otro enlace y comprueba qué regla representa el estado actual.',
      ],
      pitfall:
        'CSS no cambia el destino actual por pulsar un enlace. No uses order para que el menú se lea visualmente en un orden distinto al del teclado.',
    },
    links: [
      { label: 'Receta de navegación actual', to: '/ejemplos/navegacion-actual' },
      { label: 'Juego de navegación responsive', to: '/juego/responsive/responsive-navegacion' },
      { label: 'Taller de Flexbox', to: '/diseno/flexbox' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Typical_use_cases_of_flexbox',
    quiz: [
      {
        question: '¿Dónde aplicarías display: flex para repartir los elementos de esta lista?',
        options: [
          'En todos los párrafos del documento.',
          'Únicamente en ::marker.',
          'En el ul del menú.',
        ],
        answer: 2,
      },
      {
        question: '¿Qué expresa aria-current="page"?',
        options: [
          'Que ese enlace representa la página actual.',
          'Que el enlace está deshabilitado.',
          'Que CSS debe ejecutar una navegación.',
        ],
        answer: 0,
      },
      {
        question: '¿Qué hace flex-wrap: wrap?',
        options: [
          'Ocultar enlaces sobrantes.',
          'Permitir nuevas líneas cuando falta espacio.',
          'Cambiar automáticamente el orden del DOM.',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'm13',
    module: 13,
    name: 'Dar formato a una tabla',
    minutes: 15,
    objective:
      'Diseñar tablas de datos claras, con cabeceras asociadas, alineación coherente y desplazamiento horizontal local cuando sea necesario.',
    explanation:
      'Una tabla explica relaciones entre filas y columnas. CSS debe ayudar a leer esas relaciones y mantener la estructura comprensible en pantallas pequeñas.',
    ideas: [
      'table es adecuada para datos tabulares; no la utilices como sistema general para maquetar una página.',
      'caption da contexto; th y scope distinguen las cabeceras de fila y de columna.',
      'border-collapse: collapse une bordes contiguos y el padding de las celdas mejora la lectura.',
      'Las filas alternas y la alineación numérica facilitan seguir datos sin depender solo del color.',
      'Un contenedor con overflow-x: auto puede desplazar la tabla sin hacer que toda la página desborde.',
    ],
    sections: [
      {
        title: '1. Organizar los datos',
        paragraph:
          'La apariencia no sustituye las asociaciones del HTML. Define primero qué representa cada eje.',
        points: [
          'Agrupa cabeceras en thead y datos en tbody. Un caption ofrece un título específico a la tabla.',
          'Usa th scope="col" en las cabeceras superiores y th scope="row" en el nombre de cada fila.',
          'Evita celdas combinadas innecesarias: una tabla simple suele ser más fácil de recorrer y comprender.',
        ],
      },
      {
        title: '2. Dar jerarquía y ritmo',
        paragraph:
          'Destaca las cabeceras, deja espacio en las celdas y alinea cada tipo de dato con un criterio consistente.',
        points: [
          'border-collapse: collapse evita una doble cuadrícula cuando las celdas tienen bordes.',
          'Alinea etiquetas al inicio y cantidades al final. font-variant-numeric: tabular-nums ayuda cuando la fuente ofrece cifras de ancho uniforme.',
          'tbody tr:nth-child(even) alterna filas. Cuenta posiciones dentro de tbody, independientemente de la fila de thead.',
        ],
      },
      {
        title: '3. Mantener la lectura en móvil',
        paragraph:
          'Cuando varias columnas necesitan un ancho mínimo para conservar su significado, el desplazamiento local suele ser más claro que comprimir todo el contenido.',
        points: [
          'Envuelve la tabla en una región con overflow-x: auto y un nombre accesible. Permite que esa región reciba foco para poder desplazarla con teclado.',
          'Comprueba que solo la zona de datos se desplaza. El resto de la página debe seguir cabiendo en el viewport.',
          'No conviertas tr y td en bloques sin revisar las asociaciones de cabecera y el comportamiento accesible.',
        ],
      },
    ],
    example: {
      title: 'Calificaciones con cabeceras, filas alternas y scroll local',
      html: '<div class="tabla-scroll" tabindex="0" role="region" aria-label="Calificaciones, tabla desplazable">\n  <table class="notas">\n    <caption>Resultados del taller CSS</caption>\n    <thead><tr><th scope="col">Estudiante</th><th scope="col">Selectores</th><th scope="col">Diseño</th></tr></thead>\n    <tbody>\n      <tr><th scope="row">Ana</th><td>8</td><td>9</td></tr>\n      <tr><th scope="row">Luis</th><td>7</td><td>8</td></tr>\n      <tr><th scope="row">Sara</th><td>9</td><td>10</td></tr>\n    </tbody>\n  </table>\n</div>',
      css:
        base +
        `.tabla-scroll { max-width: 100%; overflow-x: auto; border: 1px solid #94a3b8; border-radius: .6rem; }
.tabla-scroll:focus-visible { outline: 3px solid #4338ca; outline-offset: 3px; }
.notas { width: 100%; min-width: 32rem; border-collapse: collapse; }
.notas caption { padding: 1rem; text-align: start; font-weight: 700; }
.notas :is(th, td) { padding: .8rem 1rem; border-bottom: 1px solid #cbd5e1; }
.notas th { text-align: start; }
.notas td { text-align: end; font-variant-numeric: tabular-nums; }
.notas thead { background: #e0e7ff; }
.notas tbody tr:nth-child(even) { background: #eef2ff; }`,
      steps: [
        'Prueba el ancho de 375 px y desplaza solo el contenedor de la tabla.',
        'Añade una fila y comprueba la alternancia de nth-child(even).',
        'Cambia la alineación de las notas y compara la facilidad para leer una columna.',
      ],
      pitfall:
        'No cuentes solo las td al usar nth-child(): una th de cabecera de fila también ocupa una posición entre los hijos del tr.',
    },
    links: [
      { label: 'Taller de tablas', to: '/diseno/tablas' },
      { label: 'Juego de celdas, filas y columnas', to: '/juego/tablas' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Tables',
    quiz: [
      {
        question: '¿Qué mantiene el desplazamiento horizontal dentro de la tabla?',
        options: [
          'overflow-x: auto en su contenedor.',
          'Un width fijo mayor que la pantalla en body.',
          'Quitar todas las cabeceras.',
        ],
        answer: 0,
      },
      {
        question: '¿Qué representa th scope="row"?',
        options: [
          'Una celda decorativa.',
          'La cabecera de su fila.',
          'Una instrucción para ocultar la fila.',
        ],
        answer: 1,
      },
      {
        question: '¿Qué cuenta tbody tr:nth-child(even)?',
        options: [
          'También la fila de thead como primera fila.',
          'Solo las celdas td de cada fila.',
          'Las posiciones pares de tr dentro de su tbody.',
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 'm14',
    module: 14,
    name: 'Dar formato a un formulario',
    minutes: 16,
    objective:
      'Distribuir campos y etiquetas, diseñar foco y estados, y conservar controles comprensibles en distintos tamaños de pantalla.',
    explanation:
      'Un formulario debe dejar claro qué se pide, cómo introducirlo y qué necesita revisión. El diseño visual acompaña las etiquetas y restricciones del HTML.',
    ideas: [
      'Asocia cada label con su control mediante for e id. El placeholder es una ayuda, no sustituye a la etiqueta.',
      'Agrupa campos relacionados con fieldset y legend; usa gap para dar un ritmo consistente.',
      'Aplica width: 100% solo a los controles que deban ocupar la fila, no indiscriminadamente a radios y casillas.',
      'Conserva el foco visible y acompaña errores y estados con texto comprensible.',
      'CSS representa estados; la aplicación y el servidor siguen siendo responsables de procesar y validar el envío.',
    ],
    sections: [
      {
        title: '1. Diseñar la estructura de los campos',
        paragraph:
          'El HTML proporciona el nombre, el propósito y las restricciones de cada control. CSS organiza su presentación sin retirar esa información.',
        points: [
          'Usa tipos apropiados, como email, y autocomplete cuando corresponda. La etiqueta visible debe seguir presente al escribir.',
          'Un fieldset con legend expresa que varios campos pertenecen al mismo grupo.',
          'Asocia las instrucciones mediante aria-describedby cuando deban acompañar a un control concreto.',
        ],
      },
      {
        title: '2. Crear una distribución coherente',
        paragraph:
          'Una columna suele facilitar la lectura de formularios breves. Un contenedor Grid permite separar los grupos sin añadir márgenes a cada elemento.',
        points: [
          'display: grid y gap en el formulario o en fieldset reparten el espacio de forma predecible.',
          'En campos de texto utiliza width: 100%, min-width: 0 y box-sizing: border-box para evitar desbordamientos.',
          'Identifica las casillas por separado para conservar su tamaño y alineación con la etiqueta.',
        ],
      },
      {
        title: '3. Foco, errores y envío',
        paragraph:
          'El cambio de estado debe ser perceptible y comprensible. Un borde rojo por sí solo no explica qué dato falta o cómo corregirlo.',
        points: [
          ':focus-visible destaca la entrada de teclado. :focus-within puede resaltar el grupo que contiene el control enfocado.',
          'La combinación :invalid:not(:placeholder-shown) del ejemplo señala un correo no vacío que incumple el tipo email. No la confundas con una gestión completa de errores.',
          'Añade mensajes claros y conserva el valor escrito. En un producto real, comprueba también los datos en el servidor; el ejemplo de esta lección no envía información.',
        ],
      },
    ],
    example: {
      title: 'Un formulario de inscripción con etiquetas y estados',
      html: '<form class="registro" aria-label="Inscripción de ejemplo">\n  <fieldset>\n    <legend>Tu inscripción</legend>\n    <label class="campo" for="nombre">Nombre<input id="nombre" name="nombre" type="text" autocomplete="name" required></label>\n    <label class="campo" for="correo">Correo<input id="correo" name="correo" type="email" autocomplete="email" placeholder="nombre@ejemplo.es" aria-describedby="ayuda-correo" required></label>\n    <p id="ayuda-correo">Escribe una dirección que incluya @ y un dominio.</p>\n    <label class="casilla"><input type="checkbox" name="avisos">Quiero recibir avisos del taller.</label>\n  </fieldset>\n  <button type="button">Inscribirme · Demostración sin envío</button>\n</form>',
      css:
        base +
        `.registro { display: grid; gap: 1rem; width: min(100%, 30rem); margin-inline: auto; }
.registro fieldset { display: grid; gap: 1rem; min-width: 0; padding: 1rem; border: 2px solid #94a3b8; border-radius: .7rem; }
.registro legend { padding-inline: .4rem; font-weight: 800; }
.campo { display: grid; gap: .4rem; font-weight: 600; }
.campo input { width: 100%; min-width: 0; padding: .7rem; border: 2px solid #64748b; border-radius: .4rem; background: white; }
.campo input:focus-visible { outline: 3px solid #0e7490; outline-offset: 2px; }
.registro fieldset:focus-within { border-color: #4338ca; }
.campo input[type="email"]:invalid:not(:placeholder-shown) { border-color: #b91c1c; }
.casilla { display: flex; align-items: baseline; gap: .6rem; }
.casilla input { accent-color: #4338ca; }
.registro p { margin: 0; font-size: .9rem; }
.registro button { padding: .75rem; border: 0; border-radius: .5rem; color: white; background: #4338ca; }`,
      steps: [
        'Recorre los controles con Tab y comprueba el foco del campo y del grupo.',
        'Escribe un correo incompleto y luego uno válido; observa el borde sin perder la etiqueta.',
        'Prueba 375 px y confirma que la casilla mantiene su tamaño mientras los campos ocupan su fila.',
      ],
      pitfall:
        'Evita input { width: 100%; } si también contiene casillas o radios. El borde de error del ejemplo no sustituye a los mensajes de validación de una aplicación.',
    },
    links: [
      { label: 'Taller de formularios', to: '/diseno/formularios' },
      { label: 'Receta de foco en el contenedor', to: '/ejemplos/foco-contenedor' },
      { label: 'Receta de validación visual', to: '/ejemplos/errores-formulario' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Styling_web_forms',
    quiz: [
      {
        question: '¿Qué debe identificar el campo cuando ya tiene un valor escrito?',
        options: [
          'Solo el placeholder.',
          'Una etiqueta label asociada.',
          'Únicamente el color de su borde.',
        ],
        answer: 1,
      },
      {
        question: '¿Por qué no conviene aplicar width: 100% a todos los input?',
        options: [
          'Porque CSS no permite diseñar formularios.',
          'Porque obliga a usar JavaScript.',
          'Porque también afectaría a radios y casillas que no deben ocupar una fila completa.',
        ],
        answer: 2,
      },
      {
        question: '¿Qué responsabilidad sigue existiendo aunque CSS marque un campo inválido?',
        options: [
          'Validar y procesar adecuadamente los datos en la aplicación y el servidor.',
          'Cambiar todas las etiquetas por imágenes.',
          'Eliminar el foco del teclado.',
        ],
        answer: 0,
      },
    ],
  },
  {
    id: 'm15',
    module: 15,
    name: 'Uso adecuado de Flexbox',
    minutes: 18,
    objective:
      'Elegir Flexbox para distribuciones de un eje, controlar crecimiento y alineación, y evitar alteraciones del orden de lectura.',
    explanation:
      'Flexbox resulta útil para repartir elementos a lo largo de una fila o columna. Define primero el eje, después el comportamiento del espacio y finalmente la adaptación.',
    ideas: [
      'Flexbox organiza un eje principal y otro transversal; su orientación depende de flex-direction.',
      'justify-content distribuye espacio en el eje principal y align-items alinea en el transversal.',
      'flex combina crecimiento, contracción y tamaño base mediante grow, shrink y basis.',
      'flex-wrap crea líneas nuevas, pero cada línea distribuye su espacio de forma independiente.',
      'Si necesitas coordinar filas y columnas entre sí, considera Grid. Conserva siempre un orden lógico en el HTML.',
    ],
    sections: [
      {
        title: '1. Cuándo elegir Flexbox',
        paragraph:
          'Úsalo cuando la relación principal sea una secuencia: una barra de herramientas, una navegación, una fila de acciones o un grupo de tarjetas que puede envolver.',
        points: [
          'display: flex convierte en elementos flexibles a los hijos directos del contenedor, no a todos sus descendientes.',
          'Con row, el eje principal sigue la dirección de la fila. Con column, pasa a ser vertical; las propiedades de alineación cambian de orientación.',
          'No intentes coordinar una cuadrícula completa con anchos calculados y saltos forzados si Grid expresa mejor el problema.',
        ],
      },
      {
        title: '2. Repartir tamaños y espacio',
        paragraph:
          'Distingue el tamaño base de cada elemento del espacio que queda para repartir. La alineación no sustituye a una política de crecimiento.',
        points: [
          'flex: 1 1 14rem permite crecer, contraerse y partir de una base de catorce rem. flex-basis no equivale a un ancho fijo en todos los ejes.',
          'gap fija una separación entre elementos; justify-content: space-between distribuye el espacio libre que quede entre ellos.',
          'Un elemento con contenido largo puede necesitar min-width: 0 para poder contraerse. Comprueba también cómo se parten las palabras.',
        ],
      },
      {
        title: '3. Adaptar sin romper el orden',
        paragraph:
          'La distribución visual debe acompañar al contenido. Ordenar elementos solo con CSS no cambia la secuencia que siguen el teclado y otras formas de lectura.',
        points: [
          'flex-wrap: wrap permite varias líneas. Los elementos de líneas distintas no mantienen necesariamente columnas alineadas.',
          'align-items trabaja sobre los elementos de una línea; align-content distribuye las líneas cuando hay varias y sobra espacio transversal.',
          'Evita usar order o row-reverse para comunicar un orden distinto al que tiene el DOM. Prueba contenido real y varios anchos.',
        ],
      },
    ],
    example: {
      title: 'Una página con cabecera y tarjetas flexibles',
      html: '<header class="cabecera">\n  <h1>Aula CSS</h1>\n  <nav aria-label="Curso"><a href="#">Lecciones</a> · <a href="#">Proyectos</a></nav>\n</header>\n<main>\n  <h2>Elige tu recorrido</h2>\n  <section class="tarjetas" aria-label="Recorridos">\n    <article><h2>Aprende</h2><p>Fundamentos para tomar buenas decisiones de diseño.</p><a href="#">Ver lecciones</a></article>\n    <article><h2>Construye</h2><p>Ejemplos y proyectos con contenido de distintas longitudes.</p><a href="#">Ver proyectos</a></article>\n    <article><h2>Comparte</h2><p>Explica lo que has creado.</p><a href="#">Ver ideas</a></article>\n  </section>\n</main>\n<footer>Un proyecto educativo</footer>',
      css:
        base +
        `.cabecera { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; padding-block: 1rem; }
.cabecera h1 { margin: 0; }
main { margin-block: 1rem; }
.tarjetas { display: flex; flex-wrap: wrap; gap: 1rem; }
.tarjetas > article { display: flex; flex-direction: column; flex: 1 1 14rem; min-width: 0; padding: 1rem; border: 1px solid #a5b4fc; border-radius: .7rem; background: white; }
.tarjetas article h2 { font-size: 1.3rem; }
.tarjetas article a { margin-top: auto; padding-top: 1rem; font-weight: 700; }
footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #cbd5e1; }`,
      steps: [
        'Alterna 375, 768 y 1200 px y observa cuándo cambian las líneas de tarjetas.',
        'Cambia el tamaño base de 14rem a 20rem y compara el número de tarjetas por fila.',
        'Añade texto a una tarjeta y comprueba cómo margin-top: auto mantiene sus acciones al final de la columna.',
      ],
      pitfall:
        'Las líneas de Flexbox son independientes: no prometen la alineación bidimensional de Grid. No arregles el orden de lectura solo con order.',
    },
    links: [
      { label: 'Taller de Flexbox', to: '/diseno/flexbox' },
      { label: 'Juego de Flexbox', to: '/juego/flexbox' },
      { label: 'Comparar con CSS Grid', to: '/teoria/m16' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox',
    quiz: [
      {
        question: '¿Qué problema encaja especialmente bien con Flexbox?',
        options: [
          'Coordinar simultáneamente todas las filas y columnas de una rejilla.',
          'Crear cabeceras de una tabla de datos.',
          'Distribuir una secuencia de elementos en una fila o columna.',
        ],
        answer: 2,
      },
      {
        question: '¿Qué representa 14rem en flex: 1 1 14rem?',
        options: [
          'El tamaño base a partir del que se reparte el espacio.',
          'El número máximo de elementos.',
          'Una separación obligatoria entre líneas.',
        ],
        answer: 0,
      },
      {
        question: '¿Por qué debes usar order con cuidado?',
        options: [
          'Porque siempre elimina elementos del DOM.',
          'Porque cambia la disposición visual, pero no el orden del DOM y de lectura.',
          'Porque solo funciona en tablas.',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'm16',
    module: 16,
    name: 'Uso adecuado de CSS Grid',
    minutes: 18,
    objective:
      'Construir composiciones de filas y columnas, elegir pistas y áreas y combinar Grid con Flexbox cuando sus responsabilidades sean distintas.',
    explanation:
      'Grid relaciona dos dimensiones: filas y columnas. Permite expresar la estructura de una página y distribuir colecciones sin depender de anchos calculados a mano.',
    ideas: [
      'Usa Grid cuando quieras coordinar filas y columnas, no solo repartir una secuencia en un eje.',
      'grid-template-columns y grid-template-rows definen pistas explícitas; repeat() evita repetir medidas.',
      'fr reparte espacio disponible. minmax() combina un mínimo y un máximo de pista.',
      'Las áreas nombradas describen regiones rectangulares y hacen legible la composición de una página.',
      'Grid y Flexbox se complementan: puedes usar Grid en la estructura y Flexbox dentro de una navegación o tarjeta.',
    ],
    sections: [
      {
        title: '1. Pensar en pistas y límites',
        paragraph:
          'Dibuja qué filas y columnas deben guardar relación. Después decide cuáles tienen tamaño flexible y cuáles responden al contenido.',
        points: [
          'repeat(3, 1fr) crea tres columnas flexibles iguales. gap añade espacio entre pistas.',
          'minmax(0, 1fr) puede evitar que el mínimo automático de una pista flexible imponga un ancho excesivo por su contenido. Revisa también min-width: 0 y el ajuste de texto en los elementos.',
          'Si no declaras todas las filas, Grid crea pistas implícitas para el contenido restante. grid-auto-rows permite definir su comportamiento.',
        ],
      },
      {
        title: '2. Áreas de página y adaptación',
        paragraph:
          'Los nombres de área describen la intención de cada región. El CSS base puede mantener una sola columna y ampliar la composición cuando haya espacio.',
        points: [
          'Cada cadena de grid-template-areas representa una fila. Las repeticiones de un nombre deben formar un rectángulo.',
          'Asigna cada elemento con grid-area y define las columnas junto a las áreas. Una media query puede cambiar ambas.',
          'La colocación visual no cambia el orden del DOM: organiza primero una lectura lógica que funcione también en una columna.',
        ],
      },
      {
        title: '3. Galerías y combinación de herramientas',
        paragraph:
          'Una página puede necesitar una rejilla exterior y otra interior. Elige cada sistema según la relación entre sus elementos.',
        points: [
          'repeat(auto-fit, minmax(min(100%, 12rem), 1fr)) crea las columnas que caben y limita el mínimo al espacio disponible.',
          'auto-fit colapsa las pistas vacías; no equivale siempre a un número fijo de columnas.',
          'Usa Flexbox para una fila de acciones dentro de una tarjeta Grid. Evita imponer dos sistemas al mismo contenedor sin una razón clara.',
        ],
      },
    ],
    example: {
      title: 'Una página por áreas con una galería adaptable',
      html: '<div class="pagina">\n  <header><h1>Revista de proyectos</h1><p>Una página organizada con Grid.</p></header>\n  <main><h2>Últimos trabajos</h2>\n    <section class="galeria" aria-label="Proyectos">\n      <article><h3>Editorial</h3><p>Una publicación digital.</p></article>\n      <article><h3>Portfolio</h3><p>Una colección de proyectos.</p></article>\n      <article><h3>Agenda</h3><p>Encuentros de la comunidad.</p></article>\n    </section>\n  </main>\n  <aside><h2>Para continuar</h2><p>Explora nuevas ideas de diseño.</p></aside>\n  <footer>CSS para todos los tamaños</footer>\n</div>',
      css:
        base +
        `.pagina { display: grid; gap: 1rem; grid-template-columns: minmax(0, 1fr); grid-template-areas: "cabecera" "contenido" "lateral" "pie"; }
.pagina > * { min-width: 0; padding: 1rem; border: 1px solid #a5b4fc; border-radius: .6rem; background: white; }
.pagina > header { grid-area: cabecera; background: #e0e7ff; }
.pagina > main { grid-area: contenido; }
.pagina > aside { grid-area: lateral; background: #fef3c7; }
.pagina > footer { grid-area: pie; }
.galeria { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); }
.galeria article { padding: 1rem; border: 1px solid #cbd5e1; border-radius: .5rem; }
.galeria h3 { margin: 0 0 .5rem; }
@media (min-width: 48rem) { .pagina { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); grid-template-areas: "cabecera cabecera" "contenido lateral" "pie pie"; } }`,
      steps: [
        'Compara 375 y 1200 px: el lateral cambia de debajo del contenido a una columna contigua.',
        'Cambia las columnas de la media query y observa que las áreas conservan su nombre y función.',
        'Añade más proyectos a .galeria y comprueba cómo se crean filas sin modificar el CSS.',
      ],
      pitfall:
        'Una región nombrada debe ser rectangular. No confundas el orden visual de las áreas con el orden de lectura del DOM.',
    },
    links: [
      { label: 'Taller de CSS Grid', to: '/diseno/grid' },
      { label: 'Juego de CSS Grid', to: '/juego/grid' },
      { label: 'Juego de página responsive', to: '/juego/responsive/responsive-pagina' },
      { label: 'Comparar con Flexbox', to: '/teoria/m15' },
    ],
    reference:
      'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout',
    quiz: [
      {
        question: '¿Cuándo conviene especialmente Grid?',
        options: [
          'Cuando hay que coordinar filas y columnas.',
          'Cuando solo quieres cambiar el color de un enlace.',
          'Cuando quieres eliminar el HTML semántico.',
        ],
        answer: 0,
      },
      {
        question: '¿Qué condición debe cumplir un área nombrada que ocupa varias celdas?',
        options: [
          'Puede tener cualquier forma discontinua.',
          'Debe formar una región rectangular.',
          'Debe llamarse siempre main.',
        ],
        answer: 1,
      },
      {
        question: '¿Qué hacen Grid y Flexbox en una misma página?',
        options: [
          'Se excluyen y nunca deben combinarse.',
          'Cambian automáticamente el orden del DOM.',
          'Pueden resolver responsabilidades distintas, como la rejilla exterior y una fila de acciones interior.',
        ],
        answer: 2,
      },
    ],
  },
]
export const practicalLessons: TheoryLesson[] = seeds.map((lesson) =>
  theoryLessonSchema.parse(lesson),
)
