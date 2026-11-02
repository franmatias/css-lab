import { theoryLessonSchema } from './practicalTheory'
import type { PropertyExercise } from './properties'
export const curriculumTopics =
  'espaciado-letras|Espaciado entre letras|Tipografía avanzada|letter-spacing: .08em;|letter-spacing|letter-spacing ajusta la distancia entre caracteres sin alterar el texto del documento.|Compara etiquetas cortas y párrafos antes de elegir la separación.|Un espaciado excesivo dificulta reconocer palabras.|card\nespaciado-palabras|Espaciado entre palabras|Tipografía avanzada|word-spacing: .4em;|word-spacing|word-spacing modifica el espacio entre palabras manteniendo sus caracteres.|Observa una frase y un párrafo en distintos anchos.|No añadas espacios repetidos al HTML para crear separación visual.|card\nmayusculas|Mayúsculas visuales|Tipografía avanzada|text-transform: uppercase;|text-transform|text-transform cambia visualmente las letras sin reescribir el contenido original.|Reserva las mayúsculas para etiquetas breves.|Un párrafo entero en mayúsculas puede perder legibilidad.|card\nsangria|Sangría de primera línea|Tipografía avanzada|text-indent: 2em;|text-indent|text-indent desplaza el comienzo de la primera línea del bloque.|Compara la sangría con el espacio entre párrafos.|No confundas sangría de primera línea con relleno de todo el bloque.|text\ncursiva|Énfasis tipográfico|Tipografía avanzada|font-style: italic;|font-style|font-style solicita una variante inclinada de la fuente.|Utiliza em en HTML cuando el énfasis afecte al significado.|La cursiva visual no sustituye la semántica del énfasis.|text\ndecoracion|Subrayados con intención|Texto y lectura|text-decoration-line: underline; text-decoration-thickness: 2px;|text-decoration-line,text-decoration-thickness|Las propiedades de decoración controlan la línea y su grosor sin cambiar las letras.|Mantén identificables los enlaces además de diferenciarlos por color.|Subrayar todo puede hacer que cualquier texto parezca un enlace.|text\nsubrayado-separado|Distancia del subrayado|Texto y lectura|text-decoration-line: underline; text-underline-offset: 6px;|text-underline-offset|text-underline-offset separa el subrayado del texto sin mover las letras.|Prueba letras con descendentes para observar su relación con la línea.|Una separación excesiva desvincula visualmente la línea de su texto.|text\nespacios-texto|Conservar saltos y espacios|Texto y lectura|white-space: pre-wrap;|white-space|pre-wrap conserva espacios y saltos y permite ajustar las líneas al ancho disponible.|Cambia el ancho y comprueba los saltos escritos en el HTML.|pre también conserva espacios pero puede producir desbordamientos.|text\nruptura-palabras|Ruptura entre caracteres|Texto y lectura|word-break: break-all;|word-break|break-all permite cortar palabras entre caracteres cuando es necesario ajustar el texto.|Compara break-all con overflow-wrap para elegir el tratamiento del texto.|Cortar palabras corrientes puede perjudicar la lectura.|long\nenlaces-largos|URL largas sin desbordamiento|Texto y lectura|overflow-wrap: anywhere;|overflow-wrap|anywhere permite rupturas de emergencia en cadenas que no caben.|Prueba una URL extensa en una tarjeta estrecha manteniendo todo su texto.|Recortar el desbordamiento puede ocultar una parte importante del enlace.|long\nancho-calculado|Ancho con calc()|Medidas y funciones|width: calc(100% - 48px);|width|calc() combina medidas compatibles para expresar una relación con el contenedor.|Escribe espacios alrededor de suma y resta.|El porcentaje de width no siempre se refiere al viewport.|card\nancho-minimo|Límites de ancho mínimo|Medidas y funciones|min-width: 180px;|min-width|min-width limita cuánto puede reducirse una caja.|Comprueba qué ocurre cuando el espacio es menor que el mínimo.|Un mínimo demasiado grande puede producir desplazamiento horizontal.|card\nalto-minimo|Altura que puede crecer|Medidas y funciones|min-height: 180px;|min-height|min-height ofrece una altura mínima permitiendo crecer con el contenido.|Añade párrafos y compara con una altura fija.|Una altura rígida puede recortar texto ampliado.|card\nproporcion|Relaciones de aspecto|Medidas y funciones|aspect-ratio: 16 / 9;|aspect-ratio|aspect-ratio expresa una proporción preferida entre ancho y alto.|Deja una dimensión automática para apreciar la relación.|Un ancho y alto rígidos pueden impedir que se aprecie la proporción.|card\ncaja-contenido|Content-box paso a paso|Medidas y funciones|box-sizing: content-box;|box-sizing|content-box interpreta el ancho como tamaño del contenido y añade borde y relleno.|Suma padding y bordes para obtener el tamaño exterior.|El relleno no está incluido dentro del ancho declarado con content-box.|card\ncentrado-logico|Centrado con márgenes lógicos|Propiedades lógicas|margin-inline: auto;|margin-left,margin-right|Los márgenes automáticos en línea distribuyen espacio libre alrededor de un bloque limitado.|Usa un ancho menor que el contenedor para observar el centrado.|Un bloque que ocupa todo el ancho no deja espacio libre que repartir.|card\nrelleno-logico|Relleno según la escritura|Propiedades lógicas|padding-inline: 24px;|padding-left,padding-right|padding-inline expresa separación en los dos extremos del eje de escritura.|Compara propiedades físicas y lógicas con direction: rtl.|El inicio en línea no siempre corresponde a la izquierda.|card\nborde-logico|Borde al inicio del bloque|Propiedades lógicas|border-block-start: 4px solid #4338ca;|border-top-width,border-top-style,border-top-color|border-block-start sitúa un borde al comienzo del eje de bloques.|Cambia writing-mode y observa la orientación del borde.|Las propiedades físicas y lógicas pueden competir si se mezclan sin intención.|card\ncontorno|Contornos sin cambiar medidas|Foco y controles|outline: 3px solid #0e7490;|outline-width,outline-style,outline-color|outline dibuja una señal exterior sin ocupar espacio en el modelo de caja.|Comprueba el contorno sobre los fondos vecinos.|No elimines el foco sin proporcionar una alternativa visible.|card\ndistancia-foco|Separar el indicador de foco|Foco y controles|outline: 3px solid #0e7490; outline-offset: 5px;|outline-offset|outline-offset desplaza el contorno respecto al borde de la caja.|Deja espacio alrededor de la caja para que se vea la señal completa.|Un ancestro que recorta el desbordamiento puede cortar el foco.|card\ndegradado-radial|Fondos radiales|Fondos avanzados|background-image: radial-gradient(circle, #e0e7ff, #4338ca);|background-image|Un degradado radial cambia de color desde un centro hacia el exterior.|Compara circle y ellipse en cajas de distintas proporciones.|El fondo decorativo debe mantener suficiente contraste con el texto.|card\ntamano-fondo|Escala de un fondo|Fondos avanzados|background-size: 32px 32px;|background-size|background-size controla el tamaño de las imágenes de fondo independientemente de la caja.|Cambia la escala de un patrón y observa su densidad.|El tamaño del fondo no cambia el ancho del elemento.|card\nposicion-fondo|Situar una imagen de fondo|Fondos avanzados|background-position: right bottom;|background-position-x,background-position-y|background-position alinea la imagen dentro de su área de posicionamiento.|Usa un fondo pequeño sin repetición para ver su posición.|Si el fondo llena toda el área puede no apreciarse el desplazamiento.|card\nrepeticion-fondo|Repetición en un solo eje|Fondos avanzados|background-repeat: repeat-x;|background-repeat|repeat-x repite la imagen horizontalmente evitando la repetición vertical.|Compara repeat-y y no-repeat sobre el mismo patrón.|Una imagen decorativa no debe contener la única copia de información importante.|card\nrecorte-fondo|Pintar solo el contenido|Fondos avanzados|background-clip: content-box;|background-clip|background-clip limita el área donde se pinta el fondo.|Aumenta el padding para distinguir content-box y padding-box.|Recortar el fondo no reduce el tamaño de la caja.|card\nimagen-cover|Imágenes que llenan la caja|Imágenes y recorte|object-fit: cover;|object-fit|cover conserva la proporción de una imagen y recorta lo necesario para llenar su caja.|Define dimensiones para la caja y observa las partes recortadas.|El recorte puede ocultar información relevante de la imagen.|image\nencuadre-imagen|Elegir el encuadre|Imágenes y recorte|object-fit: cover; object-position: left top;|object-fit,object-position|object-position alinea el contenido reemplazado dentro de la caja de la imagen.|Prueba porcentajes para conservar visible la zona importante.|El encuadre no sustituye un texto alternativo adecuado.|image\nescala-grises|Filtros en escala de grises|Imágenes y recorte|filter: grayscale(1);|filter|grayscale() reduce la saturación visual sin modificar el recurso original.|Compara cero y uno sobre la misma imagen.|Un filtro puede modificar el contraste de todo el contenido representado.|image\nsaturacion|Controlar la saturación|Imágenes y recorte|filter: saturate(.5);|filter|saturate() ajusta la intensidad de los colores representados.|Compara 0.5 con 1 y 1.5 sin descargar otras imágenes.|La saturación no debe ser la única señal de selección.|image\nrecorte-poligono|Siluetas con clip-path|Imágenes y recorte|clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);|clip-path|polygon() define una región visible mediante puntos de la caja.|Mueve un vértice y observa la silueta sin cambiar el HTML.|Un recorte puede cortar texto o áreas de interacción importantes.|card\nbloque-linea|Cajas inline-block|Flujo y desbordamiento|display: inline-block;|display|inline-block participa en una línea y permite controlar sus dimensiones.|Coloca varias cajas junto a un texto y observa su alineación.|Los espacios entre etiquetas pueden separar visualmente las cajas inline-block.|card\nvisibilidad|Ocultar conservando espacio|Flujo y desbordamiento|visibility: hidden;|visibility|visibility: hidden oculta la caja manteniendo su espacio en el flujo.|Compara el hueco que deja con display: none.|No ocultes la única forma disponible de completar una tarea.|card\nrecorte-desborde|Recortar un desbordamiento|Flujo y desbordamiento|overflow: hidden;|overflow-x,overflow-y|overflow: hidden recorta el contenido que excede la caja.|Revisa qué información queda fuera antes de decidir recortarla.|No recortes toda la página para tapar errores de distribución.|long\ndesplazamiento|Regiones con desplazamiento|Flujo y desbordamiento|overflow-y: auto;|overflow-y|overflow-y: auto ofrece desplazamiento vertical cuando el contenido supera la altura disponible.|Recorre la región con ratón y teclado.|Muchas regiones pequeñas con desplazamiento independiente dificultan la navegación.|long\nredimensionado|Áreas de texto redimensionables|Flujo y desbordamiento|resize: vertical;|resize|resize permite cambiar las dimensiones de ciertos elementos como textarea.|Conserva el crecimiento vertical para revisar respuestas largas.|Impedir el redimensionado puede dificultar la lectura de una respuesta extensa.|textarea\nflex-columna|El eje principal de Flexbox|Flexbox avanzado|flex-direction: column;|flex-direction|flex-direction establece la orientación del eje principal del contenedor flexible.|Compara row y column antes de elegir la alineación.|justify-content no significa siempre alineación horizontal.|flex\nflex-crecimiento|Repartir espacio sobrante|Flexbox avanzado|flex-grow: 2;|flex-grow|flex-grow es un factor de reparto del espacio positivo disponible.|Compara factores dos y uno dentro del mismo contenedor.|Un factor dos no garantiza un ancho total final exactamente doble.|item\nflex-contraccion|Controlar la contracción|Flexbox avanzado|flex-shrink: 0;|flex-shrink|flex-shrink participa en el reparto del espacio negativo cuando los ítems no caben.|Reduce el contenedor y observa el ítem que no se contrae.|Evitar toda contracción puede producir desbordamientos.|item\nflex-base|Una base antes del reparto|Flexbox avanzado|flex-basis: 160px;|flex-basis|flex-basis establece el tamaño inicial sobre el que Flexbox reparte el espacio.|Compara la base con el resultado después de activar crecimiento.|La base no es un ancho final garantizado.|item\nflex-individual|Alinear un ítem concreto|Flexbox avanzado|align-self: flex-end;|align-self|align-self sobrescribe para un ítem la alineación transversal del contenedor.|Da altura al contenedor para disponer de espacio transversal libre.|Aplica la propiedad al ítem y no al contenedor.|item\nflex-transversal|Centrado transversal|Alineación y separación|align-items: center;|align-items|align-items alinea los ítems en el eje transversal.|Cambia flex-direction para identificar el eje transversal.|align-items no reparte las líneas como align-content.|flex\nflex-lineas|Distribuir varias líneas|Alineación y separación|align-content: space-between;|align-content|align-content distribuye varias líneas cuando sobra espacio transversal.|Activa flex-wrap y compara un contenedor alto y otro ajustado.|Con una sola línea flex su efecto puede no apreciarse.|flex\norden-visual|Orden visual y DOM|Alineación y separación|order: 2;|order|order cambia la posición visual de un ítem sin reordenar el documento.|Recorre los enlaces con Tab y compara el orden de foco con el visual.|Separar el orden visual de la lectura puede dificultar el uso de la página.|item\nseparacion-filas|Separación entre filas|Alineación y separación|row-gap: 24px;|row-gap|row-gap crea espacio entre filas sin añadir margen exterior.|Compara la separación interna de la rejilla con sus bordes.|gap no separa automáticamente la rejilla de otros bloques.|grid\nseparacion-columnas|Separación entre columnas|Alineación y separación|column-gap: 32px;|column-gap|column-gap crea las calles entre columnas.|Prueba diferentes anchos de columna y compara la calle.|Una calle grande reduce el espacio disponible para las columnas.|grid\nfilas-implicitas|Filas implícitas de Grid|Grid avanzado|grid-auto-rows: minmax(80px, auto);|grid-auto-rows|grid-auto-rows dimensiona filas creadas fuera de la plantilla explícita.|Añade tarjetas y observa nuevas filas con un mínimo común.|Una altura fija puede recortar filas con más contenido.|grid\nflujo-grid|Colocación automática por columnas|Grid avanzado|grid-auto-flow: column;|grid-auto-flow|grid-auto-flow decide cómo recorre Grid las celdas al colocar ítems.|Define filas explícitas para observar el avance por columnas.|La colocación visual no cambia el orden de lectura del DOM.|grid\nocupar-columnas|Un ítem ocupa dos columnas|Grid avanzado|grid-column: span 2;|grid-column-start,grid-column-end|span indica cuántas pistas debe abarcar un ítem.|Compara una tarjeta destacada con las restantes al modificar la rejilla.|Pedir más pistas de las previstas puede crear columnas implícitas.|grid-item\nocupar-filas|Un ítem ocupa dos filas|Grid avanzado|grid-row: span 2;|grid-row-start,grid-row-end|grid-row permite extender un ítem a través de varias filas.|Asigna tamaño a las filas automáticas para apreciar el espacio abarcado.|La expansión puede dejar huecos que necesitan una decisión de diseño.|grid-item\nalineacion-grid|Alinear dentro de una celda|Grid avanzado|justify-self: end;|justify-self|justify-self coloca un ítem dentro de su área de Grid en el eje en línea.|Limita el ancho del ítem para disponer de espacio libre en su celda.|No distribuye el espacio entre todas las columnas de la rejilla.|grid-item\ndesplazar-relativo|Desplazamiento relativo|Posición y capas|position: relative; top: 12px;|position,top|La posición relativa desplaza la representación conservando el hueco original.|Observa el hueco de la tarjeta al moverla con top.|La caja puede superponerse a vecinos aunque su espacio original se conserve.|card\nanclaje-logico|Anclaje absoluto lógico|Posición y capas|position: absolute; inset-inline-end: 16px;|position,inset-inline-end|inset-inline-end expresa el anclaje al extremo final del eje en línea.|Prueba direction: rtl para observar el cambio de extremo.|El posicionamiento absoluto no reserva espacio y necesita una referencia adecuada.|card\nflotacion|Flotación para acompañar texto|Posición y capas|float: right;|float|float permite que contenido en línea rodee una caja desplazada a un lado.|Coloca una imagen pequeña junto a un párrafo y observa el rodeo.|No uses flotantes para construir toda una página de columnas.|card\nlimpiar-float|Evitar el rodeo de un flotante|Posición y capas|clear: both;|clear|clear exige situar la caja por debajo de flotantes previos en los lados indicados.|Compara none y both después de una caja flotante.|clear no elimina la propiedad float del elemento anterior.|card\naislar-capas|Contextos de apilamiento locales|Posición y capas|isolation: isolate;|isolation|isolation: isolate crea un contexto de apilamiento para el componente.|Razona sobre las capas internas dentro de un componente aislado.|Un hijo no escapa de su contexto mediante un z-index enorme.|card\nacento-control|Color de acento nativo|Formularios y controles|accent-color: #4338ca;|accent-color|accent-color propone un color para controles nativos compatibles.|Prueba una casilla marcada con diferentes temas del sistema.|La apariencia exacta depende del navegador y del sistema operativo.|checkbox\ncolor-cursor|Color del cursor de escritura|Formularios y controles|caret-color: #dc2626;|caret-color|caret-color cambia la marca de inserción en una zona editable.|Enfoca el campo y escribe para comprobar el contraste del cursor.|El color del cursor no cambia el texto ni el puntero del ratón.|input\npuntero|Pistas del puntero|Formularios y controles|cursor: pointer;|cursor|cursor cambia el indicador del puntero al situarlo sobre una caja.|Usa controles HTML adecuados y conserva el manejo con teclado.|La mano del puntero no convierte una caja en botón accesible.|card\nseleccion-texto|Selección de texto decorativo|Formularios y controles|user-select: none;|user-select|user-select controla si se puede seleccionar texto con interacción habitual.|Limita none a los casos donde exista una razón concreta.|Desactivar la selección de todo un artículo impide copiar información útil.|card\neventos-puntero|Capas que dejan pasar el puntero|Formularios y controles|pointer-events: none;|pointer-events|pointer-events: none evita que la caja sea objetivo de eventos del puntero.|Úsalo para capas decorativas que no deban interceptar controles.|No garantiza que el elemento deje de recibir foco con teclado.|card\ninclinacion|Inclinar con skew()|Transformación avanzada|transform: skewX(8deg);|transform|skewX inclina la representación sin cambiar su hueco en el flujo.|Prueba ángulos pequeños conservando el texto legible.|Una inclinación grande puede deformar el texto o superponer cajas.|card\ncara-posterior|Visibilidad de la cara posterior|Transformación avanzada|backface-visibility: hidden;|backface-visibility|backface-visibility controla si se ve la cara posterior transformada en 3D.|Combínala con rotateY(180deg) para apreciar el efecto.|Ocultar una cara no crea por sí solo una interacción accesible.|card\nperspectiva|Perspectiva de un contenedor|Transformación avanzada|perspective: 600px;|perspective|perspective en el padre aporta profundidad a los hijos transformados.|Gira un hijo con rotateY y compara distintas distancias.|Sin transformaciones en los hijos puede no apreciarse ningún cambio.|card\nespacio-3d|Conservar el espacio tridimensional|Transformación avanzada|transform-style: preserve-3d;|transform-style|preserve-3d conserva la relación espacial de los descendientes transformados.|Combina perspectiva y traslaciones en Z para observar profundidad.|Algunas propiedades de agrupación pueden aplanar el resultado.|card\ntransiciones-multiples|Varias transiciones coordinadas|Movimiento y preferencias|transition: color 200ms, transform 400ms ease-in-out;|transition-property,transition-duration|Una lista permite tiempos y ritmos diferentes para cada propiedad.|Cambia el estado por foco y por puntero observando qué efecto termina antes.|transition: all puede animar propiedades no previstas.|card\nrelleno-animacion|Conservar el último fotograma|Movimiento y preferencias|animation: entrada 2s forwards;|animation-fill-mode|forwards conserva el último fotograma aplicable después del intervalo activo.|Compara forwards y none al terminar una sola repetición.|El estilo retenido no modifica la regla original de la hoja.|card\npasos-animacion|Animaciones por pasos|Movimiento y preferencias|animation: entrada 2s steps(4, end) infinite;|animation-timing-function|steps() divide la progresión en saltos discretos.|Compara cuatro pasos y linear sobre la misma secuencia.|Ofrece una alternativa estática para cambios repetitivos molestos.|card\nretardo-negativo|Entrar a mitad de un ciclo|Movimiento y preferencias|animation: entrada 4s infinite; animation-delay: -2s;|animation-delay|Un retardo negativo inicia la reproducción con parte del ciclo ya transcurrida.|Compara dos elementos con la misma secuencia y retardos diferentes.|No reduce por sí mismo la duración del ciclo.|card\nmovimiento-reducido|Respetar el movimiento reducido|Movimiento y preferencias|animation: entrada 2s infinite alternate;|animation-name|prefers-reduced-motion permite adaptar los efectos a la preferencia de menos movimiento.|Conserva una representación estática con la misma información.|Reducir movimiento no significa ocultar información ni bloquear la interacción.|card\ntema-sistema|Temas según el sistema|CSS adaptable|color-scheme: light dark;|color-scheme|prefers-color-scheme consulta la preferencia y color-scheme informa sobre los temas soportados.|Comprueba texto, controles y superficies en ambos temas.|Invertir todos los colores con un filtro no garantiza legibilidad.|card\nconsulta-contenedor|Componentes con container queries|CSS adaptable|container-type: inline-size;|container-type|Las consultas de tamaño adaptan un descendiente a su contenedor de consulta.|Declara container-type en el ancestro y @container para su contenido.|Un elemento no consulta su propio tamaño como si fuera su ancestro.|card\nsubrejilla|Alinear componentes con subgrid|CSS adaptable|display: grid; grid-template-columns: subgrid;|grid-template-columns|subgrid permite compartir pistas con la rejilla de la que el elemento es ítem.|Haz que el ítem abarque varias pistas del padre para apreciar la alineación.|Necesita un contexto Grid adecuado; no crea una página independiente.|grid-item\nsoporte-progresivo|Mejora progresiva con @supports|Arquitectura y entrega|display: grid; gap: 16px;|display,gap|@supports aplica reglas si el navegador reconoce la condición indicada.|Define una presentación funcional antes de añadir la mejora.|Comprobar sintaxis no certifica el diseño completo.|grid\ncapas-cascada|Ordenar una hoja con @layer|Arquitectura y entrega|color: #4338ca;|color|Las capas organizan prioridad de grupos de reglas antes de la especificidad.|Declara explícitamente el orden de las capas al principio de la hoja.|Las reglas normales sin capa superan a las normales dentro de capas.|card\nimpresion|Preparar una página para imprimir|Arquitectura y entrega|break-inside: avoid;|break-inside|@media print adapta la presentación al papel y a la vista de impresión.|Conserva títulos y datos importantes y oculta navegación prescindible.|Una captura de pantalla no sustituye la vista de impresión.|card'
    .trim()
    .split('\n')
    .map((line, index) => {
      const [slug, name, category, rule, checks, definition, tip, pitfall, kind] = line.split(
        '|',
      ) as [string, string, string, string, string, string, string, string, string]
      return {
        slug,
        name,
        category,
        rule,
        checks: checks.split(','),
        definition,
        tip,
        pitfall,
        kind,
        id: 'm' + (25 + index),
      }
    })
const image =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240"><rect width="600" height="240" fill="#e0e7ff"/><circle cx="100" cy="120" r="80" fill="#4338ca"/><rect x="270" y="40" width="250" height="160" rx="20" fill="#f59e0b"/></svg>',
  )
const fixtures: Record<string, string> = {
  card: '<main class="escena"><article class="muestra"><h2>Un componente CSS</h2><p>Diseña una tarjeta que responda a su contenido y a las personas que la utilizan.</p><a href="#">Explorar</a><div class="hijo">Detalle del componente</div></article><p>Un párrafo vecino permite observar el flujo.</p></main>',
  text: '<main class="escena"><p class="muestra">Primera línea con espacios y palabras.\nSegunda línea para experimentar con la lectura y sus medidas.</p></main>',
  long: '<main class="escena"><p class="muestra">UnaCadenaSinEspaciosMuyLargaQuePermiteComprobarLosLimitesDelContenedorYLaFormaDeTratarElDesbordamiento<br>Más contenido de la región.<br>Una tercera línea con información.<br>Otra línea que debe poder consultarse.<br>Y la última línea del ejemplo.</p></main>',
  flex: '<main class="escena"><section class="muestra"><article class="ficha">Uno</article><article class="ficha">Dos</article><article class="ficha">Tres</article><article class="ficha">Cuatro</article></section></main>',
  grid: '<main class="escena"><section class="muestra"><article class="ficha">Uno</article><article class="ficha">Dos</article><article class="ficha">Tres</article><article class="ficha">Cuatro</article></section></main>',
  item: '<main class="escena grupo-flex"><article class="muestra"><h2>Destacada</h2><p>Descripción del componente.</p><a href="#">Más información</a></article><article class="ficha">Segunda tarjeta</article><article class="ficha">Tercera tarjeta</article></main>',
  'grid-item':
    '<main class="escena grupo-grid"><article class="muestra"><h2>Destacada</h2><p>Descripción del componente.</p><a href="#">Más información</a></article><article class="ficha">Segunda tarjeta</article><article class="ficha">Tercera tarjeta</article></main>',
  image:
    '<main class="escena"><img class="muestra" src="' +
    image +
    '" alt="Círculo violeta y rectángulo naranja sobre fondo claro"></main>',
  input:
    '<main class="escena"><label for="dato">Tu respuesta</label><input class="muestra" id="dato" value="Escribe aquí"></main>',
  textarea:
    '<main class="escena"><label for="dato">Describe tu idea</label><textarea class="muestra" id="dato">Un espacio para una respuesta extensa.</textarea></main>',
  checkbox:
    '<main class="escena"><label><input class="muestra" type="checkbox" checked> Quiero practicar CSS</label></main>',
}
export const curriculumBase =
  '* { box-sizing: border-box; }\nbody { margin: 0; padding: 1rem; color: #172554; background: #f8fafc; font: 16px/1.6 system-ui, sans-serif; }\n.escena { position: relative; padding: 1rem; min-height: 300px; }\n.muestra { display: block; width: 280px; max-width: 100%; min-width: 0; min-height: 0; margin: 0; padding: 16px; background: #e0e7ff; border: 1px solid #a5b4fc; border-radius: 8px; }\nh2 { margin: 0 0 .5rem; font-size: 1.3rem; } p { margin-block: .75rem; }\na { color: #4338ca; } :focus-visible { outline: 3px solid #0e7490; outline-offset: 3px; }\n.ficha { padding: 1rem; border: 1px solid #a5b4fc; background: #fef3c7; }\n.grupo-flex { display: flex; min-height: 300px; gap: 12px; }\n.grupo-flex > * { flex: 1 1 80px; min-width: 0; }\n.grupo-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: minmax(80px, auto); gap: 12px; }\n.grupo-grid > .muestra { width: 100px; }\n:where(img).muestra { width: 240px; height: 220px; object-fit: fill; }\ninput.muestra, textarea.muestra { font: inherit; }\ninput[type="checkbox"].muestra { display: inline-block; width: 24px; height: 24px; }\n.hijo { margin-top: 1rem; padding: .5rem; background: white; }\n'
function extra(topic: (typeof curriculumTopics)[number]) {
  let css =
    topic.kind === 'flex'
      ? '.muestra { display: flex; flex-wrap: wrap; min-height: 260px; } .ficha { flex: 0 0 100px; }'
      : topic.kind === 'grid'
        ? '.muestra { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, auto); }'
        : ''
  if (topic.kind === 'long') css += '.muestra { height: 100px; }'
  if (topic.kind === 'textarea') css += '.muestra { overflow: auto; }'
  if (['posicion-fondo', 'repeticion-fondo', 'tamano-fondo'].includes(topic.slug))
    css +=
      '.muestra { background-image: linear-gradient(45deg, #4338ca 50%, #f59e0b 50%); background-size: 64px 64px; background-repeat: no-repeat; }'
  if (topic.slug === 'cara-posterior') css += '.muestra { transform: rotateY(180deg); }'
  if (topic.slug === 'perspectiva') css += '.hijo { transform: rotateY(35deg); }'
  if (topic.slug === 'espacio-3d')
    css += '.escena { perspective: 600px; } .hijo { transform: translateZ(40px) rotateY(25deg); }'
  if (topic.slug === 'limpiar-float')
    css +=
      '.escena::before { content: "Caja flotante"; float: left; padding: 2rem; background: #fef3c7; }'
  return css
}
export const expandedPropertyExercises: PropertyExercise[] = curriculumTopics
  .slice(0, 64)
  .map((topic) => ({
    id: 'prop-' + topic.slug,
    title: topic.name,
    category: topic.category,
    description: 'En .muestra, aplica ' + topic.rule + ' ' + topic.definition,
    theory: '/teoria/' + topic.id,
    html: fixtures[topic.kind]!,
    baseCss: curriculumBase + extra(topic),
    starter: '.muestra {\n\t/* Completa el objetivo con tus declaraciones. */\n}\n',
    solution: '.muestra {\n\t' + topic.rule.split('; ').join(';\n\t') + '\n}\n',
    hint: topic.tip + ' Propiedades que se comprueban: ' + topic.checks.join(', ') + '.',
    checks: topic.checks.map((property) => ({ selector: '.muestra', property })),
  }))
function lessonCss(topic: (typeof curriculumTopics)[number]) {
  let css = curriculumBase + extra(topic) + '\n.muestra { ' + topic.rule + ' }\n'
  if (topic.slug === 'transiciones-multiples')
    css += '.muestra:hover, .muestra:focus-within { color: #dc2626; transform: translateY(-8px); }'
  if (topic.category === 'Movimiento y preferencias')
    css +=
      '@keyframes entrada { from { opacity: .5; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }\n@media (prefers-reduced-motion: reduce) { .muestra { animation: none; transition: none; } }'
  if (topic.slug === 'consulta-contenedor')
    css +=
      '.escena { container-type: inline-size; } @container (min-width: 500px) { .muestra { width: 100%; background: #cffafe; } }'
  if (topic.slug === 'tema-sistema')
    css +=
      '@media (prefers-color-scheme: dark) { body { background: #111827; color: #f8fafc; } .muestra { background: #312e81; color: #f8fafc; } a { color: #c7d2fe; } }'
  if (topic.slug === 'subrejilla') css += '.muestra { grid-column: span 3; width: auto; }'
  if (topic.slug === 'soporte-progresivo')
    css +=
      '@supports (display: grid) { .muestra { grid-template-columns: repeat(2, minmax(0, 1fr)); } }'
  if (topic.slug === 'capas-cascada')
    css =
      '@layer base, componentes;\n' +
      css +
      '@layer base { .muestra { color: #dc2626; } } @layer componentes { .muestra { color: #166534; } }'
  if (topic.slug === 'impresion')
    css +=
      '@media print { body { background: white; color: black; } .muestra { width: auto; background: white; border: 1px solid black; } a::after { content: " (" attr(href) ")"; } }'
  return css
}
export const expandedLessons = curriculumTopics.map((topic, index) =>
  theoryLessonSchema.parse({
    id: topic.id,
    module: 25 + index,
    category: topic.category,
    name: topic.name,
    minutes: 10,
    objective:
      'Aplicar ' + topic.name.toLowerCase() + ' y comprobar el resultado en un componente real.',
    explanation: topic.definition,
    ideas: [
      topic.definition,
      topic.tip,
      topic.pitfall,
      'La declaración de referencia es ' + topic.rule,
      'El objetivo es .muestra: comprueba la caja y su contenido antes y después de cambiar su estilo.',
    ],
    sections: [
      {
        title: '1. Qué cambia y dónde se aplica',
        paragraph: topic.definition,
        points: [
          topic.tip,
          'Las propiedades del ejemplo son ' +
            topic.checks.join(', ') +
            '. Compara sus valores antes y después de editar.',
        ],
      },
      {
        title: '2. Leer y modificar el ejemplo',
        paragraph:
          'La regla actúa sobre .muestra. El contexto organiza el documento para distinguir el efecto de esta técnica.',
        points: [
          'Localiza ' + topic.rule + ' y cambia un valor cada vez.',
          'Observa los vecinos de la caja: no todas las propiedades modifican el espacio reservado en el flujo.',
        ],
      },
      {
        title: '3. Elegir y comprobar',
        paragraph: topic.pitfall,
        points: [
          topic.tip,
          'Prueba 375, 768 y 1200 px, aumenta el texto y comprueba los controles con teclado.',
        ],
      },
    ],
    example: {
      title: topic.name + ' en la práctica',
      html: fixtures[topic.kind]!,
      css: lessonCss(topic),
      selector: '.muestra',
      steps: [
        'Localiza .muestra y observa el efecto de ' + topic.checks[0] + '.',
        'Modifica ' + topic.rule + ' y compara con la explicación.',
        'Prueba otro ancho y comprueba la precaución indicada antes de restaurar la referencia.',
      ],
      pitfall: topic.pitfall,
    },
    quiz: [
      {
        question: '¿Qué explica correctamente «' + topic.name + '»?',
        options: [
          topic.definition,
          curriculumTopics[(index + 1) % 75]!.definition,
          curriculumTopics[(index + 2) % 75]!.definition,
        ],
        answer: 0,
      },
      {
        question: '¿Qué revisión corresponde a esta técnica?',
        options: [
          'La técnica hace innecesarias las pruebas de tamaño y contenido.',
          topic.tip,
          'La ausencia de errores de sintaxis garantiza la accesibilidad del diseño.',
        ],
        answer: 1,
      },
    ],
    links: [
      {
        label:
          index < 64 ? 'Resolver el reto de esta técnica' : 'Practicar propiedades relacionadas',
        to: index < 64 ? '/propiedades/prop-' + topic.slug : '/propiedades',
      },
      { label: 'Consultar selectores', to: '/catalogo' },
    ],
    reference: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  }),
)
