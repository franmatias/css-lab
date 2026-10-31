import { lessons as foundationLessons } from './index'
import { theoryLessonSchema, type TheoryLesson } from './practicalTheory'
const html =
  '<main class="escena"><article class="tarjeta"><span class="etiqueta">CSS en acción</span><h1>Diseña con intención</h1><p>Una tarjeta accesible, legible y adaptable.</p><button type="button">Explorar</button></article></main>'
const base =
  '* { box-sizing: border-box; }\nbody { margin: 0; padding: 1.5rem; font: 16px/1.6 system-ui, sans-serif; background: #e0e7ff; color: #172554; }\n.tarjeta { position: relative; max-width: 32rem; margin-inline: auto; padding: 2rem; border: 1px solid #a5b4fc; border-radius: 1rem; background: white; }\nh1 { margin: .5rem 0; font-size: 2rem; line-height: 1.2; }\nbutton { padding: .75rem 1rem; border: 0; border-radius: .5rem; font: inherit; color: white; background: #4338ca; cursor: pointer; }\nbutton:focus-visible { outline: 3px solid #0e7490; outline-offset: 4px; }\n'
type Topic = {
  id: string
  name: string
  objective: string
  explanation: string
  ideas: string[]
  sections: NonNullable<TheoryLesson['sections']>
  css: string
  steps: string[]
  pitfall: string
  quiz: TheoryLesson['quiz']
  property: string
  reference: string
}
const topics: Topic[] = [
  {
    id: 'm17',
    name: 'Modelo de caja y medidas',
    objective: 'Calcular el espacio de una caja y elegir medidas que respeten su contenido.',
    explanation:
      'Cada elemento genera una caja. Contenido, relleno, borde y margen explican por qué dos bloques con el mismo width pueden ocupar espacios distintos.',
    ideas: [
      'El contenido se rodea de padding, border y margin, en ese orden.',
      'Con content-box, width mide solo el contenido; con border-box incluye relleno y borde.',
      'El margen queda fuera del ancho declarado, incluso con border-box.',
      'rem toma como referencia la raíz; em depende del contexto de la propiedad.',
      'Las propiedades lógicas, como padding-inline, se adaptan a la dirección de escritura.',
    ],
    sections: [
      {
        title: '1. Medir antes de ajustar',
        paragraph:
          'Una caja con width: 280px, padding: 24px y borde de 2px ocupa 332px con content-box.',
        points: [
          'Suma 280 + 48 + 4 para obtener el ancho exterior sin márgenes.',
          'Con border-box el ancho exterior es 280px y el contenido dispone de 228px.',
        ],
      },
      {
        title: '2. Separación con intención',
        paragraph: 'Usa relleno para separar el contenido de su borde y margen para separar cajas.',
        points: [
          'margin-inline: auto centra un bloque cuando dispone de espacio libre y un ancho limitado.',
          'Los márgenes verticales de ciertos bloques pueden colapsar; gap en flex o grid evita depender de ese comportamiento.',
        ],
      },
      {
        title: '3. Medidas adaptables',
        paragraph:
          'El ancho debe responder al espacio disponible y la altura debería poder crecer con el texto.',
        points: [
          'width: min(100%, 32rem) combina un límite con adaptación.',
          'Evita alturas fijas para párrafos: el zoom y las traducciones necesitan espacio.',
        ],
      },
    ],
    css: '.tarjeta { box-sizing: border-box; width: min(100%, 32rem); padding: 24px; border: 2px solid #4338ca; margin-block: 24px; }',
    steps: [
      'Cambia border-box por content-box y compara el ancho exterior.',
      'Modifica padding de 24px a 40px.',
      'Prueba 375px y aumenta el tamaño de letra.',
    ],
    pitfall: 'border-box no incluye margin dentro de width.',
    property: 'margen',
    reference:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model',
    quiz: [
      {
        question: '¿Qué incluye width con border-box?',
        options: ['Contenido, padding y borde', 'También los márgenes', 'Solo el contenido'],
        answer: 0,
      },
      {
        question: '¿Qué crea espacio dentro del borde?',
        options: ['margin', 'padding', 'z-index'],
        answer: 1,
      },
      {
        question: '¿Qué facilita la adaptación al texto?',
        options: [
          'Una altura fija pequeña',
          'Ocultar todo desbordamiento',
          'Permitir que la altura crezca',
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 'm18',
    name: 'Tipografía, color y fondos',
    objective: 'Crear jerarquía visual con texto legible, colores y fondos adecuados.',
    explanation:
      'El tamaño, el interlineado y el contraste construyen la lectura. Los fondos acompañan al contenido sin sustituirlo.',
    ideas: [
      'font-family permite una lista de respaldo y debe terminar con una familia genérica.',
      'line-height sin unidad escala con el tamaño de letra heredado.',
      'Usa rem para tamaños base y limita las líneas de texto con ch.',
      'Un degradado es una imagen CSS, no un color de fondo.',
      'No uses solo el color para comunicar un error, selección o estado.',
    ],
    sections: [
      {
        title: '1. Jerarquía y ritmo',
        paragraph: 'El título guía la mirada y el cuerpo necesita una lectura cómoda.',
        points: [
          'Combina tamaño, peso y espacio; no recurras a mayúsculas para todos los textos.',
          'Un interlineado de 1.5 o 1.6 es un punto de partida, no una regla universal.',
        ],
      },
      {
        title: '2. Color con significado',
        paragraph: 'Los colores CSS admiten nombres, hexadecimal y funciones como rgb() y hsl().',
        points: [
          'rgb(67 56 202 / 20%) añade transparencia al color, sin afectar al texto.',
          'Comprueba contraste sobre el fondo real, especialmente en degradados y transparencias.',
        ],
      },
      {
        title: '3. Fondos y decoración',
        paragraph:
          'background agrupa varias propiedades y puede restablecer valores que no escribas.',
        points: [
          'Usa background-color para modificar solo el color.',
          'linear-gradient(135deg, color1, color2) crea un fondo sin descargar una imagen.',
        ],
      },
    ],
    css: 'h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3rem); font-weight: 700; }\np { max-width: 60ch; line-height: 1.8; }\n.escena { padding: 1rem; background: linear-gradient(135deg, #e0e7ff, #cffafe); }',
    steps: [
      'Cambia el interlineado de 1.8 a 1.2 y compara la lectura.',
      'Modifica el ángulo del degradado.',
      'Prueba anchos distintos y observa el título fluido.',
    ],
    pitfall: 'Una medida en vw por sí sola puede dificultar el aumento de texto.',
    property: 'color-texto',
    reference:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Fundamentals',
    quiz: [
      {
        question: '¿Qué representa line-height: 1.5?',
        options: ['1.5 píxeles', 'Un factor respecto al tamaño de letra', 'El ancho del párrafo'],
        answer: 1,
      },
      {
        question: '¿Qué propiedad admite linear-gradient()?',
        options: ['background-image', 'color', 'font-weight'],
        answer: 0,
      },
      {
        question: '¿Cómo comunicar un error?',
        options: ['Solo en rojo', 'Ocultando la etiqueta', 'Con texto o icono además del color'],
        answer: 2,
      },
    ],
  },
  {
    id: 'm19',
    name: 'Posicionamiento y capas',
    objective:
      'Elegir entre el flujo normal, relative, absolute, fixed y sticky y entender sus capas.',
    explanation:
      'El flujo normal resuelve la mayoría de una página. El posicionamiento especial sirve para superponer o mantener elementos en contextos concretos.',
    ideas: [
      'relative conserva el espacio original del elemento.',
      'absolute sale del flujo y toma como referencia su bloque contenedor.',
      'fixed normalmente toma el viewport como referencia; algunas propiedades de ancestros pueden cambiarlo.',
      'sticky se desplaza con el contenido hasta alcanzar un umbral como top: 0.',
      'z-index se interpreta dentro de contextos de apilamiento, no como una clasificación global.',
    ],
    sections: [
      {
        title: '1. Etiquetas sobre una tarjeta',
        paragraph:
          'Un contenedor relativo permite situar una etiqueta absoluta sin anclarla a toda la página.',
        points: [
          'Pon position: relative en la tarjeta y absolute en la etiqueta.',
          'top y right son físicos; inset-block-start e inset-inline-end expresan la intención lógica.',
        ],
      },
      {
        title: '2. Cabeceras que acompañan',
        paragraph: 'sticky necesita un umbral y espacio para desplazarse dentro de su contenedor.',
        points: [
          'Comprueba qué ancestro tiene overflow: auto o scroll.',
          'Una cabecera pegajosa no debe tapar el foco ni ocupar casi toda una pantalla pequeña.',
        ],
      },
      {
        title: '3. Comprender las capas',
        paragraph:
          'Transformaciones y opacidad menor que uno pueden crear contextos de apilamiento.',
        points: [
          'Un z-index enorme de un hijo no lo saca del contexto de su ancestro.',
          'Usa capas pequeñas y con nombre mediante variables en lugar de números arbitrarios.',
        ],
      },
    ],
    css: '.tarjeta { position: relative; padding-top: 3rem; }\n.etiqueta { position: absolute; inset-block-start: .75rem; inset-inline-end: 1rem; z-index: 1; padding: .25rem .5rem; background: #fef3c7; }',
    steps: [
      'Cambia la distancia de la etiqueta al borde.',
      'Quita position: relative y observa la nueva referencia.',
      'Restaura la referencia y prueba un ancho pequeño.',
    ],
    pitfall: 'absolute no reserva espacio; el contenido debe disponer de separación suficiente.',
    property: 'posicion-absoluta',
    reference: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position',
    quiz: [
      {
        question: '¿Qué posición conserva su espacio en el flujo?',
        options: ['absolute', 'fixed', 'relative'],
        answer: 2,
      },
      {
        question: '¿Qué necesita sticky para empezar a pegarse?',
        options: ['Un umbral como top: 0', 'Un z-index de 99999', 'display: none'],
        answer: 0,
      },
      {
        question: '¿Dónde se compara z-index?',
        options: [
          'Siempre en todo el documento',
          'Dentro de contextos de apilamiento',
          'Solo en tablas',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'm20',
    name: 'Sombras y transparencias',
    objective: 'Crear profundidad y superficies transparentes conservando la legibilidad.',
    explanation:
      'Las sombras separan planos sin cambiar las dimensiones de la caja. La transparencia permite ver el fondo y exige comprobar el resultado de la mezcla.',
    ideas: [
      'box-shadow sigue la caja; text-shadow sigue los caracteres.',
      'Una sombra de caja admite desplazamiento X, Y, desenfoque, expansión y color.',
      'inset dibuja la sombra hacia el interior.',
      'El canal alfa de un color afecta a ese color; opacity afecta al conjunto con sus descendientes.',
      'Ni una sombra ni el color deben ser la única señal de que algo se puede pulsar.',
    ],
    sections: [
      {
        title: '1. Construir una sombra',
        paragraph: 'Empieza con una sombra suave y modifica un parámetro cada vez.',
        points: [
          'Modifica primero desplazamientos y después desenfoque y expansión.',
          'Puedes separar varias sombras con comas; un exceso de desenfoque resta claridad.',
        ],
      },
      {
        title: '2. Elegir la transparencia',
        paragraph:
          'Para una superficie translúcida, suele convenir un color con alfa antes que opacity.',
        points: [
          'Un fondo blanco con alfa conserva el texto completamente opaco.',
          'opacity: .5 aplica transparencia al elemento compuesto, incluidos sus hijos.',
        ],
      },
      {
        title: '3. Probar el fondo real',
        paragraph: 'La transparencia modifica el contraste según lo que haya detrás.',
        points: [
          'Prueba fondos claros, oscuros y con franjas.',
          'No sustituyas un contorno de foco visible por una sombra casi imperceptible.',
        ],
      },
    ],
    css: '.escena { padding: 1rem; background: repeating-linear-gradient(45deg, #c7d2fe 0 16px, #e0e7ff 16px 32px); }\n.tarjeta { background: rgb(255 255 255 / 85%); box-shadow: 0 8px 24px rgb(15 23 42 / 20%); }\nh1 { text-shadow: 1px 2px 3px rgb(67 56 202 / 15%); }',
    steps: [
      'Aumenta el desenfoque de la sombra y compara.',
      'Cambia el alfa del fondo entre 30% y 100%.',
      'Prueba opacity: .5 y observa la diferencia en el texto; después retírala.',
    ],
    pitfall:
      'opacity también hace transparentes los descendientes; no se corrige poniendo opacity: 1 en un hijo.',
    property: 'sombra-caja',
    reference: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow',
    quiz: [
      {
        question: '¿Cómo mantener el texto opaco?',
        options: [
          'Usar opacity: .2 en su padre',
          'Usar un color de fondo con alfa',
          'Aplicar opacity: 1 al hijo de un padre transparente',
        ],
        answer: 1,
      },
      {
        question: '¿Qué sombra sigue las letras?',
        options: ['box-shadow', 'border-shadow', 'text-shadow'],
        answer: 2,
      },
      {
        question: '¿La sombra cambia el ancho calculado?',
        options: ['No', 'Sí, siempre', 'Solo si es azul'],
        answer: 0,
      },
    ],
  },
  {
    id: 'm21',
    name: 'Transiciones entre estados',
    objective:
      'Suavizar cambios de estado con duración, ritmo y retardo y ofrecer una alternativa sin movimiento.',
    explanation:
      'Una transición interpola valores cuando cambia una propiedad. Necesita un estado inicial, otro final y una duración distinta de cero.',
    ideas: [
      'transition-property identifica la propiedad que cambia.',
      'transition-duration define cuánto tarda; transition-delay cuánto espera.',
      'transition-timing-function controla el ritmo, por ejemplo ease-in-out.',
      'Declara la transición en el estado base para suavizar tanto la entrada como la salida.',
      'Incluye :focus-visible junto a :hover para que la interacción funcione con teclado.',
    ],
    sections: [
      {
        title: '1. Del reposo a la interacción',
        paragraph: 'Un botón puede cambiar de fondo y elevarse ligeramente al recibir foco.',
        points: [
          'Especifica background-color o transform en lugar de transition: all.',
          'El foco sigue necesitando un indicador visible aunque haya movimiento.',
        ],
      },
      {
        title: '2. Una secuencia temporal',
        paragraph: 'La abreviatura agrupa propiedad, duración, función temporal y retardo.',
        points: [
          'El primer tiempo expresa duración; el segundo, retardo.',
          'Separa con comas las transiciones de distintas propiedades.',
        ],
      },
      {
        title: '3. Respetar las preferencias',
        paragraph: 'El movimiento decorativo puede incomodar a algunas personas.',
        points: [
          'Usa @media (prefers-reduced-motion: reduce) para retirar el desplazamiento.',
          'Mantén una señal estática de interacción: fondo, borde o subrayado.',
        ],
      },
    ],
    css: 'button { transition: transform 300ms ease-in-out, background-color 300ms; }\nbutton:hover, button:focus-visible { transform: translateY(-6px); background-color: #312e81; }\n@media (prefers-reduced-motion: reduce) { button { transition: none; } button:hover, button:focus-visible { transform: none; } }',
    steps: [
      'Pasa el ratón y luego enfoca el botón con Tab.',
      'Cambia 300ms por 800ms y compara el ritmo.',
      'Prueba la preferencia de movimiento reducido del sistema.',
    ],
    pitfall:
      'Sin un cambio entre dos valores no hay transición; una duración por sí sola no produce movimiento.',
    property: 'transicion-color',
    reference: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using',
    quiz: [
      {
        question: '¿Qué inicia una transición?',
        options: ['Un cambio de valor', 'Escribir únicamente duration', 'Añadir un comentario'],
        answer: 0,
      },
      {
        question: '¿Qué representa el segundo tiempo en la abreviatura?',
        options: ['La duración', 'El retardo', 'El número de repeticiones'],
        answer: 1,
      },
      {
        question: '¿Qué preferencia consulta el movimiento reducido?',
        options: ['prefers-color-scheme', 'orientation', 'prefers-reduced-motion'],
        answer: 2,
      },
    ],
  },
  {
    id: 'm22',
    name: 'Transformaciones en 2D y 3D',
    objective:
      'Desplazar, girar y escalar elementos y razonar sobre el orden y el punto de origen.',
    explanation:
      'Las transformaciones cambian cómo se dibuja un elemento. Su espacio en el flujo permanece, por lo que hay que vigilar superposiciones y desbordamientos.',
    ideas: [
      'translate() desplaza; rotate() gira; scale() cambia la escala.',
      'transform-origin fija el punto desde el que se transforma.',
      'El orden de las funciones cambia el resultado de su composición.',
      'Una transformación puede crear un contexto de apilamiento.',
      'Las transformaciones 3D usan ejes X, Y y Z; perspective aporta profundidad visual.',
    ],
    sections: [
      {
        title: '1. Transformar sin redistribuir',
        paragraph: 'Una tarjeta trasladada conserva su hueco original.',
        points: [
          'translateX(24px) desplaza la representación 24px hacia la derecha.',
          'No uses transform como sustituto de Grid o Flexbox para organizar toda una página.',
        ],
      },
      {
        title: '2. Origen y orden',
        paragraph:
          'Una rotación alrededor del centro no coincide con otra alrededor de una esquina.',
        points: [
          'transform-origin: left top ancla el efecto en la esquina superior izquierda.',
          'Prueba rotate(6deg) translateX(24px) y después invierte las funciones.',
        ],
      },
      {
        title: '3. Profundidad con moderación',
        paragraph: 'En 3D, el contenedor puede proporcionar perspectiva a sus descendientes.',
        points: [
          'perspective: 600px en el padre permite percibir un rotateY().',
          'Conserva el texto legible y reduce el movimiento cuando la persona lo solicite.',
        ],
      },
    ],
    css: '.tarjeta { transform-origin: left top; transform: translateX(12px) rotate(3deg) scale(.95); }\n@media (prefers-reduced-motion: reduce) { .tarjeta { transform: none; } }',
    steps: [
      'Cambia el origen de left top a center.',
      'Invierte rotate() y translateX() y compara.',
      'Retira scale() y comprueba que el resto del flujo no se redistribuye.',
    ],
    pitfall: 'Escalar visualmente una caja no reduce el espacio que ocupa en el flujo.',
    property: 'traslacion',
    reference: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using',
    quiz: [
      {
        question: '¿Qué función gira?',
        options: ['translate()', 'rotate()', 'scale()'],
        answer: 1,
      },
      {
        question: '¿Qué determina transform-origin?',
        options: ['El color', 'El margen', 'El punto de referencia'],
        answer: 2,
      },
      {
        question: '¿Importa el orden de las funciones?',
        options: ['Sí, puede cambiar el resultado', 'No, nunca', 'Solo para el color'],
        answer: 0,
      },
    ],
  },
  {
    id: 'm23',
    name: 'Animaciones con @keyframes',
    objective: 'Escribir fotogramas, controlar los ciclos y pausar o reducir una animación.',
    explanation:
      'Una animación puede recorrer varios estados sin esperar a una interacción. Los fotogramas describen los valores y animation establece cómo reproducirlos.',
    ideas: [
      '@keyframes define una secuencia con from, to o porcentajes.',
      'animation-name conecta la secuencia con el elemento.',
      'animation-duration mide un ciclo; iteration-count establece las repeticiones.',
      'animation-direction: alternate invierte el sentido en ciclos alternos.',
      'animation-play-state permite pausar; la pausa debe estar al alcance de quien la necesita.',
    ],
    sections: [
      {
        title: '1. Escribir la secuencia',
        paragraph: 'Cada fotograma describe propiedades animables en un momento del ciclo.',
        points: [
          'from equivale a 0% y to a 100%.',
          'Usa un nombre descriptivo, como pulso, y evita destellos rápidos.',
        ],
      },
      {
        title: '2. Controlar la reproducción',
        paragraph: 'La abreviatura animation reúne el nombre y las opciones temporales.',
        points: [
          'Un ciclo no equivale a toda la duración de varias repeticiones.',
          'animation-fill-mode controla los estilos fuera del intervalo activo; no completa una tarea por sí mismo.',
        ],
      },
      {
        title: '3. Movimiento útil y accesible',
        paragraph: 'Una animación debe ayudar a comprender un cambio y no impedir la lectura.',
        points: [
          'Ofrece pausa para efectos continuos y conserva un estado estático comprensible.',
          'Con prefers-reduced-motion: reduce, desactiva los efectos decorativos sin ocultar información.',
        ],
      },
    ],
    css: '@keyframes pulso { from { transform: scale(1); } to { transform: scale(1.04); } }\n.tarjeta { animation: pulso 2s ease-in-out infinite alternate; }\n.tarjeta:hover, .tarjeta:focus-within { animation-play-state: paused; }\n@media (prefers-reduced-motion: reduce) { .tarjeta { animation: none; } }',
    steps: [
      'Observa un ciclo y cambia su duración.',
      'Pasa el ratón o enfoca el botón para pausar.',
      'Cambia alternate por normal y compara la vuelta al inicio.',
    ],
    pitfall: 'Escribir animation-name sin definir sus @keyframes no crea una secuencia visible.',
    property: 'fotogramas',
    reference: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using',
    quiz: [
      {
        question: '¿Dónde se escriben los estados?',
        options: ['En @keyframes', 'En @import', 'En z-index'],
        answer: 0,
      },
      {
        question: '¿Qué hace alternate?',
        options: [
          'Oculta la caja',
          'Invierte el sentido en ciclos alternos',
          'Elimina todos los fotogramas',
        ],
        answer: 1,
      },
      {
        question: '¿Cómo se pausa una animación?',
        options: ['opacity: 0', 'display: grid', 'animation-play-state: paused'],
        answer: 2,
      },
    ],
  },
  {
    id: 'm24',
    name: 'Imágenes, desbordamiento y accesibilidad',
    objective:
      'Controlar el contenido que no cabe y crear componentes que resistan zoom, teclado y textos largos.',
    explanation:
      'Un diseño se comprueba con contenido real. Las imágenes, las palabras largas y el foco revelan límites que no se ven en una maqueta ideal.',
    ideas: [
      'max-width: 100% y height: auto conservan las proporciones de imágenes flexibles.',
      'object-fit controla cómo se adapta una imagen a una caja con dimensiones definidas.',
      'overflow: auto permite desplazamiento cuando hace falta.',
      'overflow-wrap: anywhere puede evitar el desbordamiento de palabras o URL largas.',
      'Un outline visible y el respeto al movimiento reducido forman parte del diseño CSS.',
    ],
    sections: [
      {
        title: '1. Imágenes que se adaptan',
        paragraph:
          'El recurso necesita una descripción alternativa adecuada en HTML y un tamaño flexible en CSS.',
        points: [
          'Con width: 100% y height: auto la imagen mantiene su proporción.',
          'object-fit: cover recorta para llenar; contain conserva la imagen entera y puede dejar espacio.',
        ],
      },
      {
        title: '2. Cuando el contenido no cabe',
        paragraph: 'Elige si el contenido debe envolver, crecer o disponer de desplazamiento.',
        points: [
          'min-width: 0 permite a un ítem flex o grid reducirse por debajo de su tamaño mínimo automático.',
          'Usa overflow: auto en la región que lo necesita; no ocultes desbordamientos globales para tapar errores.',
        ],
      },
      {
        title: '3. Estados y preferencias',
        paragraph: 'Comprueba navegación con Tab, zoom al 200% y pantallas estrechas.',
        points: [
          'No elimines outline sin proporcionar un indicador de foco equivalente.',
          'El orden visual de Flexbox o Grid no modifica el orden de lectura del DOM: conserva una secuencia coherente.',
        ],
      },
    ],
    css: '.tarjeta { max-width: 320px; overflow-wrap: anywhere; }\n.etiqueta { display: block; max-height: 4rem; overflow: auto; }\nbutton { max-width: 100%; white-space: normal; }\nbutton:focus-visible { outline: 3px solid #0e7490; outline-offset: 4px; }',
    steps: [
      'Añade una palabra de 70 letras al párrafo.',
      'Prueba el ancho de 375px y aumenta el tamaño del texto.',
      'Recorre los elementos interactivos con Tab y comprueba el foco.',
    ],
    pitfall:
      'overflow: hidden puede ocultar información y contornos de foco; no es una solución general al desbordamiento.',
    property: 'ancho-maximo',
    reference:
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Overflow',
    quiz: [
      {
        question: '¿Qué mantiene las proporciones de una imagen flexible?',
        options: ['height: auto', 'height: 10px siempre', 'opacity: .5'],
        answer: 0,
      },
      {
        question: '¿Qué permite desplazamiento cuando hace falta?',
        options: ['overflow: hidden', 'overflow: auto', 'display: none'],
        answer: 1,
      },
      {
        question: '¿Qué conviene comprobar con Tab?',
        options: [
          'Solo el color de fondo',
          'Solo las imágenes',
          'El orden y la visibilidad del foco',
        ],
        answer: 2,
      },
    ],
  },
]
export const additionalLessons = topics.map((topic, index) =>
  theoryLessonSchema.parse({
    id: topic.id,
    module: 17 + index,
    name: topic.name,
    minutes: 12,
    objective: topic.objective,
    explanation: topic.explanation,
    ideas: topic.ideas,
    sections: topic.sections,
    example: {
      title: topic.name + ' en una tarjeta real',
      html,
      css: base + topic.css,
      selector: '.tarjeta',
      steps: topic.steps,
      pitfall: topic.pitfall,
    },
    links: [
      { label: 'Practicar propiedades', to: '/propiedades/' + topic.property },
      { label: 'Experimentar en el laboratorio', to: '/laboratorio' },
    ],
    reference: topic.reference,
    quiz: topic.quiz,
  }),
)
// Keep the additional lesson bodies in the lazy learning routes.
export const lessons: TheoryLesson[] = [...foundationLessons, ...additionalLessons]
