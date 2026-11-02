# Estado de la implementación de CSS Lab

Actualizado: **2 de noviembre de 2026**. Producto validado: **60fe9e8**. [Validación y despliegue](https://github.com/franmatias/css-lab/actions/runs/41524347399). [Plan vigente](./IMPLEMENTATION_PLAN.md).

Este estado sustituye los recuentos históricos de 10, 17 y 25 lecciones o 36 retos de Propiedades. La aplicación está publicada en [Pages](https://franmatias.github.io/css-lab/). No se declara cierre integral ni certificación de la v1.0.

## Inventario vigente

| Área                | Estado                                                                                                             | Evidencia                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Teoría              | 100 lecciones m0–m99; categorías, búsqueda, completados, ejemplos y quiz.                                          | [Agregador](../packages/content/src/theory.ts), [ampliación](../packages/content/src/expandedCurriculum.ts), [pantalla](../src/features/theory/TheoryPage.vue).                  |
| Propiedades         | 100 retos, requisitos, ayuda, soluciones, borradores y 60 XP iniciales.                                            | [Contenido](../packages/content/src/properties.ts), [metadatos](../packages/content/src/propertyProgress.ts), [evaluador](../src/domain/propertyExercise.ts).                    |
| Catálogo            | 100 fichas en 19 categorías, favoritos y ejemplos; conserva las 51 originales.                                     | [Contenido](../packages/content/src/catalog.ts), [pantalla](../src/features/catalog/CatalogPage.vue).                                                                            |
| Retos de selectores | 62 retos con siete estrategias, pistas, integradores y repaso.                                                     | [Contenido](../packages/content/src/index.ts), [evaluación](../src/domain/challenges.ts).                                                                                        |
| Talleres            | 12 talleres, 53 pasos, objetivos, círculos y revisión responsive; alias /diseno compatible.                        | [Pantalla](../src/features/design/DesignPage.vue), [metadatos](../packages/content/src/designProgress.ts).                                                                       |
| Juegos              | Seis recorridos y 48 misiones: 12 de Galaxia, 12 de tablas y seis por cada modo Semántica/Flexbox/Grid/Responsive. | [Galaxia](../packages/content/src/game.ts), [tablas](../packages/content/src/tableGame.ts), [otros](../packages/content/src/studioGames.ts).                                     |
| Laboratorio         | 15 plantillas, formato, Emmet, DOM, ayudas visuales, deshacer y compartir.                                         | [Pantalla](../src/features/lab/LabPage.vue), [plantillas nuevas](../src/features/lab/model/extraLabTemplates.ts), [editor](../src/features/lab/CodeEditor.vue).                  |
| Progreso            | XP, niveles, racha, actividad, dominio, módulo al 80 % con integradores, repasos y JSON; 50 insignias SVG.         | [Store](../src/shared/model/learningStore.ts), [pantalla](../src/features/progress/ProgressPage.vue), [esquema](../src/domain/progress.ts), [métricas](../src/domain/badges.ts). |
| Referencias         | Guía de 96 referencias en 16 bloques y 12 recetas.                                                                 | [Guía](../packages/content/src/quickReference.ts), [recetas](../src/features/examples/ExamplesPage.vue).                                                                         |
| Inicio y navegación | Accesos actualizados, reto del día, temas, menú responsive y pie institucional IEZV.                               | [Inicio](../src/features/home/HomePage.vue), [estructura](../src/app/App.vue), [rutas](../src/app/router.ts).                                                                    |

## Comportamientos entregados

- Sintaxis y números de línea, formato con espacios/tabulaciones y Emmet por Tab, Ctrl/⌘ + Mayús + E o botón. Campos editables y protección de tamaño; los ejemplos de solo lectura no cambian.
- Árbol DOM con selección fija y conmutable, borde y selector. Cambiar HTML invalida selecciones obsoletas. Árbol y vista se desplazan en su panel.
- Viewports reales con ajuste visual opcional. HTML encima de CSS y resultado lateral en talleres y juegos guiados; Galaxia mantiene su escenario.
- Bordes, fondos, colores y contornos de ayuda; adaptación oscura de prueba sin cambiar el CSS guardado. Movimiento reducido y celebraciones configurables.
- Progreso, IDs y favoritos anteriores conservados; no se duplican recompensas. Exportación/importación, respaldo de datos corruptos, recordatorio de copia y sincronización entre pestañas.
- Carga por rutas, fuentes locales y ausencia de analítica externa.

## Aislamiento y límites de evaluación

Las vistas visibles conservan sandbox vacío y CSP restrictiva, con HTML saneado y sin scripts del alumno. Propiedades usa documentos temporales sin scripts, del mismo tamaño, y los retira al terminar; permite imágenes locales en datos y bloquea recursos CSS externos. El progreso no se envía a servidores.

- Selectores: nodos de DOM inerte y estados transitorios simulados por clases.
- Pseudoelementos: nombre separado y elementos de origen, sin tratarlos como nodos DOM.
- Talleres/juegos de distribución: declaraciones, contexto y pregunta o revisión guiada, no evaluación estética general.
- Propiedades: estilos computados y cascada de la escena; el reto de fotogramas comprueba sus extremos.
- Cascada: reglas explícitas, no inspección de toda la cascada real.
- Optimización: longitud frente a referencia, no demostración de un mínimo global.

Vista → árbol y divisores libres de arrastre no están implementados. Existen árbol → vista, selección fija, distribuciones predefinidas y plegado.

## Evidencia de calidad

Ver [informe](./QUALITY_REPORT.md), [guiones de revisión humana](./HUMAN_VALIDATION.md) y [flujo de integración](../.github/workflows/deploy.yml).

- 66 pruebas unitarias/de componente; cobertura de dominio 99,10 % de líneas, 94,07 % de ramas y 96,77 % de funciones.
- Umbrales globales de 90 % en las cuatro métricas, sin excluir archivos difíciles del dominio.
- 81 casos por navegador verificados en Chromium, Firefox y WebKit: 243 casos en CI. La limitación de Firefox en este Windows no afecta a la matriz validada en Ubuntu.
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

- [ ] Nivel y compatibilidad individual en Catálogo.
- [ ] Implementar o aceptar arrastre de paneles y DOM bidireccional preservando aislamiento.
- [ ] Localización y corrección contextual de errores; aceptación del alcance de cascada y optimización.
- [ ] Textos restantes en i18n; el producto sigue en español.
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

Entregados doce experimentos con parámetros, CSS generado y escenas aisladas, además de reproducción controlada y movimiento reducido. [Detalle](./PROPERTY_PLAYGROUNDS.md). Recuentos vigentes: 66 pruebas unitarias/de componente, 81 casos por navegador y dos de producción. Las revisiones con personas siguen pendientes.
