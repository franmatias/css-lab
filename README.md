# CSS Lab

**Selecciona, prueba, domina.** CSS Lab es una aplicación educativa en español para aprender selectores CSS experimentando, resolviendo retos y consultando el progreso local.

La aplicación incluye 17 lecciones, 51 fichas de catálogo, 62 retos, 48 misiones en seis juegos, 12 recetas prácticas, 12 talleres de diseño y un laboratorio editable. Resuelve retos, consigue las 50 insignias y exporta tu progreso sin crear una cuenta. Consulta el [estado y límites de la implementación](./docs/IMPLEMENTATION_STATUS.md) y el [plan de implementación](./docs/IMPLEMENTATION_PLAN.md).

## Desarrollo local

Requisitos: Node.js `20.18.0` y pnpm `9.15.9`.

```sh
pnpm install
pnpm dev
```

## Comprobaciones

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

El build incluye el prefijo `/css-lab/` de GitHub Pages y genera `dist/404.html` para que las rutas profundas funcionen en el hosting estático.

## Herramientas del laboratorio

- Paneles HTML, CSS y vista previa plegables; distribución equilibrada o con prioridad al código o la vista. El árbol DOM también se puede contraer. Se conservan el contenido y las preferencias al recargar.

- Código HTML/CSS con colores de sintaxis, números de línea alineados, posición del cursor y ajuste de líneas.
- **Formatear** por editor o **Formatear todo**: saltos de línea e indentación con espacios o tabulaciones de 2/4 columnas. Atajo: `Ctrl + Mayús + F` (`⌘ + Mayús + F` en Mac). Un error conserva el código original.
- Resaltado por bordes, fondo, ambos o sin marcas; tres colores, numeración y contornos de cajas opcionales.
- Animaciones breves de los elementos afectados, desactivables y respetuosas con movimiento reducido.
- Actualización en directo o en pausa con aplicación manual; vista ampliada y anchos de 375/768 px; fondos claro, oscuro y transparencia.
- Preferencias locales persistentes y exportación HTML sin resaltados de aprendizaje.

## Juego, insignias y recetas

- Cuatro recorridos nuevos con seis misiones cada uno: `/juego/semantica`, `/juego/flexbox`, `/juego/grid` y `/juego/responsive`. La semántica evalúa conjuntos exactos; los juegos de diseño comprueban las declaraciones solicitadas mediante CSSOM. Las vistas de objetivo y resultado comparten HTML y ancho de prueba. El ajuste visual al panel conserva el viewport interior real, por lo que las media queries siguen funcionando.
- Los nuevos juegos guardan el código por misión, ofrecen tres pistas, permiten abrir el ejemplo en el Laboratorio y conceden XP una sola vez. Las ocho insignias nuevas tienen contadores independientes. Hay 48 misiones entre los seis escenarios.
- La vitrina reúne 50 medallas vectoriales originales, con 50 emblemas diferentes, esmalte por familia, relieve metálico, cintas, estrellas y coronas. Sus cuatro distinciones visuales no alteran las condiciones de obtención. Incluye ampliación en un diálogo, estado adquirido/pendiente, recomendación de próxima conquista, ordenación y celebración al desbloquear.
- Progreso ofrece un panel de nivel y XP, anillo de objetivo diario, racha, seis recorridos de juegos, actividad semanal, dominio por concepto y vitrina de seis medallas recientes o próximas. Se mantienen exportación, importación y ajustes accesibles.

- `/juego/tablas`: 12 misiones con celdas, filas, columnas, rangos, `:nth-child()`, `:first-child`, `:last-child`, `:first-of-type`, `:hover` y `:has()`. El objetivo y la selección se distinguen por símbolos y bordes. Las filas se evalúan como elementos `tr`, no como un conjunto de celdas equivalente.
- El puntero y el foco permiten recorrer la tabla; un selector de referencia ofrece el mismo ensayo sin ratón. El estado `:hover` se reproduce sobre HTML inerte, y las misiones interactivas verifican todas las celdas y el estado exterior para descartar soluciones fijas. Hay animación, pistas, puntos una sola vez y dos insignias propias, sin adelantar los logros de la galaxia.
- Las lecciones de selectores muestran una introducción breve y cinco ideas clave en lista. Teoría y catálogo comparten una vista de HTML formateado y selector editable en dos columnas, apiladas en pantallas pequeñas.

- `/juego`: una galaxia de seis planetas representa un árbol HTML. Escribe un selector para seleccionar exactamente los objetivos; la selección se ve en directo y el acierto activa una animación. Las 12 misiones cubren clases, atributos, combinadores, posición, negación, selector búho, `:has()` y `:is()`.
- La primera resolución concede XP según dificultad y pistas. Repetir una misión no duplica sus puntos. El resultado se integra con la racha diaria, el progreso y la copia JSON.
- `/insignias`: galería de 50 logros, con condiciones, avance, filtros por familia y fecha de obtención. Seis logros pertenecen al juego visual.
- `/ejemplos`: 12 recetas con HTML/CSS, explicación, errores frecuentes, referencia y vista interactiva. Incluyen espaciado con el búho, foco de teclado, formularios, tarjetas con `:has()`, navegación, listas y pseudoelementos. Cada ejemplo se abre en el Laboratorio.
- El menú responsive se abre desde la cabecera, cierra con Escape, al pulsar fuera o al navegar y devuelve el foco al control adecuado. La navegación inferior sigue disponible.

## Teoría aplicada y talleres CSS

La teoría incluye siete lecciones prácticas nuevas en `/teoria/m10`–`/teoria/m16`: variables y funciones `var()`/`calc()`/`min()`/`max()`/`clamp()`, listas, menús con listas, tablas, formularios, uso adecuado de Flexbox y uso adecuado de Grid. Cada una contiene cinco ideas clave, tres apartados explicativos, un ejemplo HTML/CSS editable y formateado, tres preguntas y enlaces a talleres o juegos. Completar su cuestionario permite conseguir los 40 XP de la lección una sola vez.

Los ejemplos tienen editores en dos columnas, vista previa aislada a 375/768/1200 px, escala opcional y traslado del código modificado al Laboratorio para guardarlo. El recuento de teoría en Progreso se amplía a 17 sin cambiar los identificadores ni los logros anteriores.

En `/talleres` puedes buscar talleres por tema, categoría y avance. `/diseno` conserva los enlaces anteriores. Las tarjetas muestran descripción, duración, pasos realizados y porcentaje; un acceso permite retomar el primer taller en curso. El recorrido incluye tablas, formularios, listas, una página Flexbox, una galería Grid, una página responsive, BEM, SMACSS, variables, `clamp()`, `calc()`/`min()` y una página de cursos que integra las técnicas.

Los doce talleres reúnen 53 pasos: objetivo, declaraciones comprobables individualmente, revisión responsive y pregunta final. El mapa de círculos distingue el paso activo y los realizados, permite navegar libremente y retoma el primer paso pendiente al volver. El guardado conserva código y pasos sin duplicar XP y reconoce como completos los talleres de versiones anteriores.

La mesa de trabajo coloca HTML de solo lectura encima del CSS del alumno, y la vista previa a la derecha en escritorio. El CSS de partida se consulta aparte; ambos se combinan en el resultado y al abrir el Laboratorio. Los botones Auto/375/768/1200 conservan anchos interiores reales, con ajuste visual opcional y bordes de diagnóstico. El árbol DOM resalta al pasar o enfocar un nodo y permite fijar una selección al pulsarlo. HTML, mapa y árbol se pueden contraer; en móvil los paneles se apilan.

La comprobación guiada verifica con CSSOM las declaraciones pedidas en un selector y contexto de media query concretos, además de una pregunta conceptual. No es una evaluación de toda la cascada ni de la calidad visual. La revisión visual requiere probar móvil y escritorio y confirmar la observación. Completar todos los pasos con las declaraciones y respuesta correctas concede 100 XP una sola vez, cuenta para la actividad diaria y desbloquea tres insignias de diseño. Cargar la solución es una ayuda permitida y no completa pasos por sí sola. Reiniciar el código conserva los pasos históricos, el logro y sus puntos. Las copias de progreso anteriores siguen siendo importables.

## Guía rápida

La guía rápida se abre desde el icono de libro de la cabecera, el menú móvil o el acceso de cada taller. Incluye 96 referencias en 16 bloques: selectores básicos y de atributos, combinadores y búho, pseudoclases estructurales, estados, lógica y relaciones, pseudoelementos, caja, texto, fondos, Flexbox, Grid, funciones, responsive, componentes, organización y movimiento. La búsqueda ignora acentos y se puede filtrar por tema. La ventana respeta el teclado, se cierra con Esc y devuelve el foco, sin abandonar el ejercicio ni modificar su borrador. Su contenido se carga al abrirla.

## Publicación

`.github/workflows/deploy.yml` comprueba cada pull request y publica automáticamente al hacer push a `main`. En GitHub, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. La URL prevista es <https://franmatias.github.io/css-lab/>.

## Arquitectura y alcance

- Vue 3, TypeScript estricto, Vite, Vue Router y Pinia.
- Estilos con Tailwind CSS y variables CSS como tokens.
- Las preferencias y el progreso se guardan en el navegador; no hay cuentas, backend ni analítica externa.
- El HTML/CSS que se añada al laboratorio no ejecutará JavaScript.
- El contenido se mantiene en `packages/content`, validado con Zod y separado de Vue. Los retos verifican conjuntos exactos, estados simulados, pseudoelementos, respuestas de cascada o estilos computados según su estrategia.
- Catálogo con búsqueda y favoritos; teoría con ejemplos editables y quiz; progreso con XP, racha, objetivo diario, 50 insignias y repasos espaciados.
- Exportar progreso genera un JSON local; importar requiere el mismo esquema. No se sincronizan datos con servidores ni se instalan cookies de seguimiento.
- Tipografías autoalojadas: Inter, Space Grotesk, JetBrains Mono y Atkinson Hyperlegible (SIL OFL).
- Consulta las decisiones iniciales en [`docs/adr/`](./docs/adr/).

## Licencias

El código está bajo [MIT](./LICENSE). El contenido pedagógico, la marca y los recursos originales están bajo [CC BY-SA 4.0](./LICENSE-CONTENT). Las licencias de fuentes e iconos de terceros se respetan por separado.
