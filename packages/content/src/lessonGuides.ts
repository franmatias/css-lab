export const lessonGuides = [
  {
    intro:
      'HTML describe la estructura y CSS su presentación. Para elegir un selector, empieza por entender el árbol del documento.',
    ideas: [
      'El navegador convierte el HTML en un árbol DOM: los elementos tienen padres, hijos y hermanos.',
      'En p { color: blue; }, p es el selector, color es la propiedad y blue es el valor.',
      'Las llaves delimitan el bloque de declaraciones; el punto y coma separa declaraciones.',
      'Una regla puede coincidir con varios elementos o con ninguno. Cambiar el selector cambia las coincidencias, no el árbol.',
      'La apariencia y el orden visual de CSS no modifican las relaciones del DOM.',
    ],
  },
  {
    intro: 'Los selectores básicos identifican elementos por su tipo, clase o identificador.',
    ideas: [
      '* selecciona todos los elementos; p selecciona una etiqueta; .destacado selecciona una clase; #principal selecciona un ID.',
      'Una clase puede repetirse y un elemento puede tener varias clases separadas por espacios.',
      'Un ID debe ser único dentro del documento.',
      'En HTML se escribe class="destacado" y en CSS .destacado. El punto no forma parte del nombre de la clase.',
      'Prefiere clases para estilos reutilizables y acota el selector universal cuando no quieras afectar a todo.',
    ],
  },
  {
    intro: 'Combina condiciones para describir con precisión qué elementos deben coincidir.',
    ideas: [
      'La coma expresa alternativas: h2, p selecciona títulos h2 y párrafos.',
      'Sin espacio, p.destacado exige la etiqueta y la clase en un mismo elemento.',
      '.tarjeta.activa exige ambas clases, sin importar su orden en el atributo class.',
      'El espacio cambia el significado: .tarjeta .activa busca un descendiente.',
      'Añade una condición cada vez y comprueba tanto los objetivos como los elementos que deben quedar fuera.',
    ],
  },
  {
    intro: 'Los selectores de atributo aprovechan los datos que ya existen en el HTML.',
    ideas: [
      '[title] comprueba la presencia del atributo; [type="email"] exige un valor exacto.',
      '^= comprueba el comienzo, $= el final y *= una secuencia en cualquier posición del valor.',
      '~= encuentra una palabra completa de una lista separada por espacios: tag no equivale a tag-nueva.',
      '|= coincide con un valor exacto o seguido por guion; es útil para idiomas como es y es-MX.',
      'Usa comillas y combina filtros, por ejemplo a[title][href$=".pdf"]. Un atributo ausente no equivale a uno vacío.',
    ],
  },
  {
    intro: 'Los combinadores seleccionan elementos según sus relaciones en el árbol HTML.',
    ideas: [
      'Un espacio alcanza descendientes a cualquier profundidad; > exige hijos directos.',
      '+ selecciona el hermano inmediato posterior; ~ los hermanos posteriores que coincidan.',
      'Los hermanos comparten padre. Importa su orden en el HTML, no el orden visual de CSS.',
      'El elemento seleccionado está en el extremo derecho: .menu > li encuentra li, no .menu.',
      'Dibuja el árbol y prueba un nivel adicional de anidamiento para distinguir entre espacio y >.',
    ],
  },
  {
    intro:
      'Las pseudoclases estructurales describen posiciones entre hermanos. Sus índices empiezan en 1.',
    ideas: [
      ':first-child y :last-child cuentan todos los hermanos, aunque tengan etiquetas diferentes.',
      ':first-of-type y :nth-of-type() cuentan solo los hermanos de la misma etiqueta.',
      ':nth-child(2n) selecciona posiciones pares; :nth-child(2n+1), impares. Solo cuentan los resultados positivos.',
      ':nth-last-child() cuenta desde el final. En una tabla, tbody > tr cuenta filas del cuerpo y tr > :nth-child(3) cuenta sus celdas, incluidas las th.',
      ':empty exige ausencia de hijos y nodos de texto: un espacio puede impedir la coincidencia. :root suele ser html.',
    ],
  },
  {
    intro:
      'Las pseudoclases de estado responden a la interacción y al estado real de los controles.',
    ideas: [
      ':hover sigue al puntero; :active dura durante la pulsación.',
      ':focus identifica el elemento que recibe entrada; :focus-visible permite señalar el foco cuando resulta útil.',
      ':focus-within también selecciona un contenedor con un descendiente enfocado. Conserva siempre un indicador de foco visible.',
      ':checked, :disabled y :invalid dependen del estado de los controles y de sus restricciones HTML.',
      'Los ejemplos de esta sección simulan la interacción con clases sim-… para mantener un resultado estable. El juego de tablas permite explorar el estado con puntero y teclado.',
    ],
  },
  {
    intro: 'Las pseudoclases lógicas y relacionales reúnen condiciones con menos repetición.',
    ideas: [
      ':is(h2, h3) agrupa alternativas y toma la mayor especificidad de sus argumentos.',
      ':where() funciona de forma similar, pero todos sus argumentos aportan especificidad cero.',
      ':not(.agotado) excluye los elementos que cumplen esa condición.',
      ':has(img) comprueba una relación con descendientes; :has(> img) exige un hijo directo y :has(+ p) observa el hermano siguiente.',
      'El elemento seleccionado sigue fuera del paréntesis: article:has(img) selecciona el artículo, no la imagen.',
    ],
  },
  {
    intro:
      'Los pseudoelementos representan partes de un elemento o cajas generadas, no nuevos nodos HTML.',
    ideas: [
      'Se escriben con dos puntos dobles para distinguirlos de las pseudoclases.',
      '::before y ::after necesitan content para generar su caja. No los uses como única fuente de información esencial.',
      '::first-letter y ::first-line afectan partes del texto y admiten propiedades limitadas. La primera línea depende del ancho.',
      '::marker da estilo a viñetas, ::selection al texto seleccionado y ::placeholder al texto provisional de un campo.',
      'querySelectorAll no devuelve pseudoelementos: el Laboratorio marca el elemento de origen y comprueba el nombre del pseudoelemento.',
    ],
  },
  {
    intro: 'La cascada resuelve qué declaración se aplica cuando varias reglas coinciden.',
    ideas: [
      'Se comparan origen e importancia; dentro de un mismo origen, capas, especificidad y finalmente orden de aparición.',
      'La especificidad compara tres columnas: IDs, clases/atributos/pseudoclases y tipos/pseudoelementos. No las conviertas en un número decimal.',
      ':where() pesa cero. :is(), :not() y :has() toman la mayor especificidad de sus argumentos.',
      'En declaraciones normales ganan las reglas sin capa; entre capas gana la última. !important invierte el orden de las capas.',
      'La herencia puede aportar valores cuando no existe una declaración propia aplicable.',
    ],
  },
]
