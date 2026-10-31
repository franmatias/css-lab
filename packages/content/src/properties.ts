export interface PropertyExercise {
  id: string
  title: string
  category: string
  description: string
  theory: string
  html: string
  baseCss: string
  starter: string
  solution: string
  hint: string
  checks: { selector: string; property: string; pseudo?: string }[]
  keyframes?: string
}
const card = `<main class="escena">
  <article class="muestra">
    <h2>Tu próxima idea</h2>
    <p>Aprende CSS dando forma a una tarjeta real.</p>
    <a href="#">Explorar el diseño</a>
  </article>
</main>`
const layout = `<main class="escena">
  <section class="muestra">
    <article class="ficha">Aprende</article>
    <article class="ficha">Experimenta</article>
    <article class="ficha">Comparte</article>
  </section>
</main>`
const button =
  '<main class="escena"><button class="muestra" type="button">Pasa el ratón o usa Tab</button></main>'
const base = `* { box-sizing: border-box; }
body { margin: 0; padding: 1rem; font: 16px/1.5 system-ui, sans-serif; color: #172554; background: #f8fafc; }
.escena { padding: 1rem; min-height: 240px; }
.muestra { margin: 0; padding: 1rem; max-width: 28rem; border: 1px solid #cbd5e1; border-radius: 0; background: white; color: #172554; font-size: 16px; font-weight: 400; line-height: 1.5; }
h2 { margin: 0 0 .75rem; font-size: 1.4rem; }
p { margin: 0 0 .75rem; }
a { color: #4338ca; }
button, input { font: inherit; }
:focus-visible { outline: 3px solid #0e7490; outline-offset: 3px; }
.ficha { padding: 1rem; border: 1px solid #a5b4fc; background: #e0e7ff; }
.ficha:nth-child(2) { background: #fef3c7; }
`
type Seed = [string, string, string, string, string, string[], string?, string?, string?, string?]
// id, title, category, task, solution declarations, computed properties, theory, fixture, base, target
const seeds: Seed[] = [
  [
    'color-texto',
    'Título en rojo',
    'Color y fondos',
    'Pon el texto de .muestra en #dc2626.',
    'color: #dc2626;',
    ['color'],
    'm18',
  ],
  [
    'color-fondo',
    'Un fondo suave',
    'Color y fondos',
    'Aplica a .muestra el fondo #e0e7ff.',
    'background-color: #e0e7ff;',
    ['background-color'],
    'm18',
  ],
  [
    'degradado',
    'Dos colores, un fondo',
    'Color y fondos',
    'Crea un degradado de 135deg desde #e0e7ff hasta #cffafe.',
    'background-image: linear-gradient(135deg, #e0e7ff, #cffafe);',
    ['background-image'],
    'm18',
  ],
  [
    'tamano-texto',
    'Texto con presencia',
    'Tipografía',
    'Cambia el tamaño de texto de .muestra a 24px.',
    'font-size: 24px;',
    ['font-size'],
    'm18',
  ],
  [
    'peso-texto',
    'Dale énfasis',
    'Tipografía',
    'Usa un peso de 700 en .muestra.',
    'font-weight: 700;',
    ['font-weight'],
    'm18',
  ],
  [
    'interlineado',
    'Lectura con aire',
    'Tipografía',
    'Usa un interlineado sin unidad de 1.8 en .muestra.',
    'line-height: 1.8;',
    ['line-height'],
    'm18',
  ],
  [
    'margen',
    'Margen exterior',
    'Modelo de caja',
    'Pon 24px de margen en los cuatro lados de .muestra.',
    'margin: 24px;',
    ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
    'm17',
  ],
  [
    'relleno',
    'Relleno interior',
    'Modelo de caja',
    'Pon 24px de relleno en los cuatro lados de .muestra.',
    'padding: 24px;',
    ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    'm17',
  ],
  [
    'border-box',
    'El ancho total',
    'Modelo de caja',
    'Haz que los 280px de ancho incluyan borde y relleno.',
    'box-sizing: border-box; width: 280px;',
    ['box-sizing', 'width'],
    'm17',
    card,
    '.muestra { box-sizing: content-box; padding: 24px; }',
  ],
  [
    'borde',
    'Borde índigo',
    'Bordes y medidas',
    'Añade un borde de 3px, discontinuo (dashed), de color #4338ca en todos los lados.',
    'border: 3px dashed #4338ca;',
    [
      'border-top-width',
      'border-top-style',
      'border-top-color',
      'border-right-width',
      'border-right-style',
      'border-right-color',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'border-left-width',
      'border-left-style',
      'border-left-color',
    ],
    'm17',
  ],
  [
    'radio',
    'Esquinas redondas',
    'Bordes y medidas',
    'Redondea las cuatro esquinas de .muestra con 16px.',
    'border-radius: 16px;',
    [
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-left-radius',
      'border-bottom-right-radius',
    ],
    'm17',
  ],
  [
    'ancho-maximo',
    'Una medida legible',
    'Bordes y medidas',
    'Limita el ancho máximo de .muestra a 320px.',
    'max-width: 320px;',
    ['max-width'],
    'm24',
  ],
  [
    'marcadores',
    'Viñetas con color',
    'Componentes',
    'Colorea de #4338ca el ::marker de cada li de la lista.',
    'color: #4338ca;',
    ['color'],
    'm11',
    '<main class="escena"><ul class="muestra"><li>Aprender</li><li>Practicar</li><li>Compartir</li></ul></main>',
    '',
    '.muestra li::marker',
  ],
  [
    'tabla',
    'Bordes compartidos',
    'Componentes',
    'Colapsa los bordes de la tabla con border-collapse.',
    'border-collapse: collapse;',
    ['border-collapse'],
    'm13',
    '<main class="escena"><table class="muestra"><caption>Sesiones CSS</caption><thead><tr><th scope="col">Tema</th><th scope="col">Minutos</th></tr></thead><tbody><tr><th scope="row">Flexbox</th><td>20</td></tr><tr><th scope="row">Grid</th><td>25</td></tr></tbody></table></main>',
    'th, td { border: 1px solid #64748b; padding: 12px; } .muestra { border-spacing: 8px; }',
  ],
  [
    'formulario',
    'Un campo cómodo',
    'Componentes',
    'Pon 12px de relleno en los cuatro lados del campo.',
    'padding: 12px;',
    ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    'm14',
    '<main class="escena"><label for="correo">Correo electrónico</label><br><input class="muestra" id="correo" type="email" placeholder="tu@ejemplo.es"></main>',
  ],
  [
    'flex-activar',
    'Una fila flexible',
    'Flexbox',
    'Convierte .muestra en un contenedor flex.',
    'display: flex;',
    ['display'],
    'm15',
    layout,
  ],
  [
    'flex-salto',
    'Tarjetas que saltan',
    'Flexbox',
    'Activa flex y permite que las tarjetas salten de línea. Prueba a 375px.',
    'display: flex; flex-wrap: wrap;',
    ['display', 'flex-wrap'],
    'm15',
    layout,
    '.ficha { flex: 1 1 140px; }',
  ],
  [
    'flex-reparto',
    'Reparte el espacio',
    'Flexbox',
    'Activa flex y distribuye el espacio libre entre las tarjetas con space-between.',
    'display: flex; justify-content: space-between;',
    ['display', 'justify-content'],
    'm15',
    layout,
    '.ficha { flex: 0 0 90px; }',
  ],
  [
    'grid-columnas',
    'Tres columnas',
    'Grid',
    'Activa Grid y crea tres columnas iguales con repeat(3, 1fr).',
    'display: grid; grid-template-columns: repeat(3, 1fr);',
    ['display', 'grid-template-columns'],
    'm16',
    layout,
  ],
  [
    'grid-espacio',
    'Calles de la rejilla',
    'Grid',
    'Activa Grid y separa filas y columnas 16px.',
    'display: grid; gap: 16px;',
    ['display', 'row-gap', 'column-gap'],
    'm16',
    layout,
  ],
  [
    'grid-centrar',
    'El centro exacto',
    'Grid',
    'Activa Grid y centra los ítems en ambos ejes con place-items.',
    'display: grid; place-items: center;',
    ['display', 'align-items', 'justify-items'],
    'm16',
    layout,
    '.muestra { min-height: 320px; } .ficha { width: 150px; }',
  ],
  [
    'posicion-absoluta',
    'Una etiqueta en la esquina',
    'Posicionamiento',
    'Sitúa .muestra de forma absoluta a 16px de arriba y de la derecha de .escena.',
    'position: absolute; top: 16px; right: 16px;',
    ['position', 'top', 'right'],
    'm19',
    '<main class="escena"><h2>Última novedad</h2><p>La etiqueta toma su contenedor como referencia.</p><span class="muestra">Nuevo</span></main>',
    '.escena { position: relative; min-height: 280px; border: 1px dashed #64748b; }',
  ],
  [
    'posicion-sticky',
    'Una cabecera que acompaña',
    'Posicionamiento',
    'Usa sticky y top: 0 en .muestra. Desplaza el contenido de su panel.',
    'position: sticky; top: 0;',
    ['position', 'top'],
    'm19',
    '<main class="scroll-demo"><header class="muestra">Cabecera de la lista</header><div class="contenido-largo">Desplázate dentro de este panel ↓</div></main>',
    '.scroll-demo { height: 340px; overflow: auto; } .contenido-largo { height: 700px; padding: 2rem; background: linear-gradient(#e0e7ff,#cffafe); }',
  ],
  [
    'capas',
    'Por delante',
    'Posicionamiento',
    'Posiciona .muestra de forma relativa y asígnale z-index: 4.',
    'position: relative; z-index: 4;',
    ['position', 'z-index'],
    'm19',
  ],
  [
    'sombra-caja',
    'Una tarjeta elevada',
    'Sombras y transparencia',
    'Añade una sombra sin desplazamiento horizontal, 8px vertical, 24px de desenfoque y color rgb(15 23 42 / 20%).',
    'box-shadow: 0 8px 24px rgb(15 23 42 / 20%);',
    ['box-shadow'],
    'm20',
  ],
  [
    'sombra-texto',
    'Sombra en el texto',
    'Sombras y transparencia',
    'Añade text-shadow de 2px en ambos ejes, 4px de desenfoque y rgb(15 23 42 / 30%).',
    'text-shadow: 2px 2px 4px rgb(15 23 42 / 30%);',
    ['text-shadow'],
    'm20',
  ],
  [
    'transparencia',
    'Solo el fondo transparente',
    'Sombras y transparencia',
    'Usa rgb(67 56 202 / 20%) como fondo y conserva opacity: 1 para que el texto no se vuelva transparente.',
    'background-color: rgb(67 56 202 / 20%); opacity: 1;',
    ['background-color', 'opacity'],
    'm20',
    card,
    '.escena { background: repeating-linear-gradient(45deg, #e2e8f0 0 12px, #f8fafc 12px 24px); }',
  ],
  [
    'transicion-color',
    'Un cambio suave',
    'Transiciones',
    'Anima únicamente background-color durante 300ms. Pasa el ratón o usa Tab.',
    'transition: background-color 300ms;',
    ['transition-property', 'transition-duration'],
    'm21',
    button,
  ],
  [
    'transicion-ritmo',
    'El ritmo del movimiento',
    'Transiciones',
    'Transiciona transform durante 400ms con ease-in-out. Pasa el ratón o usa Tab.',
    'transition: transform 400ms ease-in-out;',
    ['transition-property', 'transition-duration', 'transition-timing-function'],
    'm21',
    button,
  ],
  [
    'transicion-retardo',
    'Espera y cambia',
    'Transiciones',
    'Transiciona transform durante 300ms, con 100ms de retardo. Pasa el ratón o usa Tab.',
    'transition: transform 300ms 100ms;',
    ['transition-property', 'transition-duration', 'transition-delay'],
    'm21',
    button,
  ],
  [
    'traslacion',
    'Desplaza sin romper el flujo',
    'Transformaciones',
    'Desplaza .muestra 24px hacia la derecha con translateX().',
    'transform: translateX(24px);',
    ['transform'],
    'm22',
  ],
  [
    'rotacion',
    'Un pequeño giro',
    'Transformaciones',
    'Gira .muestra 6deg con rotate().',
    'transform: rotate(6deg);',
    ['transform'],
    'm22',
  ],
  [
    'escala-origen',
    'Crece desde una esquina',
    'Transformaciones',
    'Escala .muestra a 1.1 y establece el origen en left top.',
    'transform: scale(1.1); transform-origin: left top;',
    ['transform', 'transform-origin'],
    'm22',
  ],
  [
    'animacion-pulso',
    'Un pulso continuo',
    'Animaciones',
    'Aplica los fotogramas pulso durante 2s y repítelos infinitamente.',
    'animation: pulso 2s infinite;',
    ['animation-name', 'animation-duration', 'animation-iteration-count'],
    'm23',
  ],
  [
    'animacion-alterna',
    'Un vaivén de tres ciclos',
    'Animaciones',
    'Aplica giro durante 2s, repítelo 3 veces y alterna la dirección.',
    'animation: giro 2s 3 alternate;',
    ['animation-name', 'animation-duration', 'animation-iteration-count', 'animation-direction'],
    'm23',
  ],
  [
    'fotogramas',
    'Escribe tus fotogramas',
    'Animaciones',
    'Crea @keyframes entrada de opacity: 0 (from) a opacity: 1 (to). Aplícalos durante 2s, infinitamente y en dirección alternate.',
    'animation: entrada 2s infinite alternate;',
    ['animation-name', 'animation-duration', 'animation-iteration-count', 'animation-direction'],
    'm23',
  ],
]
export const propertyExercises: PropertyExercise[] = seeds.map(
  ([
    id,
    title,
    category,
    description,
    declarations,
    properties,
    theory = 'm18',
    html = card,
    extra = '',
    target = '.muestra',
  ]) => {
    const frames =
      id === 'fotogramas' ? '@keyframes entrada { from { opacity: 0; } to { opacity: 1; } }\n' : ''
    const motion =
      category === 'Animaciones'
        ? '@keyframes pulso { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }\n@keyframes giro { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }\n'
        : ''
    const hover =
      category === 'Transiciones'
        ? '.muestra:hover, .muestra:focus-visible { background-color: #c7d2fe; transform: translateY(-6px); }\n'
        : ''
    const pseudo = target.includes('::') ? target.slice(target.indexOf('::')) : undefined
    return {
      id,
      title,
      category,
      description,
      theory: `/teoria/${theory}`,
      html,
      baseCss: base + extra + '\n' + motion + hover,
      starter: `${target} {\n\t/* Escribe tus propiedades aquí. */\n}\n`,
      solution: frames + `${target} {\n\t${declarations.split('; ').join(';\n\t')}\n}\n`,
      hint: `Trabaja con ${target}. Propiedades que necesitas: ${properties.join(', ')}. Revisa la teoría y compara con el objetivo.`,
      checks: properties.map((property) => ({
        selector: target.replace(/::.*/, ''),
        property,
        pseudo,
      })),
      keyframes: id === 'fotogramas' ? 'entrada' : undefined,
    }
  },
)
export const propertyCategories = [...new Set(propertyExercises.map((item) => item.category))]
