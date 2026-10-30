import { z } from 'zod'
import { workshopIds } from './designProgress'

export const workshopSchema = z.object({
  id: z.enum(workshopIds),
  title: z.string(),
  category: z.string(),
  summary: z.string(),
  minutes: z.number().int().positive(),
  concepts: z.array(z.string()).min(3),
  steps: z.array(z.string()).min(3),
  pitfall: z.string(),
  html: z.string(),
  baseCss: z.string(),
  task: z.string(),
  starter: z.string(),
  solution: z.string(),
  checks: z
    .array(
      z.object({
        selector: z.string(),
        property: z.string(),
        value: z.string(),
        media: z.string().optional(),
      }),
    )
    .min(1),
  question: z.string(),
  options: z.array(z.string()).length(3),
  correct: z.number().int().min(0).max(2),
  reason: z.string(),
  source: z.string().url(),
})
export type Workshop = z.infer<typeof workshopSchema>
const mdn = 'https://developer.mozilla.org/en-US/docs/Web/CSS/'
// Shared presentation only: the exercise declarations are deliberately absent.
const base =
  '* {\n  box-sizing: border-box;\n}\nbody {\n  margin: 0;\n  padding: 1rem;\n  font-family: system-ui, sans-serif;\n  color: #172554;\n  background: #f8fafc;\n  line-height: 1.5;\n}\nh1,\nh2,\np {\n  margin: 0 0 1rem;\n}\na {\n  color: #3730a3;\n}\nbutton,\ninput,\nselect {\n  font: inherit;\n}\nbutton {\n  padding: 0.65rem 1rem;\n  border: 2px solid #4338ca;\n  border-radius: 0.5rem;\n  background: #4338ca;\n  color: white;\n}\nbutton:focus-visible,\na:focus-visible,\ninput:focus-visible {\n  outline: 3px solid #0e7490;\n  outline-offset: 3px;\n}\narticle {\n  padding: 1rem;\n  background: white;\n  border: 1px solid #a5b4fc;\n  border-radius: 0.75rem;\n}\narticle + article {\n  margin-top: 0.75rem;\n}\n'
const seeds: Workshop[] = [
  {
    id: 'tablas',
    title: 'Tablas legibles y adaptables',
    category: 'Componentes',
    minutes: 15,
    summary:
      'Diseña una tabla de calificaciones con cabeceras, filas alternas y desplazamiento local.',
    concepts: [
      'Usa table para datos relacionados, caption para el título y th con scope para asociar cabeceras.',
      'border-collapse combina bordes contiguos; el relleno de las celdas crea un ritmo legible.',
      'Un contenedor con overflow-x: auto permite desplazar la tabla sin desbordar toda la página.',
    ],
    steps: [
      'Observa la separación entre celdas antes de completar el CSS.',
      'Añade las dos declaraciones solicitadas y comprueba las filas alternas.',
      'Prueba 375 px: solo el contenedor de la tabla debe poder desplazarse.',
    ],
    pitfall:
      'No conviertas tr y td en bloques para forzar una vista móvil sin revisar la semántica y las asociaciones de cabecera.',
    html: '<div\n  class="tabla-scroll"\n  tabindex="0"\n  role="region"\n  aria-label="Calificaciones, desplazamiento horizontal"\n>\n  <table class="notas">\n    <caption>\n      Resultados de CSS · Primera evaluación\n    </caption>\n    <thead>\n      <tr>\n        <th scope="col">Estudiante</th>\n        <th scope="col">Selectores</th>\n        <th scope="col">Diseño</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <th scope="row">Ana</th>\n        <td>8</td>\n        <td>9</td>\n      </tr>\n      <tr>\n        <th scope="row">Luis</th>\n        <td>7</td>\n        <td>8</td>\n      </tr>\n      <tr>\n        <th scope="row">Sara</th>\n        <td>9</td>\n        <td>10</td>\n      </tr>\n    </tbody>\n  </table>\n</div>',
    baseCss:
      base +
      '.notas {\n  width: 100%;\n  min-width: 32rem;\n}\ncaption {\n  padding: 1rem;\n  text-align: left;\n  font-weight: 700;\n}\nth,\ntd {\n  padding: 0.8rem;\n  text-align: left;\n  border: 1px solid #94a3b8;\n}\nthead {\n  background: #e0e7ff;\n}\ntbody tr:nth-child(even) {\n  background: #eef2ff;\n}',
    task: 'En .notas declara border-collapse: collapse. En .tabla-scroll declara overflow-x: auto.',
    starter:
      '.notas {\n  /* Une los bordes de la tabla. */\n}\n.tabla-scroll {\n  /* Permite el desplazamiento horizontal local. */\n}',
    solution: '.notas {\n  border-collapse: collapse;\n}\n.tabla-scroll {\n  overflow-x: auto;\n}',
    checks: [
      { selector: '.notas', property: 'border-collapse', value: 'collapse' },
      { selector: '.tabla-scroll', property: 'overflow-x', value: 'auto' },
    ],
    question: '¿Dónde debe aparecer el desplazamiento horizontal en móvil?',
    options: ['En toda la página', 'En el contenedor de la tabla', 'En cada celda por separado'],
    correct: 1,
    reason: 'El contenedor conserva la estructura de tabla y limita el desplazamiento a los datos.',
    source: mdn + 'overflow-x',
  },
  {
    id: 'formularios',
    title: 'Formularios con foco y estados',
    category: 'Componentes',
    minutes: 15,
    summary: 'Construye un formulario con etiquetas, distribución coherente y foco visible.',
    concepts: [
      'Un label asociado mediante for e id identifica el control; el placeholder no lo sustituye.',
      'Grid y gap separan los campos sin márgenes dispersos. Los controles deben caber en su contenedor.',
      ':focus-visible muestra una señal de teclado. Los estados de error necesitan texto, además de color.',
    ],
    steps: [
      'Recorre el formulario con Tab y escribe un correo.',
      'Distribuye .registro con Grid y una separación de 1rem.',
      'Comprueba el foco y el ajuste del formulario a 375 px. Este ejemplo no envía datos.',
    ],
    pitfall:
      'No elimines outline sin un indicador equivalente. CSS muestra estados, pero la validación y el envío definitivos corresponden a la aplicación y al servidor.',
    html: '<form class="registro" aria-label="Inscripción de ejemplo">\n  <h2>Apúntate al taller</h2>\n  <label for="nombre"\n    >Nombre\n    <input id="nombre" name="nombre" autocomplete="name" required\n  /></label>\n  <label for="correo"\n    >Correo\n    <input\n      id="correo"\n      name="correo"\n      type="email"\n      autocomplete="email"\n      aria-describedby="ayuda"\n      required\n  /></label>\n  <p id="ayuda">Usa una dirección con @. Ejemplo sin envío de datos.</p>\n  <button type="button">Inscribirme · Demostración</button>\n</form>',
    baseCss:
      base +
      '.registro {\n  max-width: 30rem;\n  margin-inline: auto;\n}\n.registro label {\n  display: grid;\n  gap: 0.4rem;\n  font-weight: 600;\n}\n.registro input {\n  width: 100%;\n  min-width: 0;\n  padding: 0.65rem;\n  border: 2px solid #64748b;\n  border-radius: 0.4rem;\n  background: white;\n}\n.registro input:focus-visible {\n  border-color: #4338ca;\n}\n.registro p {\n  font-size: 0.9rem;\n}',
    task: 'En .registro declara display: grid y gap: 1rem.',
    starter: '.registro {\n  /* Distribuye los campos y añade separación. */\n}',
    solution: '.registro {\n  display: grid;\n  gap: 1rem;\n}',
    checks: [
      { selector: '.registro', property: 'display', value: 'grid' },
      { selector: '.registro', property: 'gap', value: '1rem' },
    ],
    question: '¿Qué identifica correctamente un campo?',
    options: ['Solo su placeholder', 'Un borde de color', 'Un label asociado al control'],
    correct: 2,
    reason:
      'La etiqueta permanece visible al escribir y proporciona un nombre accesible al control.',
    source:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Styling_web_forms',
  },
  {
    id: 'listas',
    title: 'Listas y pasos con personalidad',
    category: 'Componentes',
    minutes: 10,
    summary: 'Da estilo a un itinerario ordenado sin escribir los números a mano.',
    concepts: [
      'Usa ol cuando importa el orden y ul cuando no importa.',
      '::marker permite cambiar el color y el peso de la numeración conservando la lista.',
      'El espacio se aplica a los li; ::marker admite un conjunto limitado de propiedades.',
    ],
    steps: [
      'Lee el itinerario como una secuencia ordenada.',
      'Haz que .pasos > li::marker use font-weight: 700.',
      'Añade un cuarto li en el Laboratorio: la numeración se actualiza automáticamente.',
    ],
    pitfall:
      'No uses un párrafo con números escritos a mano como sustituto de una lista semántica.',
    html: '<h2>Tu itinerario de diseño</h2>\n<ol class="pasos">\n  <li>Organiza el contenido en HTML.</li>\n  <li>Define el espacio y la distribución.</li>\n  <li>Comprueba teclado y pantallas pequeñas.</li>\n</ol>',
    baseCss:
      base +
      '.pasos {\n  padding-inline-start: 2rem;\n}\n.pasos > li {\n  padding: 0.75rem 0.5rem;\n  border-bottom: 1px solid #cbd5e1;\n}\n.pasos > li::marker {\n  color: #4338ca;\n}',
    task: 'En .pasos > li::marker declara font-weight: 700.',
    starter: '.pasos > li::marker {\n  /* Destaca los números. */\n}',
    solution: '.pasos > li::marker {\n  font-weight: 700;\n}',
    checks: [{ selector: '.pasos > li::marker', property: 'font-weight', value: '700' }],
    question: '¿Qué elemento corresponde a una secuencia de pasos?',
    options: ['ol', 'div', 'table'],
    correct: 0,
    reason: 'ol expresa que la posición de cada elemento es significativa.',
    source: mdn + '::marker',
  },
  {
    id: 'flexbox',
    title: 'Una página con Flexbox',
    category: 'Distribución',
    minutes: 20,
    summary: 'Combina navegación flexible y tarjetas que saltan de línea según el espacio.',
    concepts: [
      'Flexbox distribuye elementos en un eje principal. justify-content actúa en ese eje y align-items en el transversal.',
      'flex-wrap: wrap permite crear nuevas líneas; cada línea distribuye su espacio por separado.',
      'flex: 1 1 14rem combina crecimiento, contracción y tamaño base. min-width: 0 evita ciertos desbordamientos por contenido.',
    ],
    steps: [
      'Activa Flexbox y el salto de línea en .tarjetas.',
      'Compara los anchos 375, 768 y 1200 px: cambia el número de tarjetas por fila.',
      'Inspecciona en el Laboratorio cómo gap y flex-basis controlan el espacio.',
    ],
    pitfall:
      'No uses order para crear un orden visual que contradiga el orden de lectura y de teclado del HTML.',
    html: '<header class="cabecera">\n  <h1>Estudio CSS</h1>\n  <nav aria-label="Secciones">\n    <a href="#servicios">Servicios</a> ·\n    <a href="#contacto">Contacto</a>\n  </nav>\n</header>\n<main id="servicios">\n  <h2>Diseñamos contigo</h2>\n  <section class="tarjetas" aria-label="Servicios">\n    <article>\n      <h2>Aprende</h2>\n      <p>Fundamentos y ejemplos claros.</p>\n    </article>\n    <article>\n      <h2>Experimenta</h2>\n      <p>Una interfaz que puedes transformar.</p>\n    </article>\n    <article>\n      <h2>Comparte</h2>\n      <p>Diseños que funcionan a cualquier ancho.</p>\n    </article>\n  </section>\n</main>\n<footer id="contacto"><p>Estudio CSS · Proyecto educativo</p></footer>',
    baseCss:
      base +
      '.cabecera {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n  padding-block: 1rem;\n}\n.tarjetas {\n  gap: 1rem;\n}\n.tarjetas > article {\n  flex: 1 1 14rem;\n  min-width: 0;\n  margin: 0;\n}\nfooter {\n  margin-top: 2rem;\n}',
    task: 'En .tarjetas declara display: flex y flex-wrap: wrap.',
    starter: '.tarjetas {\n  /* Activa el eje flexible y permite varias líneas. */\n}',
    solution: '.tarjetas {\n  display: flex;\n  flex-wrap: wrap;\n}',
    checks: [
      { selector: '.tarjetas', property: 'display', value: 'flex' },
      { selector: '.tarjetas', property: 'flex-wrap', value: 'wrap' },
    ],
    question: 'Con flex-direction: row, ¿qué controla justify-content?',
    options: [
      'El tamaño del texto',
      'La distribución en el eje principal',
      'El orden de lectura del HTML',
    ],
    correct: 1,
    reason:
      'justify-content distribuye el espacio libre en el eje principal; su orientación depende de flex-direction.',
    source: mdn + 'CSS_flexible_box_layout/Basic_concepts_of_flexbox',
  },
  {
    id: 'grid',
    title: 'Una galería con CSS Grid',
    category: 'Distribución',
    minutes: 20,
    summary: 'Crea columnas adaptables con repeat(), auto-fit y minmax().',
    concepts: [
      'Grid coordina filas y columnas; Flexbox se centra en un eje cada vez.',
      'repeat(auto-fit, ...) crea tantas columnas como quepan y colapsa las vacías.',
      'minmax(min(100%, 14rem), 1fr) limita el mínimo al ancho disponible y reparte el espacio sobrante.',
    ],
    steps: [
      'Observa las tarjetas apiladas en el código inicial.',
      'Añade display: grid y la definición de columnas indicada.',
      'Prueba todos los anchos y comprueba que no aparece desplazamiento horizontal.',
    ],
    pitfall:
      'Un mínimo fijo de 14rem puede desbordar contenedores aún más estrechos; min(100%, 14rem) evita ese problema en este patrón.',
    html: '<h1>Galería de proyectos</h1>\n<main class="galeria">\n  <article>\n    <h2>Editorial</h2>\n    <p>Una revista digital.</p>\n  </article>\n  <article>\n    <h2>Catálogo</h2>\n    <p>Productos ordenados.</p>\n  </article>\n  <article>\n    <h2>Portfolio</h2>\n    <p>Tu trabajo, bien presentado.</p>\n  </article>\n  <article>\n    <h2>Agenda</h2>\n    <p>Eventos de la comunidad.</p>\n  </article>\n</main>',
    baseCss:
      base + '.galeria {\n  gap: 1rem;\n}\n.galeria > article {\n  margin: 0;\n  min-width: 0;\n}',
    task: 'En .galeria declara display: grid y grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)).',
    starter: '.galeria {\n  /* Crea una rejilla que se adapte sin media queries. */\n}',
    solution:
      '.galeria {\n  display: grid;\n  grid-template-columns: repeat(\n    auto-fit,\n    minmax(min(100%, 14rem), 1fr)\n  );\n}',
    checks: [
      { selector: '.galeria', property: 'display', value: 'grid' },
      {
        selector: '.galeria',
        property: 'grid-template-columns',
        value: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
      },
    ],
    question: '¿Qué representa 1fr en estas columnas?',
    options: [
      'Una fracción del espacio disponible de la rejilla',
      'Un píxel fijo',
      'Una fila por pantalla',
    ],
    correct: 0,
    reason:
      'fr reparte espacio disponible entre pistas flexibles; aquí las columnas crecen de forma equilibrada.',
    source: mdn + 'CSS_grid_layout/Auto-placement_in_grid_layout',
  },
  {
    id: 'responsive',
    title: 'Una página responsive desde móvil',
    category: 'Distribución',
    minutes: 20,
    summary:
      'Parte de una columna y transforma la composición con una media query basada en el contenido.',
    concepts: [
      'Mobile first: el CSS base funciona en pequeño y las mejoras se añaden al disponer de más espacio.',
      'Las media queries consultan el viewport; en la vista previa es el ancho interior del iframe.',
      'El punto de ruptura debe responder al contenido, no a una lista rígida de modelos de teléfono.',
    ],
    steps: [
      'Comprueba que 375 px mantiene una sola columna.',
      'Dentro de @media (min-width: 48rem), define las columnas de .pagina como 2fr 1fr.',
      'Compara 375 y 1200 px. La barra lateral debe quedar debajo o al lado del contenido, respectivamente.',
    ],
    pitfall:
      'No ocultes contenido esencial para que quepa. Conserva el orden lógico y evita anchos fijos mayores que el viewport.',
    html: '<header><h1>Revista CSS</h1></header>\n<main class="pagina">\n  <article>\n    <h2>Diseña para el contenido</h2>\n    <p>\n      Un texto legible y una composición flexible son el punto de\n      partida.\n    </p>\n    <p>El diseño gana una columna cuando el espacio lo permite.</p>\n  </article>\n  <aside>\n    <h2>En esta edición</h2>\n    <ul>\n      <li>Grid y Flexbox</li>\n      <li>Accesibilidad</li>\n      <li>Tipografía fluida</li>\n    </ul>\n  </aside>\n</main>',
    baseCss:
      base +
      '.pagina {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n}\n.pagina > * {\n  min-width: 0;\n}\naside {\n  padding: 1rem;\n  background: #e0e7ff;\n  border-radius: 0.75rem;\n}',
    task: 'Dentro de @media (min-width: 48rem), en .pagina declara grid-template-columns: 2fr 1fr.',
    starter:
      '@media (min-width: 48rem) {\n  .pagina {\n    /* Añade una segunda columna solo cuando haya espacio. */\n  }\n}',
    solution:
      '@media (min-width: 48rem) {\n  .pagina {\n    grid-template-columns: 2fr 1fr;\n  }\n}',
    checks: [
      {
        selector: '.pagina',
        property: 'grid-template-columns',
        value: '2fr 1fr',
        media: '(min-width: 48rem)',
      },
    ],
    question: '¿Qué ancho evalúa esta media query en la vista previa?',
    options: ['Siempre el monitor completo', 'El viewport del iframe', 'El ancho de un párrafo'],
    correct: 1,
    reason:
      'Cada iframe tiene su propio viewport. Cambiar su ancho permite ensayar los puntos de ruptura.',
    source:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design',
  },
  {
    id: 'bem',
    title: 'Componentes con nombres BEM',
    category: 'Organización',
    minutes: 15,
    summary: 'Distingue bloque, elemento y modificador en una tarjeta reutilizable.',
    concepts: [
      'El bloque .curso es una unidad independiente; .curso__titulo pertenece al bloque.',
      'El modificador .curso--destacado describe una variante y se añade junto a .curso.',
      'La clase expresa función y relación con el componente; evita nombres basados solo en el aspecto como caja-roja.',
    ],
    steps: [
      'Relaciona las clases del HTML con bloque, elemento y modificador.',
      'Destaca solo .curso--destacado con border-width: 3px.',
      'Abre el Laboratorio y duplica una tarjeta: debe mantener su aspecto fuera del contenedor original.',
    ],
    pitfall:
      'No encadenes nombres según cada nivel del DOM, como curso__contenido__titulo. Un elemento sigue perteneciendo al bloque curso.',
    html: '<main>\n  <article class="curso">\n    <h2 class="curso__titulo">CSS inicial</h2>\n    <p class="curso__resumen">Fundamentos para empezar.</p>\n    <button class="curso__accion" type="button">Explorar</button>\n  </article>\n  <article class="curso curso--destacado">\n    <h2 class="curso__titulo">CSS en acción</h2>\n    <p class="curso__resumen">Nuestro curso recomendado.</p>\n    <button class="curso__accion" type="button">Explorar</button>\n  </article>\n</main>',
    baseCss:
      base +
      '.curso {\n  padding: 1rem;\n  border: 1px solid #4338ca;\n}\n.curso__titulo {\n  font-size: 1.4rem;\n}\n.curso__resumen {\n  color: #334155;\n}\n.curso--destacado {\n  background: #eef2ff;\n}',
    task: 'En .curso--destacado declara border-width: 3px.',
    starter: '.curso--destacado {\n  /* Modifica la variante sin cambiar el bloque base. */\n}',
    solution: '.curso--destacado {\n  border-width: 3px;\n}',
    checks: [{ selector: '.curso--destacado', property: 'border-width', value: '3px' }],
    question: '¿Qué clases necesita la variante destacada?',
    options: ['Solo curso--destacado', 'curso__curso--destacado', 'curso y curso--destacado'],
    correct: 2,
    reason:
      'El modificador complementa la clase base. La variante conserva las declaraciones comunes del bloque.',
    source: 'https://getbem.com/naming/',
  },
  {
    id: 'smacss',
    title: 'Organiza una interfaz con SMACSS',
    category: 'Organización',
    minutes: 15,
    summary: 'Separa base, layout, módulos, estados y tema en un pequeño panel.',
    concepts: [
      'Base define estilos generales de elementos; Layout organiza las grandes zonas de la página.',
      'Module agrupa componentes reutilizables. State representa condiciones como .is-active.',
      'Theme agrupa variaciones visuales. Los prefijos l- e is- son convenciones útiles, no sintaxis especial del navegador.',
    ],
    steps: [
      'Lee los comentarios del CSS: cada grupo tiene una responsabilidad.',
      'Aplica font-weight: 700 a .aviso.is-active para reforzar el estado.',
      'Observa que el texto «Activo» comunica el estado además del color.',
    ],
    pitfall:
      'SMACSS organiza responsabilidades, no obliga a usar preprocesadores. BEM organiza nombres de componentes; se pueden combinar de manera consciente.',
    html: '<main class="l-panel tema-noche">\n  <h1>Panel de aprendizaje</h1>\n  <article class="aviso is-active">\n    <h2>Activo</h2>\n    <p>Tu taller está en curso.</p>\n  </article>\n  <article class="aviso">\n    <h2>Pendiente</h2>\n    <p>El siguiente taller te espera.</p>\n  </article>\n</main>',
    baseCss:
      base +
      '/* Base */\nh1 {\n  line-height: 1.2;\n}\n/* Layout */\n.l-panel {\n  max-width: 40rem;\n  margin-inline: auto;\n  padding: 1rem;\n}\n/* Module */\n.aviso {\n  margin-block: 1rem;\n  padding: 1rem;\n}\n/* Theme */\n.tema-noche {\n  background: #172554;\n  color: white;\n  border-radius: 1rem;\n}\n.tema-noche .aviso {\n  color: #172554;\n}\n/* State */\n.aviso.is-active {\n  border-inline-start: 0.5rem solid #4338ca;\n}',
    task: 'En .aviso.is-active declara font-weight: 700.',
    starter: '/* State: cambia el módulo cuando está activo. */\n.aviso.is-active {\n}',
    solution: '/* State */\n.aviso.is-active {\n  font-weight: 700;\n}',
    checks: [{ selector: '.aviso.is-active', property: 'font-weight', value: '700' }],
    question: '¿A qué categoría pertenece .is-active?',
    options: ['State', 'Layout', 'Base'],
    correct: 0,
    reason:
      'Un estado modifica la presentación según una condición de la interfaz, sin definir su estructura principal.',
    source: 'https://smacss.com/book/categorizing/',
  },
  {
    id: 'variables',
    title: 'Variables CSS y temas reutilizables',
    category: 'CSS fluido',
    minutes: 15,
    summary: 'Define tokens, herédalos y sobrescríbelos dentro de un componente.',
    concepts: [
      'Las propiedades personalizadas empiezan por -- y participan en cascada y herencia.',
      'var(--espacio, 1rem) usa un respaldo si la propiedad no está disponible o tiene un valor garantizado inválido.',
      'Redefinir --acento en .tema-bosque cambia los descendientes que lo consumen sin duplicar las reglas del componente.',
    ],
    steps: [
      'Compara el botón violeta con la zona de tema bosque.',
      'Define --acento: #166534 en .tema-bosque.',
      'Cambia --espacio en :root desde el Laboratorio y observa cómo se propaga.',
    ],
    pitfall:
      'El respaldo de var() no valida el tipo final: si --espacio vale rojo, padding: var(--espacio, 1rem) no se convierte automáticamente en 1rem.',
    html: '<section>\n  <h2>Tema inicial</h2>\n  <button type="button">Acción principal</button>\n</section>\n<section class="tema-bosque">\n  <h2>Tema bosque</h2>\n  <button type="button">Acción contextual</button>\n  <p>El mismo componente consume un acento local.</p>\n</section>',
    baseCss:
      base +
      ':root {\n  --acento: #4338ca;\n  --espacio: 1rem;\n}\nsection {\n  padding: var(--espacio, 1rem);\n  border: 1px solid #94a3b8;\n  border-radius: 0.75rem;\n  margin-block: 1rem;\n}\nbutton {\n  background: var(--acento);\n  border-color: var(--acento);\n}',
    task: 'En .tema-bosque define la propiedad personalizada --acento: #166534.',
    starter: '.tema-bosque {\n  /* Sobrescribe el token solo en esta rama del documento. */\n}',
    solution: '.tema-bosque {\n  --acento: #166534;\n}',
    checks: [{ selector: '.tema-bosque', property: '--acento', value: '#166534' }],
    question: '¿Dónde afecta esta redefinición de --acento?',
    options: [
      'Siempre en todos los documentos',
      'En .tema-bosque y sus descendientes que la hereden',
      'Solo en el archivo donde se escribió',
    ],
    correct: 1,
    reason: 'El ámbito depende de la cascada y la herencia del DOM, no del archivo de origen.',
    source: mdn + 'CSS_cascading_variables/Using_CSS_custom_properties',
  },
  {
    id: 'clamp',
    title: 'Tipografía fluida con clamp()',
    category: 'CSS fluido',
    minutes: 15,
    summary: 'Haz que un título crezca con el viewport dentro de límites definidos.',
    concepts: [
      'clamp(mínimo, preferido, máximo) limita un valor flexible entre dos extremos.',
      '1rem + 3vw combina una parte ligada al tamaño raíz y otra al viewport.',
      'El tamaño fluido sigue necesitando pruebas de zoom, saltos de línea y contraste.',
    ],
    steps: [
      'Compara el título inicial con la solución a 375 px.',
      'Aplica font-size: clamp(1.5rem, 1rem + 3vw, 3rem) a .titular.',
      'Alterna 375, 768 y 1200 px: el título crece y termina en un máximo de 3rem.',
    ],
    pitfall:
      'Usar solo vw puede limitar el efecto del zoom sobre el texto. Combina unidades y comprueba ampliación al 200 %; clamp() por sí solo no garantiza accesibilidad.',
    html: '<main>\n  <p>Revista digital</p>\n  <h1 class="titular">El diseño también puede respirar</h1>\n  <p>\n    Un título flexible, un ancho de lectura cómodo y espacio para cada\n    idea.\n  </p>\n</main>',
    baseCss:
      base +
      'main {\n  max-width: 65ch;\n  margin-inline: auto;\n}\n.titular {\n  font-size: 1.5rem;\n  line-height: 1.15;\n  overflow-wrap: break-word;\n}',
    task: 'En .titular declara font-size: clamp(1.5rem, 1rem + 3vw, 3rem).',
    starter: '.titular {\n  /* Mínimo, valor preferido y máximo. */\n}',
    solution: '.titular {\n  font-size: clamp(1.5rem, 1rem + 3vw, 3rem);\n}',
    checks: [
      { selector: '.titular', property: 'font-size', value: 'clamp(1.5rem, 1rem + 3vw, 3rem)' },
    ],
    question: '¿Qué ocurre cuando el valor preferido supera 3rem?',
    options: [
      'Se mantiene el máximo de 3rem',
      'El texto desaparece',
      'Se ignoran todos los límites',
    ],
    correct: 0,
    reason: 'En este ejemplo el mínimo es menor que el máximo, y clamp() impide superar 3rem.',
    source: mdn + 'clamp',
  },
  {
    id: 'calc',
    title: 'Medidas calculadas con calc() y min()',
    category: 'CSS fluido',
    minutes: 15,
    summary: 'Crea un contenedor centrado con márgenes fluidos y un ancho máximo.',
    concepts: [
      'calc() combina medidas compatibles; permite restar una longitud a un porcentaje.',
      'min(100%, 60rem) escoge la menor medida: útil para limitar el ancho sin perder adaptación.',
      'Los operadores + y - en calc() necesitan espacios alrededor.',
    ],
    steps: [
      'Aplica a .contenedor el ancho min(60rem, calc(100% - 2rem)).',
      'Observa el margen lateral de 1rem dentro del área disponible.',
      'Compara el máximo de lectura a 1200 px con la adaptación a 375 px.',
    ],
    pitfall:
      'El porcentaje se resuelve respecto al bloque contenedor, no siempre respecto al viewport. Evita sumar padding inesperado usando box-sizing: border-box.',
    html: '<main class="contenedor">\n  <h1>Espacio calculado</h1>\n  <p>\n    Este contenedor resta dos rem al ancho disponible, se centra y nunca\n    supera sesenta rem.\n  </p>\n  <article>\n    <h2>Una fórmula, varios tamaños</h2>\n    <p>Cambia el ancho de la vista previa para ver cómo responde.</p>\n  </article>\n</main>',
    baseCss:
      base +
      'body {\n  padding: 0;\n}\n.contenedor {\n  margin: 1rem auto;\n  padding-block: 1rem;\n  background: #e0e7ff;\n  border-radius: 0.75rem;\n}',
    task: 'En .contenedor declara width: min(60rem, calc(100% - 2rem)).',
    starter: '.contenedor {\n  /* Resta espacio y limita el ancho máximo. */\n}',
    solution: '.contenedor {\n  width: min(60rem, calc(100% - 2rem));\n}',
    checks: [
      { selector: '.contenedor', property: 'width', value: 'min(60rem, calc(100% - 2rem))' },
    ],
    question: '¿Qué representa 100% en esta declaración?',
    options: [
      'Siempre el tamaño de la fuente',
      'Un valor fijo de 100 píxeles',
      'El ancho del bloque contenedor',
    ],
    correct: 2,
    reason:
      'El porcentaje del ancho se refiere al bloque contenedor. calc() resta a esa medida dos rem.',
    source: mdn + 'calc',
  },
  {
    id: 'proyecto',
    title: 'Proyecto: una página de cursos',
    category: 'Proyecto',
    minutes: 30,
    summary:
      'Integra tokens, BEM, navegación Flexbox, tarjetas Grid, tipografía fluida y un formulario.',
    concepts: [
      'Empieza por contenido y semántica: cabecera, navegación, main, secciones y formulario etiquetado.',
      'Usa Flexbox para la navegación y Grid para la colección; define tokens compartidos y nombres BEM.',
      'El diseño base debe caber en móvil. Prueba anchos intermedios, teclado y zoom antes de darlo por terminado.',
    ],
    steps: [
      'Completa las dos declaraciones de .catalogo para activar una galería adaptable.',
      'Revisa el CSS por bloques: tokens, layout, componente y estado.',
      'Prueba los tres anchos, el foco de los enlaces y el formulario. Abre el Laboratorio para personalizar ambos lenguajes.',
    ],
    pitfall:
      'La comprobación automática revisa las declaraciones del ejercicio y la respuesta conceptual; no sustituye una revisión de accesibilidad ni una evaluación completa del diseño.',
    html: '<header class="sitio">\n  <a class="sitio__marca" href="#cursos">Aula CSS</a>\n  <nav class="sitio__nav" aria-label="Principal">\n    <a href="#cursos">Cursos</a><a href="#avisos">Avisos</a>\n  </nav>\n</header>\n<main class="l-contenedor">\n  <section class="portada">\n    <p>Aprender haciendo</p>\n    <h1 class="portada__titulo">Tu siguiente interfaz empieza aquí</h1>\n    <p>Doce talleres. Una forma nueva de mirar la web.</p>\n  </section>\n  <section id="cursos">\n    <h2>Elige tu recorrido</h2>\n    <div class="catalogo">\n      <article class="curso">\n        <h3 class="curso__titulo">Fundamentos</h3>\n        <p>Selectores, cascada y componentes.</p>\n        <a href="#avisos">Más información</a>\n      </article>\n      <article class="curso curso--destacado">\n        <h3 class="curso__titulo">Diseño adaptable</h3>\n        <p>Flexbox, Grid y medidas fluidas.</p>\n        <a href="#avisos">Más información</a>\n      </article>\n      <article class="curso">\n        <h3 class="curso__titulo">Arquitectura CSS</h3>\n        <p>BEM, SMACSS y tokens.</p>\n        <a href="#avisos">Más información</a>\n      </article>\n    </div>\n  </section>\n  <section id="avisos">\n    <h2>No te pierdas los próximos talleres</h2>\n    <form class="suscripcion">\n      <label for="email"\n        >Correo electrónico<input\n          id="email"\n          type="email"\n          autocomplete="email"\n          required /></label\n      ><button type="button">Avisarme · Demostración</button>\n    </form>\n    <p>Ejemplo educativo: no se envían datos.</p>\n  </section>\n</main>',
    baseCss:
      base +
      ':root {\n  --acento: #4338ca;\n  --espacio: 1rem;\n}\nbody {\n  padding: 0;\n}\n.sitio {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--espacio);\n  padding: 1rem;\n  border-bottom: 1px solid #cbd5e1;\n}\n.sitio__marca {\n  font-size: 1.4rem;\n  font-weight: 800;\n}\n.sitio__nav {\n  display: flex;\n  gap: var(--espacio);\n  flex-wrap: wrap;\n}\n.l-contenedor {\n  width: min(64rem, calc(100% - 2rem));\n  margin-inline: auto;\n}\n.portada {\n  padding-block: clamp(2rem, 6vw, 5rem);\n}\n.portada__titulo {\n  font-size: clamp(1.8rem, 1rem + 3vw, 3.5rem);\n  line-height: 1.15;\n  max-width: 20ch;\n}\n.catalogo {\n  gap: var(--espacio);\n}\n.curso {\n  min-width: 0;\n  margin: 0;\n}\n.curso__titulo {\n  color: var(--acento);\n}\n.curso--destacado {\n  border-width: 3px;\n  background: #eef2ff;\n}\n#avisos {\n  padding-block: 2rem;\n}\n.suscripcion {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: end;\n  gap: var(--espacio);\n}\n.suscripcion label {\n  display: grid;\n  gap: 0.4rem;\n  flex: 1 1 16rem;\n}\n.suscripcion input {\n  width: 100%;\n  min-width: 0;\n  padding: 0.6rem;\n  border: 2px solid #64748b;\n  border-radius: 0.4rem;\n}',
    task: 'En .catalogo declara display: grid y grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)).',
    starter: '.catalogo {\n  /* Integra una colección de tarjetas adaptable. */\n}',
    solution:
      '.catalogo {\n  display: grid;\n  grid-template-columns: repeat(\n    auto-fit,\n    minmax(min(100%, 16rem), 1fr)\n  );\n}',
    checks: [
      { selector: '.catalogo', property: 'display', value: 'grid' },
      {
        selector: '.catalogo',
        property: 'grid-template-columns',
        value: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
      },
    ],
    question: '¿Qué revisión necesitas además de comprobar las declaraciones?',
    options: [
      'Solo que funcione a 1200 px',
      'Anchos pequeños, teclado, zoom y contenido real',
      'Únicamente el color de las tarjetas',
    ],
    correct: 1,
    reason:
      'Un diseño adaptable también debe ser utilizable con teclado, contenido variable y texto ampliado.',
    source:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design',
  },
]
export const workshops = seeds.map((seed) => workshopSchema.parse(seed))
