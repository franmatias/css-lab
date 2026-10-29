<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowLeft, SearchX } from '@lucide/vue'

const { t } = useI18n()
</script>

<template>
  <section class="not-found-page" aria-labelledby="page-title">
    <span class="not-found-icon" aria-hidden="true"><SearchX :size="34" /></span>
    <p class="eyebrow">404</p>
    <h1 id="page-title" tabindex="-1">{{ t('notFound.title') }}</h1>
    <p>{{ t('notFound.description') }}</p>
    <RouterLink class="button button-primary" to="/">
      <ArrowLeft :size="17" aria-hidden="true" />{{ t('notFound.backHome') }}
    </RouterLink>
  </section>
</template>
