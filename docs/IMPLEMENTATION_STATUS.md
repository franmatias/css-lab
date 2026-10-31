# Estado de la implementación

La aplicación extiende la base existente de Hitos 0–1. Esta entrega implementa los recorridos de aprendizaje de los Hitos 2–4 y mantiene los requisitos de publicación en GitHub Pages.

## Implementado

- Laboratorio: selección DOM fijada y conmutable por clic, selector exacto visible y borde ámbar; la selección se invalida al cambiar el HTML. Árbol integrado en el panel de vista previa, con desplazamiento local y espacio de trabajo acotado a la pantalla en escritorio. El modo oscuro de prueba adapta superficies y texto después del CSS sin modificar el borrador ni los permisos del iframe.
- «Juegos» abre una portada de seis recorridos, con Galaxia en último lugar y entrada propia `/juego/galaxia`. Se conservan las rutas individuales antiguas. Semántica, Flexbox, Grid, responsive y tablas comparten HTML arriba, respuesta debajo y vista previa a la derecha; objetivos y misiones quedan en el lateral. Botones de tamaño, comparación entre objetivo y resultado, borradores, pistas, XP y logros conservados.

- Autocompletado de los editores ligado a la paleta de la aplicación: fondo, texto, selección, iconos y detalle legibles en claro y oscuro. Una prueba mide contraste mínimo 4,5:1 en las opciones normales y seleccionadas de ambos temas.

- Guía rápida ampliada: 96 referencias en 16 bloques con ejemplos y explicación breve. Búsqueda sin distinción de acentos, filtro temático, acceso global y desde talleres, ventana modal nativa y carga diferida. Comprobada con teclado, ambos temas y pantalla de 320 px.

- «Diseño CSS» pasa a «Talleres», con ruta `/talleres` y alias compatible `/diseno`. Catálogo de 12 talleres y 53 pasos, progreso porcentual, búsqueda por estado y reanudación. Objetivo explícito, mapa de círculos navegable, comprobaciones individuales y revisión visual responsive confirmada por el alumno. El guardado conserva pasos parciales y logros anteriores.
- Mesa de trabajo con HTML encima de CSS, vista previa a la derecha, botones Auto/375/768/1200, ajuste opcional al panel, bordes y árbol DOM con selección persistente. Código inicial de solo lectura separado del CSS del alumno; traslado combinado al Laboratorio. Paneles plegables y adaptación móvil.

- Teoría ampliada a 17 lecciones: las diez de selectores y siete de CSS aplicado, con IDs nuevos `m10`–`m16`. Variables y funciones matemáticas, listas, menús, tablas, formularios, Flexbox y Grid. Cada lección nueva incorpora cinco ideas clave, tres apartados, ejemplo HTML/CSS editable con sintaxis y formato, tres preguntas y referencias originales.
- Ejemplos prácticos con vista aislada, anchos de prueba reales, traslado al Laboratorio y carga del editor solo al abrir un ejemplo. Progreso contabiliza las 17 lecciones y estima minutos con su duración declarada. Los puntos de finalización no se duplican.

- Colección de 50 medallas con ilustración SVG por logro, acabado metálico, esmaltes de familia, cuatro distinciones visuales, detalle ampliable con foco nativo del navegador y celebración al desbloquear. Recomendación de siguiente objetivo y ordenación por proximidad o fecha.
- Juegos de semántica, Flexbox, Grid y responsive: seis misiones cada uno, 24 nuevas y 48 entre todos los escenarios. Selección exacta para semántica y evaluación guiada de declaraciones con CSSOM para distribución; no se afirma evaluar toda la cascada ni la calidad visual. Vista de objetivo y resultado, escala opcional conservando viewports reales de 375/768/1200 px y borrador persistente por misión.
- Progreso rediseñado con nivel, XP, anillo de objetivo diario, seis recorridos independientes, actividad semanal y una selección de medallas. Ocho logros nuevos para los cuatro recorridos, compatibles con los datos locales y las copias anteriores.

- Teoría con introducciones breves y cinco ideas por lección; HTML y selector editable en columnas mediante un componente compartido con el catálogo, con adaptación a una columna en móvil.
- Segundo escenario `/juego/tablas/:id?`: 12 misiones de selección de celdas, filas, columnas y rangos, más interacción `:hover` con puntero, foco o control sin ratón. Evaluación exacta de nodos y comprobación de todas las posiciones en los retos interactivos. Dos insignias de tablas separadas de los logros de la galaxia.

- Sección `/diseno/:id?` con 12 talleres de tablas, formularios, listas, Flexbox, Grid, responsive, BEM, SMACSS, variables, `clamp()`, `calc()`/`min()` y un proyecto integrador. Contenido validado con Zod y referencias originales.
- Editor CSS con sintaxis y formato, borradores separados, solución de ayuda, traslado al Laboratorio y vista aislada con anchos interiores reales de 375/768/1200 px. Recorrido lateral contraíble, buscador y categorías.
- Evaluación guiada de declaraciones mediante CSSOM, con selector y media query explícitos, más pregunta conceptual y observación visual. 100 XP por taller una sola vez, tres insignias nuevas y progreso compatible con exportaciones anteriores.

- Rutas funcionales de aprendizaje, laboratorio, juego, recetas, progreso e insignias; carga por ruta, menú responsive accesible y foco al navegar.
- Diez lecciones originales de selectores y siete de diseño aplicado, ejemplos editables, errores frecuentes y dos o tres preguntas por módulo. Completar una lección requiere superar su quiz y concede XP una sola vez.
- Paquete `packages/content` sin dependencia de Vue: 51 fichas, 62 retos, 12 misiones visuales, 12 recetas y 50 insignias. Esquemas Zod, IDs estables, prerrequisitos acíclicos y soluciones verificadas en Chromium.
- Catálogo con búsqueda, categorías, favoritos persistentes y fichas con ejemplos interactivos y enlaces a MDN.
- Siete tipos de reto mediante un registro: selección exacta, completar, corregir, aplicar estilo, especificidad, elección y optimización. El reto de estilo compara estilos computados en un Shadow DOM temporal; no ejecuta código del estudiante.
- Diagnóstico de sintaxis o diferencias entre conjuntos; tres pistas; desbloqueo por módulo, salto tras tres intentos y retos integradores.
- XP, cuatro niveles, racha local con un día de gracia semanal, objetivo diario, actividad semanal, dominio, galería de 50 insignias y repaso con cinco intervalos.
- Juego visual de constelaciones con evaluación exacta sobre HTML inerte, objetivos y coincidencias diferenciados, animación de acierto, pistas y XP concedido una sola vez por misión.
- Recetas útiles de combinaciones de selectores: búho, atributos, combinadores, `:focus-within`, `:has()`, `:checked`, `:not()`, `:nth-child()`, `:is()`, `:where()` y pseudoelementos.
- Paneles de laboratorio y árbol DOM plegables, con distribución persistente; mapas de teoría y misiones contraíbles. El guardado se completa también al cerrar o recargar la página.
- Progreso validado dentro de `csslab:v1`, copia de datos corruptos, sincronización entre pestañas, exportación/importación JSON y confirmación antes de reiniciar.
- Laboratorio existente ampliado con cinco plantillas, deshacer/rehacer, copiar, descargar, árbol DOM navegable y comparador de cascada. Se conserva el iframe sin permisos y el intercambio de borradores comprimidos.
- Tipografías autoalojadas, temas claro/oscuro/sistema, alto contraste, lectura espaciada, movimiento reducido y bienvenida omitible.
- CI con lint, formato, tipos, pruebas, compilación y publicación desde `main`.

## Límites que requieren una siguiente revisión

- La señalización del DOM va desde el árbol hacia la vista previa; el iframe de origen opaco no comunica eventos del puntero a la aplicación. Se mantiene el aislamiento sin scripts.
- El comparador de cascada contrasta dos reglas declaradas del mismo origen. No inspecciona automáticamente toda la cascada de un documento ni modela transiciones, animaciones, estilos inline o todos los orígenes del navegador.
- La optimización acepta conjuntos correctos y compara longitud con la referencia; no pretende demostrar una solución mínima global.
- Los ejemplos de pseudoelementos señalan los elementos de origen; su evaluación verifica el nombre del pseudoelemento. No se simula una selección de texto real.
- El modo de lectura aumenta espaciado y cambia de fuente. No sustituye una evaluación individual de legibilidad.
- Los textos de interfaz incorporados en esta entrega aún deben completar su extracción al catálogo i18n; la aplicación es únicamente española.
- La cobertura del 90 %, Lighthouse con presupuestos en CI, catálogo de componentes, auditoría manual con lector de pantalla, revisión editorial independiente y las dos rondas de cinco usuarios siguen pendientes. No se declara certificación WCAG ni cierre de todos los criterios de la v1.0.
- PWA, modos contrarreloj y paquetes importables pertenecen al Hito 6 y no forman parte de esta entrega.

## Datos y compatibilidad

### Ampliación de propiedades y efectos (noviembre de 2026)

- Inicio actualizado con seis rutas de aprendizaje, avances de selectores y propiedades y accesos a efectos. Pie institucional: IEZV - Departamento Informática y IAD.
- Nueva sección `/propiedades/:id?`: 36 retos en 12 temas con buscador y filtros, objetivo, requisitos, pista, solución consultable, HTML de referencia, CSS editable con formato y vista previa lateral. Anchos interiores reales de 375/768/1200 px, pausa/repetición y árbol DOM con selección fija.
- Comprobación por estilos computados contra una referencia al mismo ancho de 768 px, contemplando cascada, abreviaturas, todos los elementos objetivo y pseudoelementos. El reto de fotogramas verifica los extremos de la secuencia. Cada primera resolución suma 60 XP; los borradores, intentos y completados se guardan y exportan sin duplicar recompensas.
- Ocho lecciones nuevas, `/teoria/m17`–`/teoria/m24`: caja/medidas, tipografía/color/fondos, posición/capas, sombras/transparencias, transiciones, transformaciones, animaciones e imágenes/desbordamiento/accesibilidad. Total: 25 lecciones con los identificadores anteriores preservados. Los nuevos cuerpos de teoría se cargan solo en sus rutas.
- Las vistas previas mantienen sandbox vacío. La evaluación emplea documentos temporales sin scripts y sin recursos externos, eliminados al terminar. La revisión automática de accesibilidad se realiza sobre la interfaz; los documentos de ejemplo se comprueban mediante pruebas de semántica y estilos, no mediante inyección de scripts.

No se envían el código de los ejercicios ni el progreso a un servidor. Las fuentes y recursos de la interfaz se sirven desde el propio sitio. Los enlaces compartidos incluyen únicamente el borrador del laboratorio en el fragmento de URL; el progreso se transporta mediante un JSON exportado por el estudiante.

El paquete de contenido puede ampliarse sin editar las pantallas. El cambio de un esquema persistente debe mantener lectores anteriores o incluir una migración y sus pruebas; los campos añadidos en esta entrega tienen valores predeterminados para borradores existentes.
