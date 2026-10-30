<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { studioModes, studioMissions, studioNames } from '../../../packages/content/src/studioGames'
import { checkStudioGame } from '@/domain/studioGame'
import { useLearningStore } from '@/shared/model/learningStore'
import { visualGameScore } from '@/domain/visualGame'
import { createPreviewDocument, evaluateSelector } from '@/features/lab/model/selectorEvaluator'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
import { formatCode } from '@/features/lab/model/formatCode'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
import GameModes from '@/shared/ui/GameModes.vue'
import GameFrame from './GameFrame.vue'
import '@/features/lab/lab.css'
import './studio-game.css'
const route = useRoute()
const router = useRouter()
const store = useLearningStore()
const mode = computed(() => studioModes.find((mode) => mode === route.params.mode))
const missions = computed(() => studioMissions.filter((mission) => mission.mode === mode.value))
const mission = computed(
  () =>
    missions.value.find((mission) => mission.id === route.params.id) ??
    (!route.params.id ? missions.value[0] : undefined),
)
const answer = ref('')
const rendered = ref('')
const html = ref('')
const baseDisplay = ref('')
const width = ref('375')
const fit = ref(true)
const sidebarOpen = ref(true)
const feedback = ref('')
const won = ref(false)
const animate = ref(true)
const resetPending = ref(false)
const winKey = ref(0)
const checks = ref<boolean[] | null>(null)
const result = computed(() => (mission.value ? store.data.games[mission.value.id] : undefined))
const hints = computed(() => result.value?.hintsUsed ?? 0)
const score = computed(() => visualGameScore(mission.value?.level ?? 1, hints.value))
const next = computed(
  () => missions.value[missions.value.findIndex((item) => item.id === mission.value?.id) + 1],
)
watch(
  mission,
  async (item) => {
    answer.value = item ? (store.data.games[item.id]?.draft ?? '') : ''
    rendered.value = answer.value
    width.value = item?.width ?? '375'
    feedback.value = ''
    won.value = false
    checks.value = null
    resetPending.value = false
    html.value = item?.html ?? ''
    baseDisplay.value = item?.baseCss ?? ''
    if (item) {
      const [formatted, css] = await Promise.all([
        formatCode(item.html, 'html', { useTabs: false, tabWidth: 2 }),
        formatCode(item.baseCss, 'css', { useTabs: false, tabWidth: 2 }),
      ])
      if (mission.value === item) {
        html.value = formatted
        baseDisplay.value = css
      }
    }
  },
  { immediate: true },
)
const update = useDebounceFn(() => {
  rendered.value = answer.value
}, 120)
watch(
  answer,
  () => {
    if (mission.value) store.saveStudioDraft(mission.value.id, answer.value)
    feedback.value = ''
    won.value = false
    checks.value = null
    void update()
  },
  { flush: 'sync' },
)
function preview(target: boolean): string {
  const item = mission.value
  if (!item) return ''
  const selection = item.mode === 'semantica'
  const css = item.baseCss + (selection ? '' : '\n' + (target ? item.solution : rendered.value))
  const evaluation = evaluateSelector({
    html: item.html,
    css,
    selector: selection ? (target ? item.solution : rendered.value) : '*',
  })
  return createPreviewDocument(
    selection ? evaluation : { ...evaluation, matchedElementIds: [] },
    css,
    { highlight: selection ? 'both' : 'none', color: target ? 'amber' : 'cyan', animations: false },
  )
}
const targetPreview = computed(() => preview(true))
const playerPreview = computed(() => preview(false))
const live = computed(() =>
  mission.value?.mode === 'semantica' ? checkStudioGame(mission.value, rendered.value) : null,
)
function submit() {
  if (!mission.value) return
  if (!answer.value.trim()) {
    feedback.value = 'Escribe tu solución para empezar.'
    return
  }
  rendered.value = answer.value
  const verdict = checkStudioGame(mission.value, answer.value)
  checks.value = verdict.checks
  const reward = store.playGame(mission.value.id, verdict.correct)
  won.value = verdict.correct
  winKey.value++
  feedback.value = !answer.value.trim()
    ? 'Escribe tu solución para empezar.'
    : verdict.error
      ? 'Revisa la sintaxis del selector.'
      : verdict.correct
        ? reward
          ? `¡Misión completada! +${reward} XP. ${mission.value.explanation}`
          : '¡Lo tienes! Los puntos de esta misión se conceden una sola vez.'
        : mission.value.mode === 'semantica'
          ? `Revisa la selección: sobran ${verdict.extra} elementos y faltan ${verdict.missing}.`
          : 'Revisa las declaraciones marcadas y compara ambas vistas. Puedes usar una pista.'
}
async function format() {
  const original = answer.value
  const item = mission.value
  try {
    const value = await formatCode(original, 'css', { useTabs: false, tabWidth: 2 })
    if (item === mission.value && answer.value === original) answer.value = value
  } catch {
    feedback.value = 'No se pudo formatear. Revisa llaves y declaraciones.'
  }
}
async function openLab() {
  const item = mission.value
  if (item)
    await router.push(
      `/laboratorio${await encodeSharedLabDraft({ html: item.html, css: item.baseCss + (item.mode === 'semantica' ? '' : '\n' + answer.value), selector: item.mode === 'semantica' ? answer.value || item.solution : item.checks[0]!.selector })}`,
    )
}
function restart() {
  answer.value = ''
  resetPending.value = false
}
</script>
<template>
  <section class="learning-page studio-game-page">
    <p class="eyebrow">Construye una idea. Mira cómo cobra forma.</p>
    <h1 id="page-title" tabindex="-1">
      {{ mode ? `Juego de ${studioNames[mode]}` : 'Juego no encontrado' }}
    </h1>
    <p class="section-intro">
      {{
        mode === 'semantica'
          ? 'Encuentra las zonas de una página real y selecciona exactamente los elementos del objetivo.'
          : 'Escribe CSS para resolver la distribución propuesta. Compara tu resultado con el objetivo y prueba distintos anchos.'
      }}
    </p>
    <GameModes />
    <p v-if="mode">
      {{ store.studioCompleted(mode) }} de {{ missions.length }} misiones completadas · Tu código se
      guarda en este navegador.
    </p>
    <div class="studio-layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <CollapsibleSidebar v-model="sidebarOpen" title="Misiones del recorrido"
        ><nav aria-label="Misiones del recorrido">
          <RouterLink
            v-for="(item, index) in missions"
            :key="item.id"
            :to="`/juego/${item.mode}/${item.id}`"
            :aria-current="mission?.id === item.id ? 'page' : undefined"
            >{{ store.data.games[item.id]?.status === 'completed' ? '✓' : index + 1 }} ·
            {{ item.title }}</RouterLink
          >
        </nav></CollapsibleSidebar
      >
      <div v-if="mission" class="studio-content">
        <header class="learning-card studio-mission">
          <p class="eyebrow">
            Misión {{ missions.indexOf(mission) + 1 }} · {{ '★'.repeat(mission.level) }} · Hasta
            {{ score }} XP
          </p>
          <h2>{{ mission.title }}</h2>
          <p>{{ mission.goal }}</p>
        </header>
        <div class="studio-view-controls">
          <label
            >Ancho de prueba<select v-model="width">
              <option value="375">375 px · Móvil</option>
              <option value="768">768 px · Tableta</option>
              <option value="1200">1200 px · Escritorio</option>
            </select></label
          ><label class="check-option"
            ><input v-model="fit" type="checkbox" />Ajustar la vista al panel</label
          ><label class="check-option"
            ><input v-model="animate" type="checkbox" />Animación al acertar</label
          >
        </div>
        <div
          :key="winKey"
          class="studio-compare"
          :class="{ 'is-won': won, 'with-motion': animate }"
        >
          <section class="learning-card">
            <h2>Tu objetivo</h2>
            <p>
              {{
                mode === 'semantica'
                  ? 'Los elementos pedidos aparecen marcados en ámbar.'
                  : 'Esta es la distribución que debes construir.'
              }}
            </p>
            <GameFrame
              :document="targetPreview"
              :width="width"
              :fit="fit"
              title="Objetivo de la misión"
            />
          </section>
          <section class="learning-card">
            <h2>Tu resultado</h2>
            <p>
              {{
                mode === 'semantica'
                  ? 'Tu selector marca elementos en color cian.'
                  : 'Aquí se aplica tu CSS sobre la misma estructura HTML.'
              }}
            </p>
            <GameFrame
              :document="playerPreview"
              :width="width"
              :fit="fit"
              title="Resultado de tu código"
            />
          </section>
        </div>
        <form class="learning-card studio-answer" @submit.prevent="submit">
          <h2>{{ mode === 'semantica' ? 'Escribe tu selector' : 'Dale forma con CSS' }}</h2>
          <template v-if="mode === 'semantica'"
            ><label for="studio-selector">Tu selector de la página</label
            ><input
              id="studio-selector"
              v-model="answer"
              maxlength="160"
              autocomplete="off"
              spellcheck="false"
              autocapitalize="off"
              placeholder="main > article"
            />
            <p aria-live="polite">
              {{
                live?.error
                  ? 'Revisa la sintaxis del selector.'
                  : `${live?.extra ?? 0} elementos de más · ${live?.missing ?? 0} elementos pendientes`
              }}
            </p></template
          ><template v-else
            ><p>
              Comprobación guiada: usa el selector y las declaraciones del enunciado. Observa
              también el resultado visual; esta comprobación no evalúa toda la cascada.
            </p>
            <div class="studio-code-editor">
              <CodeEditor
                v-model="answer"
                language="css"
                label="Tu CSS para la misión"
                :max-length="20000"
                @format="format"
              /></div
          ></template>
          <div class="card-actions">
            <button class="button button-primary" type="submit">Comprobar misión</button
            ><button
              class="button button-secondary"
              type="button"
              :disabled="hints >= 3 || result?.status === 'completed'"
              @click="store.gameHint(mission.id)"
            >
              Pista {{ Math.min(3, hints + 1) }} · −20 XP</button
            ><button
              class="button button-secondary"
              type="button"
              @click="resetPending = !resetPending"
            >
              Reiniciar código</button
            ><button class="button button-secondary" type="button" @click="openLab">
              Abrir en el Laboratorio
            </button>
          </div>
          <div v-if="resetPending">
            <p>¿Quieres borrar este intento? Conservarás los puntos y los logros.</p>
            <button type="button" class="button button-secondary" @click="restart">
              Sí, reiniciar código
            </button>
          </div>
          <p class="studio-feedback" role="status">{{ feedback }}</p>
          <ul v-if="checks?.length" class="studio-checks">
            <li v-for="(check, index) in mission.checks" :key="index">
              {{ checks[index] ? '✓' : '○' }}
              <code>{{ check.selector }} · {{ check.property }}: {{ check.value }}</code
              ><span v-if="check.media"> · @media {{ check.media }}</span>
            </li>
          </ul>
          <ol v-if="hints" class="studio-hints">
            <li v-for="hint in mission.hints.slice(0, hints)" :key="hint">
              <pre>{{ hint }}</pre>
            </li>
          </ol>
          <RouterLink
            v-if="(won || result?.status === 'completed') && next"
            class="text-link"
            :to="`/juego/${next.mode}/${next.id}`"
            >Siguiente misión →</RouterLink
          ><RouterLink v-else-if="won && !next" class="text-link" to="/insignias"
            >Ver mis nuevas medallas →</RouterLink
          >
        </form>
        <details class="learning-card studio-source">
          <summary>Explorar el HTML y el CSS de partida</summary>
          <h3>HTML</h3>
          <pre tabindex="0" aria-label="HTML de la misión"><code>{{html}}</code></pre>
          <h3>CSS de partida</h3>
          <pre tabindex="0" aria-label="CSS de partida"><code>{{baseDisplay}}</code></pre>
        </details>
      </div>
      <section v-else class="learning-card">
        <h2>Esta misión no existe</h2>
        <RouterLink :to="`/juego/${mode ?? 'flexbox'}`">Elegir una misión →</RouterLink>
      </section>
    </div>
  </section>
</template>
