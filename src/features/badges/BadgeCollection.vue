<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { badgeDefinitions, challenges } from '../../../packages/content/src'
import { badgeFamily, badgeProgress, type BadgeDefinition } from '@/domain/badges'
import { useLearningStore } from '@/shared/model/learningStore'
import BadgeMedal from '@/shared/ui/BadgeMedal.vue'
import BadgeDetail from './BadgeDetail.vue'
import { badgeDestination, medalArt, medalTiers } from './badgeArt'
import './badges.css'
const { t } = useI18n()
const route = useRoute()
const store = useLearningStore()
const filter = ref<'all' | 'unlocked' | 'locked'>('all')
const family = ref('')
const sort = ref('collection')
const selected = ref<BadgeDefinition | null>(null)
const families = [...new Set(badgeDefinitions.map((badge) => badgeFamily(badge.metric)))]
const filters = ['all', 'unlocked', 'locked'] as const
const allItems = computed(() =>
  badgeDefinitions.map((badge, index) => ({
    ...badge,
    number: String(index + 1).padStart(2, '0'),
    progress: badgeProgress(badge, store.data, challenges),
    art: medalArt(badge),
  })),
)
const earned = computed(() => allItems.value.filter((badge) => store.data.badges[badge.id]))
const latest = computed(
  () =>
    [...earned.value].sort(
      (a, b) => Date.parse(store.data.badges[b.id]!) - Date.parse(store.data.badges[a.id]!),
    )[0],
)
const featured = computed(
  () => latest.value ?? allItems.value.find((badge) => badge.id === 'galaxia-completa')!,
)
const next = computed(
  () =>
    allItems.value
      .filter((badge) => !store.data.badges[badge.id])
      .sort(
        (a, b) => b.progress.current / b.progress.target - a.progress.current / a.progress.target,
      )[0],
)
const items = computed(() => {
  const items = allItems.value.filter(
    (badge) =>
      (!family.value || badgeFamily(badge.metric) === family.value) &&
      (filter.value === 'all' ||
        Boolean(store.data.badges[badge.id]) === (filter.value === 'unlocked')),
  )
  if (sort.value === 'near')
    items.sort(
      (a, b) => b.progress.current / b.progress.target - a.progress.current / a.progress.target,
    )
  if (sort.value === 'recent')
    items.sort(
      (a, b) =>
        (Date.parse(store.data.badges[b.id] ?? '') || 0) -
        (Date.parse(store.data.badges[a.id] ?? '') || 0),
    )
  return items
})
onMounted(() => {
  store.refreshBadges()
  selected.value = badgeDefinitions.find((badge) => badge.id === route.query.medalla) ?? null
})
function date(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('es-ES')
}
</script>
<template>
  <section class="learning-page badges-page">
    <div class="badge-collection-hero">
      <div>
        <p class="eyebrow">Pequeños pasos. Grandes conquistas.</p>
        <h1 id="page-title" tabindex="-1">{{ t('badges.title') }}</h1>
        <p class="section-intro">
          Una colección que cuenta lo que ya sabes hacer. Elige tu próxima medalla y conviértela en
          parte de tu historia.
        </p>
        <div class="achievement-overview">
          <strong>{{
            t('badges.obtained', { count: earned.length, total: allItems.length })
          }}</strong
          ><span>{{ store.level }} · {{ store.data.xp }} XP</span
          ><progress
            :value="earned.length"
            :max="allItems.length"
            aria-label="Insignias de la colección conseguidas"
          /><span
            >{{ families.length }} colecciones ·
            {{ allItems.filter((b) => b.art.tier === 4).length }} medallas legendarias</span
          >
        </div>
      </div>
      <button class="featured-medal" @click="selected = featured">
        <span class="eyebrow">{{
          latest ? 'Tu última conquista' : 'Una conquista que te espera'
        }}</span
        ><BadgeMedal
          :badge="featured"
          :unlocked="Boolean(store.data.badges[featured.id])"
          :size="260"
        /><strong>{{ featured.name }}</strong
        ><span>{{ medalTiers[featured.art.tier] }} · Ver en grande ↗</span>
      </button>
    </div>
    <section v-if="next" class="next-medal">
      <BadgeMedal :badge="next" :size="106" />
      <div>
        <p class="eyebrow">Tu próxima conquista</p>
        <h2>{{ next.name }}</h2>
        <p>{{ next.description }}</p>
        <progress
          :value="next.progress.current"
          :max="next.progress.target"
          :aria-label="`Progreso hacia ${next.name}`"
        />
        <p>{{ next.progress.current }} de {{ next.progress.target }} · Cada paso cuenta</p>
      </div>
      <RouterLink class="button button-primary" :to="badgeDestination(next)"
        >Ir a por ella →</RouterLink
      >
    </section>
    <div class="filter-bar badge-collection-filters">
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
      ><label
        >Ordenar<select v-model="sort">
          <option value="collection">Por colección</option>
          <option value="near">Más cerca de conseguir</option>
          <option value="recent">Últimas conseguidas</option>
        </select></label
      >
    </div>
    <p class="collection-result-count" aria-live="polite">
      {{ items.length }} medallas en esta selección
    </p>
    <div class="achievements-grid">
      <article
        v-for="badge in items"
        :key="badge.id"
        class="learning-card achievement-card"
        :class="[
          `achievement-tier-${badge.art.tier}`,
          { unlocked: Boolean(store.data.badges[badge.id]) },
        ]"
      >
        <div class="achievement-card-top">
          <span class="eyebrow">{{ badgeFamily(badge.metric) }}</span
          ><span class="medal-edition">N.º {{ badge.number }}</span>
        </div>
        <button
          class="medal-art-button"
          :aria-label="`Ver insignia ${badge.name}`"
          @click="selected = badge"
        >
          <BadgeMedal
            :badge="badge"
            :unlocked="Boolean(store.data.badges[badge.id])"
            :size="188"
          /></button
        ><span class="medal-rarity"
          >{{ medalTiers[badge.art.tier] }}
          <span aria-hidden="true">{{ '✦'.repeat(badge.art.tier) }}</span></span
        >
        <h2>{{ badge.name }}</h2>
        <p class="achievement-condition">{{ badge.description }}</p>
        <progress
          :value="store.data.badges[badge.id] ? badge.progress.target : badge.progress.current"
          :max="badge.progress.target"
          :aria-label="`${badge.name}: ${badge.progress.current} / ${badge.progress.target}`"
        />
        <p class="achievement-count">
          {{
            store.data.badges[badge.id]
              ? t('badges.earned', { date: date(store.data.badges[badge.id]!) })
              : t('badges.progress', badge.progress)
          }}
        </p>
        <span class="achievement-status">{{
          store.data.badges[badge.id] ? '✓ En tu colección' : '◇ Por conquistar'
        }}</span>
      </article>
    </div>
    <div v-if="!items.length" class="learning-card">
      <h2>{{ t('badges.empty') }}</h2>
      <p>{{ t('badges.first') }}</p>
      <RouterLink class="text-link" to="/juego">{{ t('badges.play') }}</RouterLink>
    </div>
    <BadgeDetail :badge="selected" @close="selected = null" />
  </section>
</template>
