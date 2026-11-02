# Plan de implementación de CSS Lab

Actualizado: **2 de noviembre de 2026**. Producto validado: **60fe9e8**. [Validación y despliegue](https://github.com/franmatias/css-lab/actions/runs/41524347399).

La [especificación v1.0](../spec-css-lab.md) se conserva como referencia histórica. Este plan incorpora las ampliaciones solicitadas y sustituye la secuencia de arranque por las tareas reales de cierre. Las estimaciones iniciales no son un calendario vigente: faltan auditorías y pruebas con estudiantes.

## Entrega actual

La aplicación está publicada y supera el alcance de contenido inicial. **No equivale al cierre de todos los criterios de la v1.0.**

| Área                 | Entrega vigente                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Teoría               | 100 lecciones, m0–m99, ejemplos editables, quiz, categorías y filtros de búsqueda/completado.                                 |
| Propiedades          | 100 retos con requisitos, pistas, soluciones, estilos computados, borradores y recompensa inicial de 60 XP.                   |
| Catálogo             | 100 fichas en 19 categorías, ejemplos interactivos y favoritos.                                                               |
| Retos de selectores  | 62 retos, siete estrategias, tres pistas, desbloqueo, integradores y repaso espaciado.                                        |
| Talleres             | 12 talleres y 53 pasos; mapa de círculos, comprobaciones y revisión responsive. /diseno es alias de /talleres.                |
| Juegos               | Seis recorridos y 48 misiones: Galaxia, Tablas, Semántica, Flexbox, Grid y Responsive.                                        |
| Laboratorio          | 15 plantillas, editor HTML/CSS con sintaxis, formato y Emmet, DOM, ayudas visuales, tamaños de prueba y enlaces compartibles. |
| Progreso             | XP, niveles, racha, actividad, dominio, copias JSON y 50 insignias SVG.                                                       |
| Referencias          | Guía rápida de 96 referencias en 16 bloques y 12 recetas.                                                                     |
| Inicio               | Accesos actualizados y pie «IEZV - Departamento Informática y IAD».                                                           |
| Verificación técnica | 66 pruebas unitarias/de componente, 243 casos en Chromium/Firefox/WebKit y dos pruebas de producción.                         |

Se conservan identificadores, progreso, favoritos y compatibilidad de copias anteriores. La evidencia se detalla en [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md).

## Revisión de los hitos originales

| Hito                   | Estado                                                                                  | Pendiente de cierre                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 0 — Cimientos          | Base operativa: stack, temas, rutas, calidad y Pages.                                   | Completar los controles transversales de arquitectura y calidad; no reinicializar el proyecto. |
| 1 — Laboratorio        | Núcleo implementado y ampliado con Emmet y plantillas.                                  | Implementar o aceptar las diferencias de DOM bidireccional y arrastre libre de paneles.        |
| 2 — Retos y progreso   | Funcionalidades implementadas.                                                          | Primera ronda documentada con cinco estudiantes y ajustes derivados.                           |
| 3 — Contenido núcleo   | Implementado y ampliamente superado en cantidad.                                        | Revisión editorial independiente y segunda ronda con cinco estudiantes.                        |
| 4 — Contenido completo | Selectores/cascada, medallas, accesibilidad configurable y analítica local disponibles. | Verificación manual de accesibilidad/compatibilidad y aceptación de diferencias funcionales.   |
| 5 — Lanzamiento v1.0   | Pages, documentación, licencias y pulido disponibles.                                   | Auditorías humanas y aceptación documentada; controles técnicos incorporados.                  |
| 6 — Extensiones        | Los módulos de caja, Flexbox, Grid, responsive, color y efectos ya se han adelantado.   | Generación procedural, contrarreloj, duelo, paquetes importables y PWA siguen pendientes.      |

## Calidad y validación

El [informe de calidad](./QUALITY_REPORT.md) registra resultados, condiciones y límites. Los [guiones de revisión humana](./HUMAN_VALIDATION.md) están listos.

| Prioridad | Elemento                                 | Estado                                                                                                                                                                       |
| --------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1        | Revisión editorial de los 300 contenidos | Contratos, enlaces, objetivos y soluciones comprobados. Falta revisión independiente de exactitud, dificultad, tiempos, redundancias y preguntas.                            |
| P1        | Dos rondas con estudiantes               | Guion y hojas preparados. Pendientes diez sesiones, resultados, correcciones y repruebas.                                                                                    |
| P1        | Accesibilidad manual                     | Foco y contraste corregidos y verificados automáticamente. Falta lector de pantalla, zoom real y revisión del material aislado.                                              |
| P1        | Rendimiento y CI                         | Implementado: Inicio con medianas Lighthouse 90 rendimiento, 100 accesibilidad y LCP 2,299 s; JS inicial completo 117,91 kB gzip. CI exige ≥90/≥95, LCP ≤2,5 s y JS <150 kB. |
| P1        | Cobertura y componentes                  | Implementado: 66 pruebas; líneas 99,10 %, ramas 94,07 %, funciones 96,77 %. Umbrales globales del 90 % en src/domain y prueba del panel compartido.                          |
| P1        | Compatibilidad                           | Matriz Chromium/Firefox/WebKit en CI. 81 casos por motor verificados en Chromium, Firefox y WebKit en CI. Safari real y tecnologías de asistencia siguen pendientes.         |

No se declara cierre completo de los Hitos 2–5 hasta contar con la evidencia humana. El informe registra el alcance exacto de los controles.

## Diferencias funcionales y mantenibilidad

| Prioridad   | Elemento                           | Situación y siguiente acción                                                                                                                                                                 |
| ----------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2          | Nivel y compatibilidad en Catálogo | Existen categoría, búsqueda y favoritos; falta el filtro por nivel. Añadir dificultad y compatibilidad por ficha, sustituyendo el aviso genérico.                                            |
| P2          | Redimensionado de paneles          | Hay distribuciones predefinidas y plegado, sin divisores de arrastre libre. Implementar una alternativa accesible o registrar la opción aceptada.                                            |
| P2          | Inspección DOM bidireccional       | Árbol → vista funciona con selección fija, borde y selector. Vista → árbol no está implementado. Estudiar una solución que preserve aislamiento sin scripts o aceptar formalmente el límite. |
| P2          | Diagnóstico de errores             | Existen mensajes, diferencias de conjuntos y pistas. Afinar localización de sintaxis y ejemplos de corrección contextual para completar «Explícame este error».                              |
| P2          | Cascada y optimización             | Se comparan reglas explícitas y longitud frente a referencia; no toda la cascada real ni un mínimo global o menor especificidad para cualquier respuesta. Concretar alcance y aceptación.    |
| P2          | Internacionalización interna       | Extraer textos restantes a vue-i18n. La v1 sigue en español: no implica añadir idiomas.                                                                                                      |
| Completado  | Contratos de contenido             | Entregado: esquemas Zod para lecciones, fichas y Propiedades; validación de los cien retos y casos de contrato inválido.                                                                     |
| P2          | Arquitectura y componentes         | Añadir límites de importación entre features en ESLint y un catálogo de componentes con pruebas por rol. Revisar editor compartido y contenido.                                              |
| P2          | Colaboración y decisiones          | Completar control automático de licencias de dependencias; hooks de formato/Conventional Commits si se mantiene lo previsto; actualizar ADRs de Propiedades, Emmet y bibliotecas ampliadas.  |
| P3 opcional | Resumen imprimible                 | Crear vista de progreso y acción de imprimir. La lección de CSS de impresión no implementa esta función del producto.                                                                        |
| P3 opcional | Mascota o guía                     | No existe un personaje con estados. El tour y las medallas no la sustituyen; desarrollar solo si se prioriza.                                                                                |

## Extensiones posteriores

- [x] Adelantadas: propiedades, caja, Flexbox, Grid, responsive, metodologías y efectos.
- [ ] Retos procedurales con semilla reproducible.
- [ ] Contrarreloj y duelo, opcionales y separados del progreso habitual.
- [ ] Importación de paquetes de retos para uso docente o personal.
- [ ] PWA y uso offline garantizado. Guardado local no equivale a una aplicación offline completa.

Cuentas, backend, sincronización en la nube, ranking global y colaboración en tiempo real permanecen fuera del alcance acordado.

## Orden recomendado

1. Revisar una muestra de los contenidos nuevos y corregir el patrón editorial antes de revisar toda la biblioteca.
2. Preparar y realizar la primera ronda con estudiantes.
3. Realizar la auditoría manual de accesibilidad; mantener activos los controles de cobertura, rendimiento y compatibilidad en CI.
4. Corregir las diferencias funcionales prioritarias o aceptar expresamente las alternativas.
5. Completar la segunda ronda y repetir las verificaciones afectadas.
6. Registrar el cierre de v1.0 con evidencias y limitaciones; después seleccionar extensiones.

No se cerrarán los Hitos 2–5 solo por ampliar contenido o tener CI en verde. Registrar responsable, evidencia y fecha para cada pendiente cuando existan.

## Cambio incorporado: teoría visual

Entregados diez esquemas SVG y demostraciones de caja, responsive y movimiento, con controles de pausa y respeto a movimiento reducido. [Detalle de la ampliación](./THEORY_VISUALS.md). Se añaden una prueba de recursos y cuatro casos por navegador a los controles de calidad; las revisiones humanas mantienen su estado pendiente.

## Cambio incorporado: experimentos de propiedades

Doce tipos de experimento amplían el modelo de caja: gradientes, posición, transformaciones, fondos, funciones, tipografía, unidades, animación, transición, sombras, Flexbox y Grid. Controles, resultado real, CSS generado, copia y continuación en Laboratorio. [Alcance y validación](./PROPERTY_PLAYGROUNDS.md). Se añaden cinco pruebas de modelo y seis casos por navegador: 66 pruebas unitarias/de componente, 81 casos por navegador y dos de producción.
