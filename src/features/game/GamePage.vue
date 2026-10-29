<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import { gameLevels, planets, galaxyHtml, badgeDefinitions } from '../../../packages/content/src'
import { evaluateVisualGame, visualGameScore } from '@/domain/visualGame'
import { useLearningStore } from '@/shared/model/learningStore'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
const { t } = useI18n()
const route = useRoute()
const store = useLearningStore()
const level = computed(
  () =>
    gameLevels.find((level) => level.id === route.params.id) ??
    (!route.params.id ? gameLevels[0]! : null),
)
const levelIndex = computed(() => gameLevels.findIndex((item) => item.id === level.value?.id))
const answer = ref('')
const sidebarOpen = ref(true)
const animate = ref(true)
const won = ref(false)
const winKey = ref(0)
const reward = ref(0)
const feedback = ref('')
const earned = ref<string[]>([])
const result = computed(() => (level.value ? store.data.games[level.value.id] : undefined))
const verdict = ref(evaluateVisualGame(galaxyHtml, level.value?.solution ?? '.planeta', ''))
const updateSelection = useDebounceFn(() => {
  if (level.value)
    verdict.value = evaluateVisualGame(galaxyHtml, level.value.solution, answer.value)
}, 120)
watch(answer, () => {
  won.value = false
  feedback.value = ''
  updateSelection()
})
const targets = computed(() => {
  if (!level.value) return []
  return evaluateVisualGame(galaxyHtml, level.value.solution, level.value.solution).selectedIds
})
const targetNames = computed(() =>
  planets
    .filter((p) => targets.value.includes(p.id))
    .map((p) => p.name)
    .join(', '),
)
const selectedNames = computed(() =>
  planets
    .filter((p) => verdict.value.selectedIds.includes(p.id))
    .map((p) => p.name)
    .join(', '),
)
const next = computed(() => gameLevels[levelIndex.value + 1])
const hintCount = computed(() => result.value?.hintsUsed ?? 0)
const score = computed(() => visualGameScore(level.value?.level ?? 1, hintCount.value))
function submit() {
  if (!level.value) return
  const current = evaluateVisualGame(galaxyHtml, level.value.solution, answer.value)
  verdict.value = current
  if (!answer.value.trim()) {
    feedback.value = t('game.empty')
    return
  }
  const before = new Set(Object.keys(store.data.badges))
  reward.value = store.playGame(level.value.id, current.correct)
  earned.value = badgeDefinitions
    .filter((badge) => store.data.badges[badge.id] && !before.has(badge.id))
    .map((badge) => badge.name)
  won.value = current.correct
  winKey.value++
  feedback.value = current.error
    ? t('game.syntax')
    : current.correct
      ? reward.value
        ? t('game.success', { score: reward.value })
        : t('game.reviewed')
      : t('game.mismatch', { extra: current.extra, missing: current.missing })
}
</script>
<template>
  <section class="learning-page game-page">
    <p class="eyebrow">{{ t('game.eyebrow') }}</p>
    <h1 id="page-title" tabindex="-1">{{ t('game.title') }}</h1>
    <p class="section-intro">{{ t('game.intro') }}</p>
    <div class="game-topline">
      <span>{{
        t('game.progress', { count: store.gamesCompleted, total: gameLevels.length })
      }}</span
      ><RouterLink class="text-link" to="/insignias">✦ {{ t('game.badges') }}</RouterLink>
    </div>
    <div class="game-layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <CollapsibleSidebar v-model="sidebarOpen" :title="t('panels.missions')">
        <RouterLink
          v-for="(item, index) in gameLevels"
          :key="item.id"
          class="mission-link"
          :class="{ current: item.id === level?.id }"
          :to="`/juego/${item.id}`"
          ><span class="mission-number">{{
            store.data.games[item.id]?.status === 'completed'
              ? '✓'
              : String(index + 1).padStart(2, '0')
          }}</span
          ><span
            >{{ item.title
            }}<small
              >{{ '★'.repeat(item.level) }} ·
              {{
                store.data.games[item.id]?.status === 'completed'
                  ? t('game.completed')
                  : t('game.available')
              }}</small
            ></span
          ></RouterLink
        >
      </CollapsibleSidebar>
      <div v-if="level" class="game-workspace">
        <header class="game-mission-heading">
          <div>
            <p class="eyebrow">
              {{ t('game.mission', { number: levelIndex + 1 }) }} · {{ level.title }}
            </p>
            <h2>{{ level.goal }}</h2>
          </div>
          <span class="game-score">{{
            t('game.score', { score, difficulty: '★'.repeat(level.level) })
          }}</span>
        </header>
        <figure
          :key="winKey"
          class="galaxy-board"
          :class="{ 'is-won': won, 'game-motion': animate }"
          :aria-label="t('game.board')"
        >
          <svg
            class="galaxy-edges"
            viewBox="0 0 600 480"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              v-for="(p, index) in planets"
              :key="p.id"
              :class="{ activated: won && targets.includes(p.id) }"
              :d="`M 300 240 L ${index < 3 ? 150 : 450} ${100 + (index % 3) * 140}`"
            />
            <circle cx="300" cy="240" r="19" />
          </svg>
          <div class="galaxy-orbit-label interior-label">
            {{ t('game.interior') }}<code>.interior</code>
          </div>
          <div class="galaxy-orbit-label exterior-label">
            {{ t('game.exterior') }}<code>.exterior</code>
          </div>
          <div class="galaxy-hub" aria-hidden="true">✦</div>
          <div
            v-for="(planet, index) in planets"
            :key="planet.id"
            class="galaxy-node"
            :class="[
              planet.id,
              {
                target: targets.includes(planet.id),
                selected: verdict.selectedIds.includes(planet.id),
              },
            ]"
            :style="{
              left: index < 3 ? '25%' : '75%',
              top: `${((100 + (index % 3) * 140) / 480) * 100}%`,
              '--node-delay': `${(index % 3) * 90}ms`,
            }"
          >
            <span class="planet-marker">{{
              verdict.selectedIds.includes(planet.id) ? '✓' : targets.includes(planet.id) ? '◎' : ''
            }}</span
            ><span class="planet-ball" aria-hidden="true"></span><strong>{{ planet.name }}</strong
            ><code>#{{ planet.id }}</code>
          </div>
          <figcaption class="sr-only">
            {{ t('game.targets', { names: targetNames }) }}
            {{ t('game.selection', { names: selectedNames || t('game.noSelection') }) }}
          </figcaption>
          <span v-if="won && reward" class="galaxy-reward" aria-hidden="true"
            >+{{ reward }} XP</span
          >
        </figure>
        <p class="game-legend">{{ t('game.legend') }}</p>
        <p class="game-target-names">{{ t('game.targets', { names: targetNames }) }}</p>
        <form class="learning-card game-answer" @submit.prevent="submit">
          <label for="game-selector">{{ t('game.selector') }}</label>
          <div class="game-input-row">
            <span aria-hidden="true">&gt;</span
            ><input
              id="game-selector"
              v-model="answer"
              maxlength="160"
              :placeholder="t('game.placeholder')"
              spellcheck="false"
              autocapitalize="off"
              autocomplete="off"
            /><button class="button button-primary" type="submit">{{ t('game.launch') }}</button>
          </div>
          <p class="game-live-selection" aria-live="polite">
            {{
              verdict.error
                ? t('game.syntax')
                : t('game.selection', { names: selectedNames || t('game.noSelection') })
            }}
            {{ verdict.containers ? t('game.containers', { count: verdict.containers }) : '' }}
          </p>
          <p v-if="feedback" class="feedback" :class="{ success: won }" role="status">
            {{ feedback }} {{ won ? level.explanation : '' }}
          </p>
          <p v-for="name in earned" :key="name" class="game-earned">
            ✦ {{ t('game.earned', { name }) }}
          </p>
          <div class="card-actions">
            <button
              class="button button-secondary"
              type="button"
              :disabled="hintCount >= 3 || result?.status === 'completed'"
              @click="store.gameHint(level.id)"
            >
              {{ t('game.hint', { number: Math.min(3, hintCount + 1) }) }}</button
            ><RouterLink
              v-if="won || result?.status === 'completed'"
              class="button button-primary"
              :to="next ? `/juego/${next.id}` : '/juego/galaxia-rocosos'"
              >{{ t(next ? 'game.next' : 'game.replay') }} →</RouterLink
            >
          </div>
          <ol v-if="hintCount" class="hint-list">
            <li v-for="hint in level.hints.slice(0, hintCount)" :key="hint">{{ hint }}</li>
          </ol>
        </form>
        <details class="learning-card game-code">
          <summary>{{ t('game.html') }}</summary>
          <pre><code>{{ galaxyHtml }}</code></pre>
        </details>
        <details class="learning-card game-help">
          <summary>{{ t('game.help') }}</summary>
          <p>{{ t('game.helpText') }}</p>
        </details>
        <label class="check-option"
          ><input v-model="animate" type="checkbox" />{{ t('game.animations') }}</label
        >
      </div>
      <div v-else class="learning-card">
        <h2>{{ t('game.notFound') }}</h2>
        <RouterLink class="text-link" to="/juego">{{ t('game.back') }}</RouterLink>
      </div>
    </div>
  </section>
</template>
<style src="./game.css"></style>
