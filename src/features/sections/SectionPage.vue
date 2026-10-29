<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowRight, BookOpenCheck, CircleDashed } from '@lucide/vue'

const { t } = useI18n()
const route = useRoute()
const title = computed(() => t(route.meta.titleKey ?? 'nav.home'))
const description = computed(() => t(route.meta.descriptionKey ?? 'sections.nextUpText'))
const milestone = computed(() => route.meta.milestone ?? 0)
</script>

<template>
  <section class="section-page" aria-labelledby="page-title">
    <div class="section-page-top">
      <span class="section-illustration" aria-hidden="true">
        <BookOpenCheck :size="28" />
      </span>
      <p class="eyebrow">{{ t('home.eyebrow') }}</p>
    </div>
    <h1 id="page-title" tabindex="-1">{{ title }}</h1>
    <p class="section-intro">{{ description }}</p>
    <div class="milestone-card">
      <span class="milestone-icon" aria-hidden="true"><CircleDashed :size="20" /></span>
      <div>
        <p class="milestone-label">{{ t('sections.nextUp') }}</p>
        <p>{{ t('sections.milestone', { milestone }) }}</p>
        <p class="milestone-detail">{{ t('sections.nextUpText') }}</p>
      </div>
    </div>
    <RouterLink class="button button-secondary" to="/">
      {{ t('sections.backHome') }} <ArrowRight :size="17" aria-hidden="true" />
    </RouterLink>
  </section>
</template>
