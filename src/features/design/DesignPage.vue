<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue'
import { useDebounceFn, useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowRight,
  Check,
  Flag,
  Code2,
  Eye,
  Trophy,
  Table2,
  ListOrdered,
  PanelsTopLeft,
  Columns3,
  Grid2X2,
  Smartphone,
  Braces,
  Palette,
  Scaling,
  Calculator,
  Rocket,
  TextCursorInput,
} from '@lucide/vue'
import { workshops, type Workshop } from '../../../packages/content/src/design'
import { checkWorkshop } from '@/domain/designWorkshop'
import { workshopSteps, completedWorkshopSteps } from '@/domain/workshopJourney'
import { useLearningStore } from '@/shared/model/learningStore'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import DomTree from '@/features/lab/DomTree.vue'
import GameFrame from '@/features/game/GameFrame.vue'
import { createDomTree } from '@/features/lab/model/domTree'
import { evaluateSelector, createPreviewDocument } from '@/features/lab/model/selectorEvaluator'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
import { formatCode } from '@/features/lab/model/formatCode'
import '@/features/lab/lab.css'
import './design.css'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const learning = useLearningStore()
const openGuide = inject<() => void>('openQuickGuide')
const current = computed(() => workshops.find((item) => item.id === route.params.id))
const category = ref('')
const query = ref('')
const status = ref('')
const categories = [...new Set(workshops.map((item) => item.category))]
const icons = [
  Table2,
  TextCursorInput,
  ListOrdered,
  Columns3,
  Grid2X2,
  Smartphone,
  Braces,
  PanelsTopLeft,
  Palette,
  Scaling,
  Calculator,
  Rocket,
]
function progress(item: Workshop) {
  return completedWorkshopSteps(item, learning.data.workshops[item.id]).length
}
const totalSteps = computed(() =>
  workshops.reduce((sum, item) => sum + workshopSteps(item).length, 0),
)
const doneSteps = computed(() => workshops.reduce((sum, item) => sum + progress(item), 0))
const items = computed(() =>
  workshops.filter(
    (item) =>
      (!category.value || item.category === category.value) &&
      `${item.title} ${item.summary}`.toLowerCase().includes(query.value.toLowerCase()) &&
      (!status.value ||
        (status.value === 'done'
          ? !!learning.data.workshops[item.id]?.completedAt
          : status.value === 'started'
            ? progress(item) > 0 && !learning.data.workshops[item.id]?.completedAt
            : !progress(item))),
  ),
)
const activeIndex = ref(0)
const steps = computed(() => (current.value ? workshopSteps(current.value) : []))
const active = computed(() => steps.value[activeIndex.value])
const completed = computed(() =>
  current.value
    ? completedWorkshopSteps(current.value, learning.data.workshops[current.value.id])
    : [],
)
const width = ref('375')
const autoWidth = ref(false)
const previewHost = ref<HTMLElement | null>(null)
const { width: panelWidth } = useElementSize(previewHost)
const frameWidth = computed(() =>
  autoWidth.value ? String(Math.max(280, Math.round(panelWidth.value))) : width.value,
)
const visitedWidths = ref<string[]>([])
const fit = ref(true)
const highlight = ref(false)
const css = ref('')
const answer = ref('')
const renderedCss = ref('')
const message = ref('')
const stepMessage = ref('')
const verdict = ref<ReturnType<typeof checkWorkshop> | null>(null)
const resetPending = ref(false)
const solutionPending = ref(false)
const selectedNode = ref<number | null>(null)
const hoveredNode = ref<number | null>(null)
const mapOpen = ref(true)
const treeOpen = ref(true)
const htmlOpen = ref(true)
const html = computed(() => current.value?.html ?? '')
// Retain full saved drafts while keeping the exercise editor focused on the student's rules.
const editableCss = computed({
  get: () =>
    current.value && css.value.startsWith(current.value.baseCss)
      ? css.value.slice(current.value.baseCss.length).replace(/^\n\n/, '')
      : css.value,
  set: (value: string) => {
    css.value = `${current.value?.baseCss ?? ''}\n\n${value}`
  },
})
watch(
  current,
  (item) => {
    const saved = item && learning.data.workshops[item.id]
    css.value = saved?.css ?? (item ? `${item.baseCss}\n\n${item.starter}` : '')
    renderedCss.value = css.value
    answer.value = saved?.answer ?? ''
    activeIndex.value = item
      ? Math.max(
          0,
          workshopSteps(item).findIndex(
            (step) => !completedWorkshopSteps(item, saved).includes(step.id),
          ),
        )
      : 0
    message.value = ''
    stepMessage.value = ''
    verdict.value = null
    resetPending.value = false
    solutionPending.value = false
    selectedNode.value = null
    hoveredNode.value = null
    visitedWidths.value = autoWidth.value ? [] : [width.value]
  },
  { immediate: true },
)
const renderLater = useDebounceFn(() => {
  renderedCss.value = css.value
}, 180)
watch(
  [css, answer],
  () => {
    if (current.value) learning.saveWorkshop(current.value.id, css.value, answer.value)
    verdict.value = null
    message.value = ''
    stepMessage.value = ''
    void renderLater()
  },
  { flush: 'sync' },
)
watch(activeIndex, () => {
  stepMessage.value = ''
})
function selectWidth(value: string) {
  autoWidth.value = value === 'auto'
  if (value !== 'auto') {
    width.value = value
    if (!visitedWidths.value.includes(value)) visitedWidths.value.push(value)
  }
}
const evaluation = computed(() =>
  evaluateSelector({ html: html.value, css: renderedCss.value, selector: '*' }),
)
const domTree = computed(() => createDomTree({ ...evaluation.value, matchedElementIds: [] }))
const preview = computed(() =>
  createPreviewDocument({ ...evaluation.value, matchedElementIds: [] }, renderedCss.value, {
    highlight: 'none',
    inspectedId: selectedNode.value ?? hoveredNode.value,
    grid: highlight.value,
  }),
)
const selectedLabel = computed(() => {
  if (selectedNode.value === null) return ''
  const doc = new DOMParser().parseFromString(evaluation.value.sanitizedHtml, 'text/html')
  const element = doc.querySelectorAll('*')[selectedNode.value]
  return element
    ? `${element.localName}${element.id ? '#' + element.id : ''}${Array.from(element.classList)
        .map((name) => '.' + name)
        .join('')}`
    : ''
})
function record(ids: string[]) {
  if (!current.value) return
  learning.saveWorkshop(current.value.id, css.value, answer.value)
  learning.saveWorkshopSteps(current.value.id, [...completed.value, ...ids])
}
function completeStep() {
  const item = current.value
  const step = active.value
  if (!item || !step) return
  if (step.kind === 'quiz') {
    check()
    return
  }
  if (step.kind === 'rule') {
    const result = checkWorkshop(item, css.value, answer.value)
    if (!result.declarations[step.ruleIndex]) {
      stepMessage.value =
        'Todavía falta la declaración de este paso. Revisa el selector, el valor y la media query indicados.'
      return
    }
  }
  if (
    step.kind === 'responsive' &&
    !['375', '1200'].every((value) => visitedWidths.value.includes(value))
  ) {
    stepMessage.value = 'Prueba primero los botones 375 y 1200 de la vista previa.'
    return
  }
  record([step.id])
  stepMessage.value = '✓ Paso realizado. Puedes continuar o seguir experimentando.'
}
function check() {
  const item = current.value
  if (!item) return
  renderedCss.value = css.value
  verdict.value = checkWorkshop(item, css.value, answer.value)
  const passed = item.checks.flatMap((_, index) =>
    verdict.value?.declarations[index] ? [`rule-${index}`] : [],
  )
  record([...passed, ...(verdict.value.quiz ? ['quiz'] : [])])
  if (
    verdict.value.quiz &&
    verdict.value.declarations.every(Boolean) &&
    completed.value.length === steps.value.length
  ) {
    const points = learning.completeWorkshop(item.id)
    message.value = t(points ? 'design.won' : 'design.repeated', { points })
  } else
    message.value =
      'Aún queda algo por revisar. Completa los pasos del mapa, las declaraciones y la pregunta final.'
}
async function format() {
  const item = current.value
  const original = css.value
  try {
    const formatted = await formatCode(editableCss.value, 'css', { useTabs: false, tabWidth: 2 })
    if (current.value === item && css.value === original) editableCss.value = formatted
  } catch {
    message.value = t('design.formatError')
  }
}
async function solution() {
  const item = current.value
  const original = css.value
  if (!item) return
  const formatted = await formatCode(item.solution, 'css', {
    useTabs: false,
    tabWidth: 2,
  })
  if (current.value === item && css.value === original) editableCss.value = formatted
  solutionPending.value = false
}
function restart() {
  if (!current.value) return
  css.value = `${current.value.baseCss}\n\n${current.value.starter}`
  answer.value = ''
  resetPending.value = false
}
async function openLab() {
  if (current.value)
    await router.push(
      `/laboratorio${await encodeSharedLabDraft({ html: html.value, css: css.value, selector: current.value.checks[0]!.selector })}`,
    )
}
const next = computed(
  () => workshops[workshops.findIndex((item) => item.id === current.value?.id) + 1],
)
const resume = computed(() =>
  workshops.find((item) => progress(item) > 0 && !learning.data.workshops[item.id]?.completedAt),
)
</script>

<template>
  <section class="learning-page design-page" :class="{ 'workshop-detail': current }">
    <template v-if="current">
      <header class="workshop-header">
        <div>
          <RouterLink class="text-link" to="/talleres">← Todos los talleres</RouterLink>
          <p class="eyebrow">{{ current.category }} · {{ current.minutes }} min · 100 XP</p>
          <h1 id="page-title" tabindex="-1">{{ current.title }}</h1>
        </div>
        <div class="workshop-total">
          <strong>{{ completed.length }}/{{ steps.length }}</strong
          ><span>pasos realizados</span
          ><progress
            :value="completed.length"
            :max="steps.length"
            aria-label="Progreso del taller"
          />
        </div>
      </header>
      <div class="workshop-guide-access">
        <button class="text-link" @click="openGuide?.()">Consultar guía rápida de CSS ↗</button>
      </div>
      <div class="workshop-layout">
        <aside class="workshop-guide">
          <section class="learning-card workshop-objective">
            <p class="eyebrow"><Flag :size="16" aria-hidden="true" /> TU OBJETIVO</p>
            <h2>Esto vas a construir</h2>
            <p>{{ current.summary }}</p>
            <p class="workshop-task">{{ current.task }}</p>
            <details>
              <summary>Conceptos y consejos</summary>
              <ul>
                <li v-for="concept in current.concepts" :key="concept">{{ concept }}</li>
              </ul>
              <h3>Error frecuente</h3>
              <p>{{ current.pitfall }}</p>
              <a class="text-link" :href="current.source" target="_blank" rel="noopener noreferrer"
                >Consultar en MDN ↗</a
              >
            </details>
          </section>
          <section class="learning-card workshop-roadmap">
            <h2>
              <button
                class="workshop-toggle"
                :aria-expanded="mapOpen"
                aria-controls="workshop-step-map"
                @click="mapOpen = !mapOpen"
              >
                Tu recorrido <span aria-hidden="true">{{ mapOpen ? '−' : '+' }}</span>
              </button>
            </h2>
            <nav v-show="mapOpen" id="workshop-step-map" aria-label="Pasos del taller">
              <ol>
                <li
                  v-for="(step, index) in steps"
                  :key="step.id"
                  :class="{ done: completed.includes(step.id), active: activeIndex === index }"
                >
                  <button
                    :aria-current="activeIndex === index ? 'step' : undefined"
                    @click="activeIndex = index"
                  >
                    <span class="step-circle"
                      ><Check
                        v-if="completed.includes(step.id)"
                        :size="18"
                        aria-hidden="true"
                      /><template v-else>{{ index + 1 }}</template></span
                    ><span
                      ><strong>{{ step.title }}</strong
                      ><small>{{
                        completed.includes(step.id)
                          ? 'Realizado'
                          : activeIndex === index
                            ? 'Estás aquí'
                            : 'Por hacer'
                      }}</small></span
                    >
                  </button>
                </li>
              </ol>
            </nav>
          </section>
          <details class="learning-card workshop-other">
            <summary>Otros talleres</summary>
            <nav aria-label="Recorrido de diseño">
              <RouterLink
                v-for="item in workshops"
                :key="item.id"
                :to="`/talleres/${item.id}`"
                :aria-current="item.id === current.id ? 'page' : undefined"
                >{{ learning.data.workshops[item.id]?.completedAt ? '✓ ' : ''
                }}{{ item.title }}</RouterLink
              >
            </nav>
          </details>
        </aside>
        <div class="workshop-main">
          <section
            v-if="active"
            class="learning-card workshop-active"
            aria-labelledby="active-step-title"
          >
            <div class="workshop-active-heading">
              <span class="workshop-step-number">{{ activeIndex + 1 }}</span>
              <div>
                <p class="eyebrow">
                  PASO {{ activeIndex + 1 }} DE {{ steps.length
                  }}{{ completed.includes(active.id) ? ' · REALIZADO' : '' }}
                </p>
                <h2 id="active-step-title">{{ active.title }}</h2>
              </div>
            </div>
            <p>{{ active.description }}</p>
            <details v-if="active.kind === 'brief' || active.kind === 'responsive'">
              <summary>Qué debes observar</summary>
              <ul class="workshop-observations">
                <li v-for="step in current.steps" :key="step">{{ step }}</li>
              </ul>
            </details>
            <p v-if="active.kind === 'rule'" class="workshop-rule">
              <code
                >{{ current.checks[active.ruleIndex]?.selector }} {
                {{ current.checks[active.ruleIndex]?.property }}:
                {{ current.checks[active.ruleIndex]?.value }}; }</code
              ><span v-if="current.checks[active.ruleIndex]?.media"
                >Dentro de @media {{ current.checks[active.ruleIndex]?.media }}</span
              >
            </p>
            <div class="card-actions">
              <button
                v-if="active.kind !== 'quiz'"
                class="button button-primary"
                @click="completeStep"
              >
                {{
                  active.kind === 'rule'
                    ? 'Comprobar este paso'
                    : active.kind === 'brief'
                      ? 'He leído el objetivo'
                      : 'He revisado ambas vistas'
                }}</button
              ><a v-else class="button button-primary" href="#workshop-quiz"
                >Ir a la pregunta final ↓</a
              ><button
                class="button button-secondary"
                :disabled="activeIndex === 0"
                @click="activeIndex--"
              >
                Anterior</button
              ><button
                class="button button-secondary"
                :disabled="activeIndex === steps.length - 1"
                @click="activeIndex++"
              >
                Siguiente <ArrowRight :size="16" aria-hidden="true" />
              </button>
            </div>
            <p class="workshop-step-status" role="status">{{ stepMessage }}</p>
          </section>
          <div class="design-workbench">
            <div class="workshop-code-stack">
              <section class="workshop-code-panel">
                <h2>
                  <button
                    class="workshop-toggle"
                    :aria-expanded="htmlOpen"
                    aria-controls="workshop-html"
                    @click="htmlOpen = !htmlOpen"
                  >
                    <span><Code2 :size="17" aria-hidden="true" /> Código HTML</span
                    ><small>Solo lectura {{ htmlOpen ? '−' : '+' }}</small>
                  </button>
                </h2>
                <div
                  v-show="htmlOpen"
                  id="workshop-html"
                  class="design-editor workshop-html-editor"
                >
                  <CodeEditor
                    :key="current.id"
                    :model-value="html"
                    language="html"
                    label="HTML del taller"
                    :max-length="12000"
                    read-only
                  />
                </div>
              </section>
              <section class="workshop-code-panel">
                <div class="workshop-panel-heading">
                  <h2><Code2 :size="17" aria-hidden="true" /> Tu CSS</h2>
                  <button class="text-link" @click="format">Formatear CSS</button>
                </div>
                <div class="design-editor">
                  <CodeEditor
                    v-model="editableCss"
                    language="css"
                    label="CSS del taller"
                    :max-length="12000 - current.baseCss.length - 2"
                    @format="format"
                  />
                </div>
                <p class="workshop-save-note">
                  Guardado en este navegador · Tab para indentar · Esc para salir del editor
                </p>
              </section>
              <details class="workshop-code-panel workshop-base-code">
                <summary>CSS de partida · Solo lectura</summary>
                <p class="workshop-save-note">
                  Estos estilos ya están aplicados. En el Laboratorio puedes modificar todo el
                  código.
                </p>
                <div class="design-editor workshop-html-editor">
                  <CodeEditor
                    :key="current.id"
                    :model-value="current.baseCss"
                    language="css"
                    label="CSS de partida del taller"
                    :max-length="12000"
                    read-only
                  />
                </div>
              </details>
            </div>
            <div class="workshop-result-stack">
              <section class="learning-card design-preview-panel">
                <div class="workshop-panel-heading">
                  <h2><Eye :size="18" aria-hidden="true" /> Vista previa</h2>
                  <div class="workshop-devices" role="group" aria-label="Ancho de la vista previa">
                    <button
                      v-for="value in ['auto', '375', '768', '1200']"
                      :key="value"
                      :aria-pressed="value === 'auto' ? autoWidth : !autoWidth && width === value"
                      @click="selectWidth(value)"
                    >
                      {{ value === 'auto' ? 'Auto' : value }}
                    </button>
                  </div>
                </div>
                <div class="workshop-preview-options">
                  <label><input v-model="fit" type="checkbox" /> Ajustar al panel</label
                  ><label><input v-model="highlight" type="checkbox" /> Mostrar bordes</label>
                </div>
                <p class="workshop-save-note">
                  {{ frameWidth }} px reales ·
                  {{ fit ? 'Vista reducida para encajar' : 'Desplazamiento local' }}
                </p>
                <div ref="previewHost">
                  <GameFrame
                    :document="preview"
                    :width="frameWidth"
                    :fit="fit"
                    :title="`Vista previa del taller: ${current.title}`"
                  />
                </div>
              </section>
              <section class="learning-card workshop-dom">
                <h2>
                  <button
                    class="workshop-toggle"
                    :aria-expanded="treeOpen"
                    aria-controls="workshop-dom-tree"
                    @click="treeOpen = !treeOpen"
                  >
                    Árbol DOM <span aria-hidden="true">{{ treeOpen ? '−' : '+' }}</span>
                  </button>
                </h2>
                <div v-show="treeOpen" id="workshop-dom-tree">
                  <p>
                    Pasa por un nodo o usa el teclado para destacarlo. Púlsalo para mantener la
                    selección.
                  </p>
                  <p class="workshop-selected" aria-live="polite">
                    {{
                      selectedLabel
                        ? 'Seleccionado: ' + selectedLabel
                        : 'Selecciona un elemento para explorar su estructura.'
                    }}
                  </p>
                  <button
                    v-if="selectedNode !== null"
                    class="text-link"
                    @click="selectedNode = null"
                  >
                    Quitar selección
                  </button>
                  <div class="workshop-tree-scroll">
                    <DomTree
                      :nodes="domTree"
                      :selected-key="selectedNode"
                      @inspect="hoveredNode = $event"
                      @select="selectedNode = $event"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
          <section id="workshop-quiz" class="learning-card design-check">
            <p class="eyebrow">EL ÚLTIMO PASO</p>
            <h2>Comprueba lo aprendido</h2>
            <fieldset>
              <legend>{{ current.question }}</legend>
              <label v-for="(option, index) in current.options" :key="option"
                ><input
                  v-model="answer"
                  type="radio"
                  :name="`quiz-${current.id}`"
                  :value="String(index)"
                />{{ option }}</label
              >
            </fieldset>
            <button class="button button-primary" @click="check">Comprobar taller</button>
            <details class="workshop-validation">
              <summary>Cómo se comprueba tu trabajo</summary>
              <p>{{ t('design.scope') }}</p>
            </details>
            <div v-if="verdict" class="design-verdict">
              <ul>
                <li
                  v-for="(rule, index) in current.checks"
                  :key="`${rule.selector}-${rule.property}`"
                >
                  {{ verdict.declarations[index] ? '✓' : '○' }}
                  <code>{{ rule.selector }} · {{ rule.property }}: {{ rule.value }}</code
                  ><span v-if="rule.media"> · @media {{ rule.media }}</span>
                </li>
              </ul>
              <p>
                {{ verdict.quiz ? '✓' : '○' }}
                {{ t(verdict.quiz ? 'design.quizCorrect' : 'design.quizRetry') }}
              </p>
              <p v-if="verdict.quiz">{{ current.reason }}</p>
            </div>
            <p role="status">{{ message }}</p>
            <div v-if="learning.data.workshops[current.id]?.completedAt" class="workshop-success">
              <Trophy :size="36" aria-hidden="true" />
              <div>
                <h3>¡Taller completado!</h3>
                <p>Has recorrido todos los pasos. Puedes volver a practicar cuando quieras.</p>
                <RouterLink v-if="next" class="text-link" :to="`/talleres/${next.id}`"
                  >Siguiente taller: {{ next.title }} →</RouterLink
                >
              </div>
            </div>
          </section>
          <section class="learning-card workshop-tools">
            <h2>Continúa experimentando</h2>
            <div class="card-actions">
              <button class="button button-secondary" @click="openLab">
                Abrir en el Laboratorio</button
              ><button class="button button-secondary" @click="solutionPending = !solutionPending">
                Ver ayuda y solución</button
              ><button class="button button-secondary" @click="resetPending = !resetPending">
                Reiniciar ejercicio</button
              ><RouterLink v-if="current.id === 'tablas'" class="text-link" to="/juego/tablas"
                >Jugar con celdas, filas y columnas →</RouterLink
              >
            </div>
            <div v-if="solutionPending" class="design-reset">
              <p>
                La solución sustituye tu código. No marca pasos ni concede puntos por sí sola:
                revísala y comprueba después lo aprendido.
              </p>
              <button class="button button-secondary" @click="solution">Cargar solución CSS</button
              ><button class="button button-secondary" @click="solutionPending = false">
                Cancelar
              </button>
            </div>
            <div v-if="resetPending" class="design-reset">
              <p>{{ t('design.resetQuestion') }} También conservarás los pasos ya realizados.</p>
              <button class="button button-secondary" @click="restart">
                {{ t('design.resetConfirm') }}</button
              ><button class="button button-secondary" @click="resetPending = false">
                Cancelar
              </button>
            </div>
          </section>
        </div>
      </div>
    </template>
    <template v-else>
      <header class="workshop-catalog-hero">
        <div>
          <p class="eyebrow">APRENDE CONSTRUYENDO · PASO A PASO</p>
          <h1 id="page-title" tabindex="-1">Talleres CSS</h1>
          <p class="section-intro">
            Construye componentes y páginas reales. Cada taller te guía desde el objetivo hasta el
            resultado: escribe CSS, comprueba cada paso y mira cómo tu diseño cobra forma.
          </p>
          <RouterLink v-if="resume" class="button button-primary" :to="`/talleres/${resume.id}`"
            >Continuar: {{ resume.title }} <ArrowRight :size="18" aria-hidden="true"
          /></RouterLink>
        </div>
        <div class="workshop-catalog-score">
          <Trophy :size="38" aria-hidden="true" /><strong
            >{{ learning.workshopsCompleted }}<span> / {{ workshops.length }}</span></strong
          >
          <p>talleres completados</p>
          <progress
            :value="doneSteps"
            :max="totalSteps"
            aria-label="Progreso de todos los pasos"
          /><small>{{ doneSteps }} de {{ totalSteps }} pasos · 100 XP por taller</small>
        </div>
      </header>
      <p v-if="route.params.id" role="status">{{ t('design.notFound') }}</p>
      <div class="design-filters">
        <label
          >{{ t('design.search')
          }}<input v-model="query" type="search" :placeholder="t('design.placeholder')" /></label
        ><label
          >Categoría<select v-model="category">
            <option value="">Todas las categorías</option>
            <option v-for="item in categories" :key="item">{{ item }}</option>
          </select></label
        ><label
          >Tu avance<select v-model="status">
            <option value="">Todos los estados</option>
            <option value="new">Sin empezar</option>
            <option value="started">En curso</option>
            <option value="done">Completados</option>
          </select></label
        >
      </div>
      <p aria-live="polite">{{ items.length }} talleres disponibles</p>
      <div class="learning-grid design-grid">
        <article
          v-for="item in items"
          :key="item.id"
          class="learning-card workshop-card"
          :class="{ 'is-complete': learning.data.workshops[item.id]?.completedAt }"
        >
          <div class="workshop-card-top">
            <span class="workshop-icon"
              ><component
                :is="icons[workshops.indexOf(item)]"
                :size="29"
                aria-hidden="true" /></span
            ><span class="workshop-card-state">{{
              learning.data.workshops[item.id]?.completedAt
                ? '✓ Completado'
                : progress(item)
                  ? 'En curso'
                  : 'Por descubrir'
            }}</span>
          </div>
          <p class="eyebrow">{{ item.category }} · {{ item.minutes }} min</p>
          <h2>
            <RouterLink :to="`/talleres/${item.id}`">{{ item.title }}</RouterLink>
          </h2>
          <p class="workshop-card-summary">{{ item.summary }}</p>
          <div class="workshop-card-progress">
            <progress
              :value="progress(item)"
              :max="workshopSteps(item).length"
              :aria-label="`Progreso: ${item.title}`"
            />
            <div>
              <span>{{ progress(item) }}/{{ workshopSteps(item).length }} pasos</span
              ><strong
                >{{ Math.round((progress(item) / workshopSteps(item).length) * 100) }}%</strong
              >
            </div>
          </div>
          <RouterLink class="workshop-card-action" :to="`/talleres/${item.id}`"
            >{{
              learning.data.workshops[item.id]?.completedAt
                ? 'Volver a practicar'
                : progress(item)
                  ? 'Continuar taller'
                  : 'Empezar taller'
            }}
            <ArrowRight :size="18" aria-hidden="true"
          /></RouterLink>
        </article>
      </div>
      <p v-if="!items.length">No hay talleres con esos filtros. Prueba otra búsqueda.</p>
    </template>
  </section>
</template>
