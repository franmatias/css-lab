<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMediaQuery, useDocumentVisibility } from '@vueuse/core'
import GameFrame from '@/features/game/GameFrame.vue'
import { createPreviewDocument, evaluateSelector } from '@/features/lab/model/selectorEvaluator'
import type { TheoryVisual } from './theoryVisuals'

defineProps<{ visual: TheoryVisual }>()
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
const visibility = useDocumentVisibility()
const asset = (name: string) => `${import.meta.env.BASE_URL}illustrations/theory/${name}.svg`
const padding = ref(20)
const border = ref(4)
const sizing = ref('content-box')
const outerWidth = computed(() =>
  sizing.value === 'border-box' ? 200 : 200 + 2 * padding.value + 2 * border.value,
)
const contentWidth = computed(() =>
  sizing.value === 'border-box' ? 200 - 2 * padding.value - 2 * border.value : 200,
)

const width = ref(1024)
const columns = computed(() => (width.value < 600 ? 1 : width.value < 900 ? 2 : 3))
const running = ref(false)
const message = ref('El recorrido no comienza hasta que pulses Reproducir.')
let frame = 0
let elapsed = 0
let last = 0
function pauseResponsive() {
  running.value = false
  cancelAnimationFrame(frame)
  last = 0
}
function animate(time: number) {
  if (!running.value) return
  elapsed = Math.min(12_000, elapsed + (last ? time - last : 0))
  last = time
  const progress = elapsed / 6000
  width.value = Math.round(1024 - 704 * (progress <= 1 ? progress : 2 - progress))
  if (elapsed >= 12_000) {
    pauseResponsive()
    message.value = 'Recorrido terminado: de escritorio a móvil y de vuelta. Puedes repetirlo.'
  } else frame = requestAnimationFrame(animate)
}
function toggleResponsive() {
  if (running.value) {
    pauseResponsive()
    message.value = 'Recorrido en pausa. Puedes examinar la distribución actual.'
  } else if (!reduced.value) {
    if (elapsed === 0 || elapsed >= 12_000) {
      elapsed = 0
      width.value = 1024
    }
    running.value = true
    message.value = 'Recorrido en marcha. Puedes pausarlo en cualquier momento.'
    frame = requestAnimationFrame(animate)
  }
}
function setWidth(value: number) {
  pauseResponsive()
  elapsed = 0
  width.value = value
  message.value = `Vista fijada a ${value} px. Observa cuántas columnas hay.`
}
const demoHtml =
  '<header class="demo-header"><strong>Revista CSS</strong><nav aria-label="Secciones">Ideas · Guías · Proyectos</nav></header><main><h1>El contenido se adapta</h1><p>El orden se conserva: 1, 2 y 3.</p><section class="demo-cards" aria-label="Artículos"><article><span>01</span><h2>Aprende</h2><p>Un contenido claro.</p></article><article><span>02</span><h2>Experimenta</h2><p>Prueba diferentes anchos.</p></article><article><span>03</span><h2>Comparte</h2><p>La misma información.</p></article></section></main>'
const demoCss =
  'body { margin: 0; padding: 20px; color: #172554; background: #f8fafc; font: 16px/1.5 system-ui; } .demo-header { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; padding-bottom: 16px; border-bottom: 2px solid #cbd5e1; } h1 { font-size: clamp(24px, 3vw, 36px); line-height: 1.2; } .demo-cards { display: grid; grid-template-columns: 1fr; gap: 16px; } article { min-width: 0; padding: 16px; border: 2px solid #a5b4fc; border-radius: 12px; background: white; } article span { color: #4338ca; font-weight: 800; } article h2 { font-size: 20px; margin: 4px 0; } article p { margin: 0; } @media (min-width: 600px) { .demo-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } } @media (min-width: 900px) { .demo-cards { grid-template-columns: repeat(3, minmax(0, 1fr)); } }'
const preview = createPreviewDocument(
  evaluateSelector({ html: demoHtml, css: demoCss, selector: '*' }),
  demoCss,
  { highlight: 'none', animations: false },
)
const curve = ref('linear')
const motion = ref<'idle' | 'running' | 'paused' | 'finished'>('idle')
const motionRun = ref(0)
function toggleMotion() {
  if (reduced.value) return
  if (motion.value === 'running') motion.value = 'paused'
  else {
    if (motion.value === 'idle' || motion.value === 'finished') motionRun.value++
    motion.value = 'running'
  }
}
watch(curve, () => {
  motion.value = 'idle'
  motionRun.value++
})
watch([reduced, visibility], () => {
  if (reduced.value || visibility.value === 'hidden') {
    pauseResponsive()
    if (motion.value === 'running') motion.value = 'paused'
  }
})
onBeforeUnmount(pauseResponsive)
</script>

<template>
  <section class="theory-visual" :aria-label="visual.title">
    <p class="eyebrow">Compréndelo de un vistazo</p>
    <h2>{{ visual.title }}</h2>
    <p>{{ visual.description }}</p>
    <figure class="theory-figure">
      <img
        :src="asset(visual.diagram)"
        :alt="visual.description"
        width="640"
        height="360"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        {{ visual.title }}. Esquema didáctico; las proporciones no representan una escala universal.
      </figcaption>
    </figure>
    <a class="text-link" :href="asset(visual.diagram)" target="_blank" rel="noopener"
      >Abrir ilustración a tamaño completo ↗</a
    >
    <ul class="lesson-ideas">
      <li v-for="point in visual.points" :key="point">{{ point }}</li>
    </ul>

    <div v-if="visual.interactive === 'box'" class="theory-visual-lab">
      <h3>Comprueba las medidas de otra caja</h3>
      <p>
        Esta caja tiene <code>width: 200px</code>, sin margen. Cambia el relleno, el borde y cómo se
        mide su ancho.
      </p>
      <div class="theory-visual-controls">
        <label
          >Padding: {{ padding }} px<input
            v-model.number="padding"
            type="range"
            min="0"
            max="32"
            step="1"
        /></label>
        <label
          >Borde: {{ border }} px<input
            v-model.number="border"
            type="range"
            min="0"
            max="12"
            step="1"
        /></label>
        <label
          >Modelo de medida<select v-model="sizing">
            <option value="content-box">content-box</option>
            <option value="border-box">border-box</option>
          </select></label
        >
      </div>
      <div
        class="theory-box-stage"
        role="region"
        tabindex="0"
        aria-label="Caja de prueba, zona desplazable"
      >
        <div
          class="theory-box-example"
          :style="{
            width: '200px',
            boxSizing: sizing as 'content-box' | 'border-box',
            padding: `${padding}px`,
            borderWidth: `${border}px`,
          }"
        >
          <span>Contenido<br />{{ contentWidth }} px</span>
        </div>
      </div>
      <p class="theory-visual-result" role="status">
        Ancho exterior sin margen: <strong>{{ outerWidth }} px</strong>. Contenido:
        {{ contentWidth }} px + relleno: {{ 2 * padding }} px + bordes: {{ 2 * border }} px.
      </p>
      <p v-if="sizing === 'border-box'">
        El contenido se reduce para conservar los 200 px exteriores; no desaparecen ni el relleno ni
        el borde.
      </p>
    </div>

    <div v-if="visual.interactive === 'responsive'" class="theory-visual-lab">
      <h3>Del escritorio al móvil, sin cambiar el HTML</h3>
      <p>
        Arrastra el ancho o reproduce un recorrido de 12 segundos. Las tarjetas cambian de
        distribución al cruzar 600 y 900 px.
      </p>
      <figure class="theory-figure theory-responsive-summary">
        <img
          :src="asset('responsive')"
          alt="El mismo contenido se apila en móvil y forma varias columnas en pantallas más anchas."
          width="640"
          height="360"
          loading="lazy"
        />
      </figure>
      <div class="theory-visual-controls">
        <label
          >Ancho de la demostración: {{ width }} px<input
            :value="width"
            type="range"
            min="320"
            max="1024"
            step="1"
            @input="setWidth(Number(($event.target as HTMLInputElement).value))"
        /></label>
        <div class="theory-width-buttons" role="group" aria-label="Anchos de la demostración">
          <button
            v-for="size in [375, 768, 1024]"
            :key="size"
            type="button"
            class="button button-secondary"
            :aria-pressed="width === size"
            @click="setWidth(size)"
          >
            {{ size }} px
          </button>
        </div>
        <button
          class="button button-primary"
          type="button"
          :disabled="reduced"
          @click="toggleResponsive"
        >
          {{ running ? 'Pausar recorrido' : 'Reproducir recorrido' }}
        </button>
      </div>
      <p class="theory-visual-result">
        Viewport: <strong>{{ width }} px</strong> · {{ columns }}
        {{ columns === 1 ? 'columna' : 'columnas' }}. La vista se escala para caber; su ancho real
        es el indicado.
      </p>
      <p role="status">
        {{
          reduced
            ? 'Movimiento reducido activo: usa el deslizador o los botones para comparar vistas estáticas.'
            : message
        }}
      </p>
      <GameFrame
        :document="preview"
        :width="String(width)"
        :fit="true"
        title="Demostración animada de diseño responsive"
      />
      <details>
        <summary>CSS que produce los cambios</summary>
        <pre><code>.demo-cards { display: grid; grid-template-columns: 1fr; }
@media (min-width: 600px) {
  .demo-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 900px) {
  .demo-cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}</code></pre>
      </details>
    </div>

    <div v-if="visual.interactive === 'motion'" class="theory-visual-lab">
      <h3>Compara el ritmo del recorrido</h3>
      <div class="theory-visual-controls">
        <label
          >Curva de ritmo<select v-model="curve">
            <option value="linear">linear · velocidad constante</option>
            <option value="ease-in-out">ease-in-out · arranque y frenado</option>
            <option value="steps(4, end)">steps(4, end) · cuatro saltos</option>
          </select></label
        >
        <button
          class="button button-primary"
          :disabled="reduced"
          type="button"
          @click="toggleMotion"
        >
          {{
            motion === 'running'
              ? 'Pausar animación'
              : motion === 'paused'
                ? 'Continuar animación'
                : motion === 'finished'
                  ? 'Repetir animación'
                  : 'Reproducir animación'
          }}
        </button>
      </div>
      <div class="theory-motion-labels" aria-hidden="true">
        <span>0 %</span><span>50 %</span><span>100 %</span>
      </div>
      <div class="theory-motion-track" aria-hidden="true">
        <div
          :key="motionRun"
          class="theory-motion-rider"
          :class="{ 'has-started': motion !== 'idle' }"
          :style="{
            animationTimingFunction: curve,
            animationPlayState: motion === 'running' ? 'running' : 'paused',
          }"
          @animationend="motion = 'finished'"
        >
          <span />
        </div>
      </div>
      <p role="status">
        {{
          reduced
            ? 'Movimiento reducido activo: el esquema muestra los estados sin reproducir movimiento.'
            : motion === 'finished'
              ? 'Recorrido terminado. El último estado se conserva con animation-fill-mode: both.'
              : motion === 'running'
                ? 'Animación en marcha: duración de cuatro segundos y una sola repetición.'
                : motion === 'paused'
                  ? 'Animación en pausa.'
                  : 'Pulsa Reproducir para observar el cambio; no hay reproducción automática.'
        }}
      </p>
      <p>
        <code>animation: recorrido 4s {{ curve }} 1 both;</code> La misma distancia y duración
        pueden recorrerse con ritmos diferentes.
      </p>
    </div>
  </section>
</template>

<style>
.theory-visual {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin-block: 1.5rem;
  padding: clamp(0.9rem, 2vw, 1.5rem);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  background: var(--surface-2);
}
.theory-figure {
  margin: 1rem 0 0.25rem;
}
.theory-figure img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  border: 1px solid var(--border-strong);
}
.theory-figure figcaption {
  margin-top: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}
.theory-visual-lab {
  min-width: 0;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-strong);
}
.theory-visual-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
  margin-block: 1rem;
}
.theory-visual-controls > label {
  flex: 1 1 200px;
  display: grid;
  gap: 0.5rem;
  min-width: 0;
}
.theory-visual-controls input[type='range'] {
  width: 100%;
  min-height: 32px;
  accent-color: var(--primary);
  padding: 0;
}
.theory-visual-controls select {
  width: 100%;
  min-width: 0;
}
.theory-width-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.theory-visual-result {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: var(--surface);
  border-inline-start: 4px solid var(--primary);
  overflow-wrap: anywhere;
}
.theory-box-stage {
  overflow: auto;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px dashed var(--border-strong);
  background: var(--surface);
}
.theory-box-example {
  border-style: solid;
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 15%, var(--surface));
}
.theory-box-example span {
  display: block;
  min-height: 72px;
  padding: 0.5rem;
  background: var(--surface);
  text-align: center;
  overflow-wrap: anywhere;
}
.theory-responsive-summary {
  max-width: 520px;
}
.theory-visual-lab pre {
  overflow: auto;
  white-space: pre;
  font-size: 0.85rem;
}
.theory-motion-labels {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  margin-top: 1rem;
}
.theory-motion-track {
  height: 64px;
  position: relative;
  overflow: hidden;
  margin-block: 0.5rem 1rem;
  padding-block: 16px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 0.5rem;
}
.theory-motion-rider {
  width: calc(100% - 32px);
  height: 32px;
}
.theory-motion-rider span {
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
}
.theory-motion-rider.has-started {
  animation: theory-travel 4s linear 1 both;
}
@keyframes theory-travel {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .theory-motion-rider.has-started {
    animation: none;
  }
}
</style>
