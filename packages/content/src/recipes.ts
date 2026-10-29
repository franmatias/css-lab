import { z } from 'zod'
const schema = z.object({
  id: z.string(),
  title: z.string(),
  selector: z.string(),
  category: z.string(),
  summary: z.string(),
  html: z.string(),
  css: z.string(),
  explanation: z.string(),
  pitfall: z.string(),
  interaction: z.string().default('Cambia el ejemplo en el Laboratorio para experimentar.'),
  source: z
    .string()
    .url()
    .default('https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors'),
})
export type Recipe = z.infer<typeof schema>
export const recipes: Recipe[] = [
  {
    id: 'selector-buho',
    title: 'Selector búho: un ritmo vertical constante',
    selector: '.flujo > * + *',
    category: 'Espaciado',
    summary: 'Separa bloques consecutivos sin añadir margen al primero.',
    html: '<section class="flujo">\n  <h2>Un artículo bien espaciado</h2>\n  <p>Cada bloque respira sin clases adicionales.</p>\n  <p>El primero no recibe separación superior.</p>\n  <button type="button">Seguir leyendo</button>\n</section>',
    css: '.flujo > * { margin: 0; }\n\n.flujo > * + * {\n  margin-block-start: 1rem;\n}\n\nbutton { padding: 0.5rem 1rem; }',
    explanation:
      '* + * encuentra un elemento que tiene un hermano inmediatamente anterior. El prefijo .flujo > limita el patrón a hijos directos y evita espaciar también elementos anidados. margin-block-start respeta la dirección de escritura.',
    pitfall:
      'No equivale a gap: actúa sobre márgenes y considera el orden del DOM, incluso si un hermano anterior está oculto. Evita aplicarlo globalmente si solo necesitas espaciar un componente.',
    source: 'https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/',
  },
  {
    id: 'foco-contenedor',
    title: 'Un campo que acompaña al foco',
    selector: '.campo:focus-within',
    category: 'Accesibilidad',
    summary: 'Resalta el grupo cuando uno de sus controles recibe el foco.',
    html: '<div class="campo">\n  <label for="correo">Correo electrónico</label>\n  <input id="correo" type="email" placeholder="tu@ejemplo.es">\n</div>',
    css: '.campo { padding: 1rem; border: 2px solid #64748b; border-radius: 12px; }\n.campo:focus-within { border-color: #4f46e5; background: #eef2ff; }\ninput { display: block; margin-top: 0.5rem; padding: 0.6rem; max-width: 100%; }\ninput:focus-visible { outline: 3px solid #4f46e5; outline-offset: 3px; }',
    explanation:
      ':focus-within se activa tanto si el contenedor está enfocado como si el foco está en un descendiente. Mantener :focus-visible en el control hace que también se identifique el punto exacto de interacción.',
    pitfall:
      'El color del contenedor complementa el foco del control; no elimines el indicador del teclado.',
    interaction: 'Haz clic en el campo o recórrelo con Tab y observa el contenedor.',
  },
  {
    id: 'tarjeta-seleccionada',
    title: 'Una tarjeta que conoce su casilla',
    selector: '.tarjeta:has(input:checked)',
    category: 'Formularios',
    summary: 'Da estilo a la tarjeta completa cuando se marca una opción.',
    html: '<label class="tarjeta">\n  <input type="checkbox"> Plan explorador\n  <p>Práctica diaria a tu ritmo.</p>\n</label>',
    css: '.tarjeta { display: block; padding: 1rem; border: 2px solid #64748b; border-radius: 12px; }\n.tarjeta:has(input:checked) { background: #eef2ff; border-color: #4f46e5; }\ninput { accent-color: #4f46e5; }',
    explanation:
      ':has() evalúa una relación desde la tarjeta. Cuando existe un input marcado dentro de ella, coincide la tarjeta y se actualiza su estilo sin JavaScript.',
    pitfall:
      ':checked describe el estado actual; el atributo HTML checked solo fija el estado inicial.',
    interaction: 'Marca y desmarca la casilla.',
    source: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has',
  },
  {
    id: 'navegacion-actual',
    title: 'La página actual en una navegación',
    selector: '.menu > a[aria-current="page"]',
    category: 'Navegación',
    summary: 'Combina relación directa y atributo accesible para indicar la sección activa.',
    html: '<nav class="menu" aria-label="Ejemplo">\n  <a href="#inicio">Inicio</a>\n  <a href="#guia" aria-current="page">Guía</a>\n  <a href="#ayuda">Ayuda</a>\n</nav>',
    css: '.menu { display: flex; flex-wrap: wrap; gap: 0.5rem; }\n.menu > a { padding: 0.6rem 1rem; color: #3730a3; border: 1px solid #a5b4fc; border-radius: 8px; }\n.menu > a[aria-current="page"] { background: #4f46e5; color: white; font-weight: 700; text-decoration: underline; }',
    explanation:
      '> limita la regla a enlaces hijos directos. El atributo aria-current="page" comunica qué enlace representa la página actual y sirve también como condición del selector.',
    pitfall:
      'La aplicación debe actualizar aria-current al navegar. CSS representa ese estado, no cambia de ruta.',
  },
  {
    id: 'filas-alternas',
    title: 'Filas alternas con una excepción',
    selector: '.resultados > li:nth-child(2n):not(.destacado)',
    category: 'Listas',
    summary: 'Colorea posiciones pares y conserva el estilo de las filas destacadas.',
    html: '<ul class="resultados">\n  <li>Mercurio</li>\n  <li>Venus</li>\n  <li>Tierra</li>\n  <li class="destacado">Saturno · Destacado</li>\n</ul>',
    css: '.resultados { list-style: none; padding: 0; }\n.resultados > li { padding: 0.75rem; border-bottom: 1px solid #cbd5e1; }\n.resultados > li:nth-child(2n):not(.destacado) { background: #e0e7ff; }\n.destacado { background: #fef3c7; font-weight: 700; }',
    explanation:
      ':nth-child(2n) cuenta posiciones entre todos los hermanos. :not(.destacado) descarta una fila después de contar, sin volver a numerar las restantes.',
    pitfall:
      'Si quieres contar solo un subconjunto necesitas otra estrategia, por ejemplo nth-child(2n of .fila) donde esté soportado.',
  },
  {
    id: 'separadores',
    title: 'Separadores sin una línea de más',
    selector: '.lista > li:not(:last-child)',
    category: 'Listas',
    summary: 'Añade un borde entre elementos, pero no después del último.',
    html: '<ul class="lista">\n  <li>Preparar el HTML</li>\n  <li>Escribir el selector</li>\n  <li>Observar el resultado</li>\n</ul>',
    css: '.lista { list-style: none; padding: 0; }\n.lista > li { padding: 0.8rem; }\n.lista > li:not(:last-child) { border-bottom: 2px solid #a5b4fc; }',
    explanation:
      'El selector compuesto exige ser un li hijo directo de lista y no ocupar la última posición. La regla se adapta cuando se añaden o eliminan elementos.',
    pitfall:
      ':last-child cuenta todos los hermanos, no solo los li. Mantén una estructura de lista coherente.',
  },
  {
    id: 'errores-formulario',
    title: 'Validar después de empezar a escribir',
    selector: 'input:required:invalid:not(:placeholder-shown)',
    category: 'Formularios',
    summary: 'Evita mostrar un error visual en un campo que todavía está vacío.',
    html: '<label for="email">Correo obligatorio</label>\n<input id="email" type="email" required placeholder="tu@ejemplo.es">\n<p>Usa un correo con arroba.</p>',
    css: 'input { display: block; padding: 0.7rem; margin-top: 0.5rem; max-width: 100%; border: 2px solid #64748b; border-radius: 8px; }\ninput:required:invalid:not(:placeholder-shown) { border-color: #b91c1c; background: #fef2f2; }\ninput:focus-visible { outline: 3px solid #4f46e5; outline-offset: 3px; }',
    explanation:
      'Las pseudoclases se combinan como condiciones: obligatorio, inválido y con el placeholder oculto. La validez procede de las restricciones HTML del control.',
    pitfall:
      'El borde no sustituye un mensaje de error asociado al campo. Esta receta es una ayuda visual, no una validación completa del envío.',
    interaction: 'Escribe un correo sin arroba y después corrígelo.',
  },
  {
    id: 'botones-accesibles',
    title: 'Un mismo efecto para ratón y teclado',
    selector: 'button:is(:hover, :focus-visible):not(:disabled)',
    category: 'Accesibilidad',
    summary: 'Agrupa dos formas de interacción y excluye los botones deshabilitados.',
    html: '<button type="button">Pruébame</button>\n<button type="button" disabled>No disponible</button>',
    css: 'button { margin: 0.5rem; padding: 0.8rem 1.1rem; border: 2px solid #4f46e5; border-radius: 10px; background: white; color: #3730a3; }\nbutton:is(:hover, :focus-visible):not(:disabled) { background: #4f46e5; color: white; outline: 3px solid #a5b4fc; outline-offset: 3px; }\nbutton:disabled { border-color: #64748b; color: #475569; }',
    explanation:
      ':is() acepta cualquiera de los estados. :not(:disabled) exige además que el botón se pueda activar. No hace falta duplicar las declaraciones para hover y foco visible.',
    pitfall:
      ':hover no cubre todos los dispositivos táctiles; mantén un diseño comprensible sin ese estado.',
    interaction: 'Pasa el puntero o usa Tab para enfocar el primer botón.',
  },
  {
    id: 'letra-capital',
    title: 'Una letra capital en el primer párrafo',
    selector: '.noticia > p:first-of-type::first-letter',
    category: 'Tipografía',
    summary: 'Combina jerarquía, posición por tipo y una parte del texto.',
    html: '<article class="noticia">\n  <h2>Un pequeño descubrimiento</h2>\n  <p>Aprender CSS consiste en observar relaciones.</p>\n  <p>El segundo párrafo conserva su letra normal.</p>\n</article>',
    css: '.noticia > p:first-of-type::first-letter { font-size: 2.8em; font-weight: 700; color: #4f46e5; line-height: 1; }\n.noticia { max-width: 32rem; }',
    explanation:
      ':first-of-type busca el primer p aunque antes haya un h2. ::first-letter selecciona después la primera letra de ese párrafo.',
    pitfall:
      'Un pseudoelemento no es un nodo adicional del DOM y solo admite las propiedades apropiadas para esa parte del contenido.',
  },
  {
    id: 'entradilla',
    title: 'Una entradilla tras títulos de varios niveles',
    selector: ':where(.prosa) :is(h2, h3) + p',
    category: 'Tipografía',
    summary: 'Da énfasis al párrafo que sigue inmediatamente a h2 o h3.',
    html: '<article class="prosa">\n  <h2>La idea</h2>\n  <p>Este párrafo abre la sección.</p>\n  <p>Este continúa con estilo normal.</p>\n  <h3>Un detalle</h3>\n  <p>Otra entradilla breve.</p>\n</article>',
    css: ':where(.prosa) :is(h2, h3) + p { color: #3730a3; font-size: 1.1rem; font-weight: 600; border-inline-start: 3px solid #4f46e5; padding-inline-start: 0.75rem; }',
    explanation:
      ':where(.prosa) acota el contexto sin aportar especificidad. :is(h2, h3) agrupa los títulos y + p exige que el párrafo sea el hermano inmediato posterior.',
    pitfall:
      'El selector final selecciona p, no el título. Si hay otro elemento entre ambos, la regla no coincide.',
  },
  {
    id: 'tarjeta-destacada',
    title: 'Una tarjeta cambia según lo que contiene',
    selector: '.tarjeta:has(> .insignia)',
    category: 'Componentes',
    summary: 'Destaca solo las tarjetas con una insignia hija directa.',
    html: '<article class="tarjeta">\n  <span class="insignia">Nuevo</span>\n  <h2>Explorador</h2>\n  <p>Una tarjeta especial.</p>\n</article>\n<article class="tarjeta"><h2>Aprendiz</h2><p>Una tarjeta normal.</p></article>',
    css: '.tarjeta { border: 1px solid #64748b; border-radius: 12px; padding: 1rem; margin-block-end: 1rem; }\n.tarjeta:has(> .insignia) { border: 2px solid #4f46e5; background: #eef2ff; }\n.insignia { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; background: #4f46e5; color: white; font-size: 0.8rem; }',
    explanation:
      '> dentro de :has() exige que la insignia sea hija directa. Una insignia dentro de un contenedor más profundo no activa esta condición.',
    pitfall:
      'Acota :has() al componente que necesita reaccionar para que el selector conserve una intención clara.',
    source: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has',
  },
  {
    id: 'opciones-disponibles',
    title: 'Opciones marcadas que se pueden usar',
    selector: '.opciones input:checked:not(:disabled) + span',
    category: 'Formularios',
    summary: 'Resalta la etiqueta de una opción marcada y disponible.',
    html: '<div class="opciones">\n  <label><input type="checkbox" checked><span>Disponible</span></label>\n  <label><input type="checkbox" checked disabled><span>Deshabilitada</span></label>\n  <label><input type="checkbox"><span>Otra opción</span></label>\n</div>',
    css: '.opciones label { display: block; padding: 0.7rem; }\n.opciones span { margin-inline-start: 0.5rem; }\n.opciones input:checked:not(:disabled) + span { color: #166534; font-weight: 700; text-decoration: underline; }',
    explanation:
      'Primero se comprueba el estado del input; después + span selecciona el hermano de texto que aparece justo a continuación. El elemento final que recibe estilo es span.',
    pitfall:
      'La relación + depende del orden y de que span sea el hermano inmediato, no un descendiente cualquiera.',
    interaction: 'Marca y desmarca las opciones disponibles.',
  },
].map((recipe) => schema.parse(recipe))
