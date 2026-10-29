<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { challenges, entries, moduleNames } from '../../../packages/content/src'
import { useLearningStore } from '@/shared/model/learningStore'
import { evaluateChallenge, resolveSelector, type Verdict } from '@/domain/challenges'
import { createPreviewDocument, evaluateSelector } from '@/features/lab/model/selectorEvaluator'
const route = useRoute()
const store = useLearningStore()
const key = computed(() => String(route.params.id || route.params.category || ''))
const challenge = computed(() => challenges.find((c) => c.id === key.value))
const group = computed(() => (/^m[1-9]$/.test(key.value) ? Number(key.value.slice(1)) : null))
const difficulty = ref('')
const filtered = computed(() =>
  challenges.filter(
    (c) =>
      (!group.value || c.module === group.value) &&
      (!difficulty.value || c.level === Number(difficulty.value)),
  ),
)
const answer = ref(challenge.value?.initial ?? '')
const verdict = ref<Verdict | null>(null)
const result = computed(() =>
  challenge.value ? store.data.challenges[challenge.value.id] : undefined,
)
const entry = computed(() => entries.find((e) => e.id === challenge.value?.entryId))
const target = computed(() => {
  if (!challenge.value) return ''
  let selector = 'p'
  try {
    selector =
      challenge.value.styleTarget?.selector ?? resolveSelector(challenge.value.solution).selector
  } catch {
    /* Quiz has no selector preview. */
  }
  return createPreviewDocument(
    evaluateSelector({ html: challenge.value.html, css: '', selector }),
    'body{font:16px/1.6 system-ui;padding:20px;color:#1a1b2e} p,li,button,input{margin:8px;padding:8px}',
  )
})
const next = computed(() => challenges.find((c) => c.prerequisite === challenge.value?.id))
function check() {
  if (!challenge.value || !store.available(challenge.value)) return
  const document = new DOMParser().parseFromString(challenge.value.html, 'text/html')
  verdict.value = evaluateChallenge(challenge.value, answer.value, document)
  store.attempt(challenge.value, verdict.value.correct)
}
</script>
<template>
  <section class="learning-page">
    <p class="eyebrow">Pequeños retos, grandes descubrimientos</p>
    <h1 id="page-title" tabindex="-1">{{ challenge?.title ?? 'Retos' }}</h1>
    <template v-if="challenge && store.available(challenge)">
      <div class="challenge-meta">
        <RouterLink class="text-link" :to="`/retos/m${challenge.module}`"
          >← {{ moduleNames[challenge.module] }}</RouterLink
        ><span>{{ '★'.repeat(challenge.level) }} · {{ challenge.type }}</span>
      </div>
      <div class="challenge-layout">
        <article class="learning-card">
          <h2>
            {{
              challenge.prompt ||
              (challenge.type === 'specificity'
                ? '¿Qué selector tiene más especificidad?'
                : challenge.type === 'multiple-choice'
                  ? 'Elige la afirmación correcta'
                  : 'Selecciona exactamente los elementos marcados')
            }}
          </h2>
          <p v-if="!challenge.options">
            {{ entry?.description
            }}{{
              challenge.type === 'fill'
                ? ' Sustituye los guiones del selector.'
                : challenge.type === 'fix'
                  ? ' Corrige el selector propuesto.'
                  : ''
            }}
          </p>
          <pre><code>{{ challenge.html }}</code></pre>
          <p v-if="entry?.kind === 'state'" class="muted">
            Simulamos el estado con la clase sim-… del HTML. Escribe la pseudoclase real.
          </p>
          <p v-if="entry?.kind === 'pseudo'" class="muted">
            Los objetivos son los elementos de origen. Incluye el pseudoelemento indicado.
          </p>
          <form @submit.prevent="check">
            <fieldset v-if="challenge.options">
              <legend>Tu respuesta</legend>
              <label v-for="(option, i) in challenge.options" :key="option" class="radio-option"
                ><input
                  v-model="answer"
                  type="radio"
                  name="answer"
                  :value="challenge.type === 'specificity' ? option : String(i)"
                  required
                />{{ option }}</label
              >
            </fieldset>
            <label v-else class="answer-label"
              >{{ challenge.type === 'apply-style' ? 'Tu CSS' : 'Tu selector'
              }}<textarea
                v-if="challenge.type === 'apply-style'"
                v-model="answer"
                maxlength="12000"
                rows="5"
                spellcheck="false" /><input
                v-else
                v-model="answer"
                maxlength="160"
                spellcheck="false"
                autocomplete="off"
                placeholder="Escribe aquí tu selector…"
            /></label>
            <button type="submit" class="button button-primary">Comprobar solución</button>
          </form>
          <p v-if="verdict" class="feedback" :class="{ success: verdict.correct }" role="status">
            {{ verdict.correct ? '✓' : '↻' }} {{ verdict.message }}
          </p>
          <p v-if="result?.status === 'completed'">
            ✓ Completado · {{ result.bestScore }} XP · {{ result.attempts }} intentos
          </p>
          <div class="card-actions">
            <button
              class="button button-secondary"
              :disabled="(result?.hintsUsed ?? 0) >= 3 || result?.status === 'completed'"
              @click="store.hint(challenge.id)"
            >
              Pista {{ Math.min(3, (result?.hintsUsed ?? 0) + 1) }} · −10 XP</button
            ><button
              v-if="(result?.attempts ?? 0) >= 3 && result?.status !== 'completed'"
              class="button button-secondary"
              @click="store.skip(challenge.id)"
            >
              Saltar este reto
            </button>
          </div>
          <ol v-if="result?.hintsUsed" class="hint-list">
            <li v-for="hint in challenge.hints.slice(0, result.hintsUsed)" :key="hint">
              {{ hint }}
            </li>
          </ol>
          <RouterLink
            v-if="next && store.available(next)"
            class="text-link"
            :to="`/retos/${next.id}`"
            >Siguiente reto →</RouterLink
          >
        </article>
        <aside class="learning-card">
          <h2>Elementos objetivo ◎</h2>
          <iframe :srcdoc="target" title="Objetivo del reto" sandbox="" />
          <p>El contorno ámbar indica los elementos que debe encontrar tu selector.</p>
          <RouterLink v-if="entry" class="text-link" :to="`/catalogo/${entry.id}`"
            >Consultar el concepto →</RouterLink
          >
        </aside>
      </div>
    </template>
    <div v-else-if="challenge" class="learning-card">
      <h2>Este reto se desbloquea en orden</h2>
      <p>Completa o salta el reto anterior para continuar.</p>
      <RouterLink class="text-link" :to="`/retos/${challenge.prerequisite}`"
        >Ir al reto anterior →</RouterLink
      >
    </div>
    <template v-else>
      <p class="section-intro">
        62 oportunidades de practicar. Los módulos son libres; dentro de cada uno, avanza paso a
        paso.
      </p>
      <div class="filter-bar">
        <RouterLink class="filter-chip" to="/retos">Todos</RouterLink
        ><RouterLink
          v-for="(name, i) in moduleNames.slice(1)"
          :key="name"
          class="filter-chip"
          :to="`/retos/m${i + 1}`"
          >M{{ i + 1 }} {{ name }}</RouterLink
        ><label
          >Dificultad<select v-model="difficulty">
            <option value="">Todas</option>
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
          </select></label
        >
      </div>
      <div class="learning-grid catalog-grid">
        <article
          v-for="item in filtered"
          :key="item.id"
          class="learning-card challenge-card"
          :class="{ locked: !store.available(item) }"
        >
          <p class="eyebrow">M{{ item.module }} · {{ '★'.repeat(item.level) }}</p>
          <h2>{{ item.title }}</h2>
          <p>
            {{
              store.data.challenges[item.id]?.status === 'completed'
                ? '✓ Completado'
                : store.data.challenges[item.id]?.status === 'skipped'
                  ? '↻ Pendiente de repaso'
                  : store.available(item)
                    ? 'Disponible para practicar'
                    : 'Se desbloquea tras el anterior'
            }}
          </p>
          <RouterLink class="text-link" :to="`/retos/${item.id}`">{{
            store.available(item) ? 'Abrir reto →' : 'Ver requisito →'
          }}</RouterLink>
        </article>
      </div>
    </template>
  </section>
</template>
