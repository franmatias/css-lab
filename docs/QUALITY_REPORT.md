# Informe de calidad y validación

Fecha: **2 de noviembre de 2026**. Rama: **feat/quality-validation**. Alcance: cierre técnico de los pendientes P1; los criterios que requieren personas siguen abiertos. [Guiones y hojas de registro](./HUMAN_VALIDATION.md).

## Resultados técnicos locales

Entorno: Windows, Node 20.18.0, pnpm 9.15.9, Vitest 3.2.7 y Playwright 1.64.1. Se usa la instalación de navegadores gestionada por Playwright; WebKit automatizado no equivale a Safari con VoiceOver.

| Control                           | Resultado                                                   | Alcance                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Reglas, formato y tipos           | Superados                                                   | ESLint, Prettier y vue-tsc.                                                                                                      |
| Pruebas unitarias y de componente | 60 superadas                                                | Evaluación, cascada, progreso, esquemas, limpieza de vistas y panel accesible.                                                   |
| Cobertura de dominio              | 99,10 % líneas/sentencias; 94,07 % ramas; 96,77 % funciones | Todos los archivos de src/domain, excluyendo solo archivos de pruebas. Umbral global 90 % en las cuatro métricas.                |
| Chromium                          | 71 verificadas                                              | Flujos, referencias, guardado, Emmet, vistas aisladas, accesibilidad automática y reflujo.                                       |
| WebKit                            | 71 verificadas                                              | La misma batería, incluidas las correcciones de foco y cambio de tema.                                                           |
| Firefox local                     | No ejecutable en este Windows                               | El ejecutable falla antes de abrir con «configuración en paralelo no es correcta». La matriz de CI en Ubuntu incluye Firefox.    |
| Producción                        | 2 superadas                                                 | Inicio y navegación bajo /css-lab/, talleres, juegos y presupuesto de JS.                                                        |
| JS inicial completo               | **117 909 bytes gzip (117,91 kB)**                          | Todos los scripts solicitados al entrar en Inicio con contexto limpio, incluido theme-init. Presupuesto: menos de 150 000 bytes. |
| Lighthouse móvil, Inicio          | **90/100 rendimiento; 100/100 accesibilidad**               | Mediana de tres ejecuciones sobre producción local.                                                                              |
| LCP móvil                         | **2,299 s**                                                 | Valores: 2,285; 2,299; 2,304 s. Objetivo: menos de 2,5 s.                                                                        |
| Estabilidad visual                | **CLS 0**                                                   | Las tres ejecuciones finales.                                                                                                    |

Las siete pruebas interrumpidas durante una suspensión del equipo se repitieron sin modificar los tiempos de espera: las siete superadas. Se conservan las diferencias entre ejecución interrumpida y reprueba; no se presentan como una ejecución inicial limpia de toda la matriz.

Lighthouse usa su perfil móvil simulado predeterminado, sin cambiar a escritorio ni reducir la penalización de CPU/red para pasar el umbral. Puntuaciones finales: 92, 90 y 90. Es una medición reproducible de Inicio en laboratorio, no una medición de usuarios reales ni una certificación de todas las rutas. Las rutas de editor cargan CodeMirror y el formateador cuando se necesitan; el aviso de tamaño de ese fragmento diferido permanece visible en el build.

## Incidencias corregidas

- WebKit detectó contraste transitorio insuficiente al cambiar de tema con movimiento reducido. Las transiciones quedan desactivadas de verdad con esa preferencia, en lugar de durar 0,01 ms.
- Safari/WebKit no enfoca necesariamente un botón al pulsarlo con el ratón. La guía guarda su activador y devuelve el foco; los botones de insignias reciben foco antes de abrir el diálogo.
- El evaluador de propiedades retiraba los documentos temporales, pero podía dejar pendiente el temporizador de una carga paralela que fallase. Ahora cancela ambos temporizadores y manejadores al finalizar, también en errores.
- Inicio cargaba material de teoría y el analizador de selectores que no necesitaba. Se separaron contenido, calendario y puntuación manteniendo las exportaciones y los IDs anteriores. La portada se carga directamente y las fuentes necesarias se anticipan.
- Diferir el aviso de insignia causaba un desplazamiento visible al aparecer. Su componente se incluye desde el inicio; no se oculta la celebración para mejorar la medición.
- Se añadió un icono local para evitar la petición fallida de favicon.
- Propiedades dispone de contrato Zod propio; los cien retos, las fichas y las lecciones se verifican estructuralmente. Los objetivos de los retos deben existir en su HTML y las soluciones se comprueban en navegador.

## Reproducción y controles de integración

Instalar con pnpm 9.15.9 y el archivo de bloqueo; usar Node indicado en .nvmrc. Ejecutar, en orden:

1. pnpm lint; pnpm format:check; pnpm typecheck.
2. pnpm test:coverage.
3. pnpm exec playwright install --with-deps chromium firefox webkit.
4. pnpm test:e2e.
5. pnpm build; pnpm test:production.
6. pnpm test:lighthouse, indicando CHROME_PATH del Chromium instalado por Playwright si no hay Chrome del sistema.

[El flujo de Actions](../.github/workflows/deploy.yml) realiza estos controles antes de publicar. Un fallo impide el despliegue. Publica como artefacto quality-evidence la cobertura, resultados de navegador e informes de Lighthouse durante catorce días. El informe de JS inicial se guarda en los resultados de producción. No se requiere un servicio externo de Lighthouse ni un token para subir esos informes como artefactos.

## Criterios que no se pueden cerrar automáticamente

- Revisión editorial independiente de exactitud, dificultad, tiempos, redundancias y calidad de las preguntas de los 300 contenidos. Los esquemas y las soluciones correctas no demuestran calidad pedagógica.
- Dos rondas de cinco estudiantes, con resultados, correcciones y repruebas.
- Auditoría manual con lector de pantalla, zoom real, teclado y revisión del material dentro de los iframes. axe excluye los iframes que impiden inyección de scripts.
- Safari real y dispositivos táctiles con tecnologías de asistencia, además del WebKit automatizado.

Estos puntos tienen guion y registro preparados, pero **no se han realizado ni se declara conformidad WCAG completa**. Las funcionalidades P2 y las extensiones opcionales del plan tampoco se convierten en entregadas por terminar los controles técnicos.
