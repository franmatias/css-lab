<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
  <section class="design-invitation">
    <div>
      <h2>{{ t('design.entry') }}</h2>
      <p>{{ t('design.entryText') }}</p>
    </div>
    <RouterLink class="button button-primary" to="/talleres">{{ t('design.open') }}</RouterLink>
  </section>
</template>
<style scoped>
.design-invitation {
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
.design-invitation h2 {
  margin: 0;
  font-size: 1.15rem;
}
.design-invitation p {
  margin: 0.4rem 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.design-invitation .button {
  margin-left: auto;
}
@media (max-width: 600px) {
  .design-invitation .button {
    margin: 0;
  }
}
</style>
