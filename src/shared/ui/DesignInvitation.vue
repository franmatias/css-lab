<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
  <section class="game-invitation">
    <div>
      <h2>{{ t('design.entry') }}</h2>
      <p>{{ t('design.entryText') }}</p>
    </div>
    <RouterLink class="button button-primary" to="/diseno">{{ t('design.open') }}</RouterLink>
  </section>
</template>
