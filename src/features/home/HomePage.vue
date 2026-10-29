<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowDown, ArrowRight, Check, CodeXml, FlaskConical, Sparkles } from '@lucide/vue'
import { useLearningStore } from '@/shared/model/learningStore'
import { challenges } from '../../../packages/content/src'
import { dailyIndex, localDate } from '@/domain/challenges'
import WelcomeTour from '@/shared/ui/WelcomeTour.vue'

const { t } = useI18n()
const learning = useLearningStore()
const dailyCandidates = challenges.filter((challenge) => !challenge.prerequisite)
const dailyChallenge = dailyCandidates[dailyIndex(localDate(), dailyCandidates.length)]!
const selector = ref('.destacado')
const preview = ref<HTMLElement | null>(null)

const matchingIds = computed<string[] | null>(() => {
  if (!preview.value || !selector.value.trim()) return []
  try {
    return Array.from(preview.value.querySelectorAll<HTMLElement>(selector.value))
      .map((element) => element.dataset.demoId)
      .filter((id): id is string => Boolean(id))
  } catch (error) {
    if (error instanceof DOMException) return null
    throw error
  }
})

const resultMessage = computed(() => {
  if (matchingIds.value === null) return t('home.selectorInvalid')
  if (matchingIds.value.length === 0) return t('home.selectorNoMatches')
  return t('home.selectorMatches', { count: matchingIds.value.length })
})

const learningPaths = [
  { title: 'nav.theory', description: 'home.demoCardOne', to: '/teoria', icon: CodeXml },
  { title: 'nav.catalog', description: 'home.demoCardTwo', to: '/catalogo', icon: Sparkles },
  { title: 'nav.challenges', description: 'home.demoCardThree', to: '/retos', icon: FlaskConical },
] as const
</script>

<template>
  <div class="home-page">
    <section class="home-progress-strip" aria-label="Tu práctica diaria">
      <span
        ><strong>{{ learning.level }}</strong> · {{ learning.data.xp }} XP ·
        {{ learning.completed }}/62 retos</span
      >
      <span
        >Objetivo diario: {{ Math.min(learning.todayCount, learning.data.settings.dailyGoal) }}/{{
          learning.data.settings.dailyGoal
        }}</span
      >
      <RouterLink :to="`/retos/${dailyChallenge.id}`"
        >Reto del día: {{ dailyChallenge.title }} →</RouterLink
      >
    </section>
    <WelcomeTour />
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="eyebrow-mark" aria-hidden="true"></span>{{ t('home.eyebrow') }}
        </p>
        <h1 id="page-title" tabindex="-1">{{ t('home.title') }}</h1>
        <p class="hero-intro">{{ t('home.intro') }}</p>
        <div class="hero-actions">
          <RouterLink class="button button-primary" to="/teoria">
            {{ t('home.start') }} <ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
          <RouterLink class="text-link" to="/laboratorio">
            {{ t('home.explore') }} <ArrowDown :size="16" aria-hidden="true" />
          </RouterLink>
        </div>
        <div class="hero-benefits">
          <span><Check :size="16" aria-hidden="true" />{{ t('home.goalText') }}</span>
          <span><Check :size="16" aria-hidden="true" />{{ t('home.progressText') }}</span>
        </div>
      </div>

      <section class="demo-card" :aria-label="t('home.demoTitle')">
        <div class="demo-card-heading">
          <div>
            <p class="demo-kicker">{{ t('home.sampleLabel') }}</p>
            <h2>{{ t('home.demoTitle') }}</h2>
          </div>
          <span class="live-indicator"><span aria-hidden="true"></span> CSS</span>
        </div>
        <p class="demo-description">{{ t('home.demoDescription') }}</p>
        <label class="selector-field" for="selector-demo">
          <span aria-hidden="true" class="prompt-symbol">&gt;</span>
          <span class="sr-only">{{ t('home.selectorLabel') }}</span>
          <input
            id="selector-demo"
            v-model="selector"
            maxlength="80"
            autocomplete="off"
            spellcheck="false"
            :placeholder="t('home.selectorPlaceholder')"
          />
        </label>
        <div ref="preview" class="demo-preview" :aria-label="t('home.sampleLabel')">
          <div class="preview-line">
            <span class="preview-dot"></span><span class="preview-dot"></span
            ><span class="preview-dot"></span>
          </div>
          <div class="preview-content">
            <p class="preview-label">{{ t('home.sampleLabel') }}</p>
            <article
              id="tarjeta-1"
              data-demo-id="one"
              class="sample-tile"
              :class="{ 'is-matched': matchingIds?.includes('one') }"
            >
              <span class="tile-icon" aria-hidden="true"><Sparkles :size="17" /></span>
              <span>{{ t('home.sampleCard') }}</span>
              <span class="tile-code">.destacado</span>
            </article>
            <article
              id="tarjeta-2"
              data-demo-id="two"
              class="sample-tile"
              :class="{ 'is-matched': matchingIds?.includes('two') }"
            >
              <span class="tile-icon tile-icon-muted" aria-hidden="true"
                ><CodeXml :size="17"
              /></span>
              <span>{{ t('home.sampleCardText') }}</span>
              <span class="tile-code">article</span>
            </article>
          </div>
        </div>
        <p class="match-result" role="status" aria-live="polite">
          <span class="match-count" aria-hidden="true">{{ matchingIds?.length ?? '!' }}</span>
          {{ resultMessage }}
        </p>
      </section>
    </section>

    <section class="learning-section" aria-labelledby="learning-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ t('home.goal') }}</p>
          <h2 id="learning-title">{{ t('home.cardsTitle') }}</h2>
        </div>
        <p>{{ t('home.cardsIntro') }}</p>
      </div>
      <div class="learning-grid">
        <RouterLink
          v-for="(path, index) in learningPaths"
          :key="path.to"
          class="learning-card"
          :class="`learning-card-${index + 1}`"
          :to="path.to"
        >
          <span class="learning-icon"
            ><component :is="path.icon" :size="20" aria-hidden="true"
          /></span>
          <span class="learning-card-title">{{ t(path.title) }}</span>
          <span class="learning-card-description">{{ t(path.description) }}</span>
          <span class="learning-card-link"
            >{{ t('home.cardCta') }} <ArrowRight :size="15" aria-hidden="true"
          /></span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
