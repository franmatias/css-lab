# Plan de implementación de CSS Lab

Este plan traduce la especificación funcional v1.0 a entregas verificables. Se mantienen los hitos y estimaciones originales; las dependencias externas y los resultados de las pruebas con usuarios pueden ajustar las fechas.

## Alcance y orden de trabajo

| Fase | Entrega | Criterios de salida |
| --- | --- | --- |
| **Hito 0 — Cimientos** · 1 semana | Vue 3 + TypeScript estricto, Vite, Tailwind, Pinia, Router, i18n, tokens, tema persistente, layout responsive, herramientas de calidad y Actions para GitHub Pages. | Build reproducible; rutas cargan bajo `/css-lab/`; tema persiste sin parpadeo; lint, tipos, pruebas y despliegue pasan; navegación por teclado y axe sin violaciones conocidas. |
| **Hito 1 — Laboratorio** · 2 semanas | Sandbox aislado, editor CodeMirror diferido, vista previa HTML/CSS, selector editable, coincidencias, contador, especificidad, árbol DOM, estado local y enlace compartible. | HTML/CSS no ejecuta JavaScript ni altera la aplicación; límites de entrada definidos; pruebas del dominio en navegador con selectores modernos; compartir/importar estado valida tamaño y esquema. |
| **Hito 2 — Retos y progreso** · 2 semanas | Evaluadores extensibles, tipos iniciales de reto, pistas y diagnósticos, XP/niveles/racha/insignias, almacenamiento versionado y exportación/importación. | Soluciones de referencia verificadas; migraciones y datos corruptos probados; flujos principales E2E; primera prueba con cinco estudiantes y ajustes priorizados. |
| **Hito 3 — Contenido núcleo** · 3 semanas | Paquete `packages/content`, módulos M0–M5, aproximadamente 34 retos, catálogo con búsqueda/favoritos y quizzes. | Esquemas, IDs, prerrequisitos y soluciones pasan validaciones automáticas; contenido original revisado; segunda ronda con usuarios. |
| **Hito 4 — Contenido completo** · 3 semanas | Módulos M6–M9, aproximadamente 28 retos adicionales, cascada, repetición espaciada, accesibilidad ampliada y analítica exclusivamente local. | 46 selectores, 5 conceptos de cascada, 51 fichas y 62 retos; accesibilidad y compatibilidad revisadas. |
| **Hito 5 — Lanzamiento v1.0** · 2 semanas | Rendimiento, auditoría con lector de pantalla, documentación y pulido. | WCAG 2.2 AA revisado; umbrales Lighthouse acordados; CI y Pages en verde; README, contribución y licencias completos. |
| **Hito 6 — Extensión** | PWA opcional, nuevos módulos, retos procedurales, modos opcionales e importación de paquetes. | Cada capacidad se prioriza como entrega independiente después de v1.0, sin comprometer el núcleo. |

## Secuencia inmediata: Hito 0

1. Inicializar Git en `main`, conectar `https://github.com/franmatias/css-lab.git` y añadir las licencias y documentación básicas.
2. Crear la aplicación Vue + TypeScript con pnpm, fijar Node y configurar Vite para el prefijo de GitHub Pages.
3. Añadir Router con rutas diferidas, Pinia, i18n en español, Tailwind y estructura por capas/features.
4. Implementar tokens visuales, elección de tema `system/light/dark` anterior al primer pintado y navegación accesible adaptable.
5. Configurar ESLint, Prettier, `vue-tsc`, Vitest y una base E2E de Playwright/axe; ejecutar controles en Actions.
6. Desplegar desde `main` con GitHub Actions y verificar rutas profundas en Pages.
7. Registrar decisiones de sandbox/evaluación, persistencia y paquete de contenido en ADRs.

## Riesgos y decisiones de implementación

- **Pages usa subruta**: `base` y `createWebHistory` deben compartir `/css-lab/`; el artefacto publica `404.html` para recuperar rutas profundas.
- **Seguridad del laboratorio**: no se añade ejecución de JavaScript. El iframe sandbox y la validación del contenido se diseñan antes de integrar el editor.
- **Compatibilidad de selectores**: el evaluador moderno se prueba en navegador real, no se toma jsdom como referencia.
- **Persistencia**: una única frontera de almacenamiento validada y versionada; no se dispersan accesos directos a localStorage por componentes.
- **Accesibilidad y rendimiento**: teclado, foco, contraste y preferencias de movimiento se consideran criterios de aceptación desde el primer layout; editor y contenido pesado se cargan bajo demanda.
- **Licencias y privacidad**: código MIT, contenido CC BY-SA 4.0, fuentes autoalojadas y sin analítica externa.

## Estado inicial

- [x] Especificación funcional y roadmap revisados.
- [ ] Hito 0 en curso: inicializar Git, aplicación mínima y pipeline de Pages.
- [ ] Hitos 1–6 pendientes de las condiciones de salida anteriores.
