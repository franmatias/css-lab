# Estado de la implementación de CSS Lab

Actualizado: **4 de noviembre de 2026**. Producto validado: **2d49e04**. [Validación y despliegue](https://github.com/franmatias/css-lab/actions/runs/41907025317). [Plan vigente](./IMPLEMENTATION_PLAN.md).

Este estado sustituye los recuentos históricos de 10, 17 y 25 lecciones o 36 retos de Propiedades. La aplicación está publicada en [Pages](https://franmatias.github.io/css-lab/). No se declara cierre integral ni certificación de la v1.0.

## Inventario vigente

| Área                | Estado                                                                                                             | Evidencia                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Teoría              | 100 lecciones m0–m99; categorías, búsqueda, completados, ejemplos y quiz.                                          | [Agregador](../packages/content/src/theory.ts), [ampliación](../packages/content/src/expandedCurriculum.ts), [pantalla](../src/features/theory/TheoryPage.vue).                  |
| Propiedades         | 100 retos, requisitos, ayuda, soluciones, borradores y 60 XP iniciales.                                            | [Contenido](../packages/content/src/properties.ts), [metadatos](../packages/content/src/propertyProgress.ts), [evaluador](../src/domain/propertyExercise.ts).                    |
| Catálogo            | 100 fichas en 19 categorías, favoritos, ejemplos, dificultad, compatibilidad y navegación contextual.              | [Contenido](../packages/content/src/catalog.ts), [pantalla](../src/features/catalog/CatalogPage.vue), [metadatos](../src/features/catalog/catalogMetadata.ts).                   |
| Retos de selectores | 62 retos con siete estrategias, pistas, integradores y repaso.                                                     | [Contenido](../packages/content/src/index.ts), [evaluación](../src/domain/challenges.ts).                                                                                        |
| Talleres            | 12 talleres, 53 pasos, objetivos, círculos y revisión responsive; alias /diseno compatible.                        | [Pantalla](../src/features/design/DesignPage.vue), [metadatos](../packages/content/src/designProgress.ts).                                                                       |
| Juegos              | Seis recorridos y 48 misiones: 12 de Galaxia, 12 de tablas y seis por cada modo Semántica/Flexbox/Grid/Responsive. | [Galaxia](../packages/content/src/game.ts), [tablas](../packages/content/src/tableGame.ts), [otros](../packages/content/src/studioGames.ts).                                     |
| Laboratorio         | 15 plantillas, formato, Emmet, DOM bidireccional, diagnósticos, divisores accesibles, deshacer y compartir.        | [Pantalla](../src/features/lab/LabPage.vue), [diagnósticos](../src/features/lab/model/cssDiagnostics.ts), [editor](../src/features/lab/CodeEditor.vue).                          |
| Progreso            | XP, niveles, racha, actividad, dominio, módulo al 80 % con integradores, repasos y JSON; 50 insignias SVG.         | [Store](../src/shared/model/learningStore.ts), [pantalla](../src/features/progress/ProgressPage.vue), [esquema](../src/domain/progress.ts), [métricas](../src/domain/badges.ts). |
| Referencias         | Guía de 96 referencias en 16 bloques y 12 recetas.                                                                 | [Guía](../packages/content/src/quickReference.ts), [recetas](../src/features/examples/ExamplesPage.vue).                                                                         |
| Inicio y navegación | Accesos actualizados, reto del día, temas, menú responsive y pie institucional IEZV.                               | [Inicio](../src/features/home/HomePage.vue), [estructura](../src/app/App.vue), [rutas](../src/app/router.ts).                                                                    |

## Comportamientos entregados

- Sintaxis y números de línea, formato con espacios/tabulaciones y Emmet por Tab, Ctrl/⌘ + Mayús + E o botón. Campos editables y protección de tamaño; los ejemplos de solo lectura no cambian.
- Árbol DOM con selección fija y conmutable, borde y selector. Cambiar HTML invalida selecciones obsoletas. Árbol y vista se desplazan en su panel.
- Viewports reales con ajuste visual opcional. HTML encima de CSS y resultado lateral en talleres y juegos guiados; Galaxia mantiene su escenario.
- Bordes, fondos, colores y contornos de ayuda; adaptación oscura de prueba sin cambiar el CSS guardado. Movimiento reducido y celebraciones configurables.
- Progreso, IDs y favoritos anteriores conservados; no se duplican recompensas. Exportación/importación, respaldo de datos corruptos, recordatorio de copia y sincronización entre pestañas.
- Al completar por primera vez una actividad aparece una celebración accesible con XP obtenido, total, nivel e insignias recién desbloqueadas; respeta movimiento reducido y devuelve el foco.
- El Catálogo combina búsqueda, categoría, dificultad y compatibilidad; cada ficha permite recorrer directamente las demás de su categoría.
- El Laboratorio incorpora divisores ajustables y selección bidireccional entre vista y árbol, manteniendo saneado, sandbox y una CSP restringida.
- Los diagnósticos CSS indican línea/columna y proponen correcciones; el inspector de cascada contempla origen, importancia, capas, inline, herencia, especificidad y orden.
- Carga por rutas, fuentes locales y ausencia de analítica externa.

## Aislamiento y límites de evaluación

Las vistas visibles conservan un sandbox aislado y CSP restrictiva, con HTML saneado y sin scripts del alumno. Solo el Laboratorio carga su inspector estático interno, autenticado mediante token efímero y limitado al origen de despliegue. Propiedades usa documentos temporales sin scripts, del mismo tamaño, y los retira al terminar; permite imágenes locales en datos y bloquea recursos CSS externos. El progreso no se envía a servidores.

- Selectores: nodos de DOM inerte y estados transitorios simulados por clases.
- Pseudoelementos: nombre separado y elementos de origen, sin tratarlos como nodos DOM.
- Talleres/juegos de distribución: declaraciones, contexto y pregunta o revisión guiada, no evaluación estética general.
- Propiedades: estilos computados y cascada de la escena; el reto de fotogramas comprueba sus extremos.
- Cascada: comparación pedagógica de origen, importancia, transición/animación, capas, inline, herencia, especificidad y orden; no sustituye las herramientas de desarrollo del navegador.
- Optimización: longitud frente a referencia, no demostración de un mínimo global.

## Evidencia de calidad

Ver [informe](./QUALITY_REPORT.md), [guiones de revisión humana](./HUMAN_VALIDATION.md) y [flujo de integración](../.github/workflows/deploy.yml).

- 70 pruebas unitarias/de componente; cobertura de dominio 99,13 % de líneas, 91,57 % de ramas y 96,87 % de funciones.
- Umbrales globales de 90 % en las cuatro métricas, sin excluir archivos difíciles del dominio.
- 82 casos por navegador verificados en Chromium, Firefox y WebKit: 246 casos en CI. La limitación de Firefox en este Windows no afecta a la matriz validada en Ubuntu.
- Dos pruebas de producción: rutas bajo /css-lab/ y presupuesto inicial completo.
- Inicio: JS inicial 117,91 kB gzip; mediana Lighthouse móvil 90 en rendimiento, 100 en accesibilidad, LCP 2,299 s y CLS 0.
- Soluciones de cien propiedades, ejemplos del catálogo, talleres y juegos comprobados en navegador; esquemas y objetivos del contenido validados.
- Corregidos contraste con movimiento reducido, devolución del foco y temporizadores del evaluador.
- CI impide publicar si fallan cobertura, matriz de navegador, producción o Lighthouse, y conserva los informes.

axe y Lighthouse no acreditan accesibilidad manual de los ejemplos aislados. El rendimiento se refiere a Inicio en laboratorio, no a datos de usuarios reales.

## Pendientes

### Calidad y validación con personas

- [ ] Revisión editorial independiente: exactitud, dificultad, redundancias, tiempos, ejemplos, cuestionarios y referencias.
- [ ] Dos rondas de cinco estudiantes y corrección documentada de incidencias.
- [ ] Auditoría manual con lector de pantalla, teclado, zoom y preferencias.
- [x] Lighthouse y presupuestos en CI: rendimiento ≥90, accesibilidad ≥95, LCP móvil <2,5 s y JS inicial completo <150 KB gzip.
- [x] Cobertura de dominio ≥90 % y prueba del panel compartido.
- [ ] Safari real y tecnologías de asistencia; matriz automática Chromium/Firefox/WebKit incorporada en CI.

### Diferencias funcionales y mantenibilidad

- [x] Nivel, compatibilidad y navegación contextual en Catálogo.
- [x] Divisores accesibles y DOM bidireccional preservando el aislamiento.
- [x] Localización y corrección contextual de errores; evaluación ampliada de cascada y alternativas.
- [ ] Migración del contenido heredado restante a i18n; las superficies nuevas y modificadas ya usan el sistema y el producto sigue en español.
- [x] Esquema Zod propio para Propiedades y validación de los cien retos.
- [ ] Límites de importación entre features, catálogo de componentes, ADRs y controles de licencias/herramientas de contribución.

### Opcionales

- [ ] Mascota o guía con estados.
- [ ] Resumen imprimible de progreso.
- [ ] Retos procedurales con semilla.
- [ ] Contrarreloj y duelo.
- [ ] Paquetes de retos importables.
- [ ] PWA y soporte offline garantizado.

Los módulos avanzados previstos para Hito 6 ya se han incorporado. El [plan](./IMPLEMENTATION_PLAN.md) propone el orden del cierre; cuentas, backend, ranking y sincronización en la nube siguen fuera de alcance.

## Ampliación visual de teoría

Diez SVG locales, calculadora de caja, recorrido responsive y animación con curvas y pausa. Reproducción voluntaria y alternativa con movimiento reducido. [Detalles y validación](./THEORY_VISUALS.md). La matriz vigente contiene 61 pruebas unitarias/de componente, 75 casos por navegador y dos de producción.

## Experimentos de propiedades

Entregados doce experimentos con parámetros, CSS generado y escenas aisladas, además de reproducción controlada y movimiento reducido. [Detalle](./PROPERTY_PLAYGROUNDS.md). Recuentos vigentes: 70 pruebas unitarias/de componente, 82 casos por navegador y dos de producción. Las revisiones con personas siguen pendientes.
