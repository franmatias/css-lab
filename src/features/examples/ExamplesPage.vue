<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { recipes } from '../../../packages/content/src/recipes'
import DesignInvitation from '@/shared/ui/DesignInvitation.vue'
import { evaluateSelector, createPreviewDocument } from '@/features/lab/model/selectorEvaluator'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const query = ref('')
const recipe = computed(() => recipes.find((recipe) => recipe.id === route.params.id))
const items = computed(() =>
  recipes.filter((recipe) =>
    `${recipe.title} ${recipe.selector} ${recipe.category}`
      .toLowerCase()
      .includes(query.value.toLowerCase()),
  ),
)
const preview = computed(() => {
  if (!recipe.value) return ''
  const evaluation = evaluateSelector({
    html: recipe.value.html,
    css: recipe.value.css,
    selector: '*',
  })
  return createPreviewDocument({ ...evaluation, matchedElementIds: [] }, recipe.value.css, {
    highlight: 'none',
    animations: false,
  })
})
async function openLab() {
  if (recipe.value)
    await router.push(
      `/laboratorio${await encodeSharedLabDraft({ html: recipe.value.html, css: recipe.value.css, selector: recipe.value.selector })}`,
    )
}
</script>
<template>
  <section class="learning-page recipes-page">
    <p class="eyebrow">{{ t('examples.eyebrow') }}</p>
    <h1 id="page-title" tabindex="-1">{{ recipe?.title ?? t('examples.title') }}</h1>
    <p class="section-intro">{{ recipe?.summary ?? t('examples.intro') }}</p>
    <template v-if="recipe"
      ><div class="card-actions">
        <RouterLink class="text-link" to="/ejemplos">← {{ t('examples.back') }}</RouterLink
        ><button class="button button-primary" @click="openLab">
          {{ t('examples.open') }} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div class="recipe-detail-grid">
        <article class="learning-card">
          <p class="eyebrow">{{ recipe.category }}</p>
          <h2>
            <code>{{ recipe.selector }}</code>
          </h2>
          <h3>{{ t('examples.explain') }}</h3>
          <p>{{ recipe.explanation }}</p>
          <h3>{{ t('examples.pitfall') }}</h3>
          <p>{{ recipe.pitfall }}</p>
          <a class="text-link" :href="recipe.source" target="_blank" rel="noopener noreferrer">{{
            t('examples.source')
          }}</a>
        </article>
        <section class="learning-card">
          <h2>{{ t('examples.preview') }}</h2>
          <p>{{ recipe.interaction }}</p>
          <iframe
            class="recipe-preview"
            :srcdoc="preview"
            :title="`${t('examples.preview')}: ${recipe.title}`"
            sandbox=""
            referrerpolicy="no-referrer"
          />
        </section>
      </div>
      <div class="recipe-detail-grid">
        <section class="learning-card">
          <h2>HTML</h2>
          <pre><code>{{ recipe.html }}</code></pre>
        </section>
        <section class="learning-card">
          <h2>CSS</h2>
          <pre><code>{{ recipe.css }}</code></pre>
        </section>
      </div>
    </template>
    <DesignInvitation v-if="!recipe" />
    <template v-if="!recipe"
      ><label class="recipe-search"
        >{{ t('examples.search')
        }}<input v-model="query" type="search" :placeholder="t('examples.placeholder')"
      /></label>
      <p aria-live="polite">{{ t('examples.count', { count: items.length }) }}</p>
      <div class="learning-grid recipe-grid">
        <article v-for="item in items" :key="item.id" class="learning-card">
          <span class="eyebrow">{{ item.category }}</span>
          <h2>
            <RouterLink :to="`/ejemplos/${item.id}`">{{ item.title }}</RouterLink>
          </h2>
          <pre class="recipe-selector"><code>{{ item.selector }}</code></pre>
          <p>{{ item.summary }}</p>
          <RouterLink class="text-link" :to="`/ejemplos/${item.id}`"
            >{{ t('examples.preview') }} →</RouterLink
          >
        </article>
      </div>
      <p v-if="!items.length">{{ t('examples.empty') }}</p></template
    >
  </section>
</template>
<style>
.recipe-search {
  display: grid;
  max-width: 500px;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.recipe-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 1rem;
}
.recipe-grid h2 {
  font-size: 1.15rem;
}
.recipe-grid p {
  color: var(--text-muted);
  font-size: 0.9rem;
}
.recipe-selector {
  color: var(--primary);
  font-size: 0.78rem !important;
}
.recipe-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.3rem;
  margin-top: 1.5rem;
}
.recipe-detail-grid h2 code {
  overflow-wrap: anywhere;
}
.learning-page .recipe-preview {
  min-height: 330px;
}
@media (max-width: 950px) {
  .recipe-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .recipe-grid,
  .recipe-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
