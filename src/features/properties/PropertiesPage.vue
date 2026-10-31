<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { propertyExercises, propertyCategories } from '../../../packages/content/src/properties'
import { checkProperty, type PropertyCheck } from '@/domain/propertyExercise'
import { useLearningStore } from '@/shared/model/learningStore'
import { createPreviewDocument, evaluateSelector } from '@/features/lab/model/selectorEvaluator'
import { createDomTree, getDomNodeSelector } from '@/features/lab/model/domTree'
import { formatCode } from '@/features/lab/model/formatCode'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import DomTree from '@/features/lab/DomTree.vue'
import GameFrame from '@/features/game/GameFrame.vue'
import GameWorkbench from '@/features/game/GameWorkbench.vue'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
import '@/features/lab/lab.css'
import './properties.css'
const route = useRoute()
const store = useLearningStore()
const exercise = computed(() => propertyExercises.find((item) => item.id === route.params.id))
const search = ref('')
const category = ref('')
const status = ref('')
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
const filtered = computed(() =>
  propertyExercises.filter(
    (item) =>
      (!category.value || item.category === category.value) &&
      normalize(item.title + ' ' + item.description + ' ' + item.category).includes(
        normalize(search.value),
      ) &&
      (!status.value ||
        (status.value === 'done') === Boolean(store.data.properties[item.id]?.completedAt)),
  ),
)
const related = computed(() =>
  propertyExercises.filter((item) => item.category === exercise.value?.category),
)
const answer = ref('')
const html = ref('')
const base = ref('')
const sidebarOpen = ref(true)
const hint = ref(false)
const solution = ref(false)
const width = ref('768')
const fit = ref(true)
const animate = ref(true)
const restart = ref(0)
const feedback = ref('')
const checks = ref<PropertyCheck[] | null>(null)
const busy = ref(false)
const formatting = ref(false)
async function formatAnswer() {
  const snapshot = answer.value
  formatting.value = true
  try {
    const formatted = await formatCode(snapshot, 'css', { useTabs: true, tabWidth: 2 })
    if (answer.value === snapshot) answer.value = formatted
  } catch {
    feedback.value =
      'No se ha podido formatear. Revisa las llaves y los valores; tu código se conserva.'
  } finally {
    formatting.value = false
  }
}
const selected = ref<number | null>(null)
const hovered = ref<number | null>(null)
watch(
  exercise,
  async (item) => {
    answer.value = item ? (store.data.properties[item.id]?.css ?? item.starter) : ''
    checks.value = null
    feedback.value = ''
    selected.value = null
    hovered.value = null
    html.value = item?.html ?? ''
    base.value = item?.baseCss ?? ''
    if (item) {
      const [formattedHtml, formattedBase] = await Promise.all([
        formatCode(item.html, 'html', { useTabs: false, tabWidth: 2 }),
        formatCode(item.baseCss, 'css', { useTabs: false, tabWidth: 2 }),
      ])
      if (exercise.value === item) {
        html.value = formattedHtml
        base.value = formattedBase
      }
    }
  },
  { immediate: true },
)
watch(answer, (css) => {
  if (exercise.value) store.saveProperty(exercise.value.id, css)
  checks.value = null
  feedback.value = ''
})
const evaluation = computed(() =>
  evaluateSelector({
    html: exercise.value?.html ?? '',
    css: (exercise.value?.baseCss ?? '') + '\n' + answer.value,
    selector: '.muestra',
  }),
)
const nodes = computed(() => createDomTree(evaluation.value))
const inspected = computed(() => selected.value ?? hovered.value)
const inspectedSelector = computed(() => getDomNodeSelector(evaluation.value, inspected.value))
const preview = computed(() => {
  const pause = animate.value
    ? ''
    : '\n* { animation-play-state: paused !important; transition: none !important; }'
  return createPreviewDocument(
    evaluation.value,
    (exercise.value?.baseCss ?? '') + '\n' + answer.value + pause,
    {
      highlight: 'none',
      animations: animate.value,
      inspectedId: inspected.value,
      inspectedSelector: inspectedSelector.value,
    },
  )
})
const next = computed(
  () => propertyExercises[propertyExercises.findIndex((item) => item === exercise.value) + 1],
)
function select(key: number) {
  selected.value = selected.value === key ? null : key
  hovered.value = null
}
async function check() {
  const item = exercise.value
  if (!item || busy.value) return
  const snapshot = answer.value
  busy.value = true
  try {
    const result = await checkProperty(item, snapshot)
    if (item !== exercise.value || answer.value !== snapshot) return
    checks.value = result
    const correct = result.every((check) => check.correct)
    const xp = store.attemptProperty(item.id, correct)
    feedback.value = correct
      ? xp
        ? '¡Reto completado! +60 XP. Tu avance está guardado.'
        : '¡Correcto! Este reto ya estaba completado.'
      : 'Todavía falta algo. Revisa los requisitos pendientes; puedes consultar la pista y la teoría.'
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'No se ha podido comprobar.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <section class="learning-page game-guided-page properties-page">
    <template v-if="!route.params.id">
      <header class="properties-hero">
        <div>
          <p class="eyebrow">De la idea al estilo</p>
          <h1 id="page-title" tabindex="-1">Propiedades CSS</h1>
          <p>
            Escribe CSS real, observa el cambio y comprueba cada requisito. Del color a las
            animaciones, una pequeña conquista cada vez.
          </p>
        </div>
        <div class="properties-total">
          <strong
            >{{ store.propertiesCompleted }}<small>/ {{ propertyExercises.length }}</small></strong
          ><span>retos completados</span
          ><progress
            :value="store.propertiesCompleted"
            :max="propertyExercises.length"
            aria-label="Progreso de propiedades"
          ></progress>
        </div>
      </header>
      <form class="properties-filters" @submit.prevent>
        <label
          >Buscar propiedades<input
            v-model="search"
            type="search"
            placeholder="Sombras, márgenes, animaciones…"
        /></label>
        <label
          >Tema<select v-model="category">
            <option value="">Todos los temas</option>
            <option v-for="item in propertyCategories" :key="item">{{ item }}</option>
          </select></label
        >
        <label
          >Estado<select v-model="status">
            <option value="">Todos los estados</option>
            <option value="pending">Por completar</option>
            <option value="done">Completados</option>
          </select></label
        >
      </form>
      <p role="status">{{ filtered.length }} retos disponibles · 60 XP por primera conquista</p>
      <div class="properties-grid">
        <RouterLink
          v-for="(item, index) in filtered"
          :key="item.id"
          class="property-card"
          :to="'/propiedades/' + item.id"
        >
          <span class="property-category">{{ item.category }}</span>
          <span class="property-number" aria-hidden="true">{{
            store.data.properties[item.id]?.completedAt ? '✓' : String(index + 1).padStart(2, '0')
          }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
          <span class="property-cta"
            >{{ store.data.properties[item.id]?.completedAt ? 'Repasar' : 'Empezar reto' }} →</span
          >
        </RouterLink>
      </div>
      <p v-if="!filtered.length">No hay retos con estos filtros. Prueba otro tema o búsqueda.</p>
    </template>
    <template v-else-if="exercise">
      <RouterLink class="text-link" to="/propiedades">← Todas las propiedades</RouterLink>
      <h1 id="page-title" tabindex="-1">{{ exercise.title }}</h1>
      <div class="property-detail" :class="{ 'property-collapsed': !sidebarOpen }">
        <aside class="game-guide">
          <CollapsibleSidebar v-model="sidebarOpen" title="Tu misión">
            <section>
              <p class="eyebrow">{{ exercise.category }} · 60 XP</p>
              <h2>Objetivo</h2>
              <p>{{ exercise.description }}</p>
              <RouterLink class="text-link" :to="exercise.theory">Consultar teoría →</RouterLink>
            </section>
            <section class="property-validation">
              <h2>Requisitos</h2>
              <p>
                {{ checks?.filter((item) => item.correct).length ?? 0 }}/{{
                  exercise.checks.length + (exercise.keyframes ? 2 : 0)
                }}
                comprobados
              </p>
              <ul>
                <li
                  v-for="(item, index) in checks ??
                  exercise.checks.map((item) => ({
                    label: item.property,
                    correct: false,
                    actual: '',
                    expected: '',
                  }))"
                  :key="index"
                >
                  <span aria-hidden="true">{{ item.correct ? '✓' : '○' }}</span>
                  <code>{{ item.label }}</code
                  ><small v-if="checks && !item.correct"
                    >Esperado: {{ item.expected }}. Actual: {{ item.actual || 'sin valor' }}.</small
                  >
                </li>
              </ul>
              <button class="button button-primary" :disabled="busy" @click="check">
                {{ busy ? 'Comprobando…' : 'Comprobar' }}
              </button>
              <button class="button button-secondary" :aria-expanded="hint" @click="hint = !hint">
                Pista
              </button>
              <p v-if="hint">{{ exercise.hint }}</p>
              <p v-if="feedback" role="status">{{ feedback }}</p>
              <p v-if="store.data.properties[exercise.id]?.completedAt" class="property-earned">
                ✓ Conquistado
              </p>
              <RouterLink v-if="next" class="text-link" :to="'/propiedades/' + next.id"
                >Siguiente reto →</RouterLink
              >
            </section>
            <nav aria-label="Retos del tema">
              <RouterLink
                v-for="item in related"
                :key="item.id"
                :to="'/propiedades/' + item.id"
                :aria-current="exercise.id === item.id ? 'step' : undefined"
                :class="{ 'mission-done': store.data.properties[item.id]?.completedAt }"
                >{{ item.title }}</RouterLink
              >
            </nav>
          </CollapsibleSidebar>
        </aside>
        <GameWorkbench>
          <template #source
            ><section class="game-code-panel">
              <h2>HTML del ejemplo <small>Solo lectura</small></h2>
              <div class="game-html-editor">
                <CodeEditor
                  :model-value="html"
                  language="html"
                  label="HTML del ejemplo"
                  :max-length="12000"
                  read-only
                />
              </div></section
          ></template>
          <template #editor>
            <section class="game-code-panel">
              <h2>Tu CSS <small>Se guarda automáticamente</small></h2>
              <CodeEditor
                v-model="answer"
                language="css"
                label="Tu CSS"
                :max-length="12000"
                :use-tabs="true"
                :formatting="formatting"
                @format="formatAnswer"
              />
            </section>
            <details class="game-base-source">
              <summary>CSS de partida (solo lectura)</summary>
              <CodeEditor
                :model-value="base"
                language="css"
                label="CSS de partida"
                :max-length="12000"
                read-only
              />
            </details>
            <details
              class="game-base-source"
              @toggle="solution = ($event.target as HTMLDetailsElement).open"
            >
              <summary>Ver una solución explicada</summary>
              <template v-if="solution"
                ><p>
                  Compara los valores con el objetivo. Consultar la solución no marca el reto como
                  completado.
                </p>
                <CodeEditor
                  :model-value="exercise.solution"
                  language="css"
                  label="Solución de referencia"
                  :max-length="12000"
                  read-only
              /></template>
            </details>
          </template>
          <template #preview>
            <section class="property-preview learning-card">
              <h2>Vista previa</h2>
              <div class="game-size-buttons" aria-label="Ancho de la vista previa">
                <button
                  v-for="size in ['375', '768', '1200']"
                  :key="size"
                  :aria-pressed="width === size"
                  @click="width = size"
                >
                  {{ size }} px
                </button>
              </div>
              <div class="property-preview-tools">
                <label><input v-model="fit" type="checkbox" /> Ajustar al panel</label
                ><button :aria-pressed="!animate" @click="animate = !animate">
                  {{ animate ? 'Pausar movimiento' : 'Reanudar movimiento' }}</button
                ><button @click="restart++">Repetir</button>
              </div>
              <GameFrame
                :key="restart"
                :document="preview"
                :width="width"
                :fit="fit"
                title="Resultado de propiedades"
              />
              <p class="property-preview-note">
                Los botones responden al ratón y al teclado. Se respeta la preferencia de movimiento
                reducido.
              </p>
              <details open class="property-dom">
                <summary>Árbol DOM</summary>
                <p>
                  Selecciona un nodo para mantener su borde y selector. Vuelve a pulsarlo para
                  soltarlo.
                </p>
                <div class="property-dom-scroll">
                  <DomTree
                    :nodes="nodes"
                    :selected-key="selected"
                    @select="select"
                    @inspect="hovered = $event"
                  />
                </div>
                <code v-if="inspectedSelector">{{ inspectedSelector }}</code>
              </details>
            </section>
          </template>
        </GameWorkbench>
      </div>
    </template>
    <template v-else
      ><h1 id="page-title" tabindex="-1">Propiedad no encontrada</h1>
      <RouterLink to="/propiedades">Volver a los retos</RouterLink></template
    >
  </section>
</template>
