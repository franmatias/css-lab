# CSS Lab – Especificación técnica y funcional

*Versión 1.0 (especificación cerrada, lista para iniciar el desarrollo) · Aplicación web educativa para aprender CSS, con foco inicial en selectores*

## 1. Resumen y objetivos

**CSS Lab** es una SPA en español que enseña CSS de forma práctica, visual y gamificada. El estudiante lee una explicación breve, experimenta en vivo, resuelve retos con retroalimentación inmediata y ve su progreso.

**Objetivos**

- Que un principiante entienda y use selectores CSS (tipo, clase, id, atributo, combinadores, pseudoclases, pseudoelementos, especificidad) en menos de 10 horas de práctica.
- Que el aprendizaje sea activo: *leer poco, probar mucho*.
- Que la base de código sea extensible a otros temas (Flexbox, Grid, colores, tipografía, animaciones) **sin tocar el núcleo**, solo añadiendo contenido y, si hace falta, nuevos tipos de reto.
- Que el proyecto sea mantenible: arquitectura modular, contenido como datos tipados, pruebas automatizadas y decisiones documentadas.

**Fuera de alcance (v1)**: cuentas de usuario, backend, sincronización en la nube, ranking global, edición colaborativa. Todo funciona offline-first en el navegador.

## 2. Público y principios pedagógicos

**Perfiles**

- *Principiante*: conoce poco HTML, necesita vocabulario y ejemplos guiados.
- *Intermedio*: conoce selectores básicos, quiere dominar combinadores, `:is()`, `:where()`, `:has()`, `:not()`, `:nth-*`, especificidad.

**Principios**

1. **Ver antes de leer**: cada concepto abre con un ejemplo visual interactivo.
2. **Retroalimentación inmediata**: el resultado se actualiza mientras se escribe (con *debounce* corto).
3. **Error amigable**: los mensajes explican *qué* falló y *por qué*, nunca solo «incorrecto».
4. **Dificultad progresiva**: cada reto desbloquea el siguiente; hay pistas escalonadas.
5. **Repetición espaciada ligera**: el Progreso sugiere repasar conceptos con peor desempeño.
6. **Gamificación al servicio del aprendizaje**: puntos y logros refuerzan la práctica, no la sustituyen.

## 3. Stack tecnológico

**Núcleo**

- **Vue 3** (Composition API, `<script setup lang="ts">`) + **TypeScript** en modo `strict`.
- **Vite** como bundler y servidor de desarrollo.
- **Vue Router 4** con *lazy loading* por ruta.
- **Pinia** para estado global (tema, progreso, laboratorio).
- **Tailwind CSS** con `darkMode: 'class'` y variables CSS como fuente de verdad de los *tokens* de diseño.

**Bibliotecas especializadas (propuestas)**

- **CodeMirror 6** (editor de código ligero, accesible, con modos CSS/HTML). Decisión confirmada; Monaco queda descartado por su peso.
- **VueUse** (`useLocalStorage`, `usePreferredDark`, `useMediaQuery`, `useDebounceFn`, `useEventListener`).
- **Zod** para validar contenido (lecciones, retos) y datos leídos de localStorage.
- **postcss-selector-parser** o **css-tree** para analizar selectores del estudiante (detectar sintaxis inválida, calcular especificidad, dar pistas).
- **DOMPurify** para sanear el HTML editable.
- **Shiki** (o `highlight.js`) para resaltar fragmentos de código en la teoría.
- **@vueuse/motion** o transiciones nativas de Vue + CSS para animaciones sutiles; **canvas-confetti** para celebrar logros (desactivable).
- **Reka UI (Radix Vue)** para componentes accesibles sin estilo (pestañas, diálogos, menús), estilizados con Tailwind y los tokens de diseño.
- **lucide-vue-next** para iconos.
- **vite-plugin-pwa** (opcional) para uso sin conexión.

**Calidad y herramientas**

- **Vitest** + **Vue Test Utils** + **@testing-library/vue** (unitarias y de componentes), entorno `happy-dom` o `jsdom`.
- **Playwright** para pruebas E2E y de accesibilidad (con `@axe-core/playwright`).
- **ESLint** (flat config, `eslint-plugin-vue`, `typescript-eslint`, `eslint-plugin-vuejs-accessibility`) + **Prettier**.
- **vue-tsc** para verificación de tipos en CI.
- **Husky + lint-staged + commitlint** (Conventional Commits).
- **Histoire** o **Storybook** para catálogo de componentes (recomendado a partir del hito 2).
- **GitHub Actions** (o similar) para CI: lint, tipos, pruebas, build, Lighthouse.

## 4. Arquitectura y metodologías de mantenibilidad

### 4.1 Enfoque general

- **Arquitectura modular por *features*** (inspirada en *Feature-Sliced Design*): cada sección es un módulo autocontenido con su UI, lógica y pruebas.
- **Separación de capas**:
  - *Dominio* (TypeScript puro, sin Vue): reglas de retos, evaluación de selectores, puntuación, insignias.
  - *Aplicación* (stores y *composables*): orquestan el dominio.
  - *Infraestructura*: persistencia (localStorage), sandbox, sanitización.
  - *Presentación*: componentes Vue.
- **Contenido como datos**: lecciones, catálogo y retos viven en archivos tipados y validados con Zod, no en plantillas. Añadir un reto = añadir un objeto, sin tocar componentes.
- **Composables pequeños y testeables** en vez de lógica dentro de componentes.
- **Dependencias hacia dentro**: la presentación depende de aplicación y dominio; nunca al revés.

### 4.2 Estructura de carpetas propuesta

```
src/
  app/                 # bootstrap, router, providers, estilos globales
  shared/              # ui kit (botones, tabs, modal), composables, utils, tipos
  domain/              # lógica pura (selectores, retos, puntuación, insignias)
  features/
    home/
    theory/
    catalog/
    lab/
    challenges/
    progress/
    theme/
  content/
    lessons/           # .ts o .json validados con Zod
    catalog/
    challenges/
    badges/
  infrastructure/
    storage/           # adaptador de localStorage versionado
    sandbox/           # render seguro de HTML/CSS
  assets/
tests/                 # e2e y utilidades de prueba
docs/adr/              # Architecture Decision Records
```

### 4.3 Prácticas

- **ADRs** (Architecture Decision Records) cortos para decisiones clave (editor, sandbox, esquema de storage).
- **Conventional Commits** + versionado semántico y `CHANGELOG` automático.
- **Definition of Done** (ver sección 15).
- **Revisión por PR** con *checklist* de accesibilidad, tipos y pruebas.
- **Tokens de diseño** únicos (variables CSS) y componentes *UI kit* reutilizables; prohibido repetir estilos ad hoc.
- **Alias de rutas** (`@/features/...`) y reglas de ESLint que impidan importaciones entre *features* (solo vía `shared` o `domain`).
- **Internacionalización preparada**: aunque la v1 es solo en español, todos los textos pasan por `vue-i18n` con archivo `es.ts`; facilita cambiar tono o añadir idiomas.

## 5. Navegación y rutas

Navegación principal en cabecera (escritorio/tablet) y barra inferior o menú desplegable (móvil), con enlace «Saltar al contenido».

- `/` → **Inicio**
- `/teoria` y `/teoria/:slug` → **Teoría**
- `/catalogo` y `/catalogo/:slug` → **Catálogo**
- `/laboratorio` → **Laboratorio**
- `/retos`, `/retos/:categoria` y `/retos/:id` → **Retos**
- `/progreso` → **Progreso**
- `*` → 404 amable con enlaces de retorno

Todas las rutas con *lazy loading*, título de documento dinámico, gestión de foco al navegar (mover foco al `<h1>`) y anuncio a lectores de pantalla.

## 6. Requisitos funcionales por sección

### 6.1 Inicio

- Propuesta de valor en una frase y botón principal «Empezar» o «Continuar donde lo dejaste».
- Mini-demostración interactiva (un selector que resalta elementos al pasar el cursor).
- Resumen del progreso (nivel, racha, % completado) si ya hay datos.
- «Reto del día» (determinista por fecha, sin servidor).
- Accesos rápidos a las demás secciones.

### 6.2 Teoría

- Lecciones cortas (5 a 8 minutos) organizadas en un mapa de aprendizaje: *Fundamentos → Selectores básicos → Atributos → Combinadores → Pseudoclases → Pseudoelementos → Especificidad y cascada → Selectores modernos (`:is`, `:where`, `:has`)*.
- Cada lección: objetivo, explicación, ejemplo vivo, «Pruébalo tú», errores comunes y mini-quiz de 2 o 3 preguntas.
- Índice lateral (*tabla de contenidos*) en escritorio; colapsable en móvil.
- Botón «Abrir en el Laboratorio» que precarga el ejemplo.
- Marcar lección como completada (suma XP una sola vez).

### 6.3 Catálogo

- Referencia consultable de selectores y propiedades relacionadas, con ficha por entrada: sintaxis, descripción, ejemplo, especificidad, compatibilidad (texto breve) y enlace a MDN.
- Búsqueda con filtrado instantáneo (nombre, sintaxis, etiquetas) y filtros por categoría y nivel.
- Favoritos guardados en localStorage.
- Cada ficha incluye un visor interactivo «Ver en acción» (HTML fijo + selector editable).

### 6.4 Laboratorio

Espacio libre de experimentación.

- Tres áreas: **HTML**, **CSS** y **Vista previa**. En móvil, pestañas; en escritorio, paneles redimensionables.
- **Resaltado de coincidencias**: al escribir un selector, los elementos que coinciden se marcan visualmente (contorno animado) y se muestra el contador («3 elementos coinciden»).
- **Árbol DOM** interactivo: al pasar el cursor sobre un nodo se ilumina en la vista previa y viceversa; muestra el camino del selector sugerido.
- **Panel de especificidad**: calcula (a,b,c) del selector, y compara reglas en conflicto indicando cuál gana y por qué.
- Plantillas de HTML (lista, formulario, tabla, tarjeta, navegación) y ejemplos precargados.
- Compartir o exportar: copiar código, descargar `.html`, y *enlace con estado* codificado en el hash de la URL (sin servidor).
- Deshacer/rehacer y restablecer.
- Guardado automático del último estado del laboratorio en localStorage.

### 6.5 Retos

- Lista de retos agrupados por categoría y dificultad (★ a ★★★), con estado: bloqueado, disponible, en curso, completado.
- **Tipos de reto (extensibles mediante un registro de estrategias)**:
  1. *Selecciona objetivo*: escribir un selector que marque exactamente los elementos resaltados como objetivo.
  2. *Completa el selector*: rellenar huecos en un selector dado.
  3. *Arregla el error*: corregir un selector con fallo (sintaxis o lógica).
  4. *Aplica estilo*: escribir CSS para conseguir un resultado visual descrito (comparación de estilos computados).
  5. *Especificidad*: ordenar o predecir qué regla gana.
  6. *Opción múltiple / verdadero-falso* para conceptos teóricos.
  7. *Más corto posible* (optimización): selector válido con menos caracteres o menor especificidad.
- **Evaluación determinista** en el cliente: se comparan el conjunto de nodos seleccionados con el conjunto esperado y se devuelve un diagnóstico (sobran X, faltan Y, sintaxis inválida en posición N).
- **Sistema de pistas** en 3 niveles (concepto → dirección → casi la solución); usar pistas reduce los puntos de forma moderada.
- Retroalimentación positiva con explicación («Funciona porque el combinador `>` solo coincide con hijos directos») y, cuando existan, soluciones alternativas.
- Reintentos ilimitados; sin penalización por fallar, solo por usar pistas.

### 6.6 Progreso

- Panel con: XP total, nivel, racha de días, lecciones completadas, retos resueltos, tiempo de práctica estimado.
- Gráfico de actividad semanal (barras o mapa de calor simple).
- **Dominio por concepto** (barras o radar): estimado a partir de aciertos, pistas e intentos.
- Galería de **insignias** (obtenidas y bloqueadas con su condición).
- Recomendación de «Qué repasar ahora».
- Gestión de datos: **exportar/importar** progreso (JSON), reiniciar con confirmación.

## 7. Gamificación

- **XP** por lección completada, reto resuelto (según dificultad), reto sin pistas (bonus) y práctica diaria.
- **Niveles** con umbrales crecientes (por ejemplo, Aprendiz → Explorador → Selector → Maestro de la cascada).
- **Racha diaria** con tolerancia opcional (un «día de gracia» semanal) para no generar ansiedad.
- **Insignias** definidas como datos: `id`, `nombre`, `descripción`, `condición` (función pura sobre el estado de progreso), `icono`.
  - Ejemplos: *Primer selector*, *Sin pistas ×5*, *Maestro de combinadores*, *Cazador de especificidad*, *Racha de 7 días*, *Modo noctámbulo* (probar el tema oscuro), *Explorador del catálogo* (visitar 20 fichas).
- Los logros se anuncian con una notificación breve (`role="status"`) y animación discreta; se pueden silenciar en Ajustes.
- Evitar mecánicas manipuladoras (sin pérdida de progreso por inactividad, sin contadores de presión).

## 8. Persistencia en localStorage

**Principios**

- Una sola clave raíz con prefijo y versión: `csslab:v1`, con subárboles por dominio (`theme`, `progress`, `lab`, `settings`, `favorites`).
- **Esquema validado con Zod** al leer; si falla, se usa valor por defecto y se conserva copia en `csslab:v1:backup` para evitar pérdida.
- **Migraciones** por versión (`migrate_v1_to_v2`), probadas con Vitest.
- Acceso a través de un único **adaptador** (`StorageService`) con interfaz inyectable, para poder simularlo en pruebas y degradar a memoria si localStorage no está disponible (modo privado, cuota excedida).
- Escrituras con *debounce* y manejo de errores de cuota.
- Sincronización entre pestañas mediante el evento `storage`.

**Modelo de datos (resumen)**

```ts
interface ProgressState {
  xp: number;
  streak: { current: number; best: number; lastActiveDate: string };
  lessons: Record<string, { completedAt: string }>;
  challenges: Record<string, {
    status: 'in_progress' | 'completed';
    attempts: number;
    hintsUsed: number;
    bestScore?: number;
    completedAt?: string;
  }>;
  badges: Record<string, { unlockedAt: string }>;
  mastery: Record<string, number>; // concepto → 0..1
}
```

## 9. Diseño, tema y responsive

- **Tokens como variables CSS** en `:root` y `[data-theme="dark"]` (o clase `.dark`): color de superficie, texto, acento, éxito, error, aviso, bordes, radios, sombras, espaciado, tipografía. Tailwind los consume mediante `theme.extend.colors` apuntando a `var(--...)`.
- **Tema claro/oscuro**: inicial según `prefers-color-scheme`; el conmutador guarda la elección explícita (`light`, `dark` o `system`) en localStorage. Script en línea en `index.html` para aplicar el tema *antes* del primer pintado y evitar parpadeo.
- **Paleta**: acento vibrante y amigable para lo «llamativo» (por ejemplo violeta/índigo con acento coral o cian), con superficies sobrias para que el código y la vista previa sean el foco.
- **Tipografía**: sans legible para UI y monoespaciada con ligaduras desactivables para código; tamaños fluidos con `clamp()`.
- **Responsive** (enfoque *mobile-first*): puntos de ruptura `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Laboratorio: pestañas en móvil, 2 columnas en tablet, 3 paneles en escritorio. Uso de *container queries* en componentes reutilizables.
- **Animaciones sutiles**: transiciones de 150–250 ms para cambios de estado, resaltado de coincidencias con pulso suave, entrada escalonada discreta en listas. Todo bajo `@media (prefers-reduced-motion: reduce)` se reduce a cambios instantáneos o fundidos mínimos. Nada de animaciones en bucle junto al contenido de lectura.

## 10. Accesibilidad (objetivo WCAG 2.2 AA)

- HTML semántico: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`; jerarquía de encabezados coherente.
- **Foco visible** consistente (`:focus-visible` con anillo de alto contraste y offset), nunca `outline: none` sin sustituto.
- **Contraste**: 4.5:1 en texto normal y 3:1 en elementos de interfaz y texto grande, verificado en ambos temas con pruebas automatizadas de tokens.
- Navegación completa por teclado (pestañas con patrón ARIA *tabs*, diálogos con captura de foco, `Esc` para cerrar).
- El editor de código debe permitir **salir con teclado** (convención `Esc` + `Tab`) y tener etiqueta accesible.
- No depender solo del color: coincidencias y errores también con iconos, texto o patrones.
- Regiones `aria-live` para resultados de validación y logros.
- Objetivos táctiles de al menos 44×44 px en móvil.
- Soporte de zoom hasta 200 % y reflujo a 320 px sin scroll horizontal (salvo código).
- Pruebas con axe en CI y revisión manual con lector de pantalla en cada hito.

## 11. Seguridad y sandbox

El estudiante ejecuta HTML/CSS arbitrario, por lo que se aísla:

- Vista previa en **`<iframe sandbox>`** con `srcdoc` (sin `allow-scripts` ni `allow-same-origin` si se puede; si se necesita leer el DOM desde la app, usar **Shadow DOM** o evaluar el DOM en un documento inerte creado con `DOMParser`).
- **Sin JavaScript del usuario** en v1: el HTML se sanea con DOMPurify (sin `<script>`, manejadores `on*`, ni URLs `javascript:`).
- Cabecera/`meta` **CSP** restrictiva en la aplicación.
- Límite de tamaño de entrada y *timeouts* defensivos para evitar bloqueos (selectores o HTML patológicos).
- El CSS del estudiante se **encapsula** (prefijado o dentro del iframe/Shadow DOM) para que no afecte a la interfaz de la aplicación.
- Los datos importados (JSON) se validan con Zod antes de aplicarse.

## 12. Rendimiento

- Presupuesto inicial: JS inicial < 150 KB gzip; LCP < 2.5 s en móvil de gama media.
- *Code splitting* por ruta; el editor (CodeMirror) y los gráficos se cargan de forma diferida.
- Contenido de lecciones cargado bajo demanda (`import()` dinámico).
- Evaluación de selectores y renderizado de la vista previa con *debounce* (≈150 ms) y cancelación de trabajos obsoletos.
- Lighthouse en CI con umbrales mínimos (Rendimiento ≥ 90, Accesibilidad ≥ 95).

## 13. Estrategia de pruebas

**Pirámide**

1. **Unitarias (Vitest)** – dominio puro: evaluación de selectores, cálculo de especificidad, puntuación, desbloqueo de insignias, migraciones de storage. Objetivo de cobertura ≥ 90 % en `domain/`.
2. **Componentes (Vue Test Utils / Testing Library)** – UI kit, tabs, tarjetas de reto, conmutador de tema, paneles del laboratorio; consultas por rol y etiqueta accesible.
3. **Contenido** – prueba automática que recorre *todos* los retos y verifica que su solución de referencia pasa el validador, que los IDs son únicos y que no hay prerrequisitos circulares.
4. **E2E (Playwright)** – flujos críticos: cambiar tema y recargar, completar un reto y ver XP e insignia en Progreso, exportar/importar progreso, navegación por teclado.
5. **Accesibilidad** – axe en cada ruta y tema; comprobación de contraste de tokens.
6. **Regresión visual (opcional)** – capturas de componentes clave en claro/oscuro y tres anchos.

## 14. Esquema de contenido (ejemplo de reto)

```ts
const reto: Challenge = {
  id: 'combinadores-hijo-directo-01',
  tipo: 'select-target',
  titulo: 'Solo los hijos directos',
  nivel: 2,
  conceptos: ['combinador-hijo'],
  prerrequisitos: ['combinadores-descendiente-01'],
  html: '<ul class="menu"><li>Inicio</li><li>Más<ul><li>Sub</li></ul></li></ul>',
  objetivo: { esperado: ['ul.menu > li'], modo: 'conjunto-exacto' },
  soluciones: ['.menu > li', 'ul.menu > li'],
  pistas: [
    'Piensa en la relación padre-hijo, no en cualquier descendiente.',
    'Existe un combinador que usa el símbolo >.',
    'Prueba: .menu > ___'
  ],
  xp: 30
};
```

El registro de estrategias de evaluación permite añadir un tipo nuevo (por ejemplo, «Flexbox: alinea los elementos») implementando una interfaz `ChallengeEvaluator` y registrándolo, sin modificar la pantalla de retos.

## 15. Calidad: Definition of Done

Una funcionalidad se considera terminada cuando:

- Cumple criterios de aceptación y tiene pruebas (unitarias y/o de componente) en verde.
- Sin errores de ESLint, Prettier ni `vue-tsc`.
- Verificada en tema claro y oscuro y en móvil, tablet y escritorio.
- Pasa axe sin violaciones y es operable solo con teclado.
- Textos en el archivo de internacionalización; sin cadenas «sueltas».
- Documentación actualizada (README, ADR o Storybook/Histoire si procede).
- PR revisado y CI correcto.

## 16. Roadmap por hitos

**Hito 0 – Cimientos (1 semana)** Repositorio, Vite + Vue + TS + Tailwind, ESLint/Prettier, Vitest, Playwright base, CI, tokens de diseño, UI kit mínimo, tema claro/oscuro persistente, enrutado y *layout* responsive con navegación.

**Hito 1 – Núcleo del Laboratorio (2 semanas)** Sandbox seguro, editor, resaltado de coincidencias, contador, árbol DOM, especificidad. Pruebas del dominio. Incluye el enlace «Comparte tu solución» (estado comprimido en el hash de la URL).

**Hito 2 – Retos + Progreso (2 semanas)** Motor de evaluación, tipos 1 a 3, pistas, XP, niveles, insignias iniciales, `StorageService` versionado, pantalla de Progreso, exportar/importar, mensajes «Explícame este error», gamificación base (XP, niveles, racha y primeras insignias) y primera ronda de pruebas con 5 usuarios.

**Hito 3 – Contenido núcleo (3 semanas).** Lecciones y fichas de los módulos M0 a M5 (27 selectores) con sus retos (≈34), búsqueda y favoritos del Catálogo, mini-quizzes y enlace «Abrir en el Laboratorio». El contenido se separa en un paquete independiente (`packages/content`) con pruebas de contenido. Segunda ronda de pruebas con usuarios.

**Hito 4 – Contenido completo y gamificación (3 semanas).** Módulos M6 a M9 (19 selectores y 5 conceptos de cascada, ≈28 retos). Visualizador de cascada, repetición espaciada, al menos 30 insignias, analítica local, alto contraste, tipografía para dislexia y tour de bienvenida.

**Hito 5 – Pulido y lanzamiento v1.0 (2 semanas).** Animaciones, auditoría de accesibilidad con lector de pantalla, rendimiento, mascota, resumen imprimible, despliegue en GitHub Pages y documentación abierta (README, CONTRIBUTING, licencias).

**Hito 6 – Extensión (posterior a v1.0).** Retos procedurales con semilla, modos Contrarreloj y Duelo de selectores (desactivables), importación de paquetes de retos, PWA opcional y nuevos módulos: Modelo de caja, Flexbox, Grid, Colores y unidades, Transiciones y animaciones.

## 17. Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| HTML/CSS malicioso o patológico del usuario | Sandbox, saneado, límites y *timeouts* |
| Pérdida o corrupción de localStorage | Validación Zod, copia de respaldo, exportar/importar |
| Contenido pedagógico incorrecto o inconsistente | Pruebas automáticas de contenido y revisión por pares |
| Gamificación que distrae | Medir y mantener opcional; XP solo por práctica significativa |
| Diferencias entre navegadores (`:has`, etc.) | Detección de soporte con `CSS.supports` y aviso contextual |
| Crecimiento desordenado del código | Límites de importación por ESLint, ADRs, revisión de arquitectura por hito |

## 18. Sugerencias para mejorar el proyecto

1. **Modo «Explícame este error»**: el analizador de selectores traduce errores de sintaxis a lenguaje claro con ejemplo de corrección.
2. **Visualizador de cascada**: mostrar paso a paso por qué una regla gana (origen, especificidad, orden).
3. **Modo «Desafío contrarreloj» y «Duelo de selectores»** (opcional y desactivable) para quien disfruta la competencia ligera.
4. **Repetición espaciada** (algoritmo tipo Leitner) para sugerir retos antiguos que conviene repasar.
5. **Retos generados proceduralmente** (HTML aleatorio con semilla) para práctica ilimitada de un mismo concepto.
6. **Modo claro/oscuro/alto contraste** y opción de tipografía para dislexia.
7. **Mascota o guía** discreta con mensajes breves de ánimo (desactivable).
8. **Certificado/resumen imprimible** del progreso (PDF generado en cliente).
9. **Comparte tu solución**: enlace con estado en el hash, útil para docentes.
10. **Panel para docentes** (futuro): importar un paquete de retos propio en JSON validado por el mismo esquema.
11. **Plugin de contenido**: carpeta `content/` publicable como paquete independiente para facilitar contribuciones de la comunidad.
12. **Analítica local y respetuosa**: sin rastreo; solo estadísticas locales visibles para el propio estudiante.
13. **Tour de bienvenida** de 4 pasos y *empty states* útiles en cada sección.
14. **Pruebas con usuarios reales** (5 estudiantes) tras el hito 2 para ajustar dificultad y feedback antes de escribir más contenido.

## 19. Decisiones confirmadas

Las respuestas del equipo cierran el alcance de la v1: público autodidacta, foco en selectores, sin JavaScript del usuario y sin cuentas. Esta sección prevalece sobre cualquier opción abierta en las secciones anteriores.

| Tema | Decisión | Efecto en la especificación |
| --- | --- | --- |
| Público | Autodidactas | Ruta guiada sin docente, tono cercano. El panel docente pasa a Hito 6 como importación de paquetes de retos |
| Alcance | Principiantes e intermedios, con foco inicial en selectores | Los hitos 3 y 4 cubren solo selectores y cascada; nuevos módulos en Hito 6 |
| Laboratorio | Admite CSS completo (propiedades y valores), no solo selectores | Los retos de v1 evalúan selectores y especificidad; el tipo «Aplica estilo» queda como apoyo visual |
| JavaScript | No permitido | Sandbox sin scripts y HTML saneado (sección 11) |
| Editor | CodeMirror 6 | Carga diferida, lenguajes CSS/HTML, salida con teclado `Esc` + `Tab` |
| Gamificación | Rachas e insignias como eje del producto | Ver «Gamificación como eje» más abajo |
| Cuentas | Ninguna | Todo en localStorage; sin sincronización ni ranking global |
| Respaldo | Exportar/importar JSON es suficiente | Recordatorio de copia cada 14 días con progreso sin exportar |
| Contenido | Entre 20 y 50 selectores | 46 selectores, 5 conceptos de cascada y 62 retos (sección 21) |
| Estado | Pinia | Un store por *feature*: `theme`, `progress`, `lab`, `settings` |
| Alojamiento | GitHub Pages | Despliegue estático con GitHub Actions (sección 22) |
| Licencia | Código abierto | MIT para el código, CC BY-SA 4.0 para el contenido (sección 22) |
| Identidad visual | Definida por la especificación | Sección 20 |

**Supuestos por defecto** (no respondidos; cámbialos si no te encajan):

- Gestor de paquetes **pnpm**, versión de Node fijada en `.nvmrc` y en CI.
- Navegadores *evergreen* con soporte de `:has()`: Chrome y Edge 105+, Safari 15.4+, Firefox 121+. En otros, un aviso explica qué ejemplos no funcionarán.
- Solo español en v1, con todos los textos en `vue-i18n` para facilitar traducciones comunitarias.
- Sin PWA en v1 (pasa a Hito 6); la app ya funciona bien con la caché normal del navegador.
- Sin analítica externa ni *cookies*: no hace falta banner de consentimiento.

### Gamificación como eje

- **Racha visible en la cabecera** de todas las rutas. Se mantiene con al menos un reto o una lección al día, calculada con la fecha local (`YYYY-MM-DD`). Cada semana hay un **día de gracia** automático para no castigar imprevistos.
- Si el reloj del dispositivo retrocede, la racha no se resta; si salta hacia delante, solo cuenta un día.
- **Objetivo diario** configurable (1, 2 o 3 retos) con un anillo de progreso en Inicio.
- **Al menos 31 insignias** en cinco familias, definidas como datos (sección 7):

| Familia | Cantidad | Ejemplos |
| --- | --- | --- |
| Progreso | 8 | Primer selector, primer módulo completado, 25 retos resueltos |
| Maestría | 9 | Módulo sin pistas, 10 retos seguidos a la primera, experto en combinadores |
| Constancia | 6 | Rachas de 3, 7, 30 y 100 días, semana perfecta, regreso tras una pausa |
| Exploración | 5 | Explorador del catálogo, probar el tema oscuro, compartir una solución |
| Secretas | 3 | Descubrir el selector universal en el Laboratorio, ganar con `:has()`, reto resuelto de madrugada |

- Los logros se celebran con un aviso breve y una animación discreta; siempre desactivables en Ajustes. Con `prefers-reduced-motion` solo aparece el aviso de texto.
- Como no hay servidor, no se protege contra edición manual de localStorage: el progreso es personal, no competitivo.

## 20. Identidad visual

CSS Lab se presenta como un **laboratorio luminoso**: superficies sobrias, un acento índigo y un color de resaltado ámbar reservado a lo que el estudiante está seleccionando. El resaltado de coincidencias es el sello visual del producto.

### Marca y tono

- **Nombre y lema**: CSS Lab, «Selecciona, prueba, domina».
- **Logotipo**: *wordmark* con llaves `{ }` y un matraz estilizado, en SVG inline, con versión monocroma.
- **Mascota opcional**: *Sely*, un cursor con forma de matraz y tres estados (neutra, pensando, celebrando) en SVG; desactivable en Ajustes.
- **Voz**: tuteo, frases cortas, humor ligero y ningún reproche. Acierto: «¡Eso es! `>` solo mira a los hijos directos». Error: «Casi: tu selector también atrapa 2 elementos de más».

### Paleta (tokens CSS)

Los pares se verifican en CI con el objetivo de 4.5:1 para texto y 3:1 para componentes; cualquier ajuste se hace en el token, nunca en el componente.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--bg` | #F7F7FB | #0E1020 | Fondo de página |
| `--surface` | #FFFFFF | #171A2E | Tarjetas y paneles |
| `--surface-2` | #EEF0F8 | #20243C | Editor y zonas secundarias |
| `--text` | #1A1B2E | #ECEDF7 | Texto principal |
| `--text-muted` | #4A4D66 | #B4B8D0 | Texto secundario |
| `--primary` | #4F46E5 | #A5B4FC | Acciones, enlaces, foco |
| `--match` | #B45309 | #FCD34D | Coincidencias del selector |
| `--success` | #15803D | #4ADE80 | Acierto |
| `--error` | #B91C1C | #FCA5A5 | Error |
| `--accent` | #E11D48 | #FB7185 | Racha y celebraciones (decorativo) |
| `--border` | #D5D8E8 | #34385A | Separadores decorativos |
| `--border-strong` | #7A7F9E | #8A90B5 | Bordes de controles (3:1) |

El texto sobre `--primary` usa `--on-primary` (#FFFFFF en claro, #0E1020 en oscuro). `--accent` nunca es el único portador de información.

```css
:root {
  --bg: #F7F7FB; --surface: #FFFFFF; --text: #1A1B2E;
  --primary: #4F46E5; --match: #B45309;
  color-scheme: light;
}
:root[data-theme="dark"] {
  --bg: #0E1020; --surface: #171A2E; --text: #ECEDF7;
  --primary: #A5B4FC; --match: #FCD34D;
  color-scheme: dark;
}
```

Tailwind consume estos tokens (`colors: { bg: 'var(--bg)', primary: 'var(--primary)' }` en v3; en v4 con `@theme` y `@custom-variant dark`), de modo que cambiar de tema no requiere clases `dark:` repetidas.

### Lenguaje visual del aprendizaje

- **Coincidencia**: contorno discontinuo de 2 px en `--match`, fondo translúcido al 12 % y una etiqueta numérica (1, 2, 3…) en la esquina. Nunca depende solo del color.
- **Objetivo del reto**: contorno punteado con icono de diana.
- **Acierto y error**: icono, texto y color a la vez, con `aria-live` para lectores de pantalla.
- **Código**: bloques sobre `--surface-2` con sintaxis resaltada por Shiki y un tema propio para cada modo.

### Tipografía

- **Interfaz**: Inter Variable. **Títulos**: Space Grotesk (600–700). **Código**: JetBrains Mono, con ligaduras desactivadas por defecto.
- Fuentes autoalojadas con `@fontsource-variable` (sin peticiones a terceros, mejor para GitHub Pages y privacidad), subconjunto latino y `font-display: swap`.
- Escala fluida con `clamp()`, base de 16 px, interlineado 1.6 en texto y 1.5 en código.
- Modo de lectura accesible (Hito 4): Atkinson Hyperlegible con más espacio entre letras y líneas.

### Forma y movimiento

- **Radios**: 8 px (controles), 12 px (tarjetas), 999 px (insignias y etiquetas). **Espaciado** base de 4 px. **Sombras** suaves en dos niveles.
- **Duraciones**: 150 ms (microinteracciones), 250 ms (paneles y rutas), 400 ms (celebraciones). **Curva**: `cubic-bezier(.2, .8, .2, 1)`.
- Con `prefers-reduced-motion: reduce` las duraciones pasan a 0–80 ms y desaparecen el confeti y los pulsos.

### Composición

- Cabecera fija con logotipo, navegación, racha y conmutador de tema; en móvil, barra inferior con las seis secciones.
- Contenido de lectura con ancho máximo de 72 rem; el Laboratorio usa todo el ancho disponible.
- Tres modos de tema (claro, oscuro, sistema) y, desde el Hito 4, alto contraste mediante `[data-contrast="more"]` y `prefers-contrast: more`.

## 21. Plan de contenido

La v1 cubre **46 selectores y 5 conceptos de cascada** en 10 lecciones, con 51 fichas de catálogo y 62 retos. Los módulos M0 a M5 (27 selectores) forman el contenido núcleo del Hito 3; M6 a M9 completan la v1 en el Hito 4.

| Módulo | Selectores o conceptos | Fichas | Retos | Hito |
| --- | --- | --- | --- | --- |
| M0 Introducción | HTML, DOM y anatomía de una regla (solo lección y quiz) | 0 | 0 | 3 |
| M1 Fundamentos | `*`, tipo (`p`), `.clase`, `#id` | 4 | 5 | 3 |
| M2 Composición | Lista `a, b`, compuesto `p.clase`, varias clases `.a.b` | 3 | 4 | 3 |
| M3 Atributos | `[a]`, `[a=v]`, `[a~=v]`, `[a\|=v]`, `[a^=v]`, `[a$=v]`, `[a*=v]` | 7 | 8 | 3 |
| M4 Combinadores | Descendiente, `>`, `+`, `~` | 4 | 7 | 3 |
| M5 Pseudoclases estructurales | `:root`, `:empty`, `:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-last-child()`, `:first-of-type`, `:nth-of-type()` | 9 | 10 | 3 |
| M6 Estado y formularios | `:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within`, `:checked`, `:disabled`, `:invalid` | 8 | 8 | 4 |
| M7 Lógicas y relacionales | `:not()`, `:is()`, `:where()`, `:has()` | 4 | 6 | 4 |
| M8 Pseudoelementos | `::before`, `::after`, `::first-letter`, `::first-line`, `::marker`, `::selection`, `::placeholder` | 7 | 6 | 4 |
| M9 Especificidad y cascada | Cálculo (a,b,c), orden, herencia, `!important`, `@layer` | 5 | 8 | 4 |
| **Total** | **46 selectores + 5 conceptos** | **51** | **62** |  |

Distribución de dificultad de los retos: unos 25 de nivel ★, 25 de ★★ y 12 de ★★★. Cada módulo termina con un reto integrador que combina varios selectores.

### Cómo se evalúa cada familia de selectores

La evaluación corre en el cliente sobre un documento inerte (sin scripts). No todos los selectores se pueden comprobar con `querySelectorAll`, así que cada familia tiene su estrategia.

| Familia | Estrategia |
| --- | --- |
| Tipo, clase, id, atributos, combinadores, estructurales, lógicas | `querySelectorAll` sobre el DOM del reto y comparación del conjunto de nodos con el esperado |
| `:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within` | Simulación de estado: el reto declara qué nodos están «en ese estado» y el evaluador reescribe el selector hacia una clase interna equivalente |
| `:checked`, `:disabled`, `:invalid` | Estado real de los controles del documento inerte, definido en el HTML del reto |
| Pseudoelementos | Análisis con `postcss-selector-parser`: se separa el pseudoelemento, se evalúan los nodos de origen y se comprueba su nombre |
| Especificidad y cascada | Cálculo en el dominio y comparación con la respuesta esperada; para `@layer`, comparación de estilos computados |

Las pruebas del evaluador se ejecutan en **Vitest Browser Mode** (con Playwright) y no en jsdom, porque jsdom no cubre todos los selectores modernos como `:has()` o `:focus-visible`.

### Plantilla editorial

- **Lección** (5 a 8 min): objetivo, ejemplo vivo, «Pruébalo tú», errores comunes y quiz de 2 o 3 preguntas.
- **Ficha**: sintaxis, descripción en una frase, ejemplo, especificidad, compatibilidad, enlace a MDN y errores frecuentes.
- **Reto**: HTML mínimo (máximo 25 nodos), enunciado en una frase, solución de referencia, soluciones alternativas, 3 pistas y explicación del acierto.
- **Identificadores estables**: `m4-hijo-directo-01`; nunca se reutilizan ni se renombran, porque el progreso del estudiante los referencia.
- **Redacción original**: no se copia texto de MDN ni de otras fuentes; se enlaza. Esto mantiene la licencia CC BY-SA del contenido sin conflictos.

### Reglas de progresión

- Los **módulos son de acceso libre** (el autodidacta intermedio puede saltarse lo que ya domina); la ruta recomendada se marca visualmente, pero no se impone.
- Dentro de un módulo, los retos se desbloquean en orden; tras 3 intentos fallidos aparece «Saltar este reto» (sin XP, y marcado para repaso).
- Un módulo se considera completado al resolver el 80 % de sus retos, incluido el integrador.

### Control de calidad del contenido

Cada elemento de `content/` se valida con Zod y con una prueba automática que comprueba que la solución de referencia pasa el evaluador, que las soluciones alternativas también, que los identificadores son únicos y que los prerrequisitos no son circulares. Un reto nuevo no se acepta en un PR si esa prueba falla.

## 22. Publicación en GitHub Pages y código abierto

CSS Lab se publica como sitio estático en GitHub Pages desde GitHub Actions. El código es MIT y el contenido pedagógico CC BY-SA 4.0, de modo que cualquiera pueda reutilizarlo y contribuir.

### Despliegue

- **Base de rutas**: `base: '/<repositorio>/'` en `vite.config.ts` (o `'/'` con dominio propio); los recursos se referencian con `import.meta.env.BASE_URL`.
- **Enrutado**: `createWebHistory(import.meta.env.BASE_URL)`. Como Pages no reescribe rutas, un paso posterior al *build* copia `index.html` a `404.html` para que enlaces profundos como `/retos/m4-hijo-directo-01` carguen la aplicación. El estado compartido del Laboratorio va en el hash (`#s=…`), que no choca con este modo de historial.
- **Flujo `deploy.yml`** al hacer *push* a `main`: instalar con pnpm, lint, `vue-tsc`, pruebas, *build*, `actions/upload-pages-artifact` y `actions/deploy-pages` (permisos `pages: write` e `id-token: write`).
- **CSP por `<meta http-equiv>`**, porque Pages no permite cabeceras propias. El *meta* no admite `frame-ancestors` ni `sandbox`; el aislamiento de la vista previa depende del atributo `sandbox` del `<iframe>`.
- **Caché**: recursos con hash en el nombre; el HTML lo gestiona Pages. Dominio propio opcional con HTTPS forzado.
- No hay entorno de *staging*; las ramas de PR generan el *build* como artefacto para revisar.

### Licencias

- **Código**: MIT (`LICENSE`). **Contenido** de `content/`, logotipo y mascota: CC BY-SA 4.0 (`LICENSE-CONTENT`).
- **Fuentes**: Inter, Space Grotesk, JetBrains Mono y Atkinson Hyperlegible bajo SIL OFL; iconos de Lucide bajo ISC.
- Una comprobación de licencias de dependencias en CI evita incorporar paquetes incompatibles.

### Archivos del repositorio

- `README.md` en español con capturas, requisitos y comandos.
- `CONTRIBUTING.md` con la guía «añade un reto en 10 minutos», convenciones y Conventional Commits.
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) y `SECURITY.md`.
- Plantillas de *issue* (error, reto nuevo, error de contenido, mejora) y de PR con la *Definition of Done*.
- `CODEOWNERS`, Dependabot o Renovate, `release-please` para `CHANGELOG.md`, `docs/adr/`, `.nvmrc` y `.editorconfig`.

### Comunidad y gobernanza

- Etiquetas `good first issue` (retos nuevos, erratas), `contenido` y `accesibilidad`.
- GitHub Discussions para proponer módulos; GitHub Projects como hoja de ruta pública.
- Las contribuciones de contenido pasan por PR; la CI valida automáticamente esquema, soluciones y enlaces antes de la revisión humana.
- **Versionado semántico**: contenido nuevo sube la versión *minor*; un cambio del esquema de localStorage sube la *major* e incluye migración.
- **Privacidad**: sin cookies ni analítica externa; el README lo declara.

## 23. Backlog de las sugerencias aceptadas

Las 14 sugerencias de la sección 18 quedan aceptadas y repartidas por hito; seis son imprescindibles para la v1.0 y el resto mejora o amplía.

| # | Sugerencia | Hito | Prioridad | Nota de implementación |
| --- | --- | --- | --- | --- |
| 1 | «Explícame este error» | 2 | Imprescindible | Diagnóstico en el dominio sobre `postcss-selector-parser`; catálogo de mensajes con ejemplo de corrección |
| 9 | «Comparte tu solución» por enlace | 1 | Imprescindible | Estado comprimido (`lz-string`) en el hash; límite de tamaño y validación con Zod al abrir |
| 14 | Pruebas con usuarios reales | 2 y 3 | Imprescindible | 5 personas por ronda, guion de tareas y registro de dudas; decide ajustes de dificultad |
| 2 | Visualizador de cascada | 4 | Imprescindible | Reutiliza el cálculo de especificidad; muestra origen, especificidad y orden paso a paso |
| 6 | Alto contraste y tipografía para dislexia | 4 | Imprescindible | Conmutadores de tokens (`data-contrast`, `data-font`), sin tocar componentes |
| 11 | Contenido como paquete independiente | 3 | Imprescindible | `packages/content` en un *workspace* de pnpm; sin dependencias de Vue |
| 4 | Repetición espaciada (Leitner) | 4 | Recomendada | Cinco cajas con intervalos de 1, 3, 7, 14 y 30 días; alimenta «Qué repasar ahora» |
| 12 | Analítica local y respetuosa | 4 | Recomendada | Solo datos del propio estudiante en el panel de Progreso; nada sale del navegador |
| 13 | Tour de bienvenida y *empty states* | 4 | Recomendada | Cuatro pasos, omitible; estados vacíos con acción sugerida en cada sección |
| 7 | Mascota o guía | 5 | Opcional | SVG con tres estados; mensajes desde el catálogo de textos; desactivable |
| 8 | Resumen imprimible del progreso | 5 | Opcional | Hoja de estilos `@media print` y `window.print()`, sin dependencia de PDF |
| 5 | Retos procedurales con semilla | 6 | Recomendada | Generadores de HTML con PRNG con semilla; la misma semilla da el mismo reto, y es evaluable por el mismo motor |
| 3 | Contrarreloj y Duelo de selectores | 6 | Opcional | Modos aparte, desactivables, sin mezclar con la racha |
| 10 | Paquetes de retos importables | 6 | Opcional | Archivo JSON validado con el mismo esquema Zod; se ejecuta solo en el navegador y no requiere confianza en código |

La fila 10 sustituye al «panel para docentes» original: al ser un público autodidacta, basta con permitir que cualquiera cargue su propio paquete de retos.

## 24. Próximos pasos

La especificación está cerrada; el siguiente paso es el Hito 0, que deja el repositorio listo para trabajar con calidad desde el primer *commit*.

1. Crear el repositorio público con licencias, README y plantillas (sección 22).
2. Inicializar Vite + Vue 3 + TypeScript estricto + Tailwind + Pinia + Vue Router, con alias de rutas y las reglas de ESLint que impiden importaciones entre *features*.
3. Configurar Vitest (unitarias y Browser Mode), Playwright y axe, y el flujo de CI con despliegue a GitHub Pages.
4. Implementar los tokens de la sección 20, el conmutador de tema persistente (con script previo al primer pintado) y el UI kit mínimo sobre Reka UI.
5. Crear el *layout* responsive con las seis secciones, la cabecera con racha y la navegación móvil.
6. Escribir los tres primeros ADRs: sandbox y evaluación de selectores, esquema de localStorage, estructura del paquete de contenido.
7. Prototipar el Laboratorio (mayor riesgo técnico: sandbox, resaltado y evaluador) antes de producir contenido en serie.
8. Redactar M0 y M1 completos (2 lecciones y 9 retos) para validar el formato de contenido y hacer la primera prueba con usuarios.

**Criterio para dar por terminado el Hito 0**: la aplicación se despliega sola en GitHub Pages, cambia de tema sin parpadeo, recuerda la elección tras recargar, pasa axe en todas las rutas y tiene la CI en verde.

**Decisiones que quedan pendientes y no bloquean el arranque**: nombre definitivo del repositorio y dominio, y si la PWA entra antes del Hito 6.
