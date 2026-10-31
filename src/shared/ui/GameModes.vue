<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { studioModes, studioNames } from '../../../packages/content/src/studioGames'
const route = useRoute()
</script>
<template>
  <nav class="game-modes" aria-label="Escenarios del juego">
    <RouterLink
      v-for="mode in studioModes"
      :key="mode"
      :to="`/juego/${mode}`"
      :aria-current="
        route.name === 'studio-game' && route.params.mode === mode ? 'page' : undefined
      "
      >{{ studioNames[mode] }} · 6 misiones</RouterLink
    >
    <RouterLink to="/juego/tablas" :aria-current="route.name === 'table-game' ? 'page' : undefined"
      >Tablas · 12 misiones</RouterLink
    >
    <RouterLink
      to="/juego/galaxia"
      :aria-current="['game', 'galaxy-home'].includes(String(route.name)) ? 'page' : undefined"
      >Galaxia · 12 misiones</RouterLink
    >
  </nav>
</template>
<style>
.game-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin: 1.3rem 0;
}
.game-modes a {
  padding: 0.7rem 1rem;
  border: 1px solid var(--border-strong);
  border-radius: 0.6rem;
  font-size: 0.9rem;
}
.game-modes a[aria-current] {
  color: var(--on-primary);
  background: var(--primary);
  border-color: var(--primary);
}
</style>
