# Estado de la implementación

La aplicación extiende la base existente de Hitos 0–1. Esta entrega implementa los recorridos de aprendizaje de los Hitos 2–4 y mantiene los requisitos de publicación en GitHub Pages.

## Implementado

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

No se envían el código de los ejercicios ni el progreso a un servidor. Las fuentes y recursos de la interfaz se sirven desde el propio sitio. Los enlaces compartidos incluyen únicamente el borrador del laboratorio en el fragmento de URL; el progreso se transporta mediante un JSON exportado por el estudiante.

El paquete de contenido puede ampliarse sin editar las pantallas. El cambio de un esquema persistente debe mantener lectores anteriores o incluir una migración y sus pruebas; los campos añadidos en esta entrega tienen valores predeterminados para borradores existentes.
