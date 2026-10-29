# CSS Lab

**Selecciona, prueba, domina.** CSS Lab es una aplicación educativa en español para aprender selectores CSS experimentando, resolviendo retos y consultando el progreso local.

> El proyecto está en desarrollo: el Hito 0 ya está publicado y el Laboratorio permite probar HTML, CSS y selectores en un entorno aislado, explorar las coincidencias en el árbol DOM y compartir borradores mediante enlaces comprimidos. Teoría, catálogo, retos y progreso se irán completando según el [plan de implementación](./docs/IMPLEMENTATION_PLAN.md).

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

## Publicación

`.github/workflows/deploy.yml` comprueba cada pull request y publica automáticamente al hacer push a `main`. En GitHub, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. La URL prevista es <https://franmatias.github.io/css-lab/>.

## Arquitectura y alcance

- Vue 3, TypeScript estricto, Vite, Vue Router y Pinia.
- Estilos con Tailwind CSS y variables CSS como tokens.
- Las preferencias y el progreso se guardan en el navegador; no hay cuentas, backend ni analítica externa.
- El HTML/CSS que se añada al laboratorio no ejecutará JavaScript.
- Consulta las decisiones iniciales en [`docs/adr/`](./docs/adr/).

## Licencias

El código está bajo [MIT](./LICENSE). El contenido pedagógico, la marca y los recursos originales están bajo [CC BY-SA 4.0](./LICENSE-CONTENT). Las licencias de fuentes e iconos de terceros se respetan por separado.
