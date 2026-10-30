<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <nav class="game-modes" aria-label="Escenarios del juego">
    <RouterLink to="/juego" :aria-current="route.name === 'game' ? 'page' : undefined"
      >Galaxia · 12 misiones</RouterLink
    ><RouterLink to="/juego/tablas" :aria-current="route.name === 'table-game' ? 'page' : undefined"
      >Tablas · 12 misiones</RouterLink
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
