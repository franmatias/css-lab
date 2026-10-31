<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  tableMissions,
  tableRows,
  tableColumns,
  tableHtml,
} from '../../../packages/content/src/tableGame'
import { evaluateTableGame, solveTableGame, tableTargets, tableCellIds } from '@/domain/tableGame'
import { visualGameScore } from '@/domain/visualGame'
import { useLearningStore } from '@/shared/model/learningStore'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
import GameModes from '@/shared/ui/GameModes.vue'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import GameWorkbench from './GameWorkbench.vue'
import '@/features/lab/lab.css'
import './table-game.css'

const route = useRoute()
const learning = useLearningStore()
const mission = computed(
  () =>
    tableMissions.find((item) => item.id === route.params.id) ??
    (!route.params.id ? tableMissions[0]! : null),
)
const answer = ref('')
const tableWidth = ref('auto')
const sidebarOpen = ref(true)
const pointer = ref<string | null>(null)
const focused = ref<string | null>(null)
const reference = ref('')
function useReference() {
  pointer.value = null
  focused.value = null
}
const active = computed(() => pointer.value ?? focused.value ?? (reference.value || null))
const feedback = ref('')
const won = ref(false)
const animations = ref(true)
const winKey = ref(0)
const reward = ref(0)
const result = computed(() => mission.value && learning.data.games[mission.value.id])
const hints = computed(() => result.value?.hintsUsed ?? 0)
const score = computed(() => visualGameScore(mission.value?.level ?? 1, hints.value))
const targets = computed(() => (mission.value ? tableTargets(mission.value, active.value) : []))
const verdict = computed(() =>
  mission.value ? evaluateTableGame(mission.value, answer.value, active.value) : null,
)
const next = computed(
  () => tableMissions[tableMissions.findIndex((item) => item.id === mission.value?.id) + 1],
)
watch(mission, () => {
  answer.value = ''
  feedback.value = ''
  won.value = false
  reference.value = ''
  pointer.value = null
  focused.value = null
})
watch(answer, () => {
  feedback.value = ''
  won.value = false
})
function name(id: string) {
  if (id.startsWith('fila-')) return `Fila de ${tableRows[Number(id.split('-')[1]) - 1]?.name}`
  const [, row, col] = id.split('-')
  return `${tableRows[Number(row) - 1]?.name} · ${tableColumns[Number(col) - 1]}`
}
const targetNames = computed(() => targets.value.map(name).join(', '))
const selectedNames = computed(() => verdict.value?.selectedIds.map(name).join(', '))
function submit() {
  if (!mission.value) return
  if (!answer.value.trim()) {
    feedback.value = 'Escribe un selector para comprobar la misión.'
    return
  }
  const grade = solveTableGame(mission.value, answer.value, active.value)
  reward.value = learning.playGame(mission.value.id, grade.correct)
  won.value = grade.correct
  winKey.value++
  feedback.value = grade.error
    ? 'Revisa la sintaxis del selector.'
    : grade.correct
      ? reward.value
        ? `¡Misión completada! +${reward.value} XP. ${mission.value.explanation}`
        : 'Misión repasada. Los puntos se conceden una sola vez.'
      : mission.value.interaction !== 'static'
        ? 'Revisa el comportamiento: el selector debe responder correctamente en todas las celdas y al salir de la tabla. Utiliza :hover y las pseudoclases pedidas.'
        : grade.correct === false && grade.extra === 0 && grade.missing === 0
          ? 'El conjunto coincide. Usa también la pseudoclase que pide el enunciado.'
          : `Casi: sobran ${grade.extra} elementos y faltan ${grade.missing}. Distingue entre seleccionar un tr y seleccionar sus celdas.`
}
</script>
<template>
  <section class="learning-page table-game-page game-guided-page">
    <p class="eyebrow">Un árbol HTML que puedes recorrer</p>
    <h1 id="page-title" tabindex="-1">Juego de tablas</h1>
    <p class="section-intro">
      Escribe selectores para encontrar celdas, filas y columnas. Observa cómo cambian las
      coincidencias al recorrer la tabla.
    </p>
    <GameModes />
    <p>
      {{ learning.tableGamesCompleted }} de {{ tableMissions.length }} misiones de tablas
      completadas
    </p>
    <div class="table-game-layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <aside class="game-guide">
        <header v-if="mission && sidebarOpen" class="learning-card">
          <p class="eyebrow">
            Misión {{ tableMissions.indexOf(mission) + 1 }} · {{ '★'.repeat(mission.level) }} ·
            Hasta {{ score }} XP
          </p>
          <h2>{{ mission.title }}</h2>
          <p>{{ mission.goal }}</p>
          <p>
            Pseudoclases del reto: <code>{{ mission.requiredPseudos.join(', ') }}</code
            >.
          </p>
        </header>
        <CollapsibleSidebar v-model="sidebarOpen" title="Misiones de tablas"
          ><nav aria-label="Misiones de tablas">
            <RouterLink
              v-for="item in tableMissions"
              :key="item.id"
              :class="{ 'mission-done': learning.data.games[item.id]?.status === 'completed' }"
              :to="`/juego/tablas/${item.id}`"
              :aria-current="item.id === mission?.id ? 'page' : undefined"
              >{{ item.title }}</RouterLink
            >
          </nav></CollapsibleSidebar
        >
      </aside>
      <div v-if="mission" class="table-game-content">
        <GameWorkbench
          ><template #source
            ><section class="game-code-panel">
              <h2>Código HTML <small>Solo lectura</small></h2>
              <div class="game-html-editor">
                <CodeEditor
                  :model-value="tableHtml"
                  language="html"
                  label="HTML de la tabla"
                  :max-length="12000"
                  read-only
                />
              </div></section></template
          ><template #editor>
            <form class="learning-card table-answer" @submit.prevent="submit">
              <label for="table-selector">Tu selector para la tabla</label
              ><input
                id="table-selector"
                v-model="answer"
                maxlength="160"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="tbody > tr:nth-child(…)"
                aria-describedby="table-count"
              />
              <p id="table-count" aria-live="polite">
                {{
                  verdict?.error
                    ? 'Revisa la sintaxis del selector.'
                    : `Seleccionado: ${selectedNames || 'ningún elemento'}.`
                }}
                {{
                  verdict?.containers
                    ? `Además, ${verdict.containers} elementos sin identificar.`
                    : ''
                }}
              </p>
              <button class="button button-primary" type="submit">Comprobar misión</button>
              <p role="status" class="table-feedback">{{ feedback }}</p>
              <button
                class="button button-secondary"
                type="button"
                :disabled="hints >= 3 || result?.status === 'completed'"
                @click="learning.gameHint(mission.id)"
              >
                Pista {{ Math.min(3, hints + 1) }} · −20 XP
              </button>
              <ol v-if="hints">
                <li v-for="hint in mission.hints.slice(0, hints)" :key="hint">{{ hint }}</li>
              </ol>
              <RouterLink
                v-if="(won || result?.status === 'completed') && next"
                class="text-link"
                :to="`/juego/tablas/${next.id}`"
                >Siguiente misión →</RouterLink
              >
            </form></template
          ><template #preview
            ><div class="game-size-buttons" role="group" aria-label="Ancho de la tabla">
              <button
                v-for="size in ['auto', '375', '768', '1200']"
                :key="size"
                type="button"
                :aria-pressed="tableWidth === size"
                @click="tableWidth = size"
              >
                {{ size === 'auto' ? 'Auto' : size + ' px' }}
              </button>
            </div>
            <section
              :key="winKey"
              class="learning-card table-board"
              :class="{ 'is-won': won, 'with-motion': animations }"
              aria-label="Tabla interactiva de calificaciones"
            >
              <p class="table-legend">
                ◎ Objetivo · ✓ Seleccionado · El borde de la fila señala un tr; una celda marcada
                señala una th o td.
              </p>
              <div class="game-table-boundary">
                <div
                  class="table-scroll"
                  :style="{
                    width: tableWidth === 'auto' ? '100%' : tableWidth + 'px',
                    maxWidth: 'none',
                  }"
                  tabindex="0"
                  role="region"
                  aria-label="Tabla desplazable"
                >
                  <table class="table-game-grid">
                    <caption>
                      Calificaciones del taller
                    </caption>
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column" scope="col">
                          {{ column }}
                        </th>
                      </tr>
                    </thead>
                    <tbody @pointerleave="pointer = null">
                      <tr
                        v-for="(row, r) in tableRows"
                        :key="row.name"
                        :class="{
                          'target-row': targets.includes(`fila-${r + 1}`),
                          'selected-row': verdict?.selectedIds.includes(`fila-${r + 1}`),
                        }"
                      >
                        <component
                          :is="c === 0 ? 'th' : 'td'"
                          v-for="(value, c) in [row.name, ...row.values]"
                          :key="c"
                          :scope="c === 0 ? 'row' : undefined"
                          tabindex="0"
                          :aria-label="`${row.name}, ${tableColumns[c]}: ${value}`"
                          :class="{
                            'target-cell': targets.includes(`celda-${r + 1}-${c + 1}`),
                            'selected-cell': verdict?.selectedIds.includes(
                              `celda-${r + 1}-${c + 1}`,
                            ),
                            'inspected-cell': active === `celda-${r + 1}-${c + 1}`,
                          }"
                          @pointerenter="pointer = `celda-${r + 1}-${c + 1}`"
                          @focus="focused = `celda-${r + 1}-${c + 1}`"
                          @blur="focused = null"
                        >
                          <span class="table-cell-mark" aria-hidden="true">{{
                            verdict?.selectedIds.includes(`celda-${r + 1}-${c + 1}`)
                              ? '✓'
                              : targets.includes(`celda-${r + 1}-${c + 1}`)
                                ? '◎'
                                : ''
                          }}</span
                          >{{ value }}
                        </component>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p class="table-context">
                {{
                  active
                    ? `Estás sobre: ${name(active)}`
                    : 'Recorre una celda con el puntero o con Tab.'
                }}
              </p>
              <label class="table-reference"
                >Simular puntero sin ratón<select v-model="reference" @change="useReference">
                  <option value="">Fuera de la tabla</option>
                  <option v-for="id in tableCellIds" :key="id" :value="id">{{ name(id) }}</option>
                </select></label
              >
              <p>
                El foco y este control reproducen el estado <code>:hover</code> para practicar
                también con teclado y pantalla táctil. La selección se calcula sobre el HTML del
                ejercicio.
              </p>
              <p class="table-targets">
                Objetivo actual:
                {{
                  targetNames ||
                  (mission.interaction === 'static'
                    ? '—'
                    : 'recorre la tabla para ver el objetivo')
                }}.
              </p>
              <p v-if="won" class="table-win">
                ✓ {{ reward ? `+${reward} XP` : 'Misión repasada' }}
              </p>
            </section></template
          ></GameWorkbench
        >

        <div class="card-actions">
          <label class="check-option"
            ><input v-model="animations" type="checkbox" />Animaciones del juego</label
          ><RouterLink class="text-link" to="/teoria/m5"
            >Repasar pseudoclases estructurales →</RouterLink
          ><RouterLink class="text-link" to="/talleres/tablas">Diseñar una tabla →</RouterLink>
        </div>
      </div>
      <div v-else class="learning-card">
        <h2>Esta misión no existe</h2>
        <RouterLink to="/juego/tablas">Elegir una misión de tablas →</RouterLink>
      </div>
    </div>
  </section>
</template>
