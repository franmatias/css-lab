<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMediaQuery, useDocumentVisibility } from '@vueuse/core'
import { useRouter } from 'vue-router'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import GameFrame from '@/features/game/GameFrame.vue'
import { createPreviewDocument, evaluateSelector } from '@/features/lab/model/selectorEvaluator'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
import { formatCode } from '@/features/lab/model/formatCode'
import {
  backgroundDataUrl,
  buildPlayground,
  initialPlaygroundValues,
  playgroundDefinitions,
  type PlaygroundKind,
  type PlaygroundValues,
} from './propertyPlaygrounds'

const props = defineProps<{ kinds: PlaygroundKind[]; lessonId: string }>()
const router = useRouter()
const selected = ref(props.kinds[0]!)
const saved = reactive<Partial<Record<PlaygroundKind, PlaygroundValues>>>({})
function defaults(kind: PlaygroundKind) {
  const result = initialPlaygroundValues(kind)
  if (props.lessonId === 'm35' && kind === 'functions') result.function = 'calc'
  if (props.lessonId === 'm45' && kind === 'gradient') result.type = 'radial'
  if (props.lessonId === 'm91' && kind === 'animation') result.timing = 'steps(4, end)'
  if (props.lessonId === 'm92' && kind === 'animation') {
    result.delay = -1
    result.iterations = '2'
  }
  return result
}
for (const kind of props.kinds) saved[kind] = defaults(kind)
const values = computed(() => saved[selected.value]!)
const definition = computed(() => playgroundDefinitions[selected.value])
const running = ref(false)
const finished = ref(false)
const motionKey = ref(0)
const active = ref(false)
const fit = ref(true)
const status = ref('Cambia una propiedad y compara el resultado con el CSS generado.')
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
const visibility = useDocumentVisibility()
const result = computed(() => buildPlayground(selected.value, values.value, running.value))
const sourceOpen = ref(false)
const formattedSource = ref({ html: '', css: '' })
let formatRequest = 0
watch(
  [() => result.value.html, () => result.value.baseCss],
  async ([html, css]) => {
    const request = ++formatRequest
    formattedSource.value = { html, css }
    try {
      const [formattedHtml, formattedCss] = await Promise.all([
        formatCode(html, 'html', { useTabs: true, tabWidth: 2 }),
        formatCode(css, 'css', { useTabs: true, tabWidth: 2 }),
      ])
      if (request === formatRequest)
        formattedSource.value = { html: formattedHtml, css: formattedCss }
    } catch {
      /* Preserve the scene source if formatting is unavailable. */
    }
  },
  { immediate: true },
)
const fields = computed(() =>
  definition.value.controls.filter(
    (control) =>
      !control.when || control.when.values.includes(String(result.value.values[control.when.key])),
  ),
)
const preview = computed(() => {
  const css = result.value.baseCss + '\n' + result.value.previewCss
  return createPreviewDocument(
    evaluateSelector({
      html:
        selected.value === 'transition' && active.value
          ? result.value.html.replace('class="muestra"', 'class="muestra is-active"')
          : result.value.html,
      css,
      selector: '*',
    }),
    css,
    { highlight: 'none', animations: false },
  )
})
function update(key: string, value: string | number) {
  values.value[key] = value
  running.value = false
  finished.value = false
  motionKey.value++
  status.value = 'Valores actualizados. Observa el resultado y su declaración CSS.'
}
function reset() {
  saved[selected.value] = defaults(selected.value)
  running.value = false
  finished.value = false
  active.value = false
  motionKey.value++
  status.value = 'Experimento restaurado a sus valores iniciales.'
}
watch(selected, () => {
  running.value = false
  finished.value = false
  active.value = false
  motionKey.value++
  status.value =
    'Experimento seleccionado. Tus ajustes de los otros experimentos se conservan mientras estés en esta lección.'
})
watch([reduced, visibility], () => {
  if (reduced.value || visibility.value === 'hidden') running.value = false
})
const nativeStyle = computed(() => {
  const v = result.value.values
  if (selected.value === 'animation')
    return {
      '--distancia': `${v.distance}px`,
      animation: `csslab-recorrido ${v.duration}s ${v.timing} ${v.delay}s ${v.iterations} ${v.direction} both`,
      animationPlayState: running.value ? 'running' : 'paused',
    }
  return {
    backgroundColor: String(active.value ? v.second : v.first),
    transform: `translateY(${active.value ? -Number(v.lift) : 0}px)`,
    transition: `background-color ${v.duration}s ${v.timing}, transform ${v.duration}s ${v.timing}`,
  }
})
function toggleAnimation() {
  if (reduced.value) return
  if (!running.value && finished.value) {
    motionKey.value++
    finished.value = false
  }
  running.value = !running.value
  status.value = running.value
    ? 'Experimento en reproducción. Puedes pausarlo.'
    : 'Experimento en pausa; conserva su posición actual.'
}
function animationEnded() {
  running.value = false
  finished.value = true
  status.value = 'Animación terminada. El último estado se conserva con both; puedes repetirla.'
}
async function copyCss() {
  try {
    await navigator.clipboard.writeText(result.value.css)
    status.value = 'CSS copiado.'
  } catch {
    status.value = 'No se ha podido copiar. Puedes seleccionar el código en el panel.'
  }
}
async function openLab() {
  const css = result.value.baseCss + '\n' + result.value.previewCss
  const hash = await encodeSharedLabDraft({
    html:
      selected.value === 'transition' && active.value
        ? result.value.html.replace('class="muestra"', 'class="muestra is-active"')
        : result.value.html,
    css,
    selector: '.muestra',
  })
  await router.push('/laboratorio' + hash)
}
</script>

<template>
  <section class="property-playground" aria-label="Experimentos de propiedades">
    <p class="eyebrow">Toca, observa y comprende</p>
    <h2>Un experimento para entenderlo</h2>
    <label v-if="kinds.length > 1" class="property-experiment-picker"
      >Experimento de esta lección<select v-model="selected">
        <option v-for="kind in kinds" :key="kind" :value="kind">
          {{ playgroundDefinitions[kind].title }}
        </option>
      </select></label
    >
    <h3>{{ definition.title }}</h3>
    <p>{{ definition.goal }}</p>
    <div class="property-playground-controls">
      <label v-for="field in fields" :key="selected + field.key">
        <span
          >{{ field.label
          }}<strong v-if="field.type !== 'select'">
            · {{ result.values[field.key] }}{{ field.unit }}</strong
          ></span
        >
        <select
          v-if="field.type === 'select'"
          :value="result.values[field.key]"
          @change="update(field.key, ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <input
          v-else
          :type="field.type"
          :value="result.values[field.key]"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          @input="
            update(
              field.key,
              field.type === 'range'
                ? Number(($event.target as HTMLInputElement).value)
                : ($event.target as HTMLInputElement).value,
            )
          "
        />
      </label>
    </div>
    <div class="property-playground-workbench">
      <section class="property-playground-preview">
        <h3>Observa el resultado</h3>
        <template v-if="selected === 'animation' || selected === 'transition'">
          <div
            class="property-native-stage"
            role="region"
            tabindex="0"
            :aria-label="
              selected === 'animation'
                ? 'Caja que recorre la distancia elegida con la duración y ritmo indicados'
                : 'Caja que cambia de color y elevación entre dos estados'
            "
          >
            <div class="property-native-canvas">
              <div
                :key="motionKey"
                class="property-native-sample"
                :class="{ 'is-animation': selected === 'animation' }"
                :style="nativeStyle"
                @animationend="animationEnded"
              />
            </div>
          </div>
          <button
            v-if="selected === 'animation'"
            class="button button-primary"
            type="button"
            :disabled="reduced"
            @click="toggleAnimation"
          >
            {{
              running
                ? 'Pausar experimento'
                : finished
                  ? 'Repetir experimento'
                  : 'Reproducir experimento'
            }}
          </button>
          <button
            v-else
            class="button button-primary"
            type="button"
            :aria-pressed="active"
            @click="active = !active"
          >
            {{ active ? 'Volver al estado inicial' : 'Activar estado final' }}
          </button>
          <p v-if="reduced">
            Movimiento reducido activo: la animación permanece estática y las transiciones cambian
            de estado al instante.
          </p>
        </template>
        <template v-else>
          <label class="check-option"
            ><input v-model="fit" type="checkbox" />Ajustar escena al panel</label
          >
          <p class="property-preview-caption">
            Viewport real: {{ result.width }} × 520 px.
            {{
              fit
                ? 'La escena se escala para caber.'
                : 'La escala es 1:1; puedes desplazarte dentro de la vista.'
            }}
          </p>
          <GameFrame
            :document="preview"
            :width="String(result.width)"
            :fit="fit"
            :title="`Experimento interactivo: ${definition.title}`"
          />
        </template>
      </section>
      <section class="property-playground-code">
        <h3>El CSS que estás construyendo</h3>
        <div class="property-generated-editor">
          <CodeEditor
            :model-value="result.css"
            language="css"
            :label="`CSS generado: ${definition.title}`"
            :max-length="12000"
            read-only
            :font-size="13"
          />
        </div>
        <p>
          Este código se genera con los controles. Usa el Laboratorio para editarlo libremente con
          su HTML y sus estilos de partida.
        </p>
        <div class="property-playground-actions">
          <button class="button button-secondary" type="button" @click="copyCss">
            Copiar CSS generado</button
          ><button class="button button-secondary" type="button" @click="reset">
            Restaurar experimento</button
          ><button class="button button-primary" type="button" @click="openLab">
            Experimentar libremente ↗
          </button>
        </div>
        <a
          v-if="selected === 'background'"
          class="text-link"
          :href="backgroundDataUrl"
          download="paisaje.svg"
          >Descargar paisaje.svg de ejemplo ↓</a
        >
        <p v-if="selected === 'background'">
          El CSS usa paisaje.svg: guarda esa imagen junto a tu HTML. Al abrir la escena en el
          Laboratorio, la imagen ya está incluida.
        </p>
      </section>
    </div>
    <p class="property-playground-observation">
      <strong>Qué está pasando:</strong> {{ result.observation }}
    </p>
    <details>
      <summary>La idea que conviene recordar</summary>
      <p>{{ definition.tip }}</p>
    </details>
    <details @toggle="sourceOpen = ($event.target as HTMLDetailsElement).open">
      <summary>HTML de la escena y estilos de partida</summary>
      <div v-if="sourceOpen" class="property-playground-workbench">
        <section>
          <h3>HTML de la escena</h3>
          <div class="property-generated-editor">
            <CodeEditor
              :model-value="formattedSource.html"
              language="html"
              label="HTML de la escena del experimento"
              :max-length="12000"
              read-only
            />
          </div>
        </section>
        <section>
          <h3>CSS de partida</h3>
          <div class="property-generated-editor">
            <CodeEditor
              :model-value="formattedSource.css"
              language="css"
              label="CSS de partida del experimento"
              :max-length="12000"
              read-only
            />
          </div>
        </section>
      </div>
    </details>
    <p class="property-playground-status" role="status">{{ status }}</p>
  </section>
</template>

<style>
.property-playground {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  margin-block: 1.5rem;
  padding: clamp(0.9rem, 2vw, 1.5rem);
  border: 1px solid var(--primary);
  border-radius: var(--radius-card);
  background: var(--surface-2);
}
.property-experiment-picker {
  display: grid;
  max-width: 32rem;
  gap: 0.5rem;
}
.property-experiment-picker select {
  width: 100%;
  min-width: 0;
}
.property-playground-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  gap: 1rem;
  margin-block: 1rem;
}
.property-playground-controls label {
  display: grid;
  gap: 0.4rem;
  align-content: start;
  min-width: 0;
  font-size: 0.85rem;
}
.property-playground-controls strong {
  font-weight: 600;
  color: var(--primary);
  overflow-wrap: anywhere;
}
.property-playground-controls input,
.property-playground-controls select {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
.property-playground-controls input[type='range'] {
  padding: 0;
  min-height: 32px;
  accent-color: var(--primary);
}
.property-playground-controls input[type='color'] {
  padding: 0.2rem;
  height: 40px;
  cursor: pointer;
}
.property-playground-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}
.property-playground-workbench > section {
  min-width: 0;
}
.property-generated-editor {
  height: 320px;
  border: 1px solid var(--border-strong);
  border-radius: 0.6rem;
  overflow: hidden;
}
.property-generated-editor .lab-editor-shell {
  height: 100%;
}
.property-generated-editor .lab-code-editor {
  height: 0;
  min-height: 0;
}
.property-playground-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 0.75rem;
}
.property-playground-actions .button {
  font-size: 0.8rem;
}
.property-playground-observation {
  padding: 1rem;
  border-inline-start: 4px solid var(--primary);
  border-radius: 0.5rem;
  background: var(--surface);
  overflow-wrap: anywhere;
}
.property-playground pre {
  max-width: 100%;
  overflow: auto;
  font-size: 0.8rem;
}
.property-playground-status {
  color: var(--text-muted);
  font-size: 0.85rem;
}
.property-native-stage {
  overflow: auto;
  border: 1px solid var(--border-strong);
  border-radius: 0.6rem;
  background: var(--surface);
  margin-bottom: 1rem;
}
.property-native-canvas {
  min-width: 280px;
  height: 220px;
  padding: 72px 16px 16px;
}
.property-native-sample {
  width: 96px;
  height: 72px;
  border-radius: 12px;
  background: var(--primary);
  box-shadow: inset 0 0 0 2px var(--border-strong);
}
.property-native-sample.is-animation {
  width: 56px;
  height: 56px;
  border: 2px solid #c7d2fe;
  background: #4338ca;
  box-shadow: none;
}
@keyframes csslab-recorrido {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--distancia));
  }
}
@media (max-width: 1100px) {
  .property-playground-workbench {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (prefers-reduced-motion: reduce) {
  .property-native-sample {
    animation: none !important;
    transition: none !important;
  }
}
</style>

<style>
.property-generated-editor .cm-editor {
  min-height: 0 !important;
}
</style>
