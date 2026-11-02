import type { LabDraft } from '@/infrastructure/storage/appStorage'
const base =
  '* { box-sizing: border-box; }\nbody { margin: 0; padding: 24px; font: 16px/1.6 system-ui, sans-serif; color: #172554; background: #f8fafc; }\n:focus-visible { outline: 3px solid #0e7490; outline-offset: 3px; }\nbutton { padding: 10px 16px; border: 0; border-radius: 8px; background: #4338ca; color: white; font: inherit; }\n'
const seeds = [
  [
    'flex-cards',
    'Tarjetas con Flexbox',
    '<main class="tarjetas"><article><h2>Aprende</h2><p>Una idea en cada tarjeta.</p></article><article><h2>Practica</h2><p>Observa cómo se reparte el espacio.</p></article><article><h2>Comparte</h2><p>Prueba también un ancho pequeño.</p></article></main>',
    '.tarjetas { display: flex; flex-wrap: wrap; gap: 16px; } .tarjetas > article { flex: 1 1 180px; padding: 20px; border: 1px solid #a5b4fc; border-radius: 12px; background: #e0e7ff; }',
    '.tarjetas > article',
  ],
  [
    'grid-gallery',
    'Galería con Grid',
    '<main><h1>Galería de ideas</h1><section class="galeria"><article>Tipografía</article><article>Color</article><article>Espacio</article><article>Movimiento</article><article>Contenido</article><article>Accesibilidad</article></section></main>',
    '.galeria { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); gap: 16px; } .galeria > article { padding: 24px; border-radius: 12px; background: #e0e7ff; border: 1px solid #a5b4fc; }',
    '.galeria > article',
  ],
  [
    'responsive-menu',
    'Menú con listas adaptable',
    '<nav class="menu" aria-label="Navegación del ejemplo"><ul><li><a href="#inicio" aria-current="page">Inicio</a></li><li><a href="#curso">Curso</a></li><li><a href="#ayuda">Ayuda</a></li></ul></nav><main id="inicio"><h1>Un menú que se adapta</h1><p>Prueba los anchos de móvil y escritorio.</p><section id="curso"><h2>Curso CSS</h2></section><section id="ayuda"><h2>Ayuda</h2></section></main>',
    '.menu ul { display: flex; gap: 8px; flex-wrap: wrap; padding: 0; list-style: none; } .menu a { display: block; padding: 12px 20px; color: #3730a3; background: #e0e7ff; border-radius: 8px; text-decoration: none; } .menu a[aria-current] { background: #4338ca; color: white; } @media (max-width: 600px) { .menu ul { flex-direction: column; } }',
    '.menu a[aria-current]',
  ],
  [
    'grid-page',
    'Página con áreas de Grid',
    '<div class="pagina"><header>CSS Lab · Ejemplo</header><nav aria-label="Secciones">Temas · Ejercicios</nav><main><h1>Una página con áreas</h1><p>Cabecera, menú, contenido y pie se organizan con Grid.</p></main><footer>Aprender construyendo</footer></div>',
    '.pagina { display: grid; grid-template-areas: "cabecera cabecera" "menu contenido" "pie pie"; grid-template-columns: 160px 1fr; gap: 16px; } header { grid-area: cabecera; } nav { grid-area: menu; } main { grid-area: contenido; } footer { grid-area: pie; } .pagina > * { padding: 20px; background: #e0e7ff; border: 1px solid #a5b4fc; border-radius: 12px; } @media (max-width: 600px) { .pagina { grid-template-areas: "cabecera" "menu" "contenido" "pie"; grid-template-columns: minmax(0, 1fr); } }',
    '.pagina > main',
  ],
  [
    'form-validation',
    'Formulario con estados',
    '<form class="registro"><h1>Solicitar información</h1><label for="nombre">Nombre</label><input id="nombre" name="nombre" autocomplete="name" required><label for="correo">Correo</label><input id="correo" name="correo" type="email" autocomplete="email" required aria-describedby="correo-ayuda"><small id="correo-ayuda">Escribe un correo válido.</small><label><input type="checkbox" name="permiso"> Acepto recibir información</label><button type="button">Probar presentación</button></form>',
    '.registro { display: grid; gap: 10px; max-width: 420px; } input { padding: 12px; border: 2px solid #94a3b8; border-radius: 8px; font: inherit; } input:focus { border-color: #4338ca; } input[type="email"]:invalid:not(:placeholder-shown) { border-color: #b91c1c; } input[type="checkbox"] { accent-color: #4338ca; }',
    '.registro input:required',
  ],
  [
    'zebra-table',
    'Tabla accesible con franjas',
    '<div class="tabla-region" role="region" aria-label="Tabla de sesiones" tabindex="0"><table class="sesiones"><caption>Plan semanal de CSS</caption><thead><tr><th scope="col">Día</th><th scope="col">Tema</th><th scope="col">Duración</th></tr></thead><tbody><tr><th scope="row">Lunes</th><td>Flexbox</td><td>30 min</td></tr><tr><th scope="row">Martes</th><td>Grid</td><td>40 min</td></tr><tr><th scope="row">Miércoles</th><td>Responsive</td><td>30 min</td></tr></tbody></table></div>',
    '.tabla-region { overflow: auto; } .sesiones { width: 100%; border-collapse: collapse; } caption { text-align: left; font-weight: 700; margin-bottom: 12px; } th, td { padding: 12px; text-align: left; border: 1px solid #cbd5e1; } thead { background: #312e81; color: white; } tbody tr:nth-child(even) { background: #e0e7ff; }',
    '.sesiones tbody tr:nth-child(even)',
  ],
  [
    'theme-tokens',
    'Variables y temas locales',
    '<main class="temas"><article class="tarjeta"><h2>Tema índigo</h2><p>Un componente basado en variables CSS.</p><a href="#">Ver contenido</a></article><article class="tarjeta tema-bosque"><h2>Tema bosque</h2><p>El mismo componente redefine sus tokens.</p><a href="#">Ver contenido</a></article></main>',
    ':root { --acento: #4338ca; --fondo: #e0e7ff; --espacio: 20px; } .temas { display: flex; flex-wrap: wrap; gap: 16px; } .tarjeta { flex: 1 1 180px; padding: var(--espacio); background: var(--fondo); border: 2px solid var(--acento); border-radius: 12px; } .tarjeta a { color: var(--acento); } .tema-bosque { --acento: #166534; --fondo: #dcfce7; }',
    '.tema-bosque',
  ],
  [
    'motion-card',
    'Sombras y movimiento accesible',
    '<main><article class="efecto"><h1>Una tarjeta elevada</h1><p>Enfoca el enlace con Tab o pasa el puntero.</p><a href="#">Explorar el componente</a></article></main>',
    '.efecto { max-width: 360px; padding: 24px; border: 1px solid #a5b4fc; border-radius: 16px; background: #e0e7ff; box-shadow: 0 8px 24px rgb(15 23 42 / 15%); transition: transform 250ms ease, box-shadow 250ms ease; } .efecto:hover, .efecto:focus-within { transform: translateY(-6px); box-shadow: 0 16px 32px rgb(15 23 42 / 22%); } @media (prefers-reduced-motion: reduce) { .efecto { transition: none; } .efecto:hover, .efecto:focus-within { transform: none; } }',
    '.efecto',
  ],
  [
    'details-faq',
    'Preguntas con details y summary',
    '<main class="faq"><h1>Preguntas frecuentes</h1><details open><summary>¿Para qué sirve Grid?</summary><p>Para organizar filas y columnas.</p></details><details><summary>¿Cuándo usar Flexbox?</summary><p>Para repartir espacio en un eje principal.</p></details><details><summary>¿Cómo pruebo el responsive?</summary><p>Cambia los anchos de la vista previa.</p></details></main>',
    '.faq { max-width: 600px; } details { margin-block: 12px; padding: 16px; border: 1px solid #a5b4fc; border-radius: 10px; } details[open] { background: #e0e7ff; } summary { cursor: pointer; font-weight: 700; }',
    'details[open] > summary',
  ],
  [
    'bem-pricing',
    'Planes con metodología BEM',
    '<main class="planes"><article class="plan"><h2 class="plan__titulo">Inicio</h2><p class="plan__precio">Gratis</p><ul class="plan__ventajas"><li>Teoría</li><li>Ejemplos</li></ul><a class="plan__accion" href="#">Elegir Inicio</a></article><article class="plan plan--destacado"><h2 class="plan__titulo">Práctica</h2><p class="plan__precio">A tu ritmo</p><ul class="plan__ventajas"><li>Retos guiados</li><li>Laboratorio</li></ul><a class="plan__accion" href="#">Elegir Práctica</a></article></main>',
    '.planes { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; } .plan { padding: 24px; border: 1px solid #a5b4fc; border-radius: 12px; } .plan--destacado { background: #e0e7ff; border-width: 3px; } .plan__titulo { margin-top: 0; } .plan__precio { font-weight: 700; font-size: clamp(1.25rem, 3vw, 2rem); } .plan__accion { display: inline-block; padding: 10px; color: #3730a3; border: 1px solid currentColor; border-radius: 8px; }',
    '.plan--destacado',
  ],
]
export const extraLabTemplates: (LabDraft & { id: string; name: string })[] = seeds.map(
  ([id, name, html, css, selector]) => ({
    id: id!,
    name: name!,
    html: html!,
    css: base + css!,
    selector: selector!,
  }),
)
