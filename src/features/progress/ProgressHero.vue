<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Flame,
  Orbit,
  Table2,
  LayoutTemplate,
  MoveHorizontal,
  Grid2X2,
  MonitorSmartphone,
  ArrowUpRight,
} from '@lucide/vue'
import { gameLevels } from '../../../packages/content/src'
import { tableMissions } from '../../../packages/content/src/tableGame'
import { studioModes, studioMissions, studioNames } from '../../../packages/content/src/studioGames'
import { useLearningStore } from '@/shared/model/learningStore'
const store = useLearningStore()
const tiers = [
  { name: 'Aprendiz', min: 0, max: 300 },
  { name: 'Explorador', min: 300, max: 1000 },
  { name: 'Selector', min: 1000, max: 2500 },
  { name: 'Maestro de la cascada', min: 2500, max: 2500 },
]
const tier = computed(() => tiers.find((tier) => store.data.xp < tier.max) ?? tiers[3]!)
const levelIndex = computed(() => tiers.indexOf(tier.value) + 1)
const levelRatio = computed(() =>
  levelIndex.value === 4
    ? 100
    : Math.min(100, ((store.data.xp - tier.value.min) / (tier.value.max - tier.value.min)) * 100),
)
const dailyRatio = computed(() => Math.min(1, store.todayCount / store.data.settings.dailyGoal))
const icons = {
  semantica: LayoutTemplate,
  flexbox: MoveHorizontal,
  grid: Grid2X2,
  responsive: MonitorSmartphone,
}
const journeys = computed(() => [
  ...studioModes.map((mode) => ({
    id: mode,
    title: studioNames[mode],
    to: `/juego/${mode}`,
    completed: store.studioCompleted(mode),
    total: studioMissions.filter((m) => m.mode === mode).length,
    icon: icons[mode],
  })),
  {
    id: 'galaxia',
    title: 'Galaxia',
    to: '/juego/galaxia',
    completed: store.gamesCompleted,
    total: gameLevels.length,
    icon: Orbit,
  },
  {
    id: 'tablas',
    title: 'Tablas',
    to: '/juego/tablas',
    completed: store.tableGamesCompleted,
    total: tableMissions.length,
    icon: Table2,
  },
])
</script>
<template>
  <section class="progress-hero" aria-label="Tu nivel y objetivo diario">
    <div class="progress-hero-copy">
      <p class="eyebrow">Cada idea que practicas deja huella</p>
      <h2>{{ store.level }}</h2>
      <div class="progress-xp">
        <span class="stat-number">{{ store.data.xp }}</span
        ><span>XP acumulados</span>
      </div>
      <div class="progress-level-line">
        <span>Nivel {{ levelIndex }} de 4</span
        ><span>{{
          levelIndex === 4
            ? 'Tu nivel más alto'
            : `${tier.max - store.data.xp} XP para el siguiente nivel`
        }}</span>
      </div>
      <progress
        class="progress-level-meter"
        :value="levelRatio"
        max="100"
        aria-label="Avance del nivel"
      />
      <div class="progress-tier-markers">
        <span
          v-for="(item, index) in tiers"
          :key="item.name"
          :class="{ 'is-reached': index < levelIndex }"
          >{{ index + 1 }}<span class="sr-only"> · {{ item.name }}</span></span
        >
      </div>
      <p class="progress-streak">
        <Flame :size="19" aria-hidden="true" />{{ store.data.streak.current }}
        {{ store.data.streak.current === 1 ? 'día' : 'días' }} de racha · Tu mejor marca:
        {{ store.data.streak.best }}
      </p>
    </div>
    <div class="progress-daily">
      <div class="progress-goal-ring" :style="{ '--goal-fill': `${dailyRatio * 100}%` }">
        <div>
          <span
            >{{ Math.min(store.todayCount, store.data.settings.dailyGoal)
            }}<small>/{{ store.data.settings.dailyGoal }}</small></span
          >
          <p>{{ dailyRatio === 1 ? '¡Objetivo logrado!' : 'Tu objetivo de hoy' }}</p>
        </div>
      </div>
      <RouterLink class="button button-primary" to="/retos"
        >{{ dailyRatio === 1 ? 'Seguir explorando' : 'Dar el siguiente paso' }}
        <ArrowUpRight :size="17" aria-hidden="true"
      /></RouterLink>
    </div>
  </section>
  <section class="progress-game-journeys">
    <div class="progress-section-heading">
      <div>
        <p class="eyebrow">Seis caminos para seguir creciendo</p>
        <h2>Tu mapa de juegos</h2>
      </div>
      <span
        >{{ journeys.reduce((n, item) => n + item.completed, 0) }} /
        {{ journeys.reduce((n, item) => n + item.total, 0) }} misiones</span
      >
    </div>
    <div class="progress-journey-grid">
      <RouterLink
        v-for="item in journeys"
        :key="item.id"
        :to="item.to"
        class="progress-journey"
        :class="`journey-${item.id}`"
        ><component :is="item.icon" :size="28" aria-hidden="true" />
        <div>
          <h3>{{ item.title }}</h3>
          <span>{{ item.completed }} de {{ item.total }} completadas</span>
        </div>
        <ArrowUpRight class="journey-arrow" :size="18" aria-hidden="true" /><progress
          :value="item.completed"
          :max="item.total"
          :aria-label="`Avance en ${item.title}`"
      /></RouterLink>
    </div>
  </section>
</template>
