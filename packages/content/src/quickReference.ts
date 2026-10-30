export const quickReference = [
  {
    title: 'Selectores básicos y atributos',
    category: 'Selectores',
    items: [
      [
        'p · .tarjeta · #principal',
        'Selecciona por etiqueta, clase o identificador. Una clase se puede reutilizar.',
      ],
      ['*', 'Selecciona todos los elementos del contexto. Limita su alcance cuando sea posible.'],
      ['input[type="email"]', 'Selecciona elementos cuyo atributo tiene exactamente ese valor.'],
      ['[href^="https"]', 'El valor del atributo empieza por el texto indicado.'],
      [
        '[href$=".pdf"] · [class*="aviso"]',
        'El valor termina en ese texto o lo contiene. *= no distingue palabras completas.',
      ],
      ['[class~="activo"]', 'Busca una palabra completa en una lista separada por espacios.'],
    ],
  },
  {
    title: 'Combinadores y combinaciones útiles',
    category: 'Selectores',
    items: [
      ['article p', 'Descendientes: párrafos situados a cualquier profundidad dentro de article.'],
      ['nav > ul > li', 'Hijos directos: evita afectar a elementos de listas anidadas.'],
      ['h2 + p', 'El párrafo que es hermano inmediatamente posterior al h2.'],
      [
        'h2 ~ p',
        'Los párrafos hermanos posteriores al h2, aunque haya otros elementos entre ellos.',
      ],
      [
        '.contenido > * + *',
        'Selector búho: selecciona hijos precedidos inmediatamente por otro elemento. Útil con margin-block-start para separar bloques.',
      ],
      [
        'button.primario, a.boton',
        'Sin espacio se combinan condiciones sobre el mismo elemento; la coma reúne varios selectores.',
      ],
    ],
  },
  {
    title: 'Pseudoclases estructurales',
    category: 'Selectores',
    items: [
      [
        ':first-child · :last-child',
        'Primer o último elemento entre sus hermanos, sin limitar el tipo de etiqueta.',
      ],
      [
        'tbody tr:nth-child(even)',
        'Filas pares del cuerpo de una tabla; odd selecciona las impares.',
      ],
      ['li:nth-child(3n + 1)', 'Posiciones 1, 4, 7… entre hermanos. La cuenta empieza en uno.'],
      ['li:nth-last-child(2)', 'El segundo elemento desde el final, si es un li.'],
      [
        'p:first-of-type · p:nth-of-type(2)',
        'El primer o segundo párrafo entre hermanos, contando solo ese tipo de etiqueta.',
      ],
      [
        ':only-child · :empty',
        'Un único hijo elemento; o un elemento sin hijos ni nodos de texto. Los espacios cuentan como texto para :empty.',
      ],
    ],
  },
  {
    title: 'Estados e interacción',
    category: 'Selectores',
    items: [
      [
        'a:hover · a:active',
        'Al pasar el puntero o durante la activación. Mantén también una señal de foco para teclado.',
      ],
      [
        ':focus-visible',
        'Foco cuando el navegador determina que hace falta indicarlo. Úsalo para un outline visible.',
      ],
      [
        '.campo:focus-within',
        'Selecciona el contenedor cuando él o un descendiente tiene el foco.',
      ],
      [
        'input:checked',
        'Casillas o radios marcados. Se puede combinar con + o ~ para estilizar elementos hermanos.',
      ],
      [
        ':disabled · :required',
        'Controles deshabilitados o con el atributo required. No sustituyen una etiqueta ni instrucciones.',
      ],
      [
        'input:invalid · input:valid',
        'Estado de las restricciones del control. Un campo required vacío puede ser inválido desde el inicio.',
      ],
    ],
  },
  {
    title: 'Selectores lógicos y relacionales',
    category: 'Selectores',
    items: [
      [
        ':is(h1, h2, h3)',
        'Agrupa alternativas. Su especificidad adopta la del argumento más específico.',
      ],
      [
        ':where(.tarjeta, .aviso)',
        'Agrupa condiciones aportando especificidad cero desde :where(), útil para estilos fáciles de sobrescribir.',
      ],
      [
        'button:not(:disabled)',
        'Excluye una condición. La especificidad de :not() depende de sus argumentos.',
      ],
      [
        '.tarjeta:has(> img)',
        'Selecciona la tarjeta que contiene una imagen hija directa. Expresa una relación con otros elementos.',
      ],
      [
        'label:has(input:checked)',
        'Selecciona una etiqueta que contiene un control marcado. Útil en tarjetas de selección.',
      ],
      [
        'a:any-link',
        'Enlaces con destino, visitados o no. Evita confundir cualquier a con un enlace interactivo.',
      ],
    ],
  },
  {
    title: 'Pseudoelementos',
    category: 'Selectores',
    items: [
      [
        '.etiqueta::before · ::after',
        'Genera contenido antes o después con content. No lo uses como único soporte de información esencial.',
      ],
      [
        'li::marker',
        'Da color o peso al marcador de lista. Admite un conjunto limitado de propiedades.',
      ],
      [
        'p::first-letter · ::first-line',
        'Da estilo a la primera letra o línea de un bloque, con las limitaciones propias de cada pseudoelemento.',
      ],
      [
        '::selection',
        'Personaliza el texto seleccionado; conserva suficiente contraste entre texto y fondo.',
      ],
      [
        'input::placeholder',
        'Da estilo a la sugerencia de un campo. El placeholder no sustituye al label.',
      ],
      ['input::file-selector-button', 'Da estilo al botón de un control de subida de archivos.'],
    ],
  },
  {
    title: 'Modelo de caja y desbordamiento',
    category: 'Propiedades',
    items: [
      [
        'box-sizing: border-box;',
        'Incluye padding y borde dentro del width y height declarados. El margen queda fuera.',
      ],
      [
        'padding: 1rem 1.5rem;',
        'Espacio interior: vertical y horizontal. Con cuatro valores, el orden es arriba, derecha, abajo e izquierda.',
      ],
      [
        'margin-inline: auto;',
        'Puede centrar un bloque con ancho limitado y espacio disponible en el eje horizontal de escritura habitual.',
      ],
      [
        'display: block | inline | inline-block;',
        'Cambia el tipo de caja y su participación en el flujo. Flex y Grid crean otros contextos de distribución.',
      ],
      [
        'overflow-x: auto;',
        'Permite desplazamiento horizontal local cuando el contenido no cabe, por ejemplo alrededor de una tabla.',
      ],
      [
        'position: relative; · position: absolute;',
        'Un ancestro posicionado puede servir de referencia a un hijo absoluto. sticky necesita un umbral como top: 0.',
      ],
    ],
  },
  {
    title: 'Tamaño, texto e imágenes',
    category: 'Propiedades',
    items: [
      [
        'width: 100%; max-width: 60rem;',
        'Ocupa el espacio disponible sin superar un límite. Revisa bordes, padding y box-sizing.',
      ],
      [
        'min-width: 0;',
        'Permite que un elemento Flex o Grid reduzca su mínimo automático cuando el contenido lo requiere.',
      ],
      [
        'font: 1rem/1.6 system-ui, sans-serif;',
        'Combina tamaño, interlineado y familia. Un interlineado sin unidad se adapta al tamaño del texto.',
      ],
      [
        'text-align: start; overflow-wrap: anywhere;',
        'Alineación según la dirección de escritura y división de cadenas largas para evitar desbordamientos.',
      ],
      [
        'aspect-ratio: 16 / 9; object-fit: cover;',
        'Define una proporción de caja y cómo encaja una imagen o vídeo. cover puede recortar el contenido.',
      ],
      [
        'text-overflow: ellipsis;',
        'Con un ancho limitado, overflow: hidden y white-space: nowrap puede abreviar una línea. Ofrece acceso al texto completo.',
      ],
    ],
  },
  {
    title: 'Color, fondos y bordes',
    category: 'Propiedades',
    items: [
      [
        'color: #4338ca; background-color: #eef2ff;',
        'Color del texto y del fondo. Comprueba el contraste y no comuniques estados solo con color.',
      ],
      [
        'background: linear-gradient(135deg, #4338ca, #0e7490);',
        'Crea una transición de colores con una dirección definida.',
      ],
      [
        'border: 1px solid #64748b; border-radius: .75rem;',
        'Traza un borde y redondea las esquinas de la caja.',
      ],
      [
        'outline: 3px solid currentColor; outline-offset: 3px;',
        'Dibuja una señal exterior sin ocupar espacio en el modelo de caja. Útil para el foco.',
      ],
      [
        'box-shadow: 0 4px 12px #0002;',
        'Desplazamiento horizontal, vertical, desenfoque y color de la sombra.',
      ],
      [
        'opacity: .5;',
        'Afecta al elemento y sus descendientes. Para atenuar solo el fondo, usa un color con canal alfa.',
      ],
    ],
  },
  {
    title: 'Flexbox: un eje principal',
    category: 'Distribución',
    items: [
      ['display: flex; gap: 1rem;', 'Activa Flexbox en el contenedor y separa los elementos.'],
      [
        'flex-direction: row | column;',
        'Define el eje principal. No cambies el orden visual en contra del orden lógico del HTML.',
      ],
      [
        'justify-content: space-between;',
        'Distribuye el espacio disponible en el eje principal. No sustituye a gap.',
      ],
      [
        'align-items: center;',
        'Alinea elementos en el eje transversal. stretch es útil cuando deben ocupar ese espacio.',
      ],
      [
        'flex-wrap: wrap;',
        'Permite varias líneas. Cada línea reparte su espacio de forma independiente.',
      ],
      [
        'flex: 1 1 14rem; align-self: start;',
        'En el hijo: crecimiento, contracción y tamaño base. align-self cambia su alineación transversal.',
      ],
    ],
  },
  {
    title: 'Grid CSS: filas y columnas',
    category: 'Distribución',
    items: [
      ['display: grid; gap: 1rem;', 'Activa la rejilla y separa sus pistas.'],
      [
        'grid-template-columns: repeat(3, minmax(0, 1fr));',
        'Tres columnas flexibles iguales con mínimo cero. fr reparte espacio disponible.',
      ],
      [
        'grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));',
        'Crea las columnas que caben sin imponer un mínimo mayor que el contenedor.',
      ],
      [
        'grid-column: span 2;',
        'Hace que un elemento ocupe dos columnas. Revisa que existan o adapta la regla en móvil.',
      ],
      [
        'grid-template-areas: "cabecera cabecera" "contenido lateral";',
        'Nombra áreas rectangulares. Asigna cada hijo con grid-area sin alterar el orden de lectura del DOM.',
      ],
      [
        'grid-auto-rows: minmax(8rem, auto); place-items: center;',
        'Define el tamaño de filas implícitas y combina align-items con justify-items.',
      ],
    ],
  },
  {
    title: 'Variables y funciones CSS',
    category: 'Funciones',
    items: [
      [
        ':root { --acento: #4338ca; }',
        'Declara una propiedad personalizada. Se hereda por defecto y puede redefinirse en un ámbito local.',
      ],
      [
        'color: var(--acento, #172554);',
        'Utiliza la variable con alternativa si falta o es inválida como variable. El fallback no corrige cualquier valor incompatible con color.',
      ],
      [
        'width: calc(100% - 2rem);',
        'Combina medidas compatibles. Conserva espacios alrededor de + y −.',
      ],
      [
        'width: min(100%, 60rem); min-height: max(12rem, 30vh);',
        'min elige el menor valor y max el mayor entre las expresiones.',
      ],
      [
        'font-size: clamp(1rem, .8rem + 1vw, 1.5rem);',
        'Mínimo, valor preferido y máximo. Comprueba la ampliación del texto y no dependas solo de vw.',
      ],
      [
        'transform: translateX(1rem) rotate(5deg);',
        'Las funciones también aparecen en transformaciones, colores, filtros y gradientes; cada propiedad admite sus propios valores.',
      ],
    ],
  },
  {
    title: 'Responsive y accesibilidad',
    category: 'Responsive',
    items: [
      [
        '@media (min-width: 48rem) { … }',
        'Parte de una base móvil y amplía la composición cuando el contenido tenga espacio suficiente.',
      ],
      [
        '@media (hover: hover) { … }',
        'Aplica efectos de puntero donde exista hover. Mantén alternativas para foco y dispositivos táctiles.',
      ],
      [
        '@media (prefers-reduced-motion: reduce) { … }',
        'Reduce o elimina movimiento no esencial cuando el usuario lo solicita.',
      ],
      [
        '@supports (display: grid) { … }',
        'Aplica reglas cuando el navegador reconoce una característica. No sustituye a una alternativa funcional.',
      ],
      [
        'button:focus-visible { outline: 3px solid; }',
        'Mantén una señal de foco visible. Evita ocultarla sin ofrecer un indicador equivalente.',
      ],
      [
        'rem · % · vw · vh · dvh',
        'Unidades con referencias distintas: raíz, medida relativa, viewport y altura dinámica. Prueba también zoom, texto largo y orientación.',
      ],
    ],
  },
  {
    title: 'Listas, tablas y formularios',
    category: 'Componentes',
    items: [
      [
        'ul.menu { list-style: none; padding: 0; display: flex; gap: 1rem; }',
        'Un menú puede partir de nav > ul > li > a. Conserva la semántica de lista y permite el salto de línea.',
      ],
      [
        'li::marker { color: #4338ca; font-weight: 700; }',
        'Da personalidad a una lista sin escribir los números a mano. ol expresa que el orden importa.',
      ],
      [
        'table { border-collapse: collapse; }',
        'Combina bordes contiguos. Usa caption y cabeceras th con scope para describir los datos.',
      ],
      [
        'tbody tr:nth-child(even) { background: #eef2ff; }',
        'Alterna el color de las filas del cuerpo sin afectar a la cabecera.',
      ],
      [
        '.formulario { display: grid; gap: 1rem; }',
        'Distribuye controles y etiquetas. Cada control necesita un label asociado mediante for e id o por anidación.',
      ],
      [
        'input, select, textarea { font: inherit; max-width: 100%; }',
        'Mantén coherencia tipográfica y límites de ancho. Revisa tipos de control, ayuda y mensajes de error.',
      ],
    ],
  },
  {
    title: 'Cascada y organización',
    category: 'Organización',
    items: [
      [
        '.tarjeta · .tarjeta__titulo · .tarjeta--destacada',
        'BEM distingue bloque, elemento y modificador. Son convenciones de nombres de clases, no sintaxis especial de CSS.',
      ],
      [
        'Base · Layout · Module · State · Theme',
        'SMACSS organiza responsabilidades. Por ejemplo, l-contenedor para distribución e is-active para un estado.',
      ],
      [
        '@layer base, componentes, utilidades;',
        'Declara capas de cascada. Su prioridad se resuelve antes que la especificidad; el orden de !important entre capas se invierte.',
      ],
      [
        'ID → clase/atributo/pseudoclase → tipo/pseudoelemento',
        'Compara la especificidad por columnas dentro del mismo nivel de cascada. Con empate, decide el orden de aparición.',
      ],
      [
        'inherit · initial · unset · revert',
        'Hereda, usa el valor inicial, elige según herencia o retrocede en la cascada. No todos equivalen a borrar una regla.',
      ],
      [
        '!important',
        'Cambia la prioridad de una declaración. Evita emplearlo como solución habitual a una arquitectura difícil de sobrescribir.',
      ],
    ],
  },
  {
    title: 'Transiciones, transformaciones y animación',
    category: 'Movimiento',
    items: [
      [
        'transition: background-color 180ms ease, transform 180ms ease;',
        'Anima cambios de propiedades concretas. Evita transition: all si no necesitas animarlo todo.',
      ],
      [
        'transform: translateY(-.25rem) scale(1.02);',
        'Modifica la representación visual sin redistribuir por sí misma el espacio del flujo normal.',
      ],
      [
        '@keyframes aparecer { from { opacity: 0; } to { opacity: 1; } }',
        'Define estados de una animación. Las propiedades deben admitir animación para interpolar.',
      ],
      [
        'animation: aparecer 300ms ease-out 1;',
        'Aplica nombre, duración, ritmo y una repetición. Respeta prefers-reduced-motion.',
      ],
      [
        'cursor: pointer; visibility: hidden;',
        'cursor cambia el indicador del puntero; visibility oculta conservando el espacio. display: none retira la caja del flujo.',
      ],
      [
        'z-index: 10;',
        'El apilamiento depende de los contextos de apilamiento: un valor grande no supera necesariamente a cualquier otro elemento de la página.',
      ],
    ],
  },
]
