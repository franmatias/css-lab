<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Award } from '@lucide/vue'
import { badgeDefinitions, challenges } from '../../../packages/content/src'
import { badgeFamily, badgeProgress } from '@/domain/badges'
import { useLearningStore } from '@/shared/model/learningStore'
const { t } = useI18n()
const store = useLearningStore()
const filter = ref<'all' | 'unlocked' | 'locked'>('all')
const family = ref('')
const families = [...new Set(badgeDefinitions.map((badge) => badgeFamily(badge.metric)))]
const filters = ['all', 'unlocked', 'locked'] as const
const items = computed(() =>
  badgeDefinitions
    .filter(
      (badge) =>
        (!family.value || badgeFamily(badge.metric) === family.value) &&
        (filter.value === 'all' ||
          Boolean(store.data.badges[badge.id]) === (filter.value === 'unlocked')),
    )
    .map((badge) => ({ ...badge, progress: badgeProgress(badge, store.data, challenges) })),
)
onMounted(() => store.refreshBadges())
function date(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('es-ES')
}
</script>
<template>
  <section class="learning-page badges-page">
    <p class="eyebrow">{{ t('badges.eyebrow') }}</p>
    <h1 id="page-title" tabindex="-1">{{ t('badges.title') }}</h1>
    <p class="section-intro">{{ t('badges.intro') }}</p>
    <div class="achievement-overview learning-card">
      <div class="achievement-medal" aria-hidden="true"><Award :size="42" /></div>
      <div>
        <strong>{{
          t('badges.obtained', {
            count: Object.keys(store.data.badges).length,
            total: badgeDefinitions.length,
          })
        }}</strong>
        <p>
          {{ store.level }} · {{ store.data.xp }} XP ·
          {{ t('game.progress', { count: store.gamesCompleted, total: 12 }) }}
        </p>
      </div>
      <RouterLink class="button button-primary" to="/juego">{{ t('badges.play') }}</RouterLink>
    </div>
    <div class="filter-bar">
      <div class="badge-filter-buttons" role="group" :aria-label="t('badges.title')">
        <button
          v-for="item in filters"
          :key="item"
          class="filter-chip"
          :aria-pressed="filter === item"
          @click="filter = item"
        >
          {{ t(`badges.${item}`) }}
        </button>
      </div>
      <label
        >{{ t('badges.family')
        }}<select v-model="family">
          <option value="">{{ t('badges.allFamilies') }}</option>
          <option v-for="item in families" :key="item">{{ item }}</option>
        </select></label
      >
    </div>
    <div class="achievements-grid">
      <article
        v-for="badge in items"
        :key="badge.id"
        class="learning-card achievement-card"
        :class="{ unlocked: Boolean(store.data.badges[badge.id]) }"
      >
        <div class="achievement-card-top">
          <span class="achievement-icon" aria-hidden="true"><Award :size="30" /></span
          ><span class="eyebrow">{{ badgeFamily(badge.metric) }}</span
          ><span class="achievement-state" aria-hidden="true">{{
            store.data.badges[badge.id] ? '✓' : '◇'
          }}</span>
        </div>
        <h2>{{ badge.name }}</h2>
        <p>{{ badge.description }}</p>
        <progress
          :value="store.data.badges[badge.id] ? badge.progress.target : badge.progress.current"
          :max="badge.progress.target"
          :aria-label="`${badge.name}: ${badge.progress.current} / ${badge.progress.target}`"
        ></progress>
        <p class="achievement-count">
          {{
            store.data.badges[badge.id]
              ? t('badges.earned', { date: date(store.data.badges[badge.id]!) })
              : t('badges.progress', badge.progress)
          }}
        </p>
      </article>
    </div>
    <div v-if="!items.length" class="learning-card">
      <h2>{{ t('badges.empty') }}</h2>
      <p>{{ t('badges.first') }}</p>
      <RouterLink class="text-link" to="/juego">{{ t('badges.play') }}</RouterLink>
    </div>
  </section>
</template>
<style>
.achievement-overview {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 2rem;
}
.achievement-overview p {
  margin: 0.4rem 0 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}
.achievement-overview .button {
  margin-left: auto;
}
.achievement-medal {
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 24px;
  color: var(--primary);
  border: 1px solid var(--primary);
  background: color-mix(in srgb, var(--primary) 9%, var(--surface));
}
.badge-filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.badge-filter-buttons button {
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
}
.badge-filter-buttons [aria-pressed='true'] {
  background: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
.achievement-card {
  box-shadow: none;
}
.achievement-card.unlocked {
  border-color: var(--primary);
}
.achievement-card p {
  color: var(--text-muted);
  font-size: 0.85rem;
}
.achievement-card-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.achievement-card-top .eyebrow {
  font-size: 0.64rem;
}
.achievement-icon {
  color: var(--text-muted);
  background: var(--surface-2);
  padding: 0.6rem;
  border-radius: 12px;
}
.unlocked .achievement-icon {
  color: var(--primary);
}
.achievement-state {
  margin-left: auto;
  color: var(--primary);
  font-size: 1.3rem;
}
.achievement-count {
  margin-bottom: 0;
  font-size: 0.75rem !important;
}
@media (max-width: 900px) {
  .achievements-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  .achievement-overview {
    flex-wrap: wrap;
  }
  .achievement-overview .button {
    margin: 0;
    width: 100%;
  }
  .achievement-medal {
    width: 54px;
    height: 54px;
    border-radius: 15px;
  }
}
</style>
