# CSS Lab

**Selecciona, prueba, domina.** CSS Lab es una aplicación educativa en español para aprender selectores CSS experimentando, resolviendo retos y consultando el progreso local.

La aplicación incluye diez lecciones, 51 fichas de catálogo, 62 retos, un juego gráfico de 12 misiones, 12 recetas prácticas, 12 talleres de diseño y un laboratorio editable. Resuelve retos, consigue las 40 insignias y exporta tu progreso sin crear una cuenta. Consulta el [estado y límites de la implementación](./docs/IMPLEMENTATION_STATUS.md) y el [plan de implementación](./docs/IMPLEMENTATION_PLAN.md).

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

- `/juego`: una galaxia de seis planetas representa un árbol HTML. Escribe un selector para seleccionar exactamente los objetivos; la selección se ve en directo y el acierto activa una animación. Las 12 misiones cubren clases, atributos, combinadores, posición, negación, selector búho, `:has()` y `:is()`.
- La primera resolución concede XP según dificultad y pistas. Repetir una misión no duplica sus puntos. El resultado se integra con la racha diaria, el progreso y la copia JSON.
- `/insignias`: galería de 40 logros, con condiciones, avance, filtros por familia y fecha de obtención. Seis logros pertenecen al juego visual.
- `/ejemplos`: 12 recetas con HTML/CSS, explicación, errores frecuentes, referencia y vista interactiva. Incluyen espaciado con el búho, foco de teclado, formularios, tarjetas con `:has()`, navegación, listas y pseudoelementos. Cada ejemplo se abre en el Laboratorio.
- El menú responsive se abre desde la cabecera, cierra con Escape, al pulsar fuera o al navegar y devuelve el foco al control adecuado. La navegación inferior sigue disponible.

## Diseño CSS

En `/diseno` puedes buscar talleres por tema y categoría. El recorrido incluye tablas, formularios, listas, una página Flexbox, una galería Grid, una página responsive, BEM, SMACSS, variables, `clamp()`, `calc()`/`min()` y una página de cursos que integra las técnicas.

Cada taller ofrece conceptos, pasos de observación, errores frecuentes, referencia original, HTML y CSS formateados. El editor resalta la sintaxis, permite probar una solución y conserva un borrador independiente por taller. La vista previa aislada prueba viewports reales de 375, 768 y 1200 px. El ejemplo también se puede abrir en el Laboratorio para editar HTML y CSS y compartirlo.

La comprobación guiada verifica con CSSOM las declaraciones pedidas en un selector y contexto de media query concretos, además de una pregunta conceptual. No es una evaluación de toda la cascada ni de la calidad visual; los pasos indican qué comprobar manualmente. Completar un taller concede 100 XP una sola vez, cuenta para la actividad diaria y desbloquea tres insignias de diseño. Cargar la solución es una ayuda permitida. Reiniciar el código conserva el logro y sus puntos. Las copias de progreso anteriores siguen siendo importables.

## Publicación

`.github/workflows/deploy.yml` comprueba cada pull request y publica automáticamente al hacer push a `main`. En GitHub, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. La URL prevista es <https://franmatias.github.io/css-lab/>.

## Arquitectura y alcance

- Vue 3, TypeScript estricto, Vite, Vue Router y Pinia.
- Estilos con Tailwind CSS y variables CSS como tokens.
- Las preferencias y el progreso se guardan en el navegador; no hay cuentas, backend ni analítica externa.
- El HTML/CSS que se añada al laboratorio no ejecutará JavaScript.
- El contenido se mantiene en `packages/content`, validado con Zod y separado de Vue. Los retos verifican conjuntos exactos, estados simulados, pseudoelementos, respuestas de cascada o estilos computados según su estrategia.
- Catálogo con búsqueda y favoritos; teoría con ejemplos editables y quiz; progreso con XP, racha, objetivo diario, 40 insignias y repasos espaciados.
- Exportar progreso genera un JSON local; importar requiere el mismo esquema. No se sincronizan datos con servidores ni se instalan cookies de seguimiento.
- Tipografías autoalojadas: Inter, Space Grotesk, JetBrains Mono y Atkinson Hyperlegible (SIL OFL).
- Consulta las decisiones iniciales en [`docs/adr/`](./docs/adr/).

## Licencias

El código está bajo [MIT](./LICENSE). El contenido pedagógico, la marca y los recursos originales están bajo [CC BY-SA 4.0](./LICENSE-CONTENT). Las licencias de fuentes e iconos de terceros se respetan por separado.
