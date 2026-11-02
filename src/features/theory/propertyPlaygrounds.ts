import { curriculumSlugs } from '../../../packages/content/src/curriculumIds'

export type PlaygroundKind =
  | 'gradient'
  | 'position'
  | 'transform'
  | 'background'
  | 'functions'
  | 'typography'
  | 'units'
  | 'animation'
  | 'transition'
  | 'shadow'
  | 'flex'
  | 'grid'
export type PlaygroundValues = Record<string, string | number>
export interface PlaygroundControl {
  key: string
  label: string
  type: 'range' | 'color' | 'select'
  initial: string | number
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: string[]
  when?: { key: string; values: string[] }
}
interface PlaygroundDefinition {
  title: string
  goal: string
  tip: string
  controls: PlaygroundControl[]
}
const range = (
  key: string,
  label: string,
  initial: number,
  min: number,
  max: number,
  unit = '',
  step = 1,
): PlaygroundControl => ({ key, label, initial, min, max, unit, step, type: 'range' })
const select = (
  key: string,
  label: string,
  options: string[],
  initial = options[0]!,
): PlaygroundControl => ({ key, label, options, initial, type: 'select' })
const color = (key: string, label: string, initial: string): PlaygroundControl => ({
  key,
  label,
  initial,
  type: 'color',
})
const conditional = (control: PlaygroundControl, key: string, values: string[]) => ({
  ...control,
  when: { key, values },
})
export const playgroundDefinitions: Record<PlaygroundKind, PlaygroundDefinition> = {
  gradient: {
    title: 'Crear un gradiente',
    goal: 'Mezcla dos colores y compara cómo cambian la dirección y las paradas de color.',
    tip: 'Un gradiente es una imagen CSS. Las paradas indican dónde aparece cada color; no son márgenes.',
    controls: [
      select('type', 'Tipo de gradiente', ['linear', 'radial']),
      color('first', 'Primer color', '#4338ca'),
      color('second', 'Segundo color', '#06b6d4'),
      conditional(range('angle', 'Ángulo del gradiente', 90, 0, 360, '°'), 'type', ['linear']),
      range('stop', 'Parada del primer color', 15, 0, 80, '%'),
    ],
  },
  position: {
    title: 'Posicionar una caja',
    goal: 'Cambia el tipo de posición y desplázate dentro de la vista para descubrir qué referencia utiliza.',
    tip: 'El fondo rayado señala la zona inicial. static ignora top/left; relative conserva su hueco; absolute sale del flujo y usa el ancestro posicionado. fixed se refiere al viewport del ejemplo, no al de toda la app. sticky necesita desplazamiento y un límite como top.',
    controls: [
      select(
        'position',
        'Tipo de posición',
        ['static', 'relative', 'absolute', 'fixed', 'sticky'],
        'relative',
      ),
      range('x', 'Desplazamiento horizontal', 40, 0, 180, 'px'),
      range('y', 'Desplazamiento vertical', 40, 0, 180, 'px'),
      range('z', 'Nivel de apilamiento', 1, 0, 5),
    ],
  },
  transform: {
    title: 'Transformar sin mover el flujo',
    goal: 'Combina desplazamiento, giro y escala; compara la caja con su contorno original.',
    tip: 'El trazo discontinuo conserva el hueco original. transform-origin cambia el punto del giro y la escala; el orden de las funciones importa.',
    controls: [
      range('x', 'Traslación horizontal', 24, -80, 80, 'px'),
      range('y', 'Traslación vertical', 0, -40, 40, 'px'),
      range('angle', 'Giro', 15, -45, 45, '°'),
      range('scale', 'Escala', 1, 0.5, 1.5, '', 0.05),
      select('origin', 'Origen de transformación', ['center', 'top left', 'bottom right']),
    ],
  },
  background: {
    title: 'Colocar una imagen de fondo',
    goal: 'Compara cover, contain, posición y repetición sobre la misma imagen.',
    tip: 'cover llena la caja y puede recortar; contain conserva toda la imagen y puede dejar espacio. Un fondo decorativo no sustituye un img con texto alternativo cuando la imagen aporta información.',
    controls: [
      select('size', 'Tamaño del fondo', ['cover', 'contain', 'auto', '96px 64px']),
      select('position', 'Posición del fondo', ['left top', 'center', 'right bottom'], 'center'),
      select('repeat', 'Repetición del fondo', ['no-repeat', 'repeat', 'repeat-x']),
      range('height', 'Altura de la caja', 220, 140, 320, 'px'),
    ],
  },
  functions: {
    title: 'Experimentar con funciones CSS',
    goal: 'Cambia el ancho de la vista y observa cómo clamp, calc, min y max toman decisiones diferentes.',
    tip: 'vw depende del viewport; los porcentajes de width toman como referencia el contenedor. min y max comparan valores, no equivalen a min-width y max-width.',
    controls: [
      select('function', 'Función CSS', ['clamp', 'calc', 'min', 'max']),
      range('viewport', 'Viewport del experimento', 768, 320, 1024, 'px'),
      conditional(range('minimum', 'Tamaño mínimo', 24, 16, 32, 'px'), 'function', ['clamp']),
      conditional(range('preferred', 'Valor preferido', 4, 1, 8, 'vw', 0.5), 'function', ['clamp']),
      conditional(range('maximum', 'Tamaño máximo', 48, 40, 72, 'px'), 'function', ['clamp']),
      conditional(range('subtract', 'Espacio que se resta', 48, 0, 120, 'px'), 'function', [
        'calc',
      ]),
      conditional(range('limit', 'Valor de comparación', 320, 160, 480, 'px'), 'function', [
        'min',
        'max',
      ]),
    ],
  },
  typography: {
    title: 'Encontrar un ritmo de lectura',
    goal: 'Relaciona tamaño, interlineado, peso y longitud de línea sin cambiar el texto.',
    tip: 'line-height sin unidad multiplica el tamaño de letra. ch se basa en el ancho del glifo 0, no garantiza un número exacto de caracteres por línea.',
    controls: [
      select('font', 'Familia tipográfica', [
        'system-ui, sans-serif',
        'Georgia, serif',
        'monospace',
      ]),
      range('size', 'Tamaño de letra', 20, 14, 36, 'px'),
      select('weight', 'Peso de letra', ['400', '600', '800']),
      range('line', 'Interlineado', 1.6, 1, 2.2, '', 0.1),
      range('spacing', 'Espaciado entre letras', 0, -0.5, 4, 'px', 0.1),
      range('measure', 'Longitud de línea', 40, 20, 60, 'ch'),
    ],
  },
  units: {
    title: '¿De qué depende una unidad?',
    goal: 'Conserva el mismo número y cambia la unidad; después modifica su referencia.',
    tip: 'En este ancho, em usa la letra heredada, rem la raíz, % el contenedor y vw/vh el viewport del ejemplo. Una medida puede desbordar: observa el valor calculado y desplázate dentro de la vista.',
    controls: [
      range('amount', 'Cantidad', 50, 1, 100, '', 1),
      select('unit', 'Unidad de medida', ['px', 'rem', 'em', '%', 'vw', 'vh'], '%'),
      range('root', 'Letra de la raíz', 16, 12, 24, 'px'),
      range('parentFont', 'Letra del contenedor', 20, 12, 32, 'px'),
      range('parentWidth', 'Ancho del contenedor', 320, 160, 640, 'px'),
      range('viewport', 'Viewport del experimento', 768, 320, 1024, 'px'),
    ],
  },
  animation: {
    title: 'Construir una animación',
    goal: 'Decide destino, duración, retardo, ritmo y repeticiones. Reproduce y pausa para comparar.',
    tip: 'El retardo positivo espera; el negativo comienza con parte del recorrido ya transcurrido. alternate invierte la dirección de la siguiente repetición, si hay más de una. La muestra no arranca sola.',
    controls: [
      range('distance', 'Distancia del recorrido', 160, 20, 180, 'px'),
      range('duration', 'Duración de la animación', 2, 0.5, 5, 's', 0.1),
      range('delay', 'Retardo de la animación', 0, -2, 2, 's', 0.1),
      select('timing', 'Ritmo del experimento', ['linear', 'ease-in-out', 'steps(4, end)']),
      select('direction', 'Dirección de repetición', ['normal', 'alternate']),
      select('iterations', 'Número de repeticiones', ['1', '2']),
    ],
  },
  transition: {
    title: 'Cambiar entre dos estados',
    goal: 'Activa y desactiva el estado final y observa cómo se interpolan color y posición.',
    tip: 'La transición necesita que cambie un valor. Si activas el estado contrario durante el recorrido, el navegador retoma el cambio desde el estado visual actual.',
    controls: [
      range('duration', 'Duración de la transición', 0.8, 0.1, 3, 's', 0.1),
      select('timing', 'Ritmo de la transición', ['linear', 'ease', 'ease-in-out']),
      range('lift', 'Elevación final', 24, 0, 48, 'px'),
      color('first', 'Color inicial', '#4338ca'),
      color('second', 'Color final', '#06b6d4'),
    ],
  },
  shadow: {
    title: 'Dar profundidad y transparencia',
    goal: 'Separa los efectos de la sombra, el alfa del fondo y la opacidad del elemento completo.',
    tip: 'El canal alfa del fondo deja ver lo que hay detrás sin atenuar el texto. opacity afecta también al texto, al borde y a la sombra del elemento.',
    controls: [
      range('x', 'Sombra horizontal', 4, -16, 24, 'px'),
      range('y', 'Sombra vertical', 12, 0, 32, 'px'),
      range('blur', 'Desenfoque de sombra', 24, 0, 60, 'px'),
      range('spread', 'Expansión de sombra', 0, -8, 16, 'px'),
      range('alpha', 'Alfa de la sombra', 0.25, 0, 0.6, '', 0.05),
      range('fill', 'Alfa del fondo', 1, 0, 1, '', 0.1),
      range('opacity', 'Opacidad del elemento', 1, 0.2, 1, '', 0.1),
    ],
  },
  flex: {
    title: 'Distribuir con Flexbox',
    goal: 'Cambia la dirección, los ejes de alineación y la separación de tres elementos.',
    tip: 'justify-content actúa en el eje principal y align-items en el transversal. No cambies el orden visual para corregir un orden de lectura incorrecto.',
    controls: [
      select('direction', 'Dirección de Flexbox', ['row', 'column']),
      select('justify', 'Distribución principal', [
        'flex-start',
        'center',
        'space-between',
        'space-evenly',
      ]),
      select('align', 'Alineación transversal', ['stretch', 'flex-start', 'center', 'flex-end']),
      range('gap', 'Separación Flexbox', 16, 0, 32, 'px'),
    ],
  },
  grid: {
    title: 'Construir una cuadrícula',
    goal: 'Combina columnas, separación y un elemento que ocupa varias pistas.',
    tip: 'El primer elemento abarca como máximo las columnas que existen. Las demás tarjetas se colocan siguiendo el orden del HTML.',
    controls: [
      range('columns', 'Número de columnas', 3, 1, 4),
      range('gap', 'Separación Grid', 16, 0, 32, 'px'),
      range('height', 'Altura de las filas', 80, 48, 120, 'px'),
      range('span', 'Columnas del primer elemento', 1, 1, 4),
    ],
  },
}

export function initialPlaygroundValues(kind: PlaygroundKind): PlaygroundValues {
  return Object.fromEntries(
    playgroundDefinitions[kind].controls.map((field) => [field.key, field.initial]),
  )
}
export function normalizePlaygroundValues(
  kind: PlaygroundKind,
  input: PlaygroundValues,
): PlaygroundValues {
  return Object.fromEntries(
    playgroundDefinitions[kind].controls.map((field) => {
      const value = input[field.key] ?? field.initial
      if (field.type === 'range') {
        const number = Number(value)
        const clamped = Math.min(field.max!, Math.max(field.min!, number))
        const stepped = Number(
          (
            field.min! +
            Math.round((clamped - field.min!) / (field.step ?? 1)) * (field.step ?? 1)
          ).toFixed(4),
        )
        return [field.key, Number.isFinite(number) ? stepped : field.initial]
      }
      if (field.type === 'color')
        return [field.key, /^#[\da-f]{6}$/i.test(String(value)) ? value : field.initial]
      return [field.key, field.options!.includes(String(value)) ? value : field.initial]
    }),
  )
}
const rule = (selector: string, declarations: string[]) =>
  `${selector} {\n${declarations.map((line) => '\t' + line + ';').join('\n')}\n}\n`
const card =
  '<article class="muestra"><h2>Una idea con CSS</h2><p>El diseño ayuda a comprender el contenido.</p></article>'
const cards =
  '<section class="muestra"><article>1</article><article>2</article><article>3</article><article>4</article></section>'
export const backgroundDrawing =
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240" viewBox="0 0 600 240"><rect width="600" height="240" fill="#cffafe"/><circle cx="480" cy="60" r="30" fill="#fbbf24"/><path d="M0 210 150 40 300 210 430 80 600 220V240H0Z" fill="#a5b4fc"/><path d="M0 240 210 110 360 240 520 150 600 240" fill="#4338ca"/><g font-family="system-ui" font-size="28" fill="#172554"><text x="20" y="40">1</text><text x="290" y="40">2</text><text x="560" y="40">3</text></g></svg>'
export const backgroundDataUrl = 'data:image/svg+xml,' + encodeURIComponent(backgroundDrawing)

export function buildPlayground(kind: PlaygroundKind, input: PlaygroundValues, playing = false) {
  const v = normalizePlaygroundValues(kind, input)
  let html = card
  let baseCss =
    '.muestra { padding: 24px; border: 2px solid #a5b4fc; border-radius: 12px; background: white; }'
  let css = ''
  let observation = playgroundDefinitions[kind].tip
  const width = Number(v.viewport ?? 375)
  switch (kind) {
    case 'gradient': {
      html = '<div class="muestra" role="img" aria-label="Gradiente de dos colores"></div>'
      baseCss = '.muestra { min-height: 240px; border-radius: 16px; }'
      const image =
        v.type === 'linear'
          ? `linear-gradient(${v.angle}deg, ${v.first} ${v.stop}%, ${v.second} 100%)`
          : `radial-gradient(circle at center, ${v.first} ${v.stop}%, ${v.second} 100%)`
      css = rule('.muestra', [`background-image: ${image}`])
      observation =
        v.type === 'linear'
          ? `${v.angle}° indica la dirección. El primer color alcanza su parada en el ${v.stop}% del recorrido.`
          : `El gradiente nace en el centro. Su primera parada está al ${v.stop}% del radio del gradiente.`
      break
    }
    case 'position':
      html =
        '<div class="lienzo"><div class="origen">Zona inicial</div><div class="muestra">Caja posicionada</div><p class="referencia">Este texto está después de la caja en el HTML. Desplázate dentro de esta vista.</p><p class="abajo">Final del contenedor</p></div>'
      baseCss =
        '.lienzo { position: relative; height: 900px; padding: 24px; border: 2px dashed #64748b; } .origen { position: absolute; top: 24px; left: 24px; width: 140px; height: 90px; border: 2px dashed #92400e; font-size: 12px; } .muestra { width: 140px; height: 90px; padding: 12px; background: #c7d2fe; border: 2px solid #4338ca; } .referencia { position: relative; max-width: 320px; } .abajo { margin-top: 600px; }'
      css = rule('.muestra', [
        `position: ${v.position}`,
        `left: ${v.x}px`,
        `top: ${v.y}px`,
        `z-index: ${v.z}`,
      ])
      observation =
        v.position === 'static'
          ? 'top y left están escritos, pero static los ignora.'
          : v.position === 'fixed'
            ? 'Desplázate dentro de la vista: la caja permanece fijada al viewport del ejemplo.'
            : v.position === 'sticky'
              ? 'Desplázate dentro de la vista: la caja se adhiere al alcanzar top y termina con su contenedor.'
              : v.position === 'absolute'
                ? 'La caja sale del flujo. Su referencia es .lienzo, que tiene position: relative.'
                : 'La caja se desplaza visualmente, pero el texto siguiente conserva el espacio que ocupaba antes.'
      break
    case 'transform':
      html =
        '<div class="lienzo"><div class="origen">Hueco original</div><div class="muestra">CSS</div></div>'
      baseCss =
        '.lienzo { position: relative; height: 300px; } .origen, .muestra { position: absolute; left: calc(50% - 60px); top: 90px; width: 120px; height: 100px; display: grid; place-items: center; } .origen { border: 2px dashed #64748b; font-size: 12px; } .muestra { background: #c7d2fe; border: 2px solid #4338ca; font-size: 24px; }'
      css = rule('.muestra', [
        `transform: translate(${v.x}px, ${v.y}px) rotate(${v.angle}deg) scale(${v.scale})`,
        `transform-origin: ${v.origin}`,
      ])
      break
    case 'background':
      html =
        '<div class="muestra" role="img" aria-label="Paisaje geométrico utilizado como fondo decorativo"></div>'
      baseCss = '.muestra { border: 2px solid #4338ca; background-color: #eef2ff; }'
      css = rule('.muestra', [
        `height: ${v.height}px`,
        'background-image: url("paisaje.svg")',
        `background-size: ${v.size}`,
        `background-position: ${v.position}`,
        `background-repeat: ${v.repeat}`,
      ])
      break
    case 'functions':
      if (v.function === 'clamp') {
        css = rule('.muestra', [
          `font-size: clamp(${v.minimum}px, ${v.preferred}vw, ${v.maximum}px)`,
        ])
        observation = `${v.preferred}vw a ${width}px equivale a ${Number(((width * Number(v.preferred)) / 100).toFixed(2))}px. clamp lo limita entre ${v.minimum}px y ${v.maximum}px: resultado ${Number(Math.min(Number(v.maximum), Math.max(Number(v.minimum), (width * Number(v.preferred)) / 100)).toFixed(2))}px.`
        html = '<p class="muestra">Un título que encuentra su medida.</p>'
      } else {
        css = rule('.muestra', [
          `width: ${v.function === 'calc' ? `calc(100% - ${v.subtract}px)` : `${v.function}(${v.function === 'min' ? '100%' : '50%'}, ${v.limit}px)`}`,
        ])
        observation =
          v.function === 'calc'
            ? `El ancho se calcula restando ${v.subtract}px al 100% del contenedor disponible.`
            : `${v.function} elige el ${v.function === 'min' ? 'menor' : 'mayor'} de los dos valores. Prueba también una vista estrecha.`
      }
      break
    case 'typography':
      html =
        '<article><h2>Leer también es una experiencia de diseño</h2><p class="muestra">Una página legible deja respirar sus palabras. El tamaño, el interlineado y la longitud de línea trabajan juntos. Cambia un solo valor cada vez y observa dónde terminan las líneas, cuánto espacio hay entre ellas y qué palabras atraen tu atención.</p></article>'
      baseCss = '.muestra { margin: 0; }'
      css = rule('.muestra', [
        `font-family: ${v.font}`,
        `font-size: ${v.size}px`,
        `font-weight: ${v.weight}`,
        `line-height: ${v.line}`,
        `letter-spacing: ${v.spacing}px`,
        `max-width: ${v.measure}ch`,
      ])
      observation = `La caja de línea mide ${Number((Number(v.size) * Number(v.line)).toFixed(2))}px: ${v.size}px × ${v.line}. El límite de ${v.measure}ch depende de la fuente.`
      break
    case 'units': {
      html =
        '<p>Contenedor de referencia</p><div class="contenedor"><div class="muestra" role="img" aria-label="Barra con el ancho calculado"></div></div>'
      baseCss =
        '.contenedor { outline: 2px dashed #64748b; padding: 0; } .muestra { height: 64px; background: #4338ca; }'
      css =
        rule('html', [`font-size: ${v.root}px`]) +
        rule('.contenedor', [`width: ${v.parentWidth}px`, `font-size: ${v.parentFont}px`]) +
        rule('.muestra', [`width: ${v.amount}${v.unit}`])
      const references: Record<string, number> = {
        px: 1,
        rem: Number(v.root),
        em: Number(v.parentFont),
        '%': Number(v.parentWidth) / 100,
        vw: width / 100,
        vh: 520 / 100,
      }
      observation = `${v.amount}${v.unit} = ${Number((Number(v.amount) * references[String(v.unit)]!).toFixed(2))}px en esta escena. El viewport mide ${width} × 520px; el contenedor mide ${v.parentWidth}px.`
      break
    }
    case 'animation':
      html = '<div class="muestra"></div>'
      baseCss =
        '.muestra { width: 56px; height: 56px; margin: 64px 16px; border: 2px solid #c7d2fe; border-radius: 12px; background: #4338ca; }'
      css =
        '@keyframes csslab-recorrido {\n\tfrom {\n\t\ttransform: translateX(0);\n\t}\n\tto {\n\t\ttransform: translateX(var(--distancia));\n\t}\n}\n' +
        rule('.muestra', [
          `--distancia: ${v.distance}px`,
          `animation: csslab-recorrido ${v.duration}s ${v.timing} ${v.delay}s ${v.iterations} ${v.direction} both`,
          `animation-play-state: ${playing ? 'running' : 'paused'}`,
        ])
      observation = `Intervalo activo: ${Number((Number(v.duration) * Number(v.iterations)).toFixed(2))}s; ${Number(v.delay) < 0 ? `comienza con ${Math.abs(Number(v.delay))}s ya transcurridos` : `antes hay ${v.delay}s de retardo`}. El destino está a ${v.distance}px.`
      break
    case 'transition':
      html = '<div class="muestra"></div>'
      baseCss = '.muestra { width: 96px; height: 72px; margin: 64px 16px; border-radius: 12px; }'
      css =
        rule('.muestra', [
          `background-color: ${v.first}`,
          'transform: translateY(0)',
          `transition: background-color ${v.duration}s ${v.timing}, transform ${v.duration}s ${v.timing}`,
        ]) +
        rule('.muestra.is-active', [
          `background-color: ${v.second}`,
          `transform: translateY(-${v.lift}px)`,
        ])
      break
    case 'shadow':
      baseCss =
        'body { background: repeating-conic-gradient(#e0e7ff 0% 25%, #fff 0% 50%) 0 / 32px 32px; } .muestra { margin: 48px 24px; padding: 24px; border: 2px solid #4338ca; border-radius: 12px; }'
      css = rule('.muestra', [
        `box-shadow: ${v.x}px ${v.y}px ${v.blur}px ${v.spread}px rgb(15 23 42 / ${v.alpha})`,
        `background-color: rgb(255 255 255 / ${v.fill})`,
        `opacity: ${v.opacity}`,
      ])
      break
    case 'flex':
      html = cards.replace('<article>4</article>', '')
      baseCss =
        '.muestra { height: 320px; padding: 16px; border: 2px dashed #64748b; } article { min-width: 48px; min-height: 48px; padding: 12px; background: #c7d2fe; border: 2px solid #4338ca; } article:nth-child(2) { font-size: 28px; }'
      css = rule('.muestra', [
        'display: flex',
        `flex-direction: ${v.direction}`,
        `justify-content: ${v.justify}`,
        `align-items: ${v.align}`,
        `gap: ${v.gap}px`,
      ])
      break
    case 'grid':
      html = cards
      baseCss =
        '.muestra { padding: 16px; border: 2px dashed #64748b; } article { display: grid; place-items: center; min-width: 0; background: #c7d2fe; border: 2px solid #4338ca; }'
      css =
        rule('.muestra', [
          'display: grid',
          `grid-template-columns: repeat(${v.columns}, minmax(0, 1fr))`,
          `grid-auto-rows: ${v.height}px`,
          `gap: ${v.gap}px`,
        ]) +
        rule('.muestra > :first-child', [
          `grid-column: span ${Math.min(Number(v.span), Number(v.columns))}`,
        ])
      observation = `${v.columns} columnas; la primera tarjeta ocupa ${Math.min(Number(v.span), Number(v.columns))}. El número se limita para no crear columnas implícitas por accidente.`
  }
  return {
    values: v,
    html,
    baseCss,
    css,
    previewCss: css.replace('url("paisaje.svg")', `url("${backgroundDataUrl}")`),
    observation,
    width,
  }
}

export function lessonPlaygrounds(id: string): PlaygroundKind[] {
  const core: Record<string, PlaygroundKind[]> = {
    m10: ['functions', 'units'],
    m15: ['flex'],
    m16: ['grid'],
    m17: ['units'],
    m18: ['typography', 'gradient', 'background'],
    m19: ['position'],
    m20: ['shadow'],
    m21: ['transition'],
    m22: ['transform'],
    m23: ['animation'],
    m24: ['background'],
  }
  if (core[id]) return core[id]!
  const slug = curriculumSlugs[Number(id.slice(1)) - 25]
  if (!slug) return []
  if (['espaciado-letras'].includes(slug)) return ['typography']
  if (slug === 'ancho-calculado') return ['functions', 'units']
  if (slug === 'degradado-radial') return ['gradient']
  if (['tamano-fondo', 'posicion-fondo', 'repeticion-fondo', 'recorte-fondo'].includes(slug))
    return ['background']
  if (slug.startsWith('flex-') || slug === 'orden-visual') return ['flex']
  if (
    [
      'separacion-filas',
      'separacion-columnas',
      'filas-implicitas',
      'flujo-grid',
      'ocupar-columnas',
      'ocupar-filas',
      'alineacion-grid',
      'subrejilla',
    ].includes(slug)
  )
    return ['grid']
  if (['desplazar-relativo', 'anclaje-logico', 'aislar-capas'].includes(slug)) return ['position']
  if (['inclinacion', 'cara-posterior', 'perspectiva', 'espacio-3d'].includes(slug))
    return ['transform']
  if (slug === 'transiciones-multiples') return ['transition']
  if (
    ['relleno-animacion', 'pasos-animacion', 'retardo-negativo', 'movimiento-reducido'].includes(
      slug,
    )
  )
    return ['animation']
  return []
}
