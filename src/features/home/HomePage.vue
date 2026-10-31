<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowDown, ArrowRight, Check, CodeXml, FlaskConical, Sparkles } from '@lucide/vue'
import { useLearningStore } from '@/shared/model/learningStore'
import { challenges, lessons, entries } from '../../../packages/content/src'
import { propertyIds, additionalTheoryIds } from '../../../packages/content/src/propertyProgress'
import { dailyIndex, localDate } from '@/domain/challenges'
import WelcomeTour from '@/shared/ui/WelcomeTour.vue'
import GameInvitation from '@/shared/ui/GameInvitation.vue'

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
  {
    title: 'nav.theory',
    description: `${lessons.length + additionalTheoryIds.length} lecciones con ideas clave, ejemplos editables y autoevaluación.`,
    to: '/teoria',
    icon: CodeXml,
  },
  {
    title: 'nav.catalog',
    description: `${entries.length} selectores para encontrar exactamente lo que quieres cambiar.`,
    to: '/catalogo',
    icon: Sparkles,
  },
  {
    title: 'nav.properties',
    description: `${propertyIds.length} retos de estilo: color, espacio, composición y movimiento.`,
    to: '/propiedades',
    icon: Sparkles,
  },
  {
    title: 'nav.design',
    description: 'Construye componentes y páginas paso a paso, con un mapa de objetivos.',
    to: '/talleres',
    icon: CodeXml,
  },
  {
    title: 'nav.game',
    description: 'Supera misiones de semántica, tablas, Flexbox, Grid y diseño responsive.',
    to: '/juego',
    icon: Sparkles,
  },
  {
    title: 'nav.lab',
    description: 'Tu espacio libre: escribe HTML y CSS, inspecciona el DOM y prueba tus ideas.',
    to: '/laboratorio',
    icon: FlaskConical,
  },
] as const
</script>

<template>
  <div class="home-page">
    <section class="home-progress-strip" aria-label="Tu práctica diaria">
      <span
        ><strong>{{ learning.level }}</strong> · {{ learning.data.xp }} XP ·
        {{ learning.completed }}/{{ challenges.length }} retos de selectores ·
        {{ learning.propertiesCompleted }}/{{ propertyIds.length }} de propiedades</span
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
              class="sample-tile destacado"
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

    <WelcomeTour />
    <section class="home-effects" aria-labelledby="effects-title">
      <div>
        <p class="eyebrow">Nuevas conquistas</p>
        <h2 id="effects-title">CSS con profundidad y movimiento</h2>
        <p>
          Eleva una tarjeta, suaviza un cambio y crea tu primera animación. Cada reto incluye
          objetivo, pista, teoría y comprobación.
        </p>
        <RouterLink class="button button-primary" to="/propiedades"
          >Explorar propiedades <ArrowRight :size="18" aria-hidden="true"
        /></RouterLink>
      </div>
      <div class="home-effects-links">
        <RouterLink to="/propiedades/sombra-caja"
          ><span aria-hidden="true">◒</span> Sombras y transparencias
          <ArrowRight :size="16" aria-hidden="true" /></RouterLink
        ><RouterLink to="/propiedades/transicion-color"
          ><span aria-hidden="true">↝</span> Transiciones
          <ArrowRight :size="16" aria-hidden="true" /></RouterLink
        ><RouterLink to="/propiedades/rotacion"
          ><span aria-hidden="true">◇</span> Transformaciones
          <ArrowRight :size="16" aria-hidden="true" /></RouterLink
        ><RouterLink to="/propiedades/animacion-pulso"
          ><span aria-hidden="true">✧</span> Animaciones <ArrowRight :size="16" aria-hidden="true"
        /></RouterLink>
      </div>
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
          <span class="learning-card-description">{{ path.description }}</span>
          <span class="learning-card-link"
            >{{ t('home.cardCta') }} <ArrowRight :size="15" aria-hidden="true"
          /></span>
        </RouterLink>
      </div>
    </section>
    <GameInvitation />
  </div>
</template>
<style>
.home-effects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: linear-gradient(130deg, var(--surface), var(--surface-2));
}
.home-effects h2 {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  line-height: 1.2;
}
.home-effects p {
  color: var(--text-muted);
}
.home-effects-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}
.home-effects-links a {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}
.home-effects-links a > span {
  font-size: 2rem;
  color: var(--primary);
}
.home-effects-links a:hover {
  border-color: var(--primary);
}
@media (max-width: 760px) {
  .home-effects {
    grid-template-columns: 1fr;
    padding: 1.25rem;
    gap: 1rem;
  }
  .home-effects-links {
    grid-template-columns: 1fr;
  }
  .home-effects-links a {
    min-height: 60px;
  }
}
</style>
