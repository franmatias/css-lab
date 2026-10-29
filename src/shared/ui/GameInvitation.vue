<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Orbit } from '@lucide/vue'
const { t } = useI18n()
</script>
<template>
  <section class="game-invitation">
    <Orbit :size="34" aria-hidden="true" />
    <div>
      <h2>{{ t('game.entry') }}</h2>
      <p>{{ t('game.entryText') }}</p>
    </div>
    <RouterLink class="button button-primary" to="/juego">{{ t('game.open') }}</RouterLink>
  </section>
</template>
<style>
.game-invitation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  padding: 1.4rem;
  border-radius: 14px;
  margin: 1.5rem 0;
}
.game-invitation > svg {
  color: var(--primary);
}
.game-invitation h2 {
  margin: 0;
  font-size: 1.15rem;
}
.game-invitation p {
  margin: 0.4rem 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.game-invitation .button {
  margin-left: auto;
}
@media (max-width: 600px) {
  .game-invitation .button {
    margin: 0;
    width: 100%;
  }
}
</style>
