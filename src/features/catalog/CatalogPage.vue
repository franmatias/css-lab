<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { entries, moduleNames } from '../../../packages/content/src/catalog'
import { useLearningStore } from '@/shared/model/learningStore'
import SelectorDemo from '@/shared/ui/SelectorDemo.vue'
import { useI18n } from 'vue-i18n'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
import { catalogMetadata } from './catalogMetadata'
const { t } = useI18n()
const route = useRoute()
const store = useLearningStore()
const query = ref('')
const category = ref('')
const favoritesOnly = ref(false)
const difficulty = ref('')
const compatibility = ref('')
const sidebarOpen = ref(true)
function clearFilters() {
  query.value = ''
  category.value = ''
  favoritesOnly.value = false
  difficulty.value = ''
  compatibility.value = ''
}
const entry = computed(() => entries.find((e) => e.id === route.params.slug))
const entryMetadata = computed(() => (entry.value ? catalogMetadata(entry.value) : null))
const categoryEntries = computed(() =>
  entries.filter((item) => item.module === entry.value?.module),
)
const filtered = computed(() =>
  entries.filter(
    (e) =>
      `${e.name} ${e.syntax} ${e.description}`.toLowerCase().includes(query.value.toLowerCase()) &&
      (!category.value || e.module === Number(category.value)) &&
      (!difficulty.value || catalogMetadata(e).difficulty === difficulty.value) &&
      (!compatibility.value || catalogMetadata(e).compatibility === compatibility.value) &&
      (!favoritesOnly.value || store.data.favorites.includes(e.id)),
  ),
)
watch(
  entry,
  (value) => {
    if (value) store.visit(value.id)
  },
  { immediate: true },
)
</script>
<template>
  <section class="learning-page catalog-page">
    <p class="eyebrow">{{ t('catalog.pocket') }}</p>
    <h1 id="page-title" tabindex="-1">{{ entry?.name ?? t('catalog.title') }}</h1>
    <RouterLink class="text-link" to="/ejemplos">{{ t('examples.discover') }}</RouterLink>
    <template v-if="entry">
      <RouterLink class="text-link" to="/catalogo">← {{ t('catalog.allCards') }}</RouterLink>
      <div
        class="learning-layout catalog-detail-layout"
        :class="{ 'sidebar-collapsed': !sidebarOpen }"
      >
        <CollapsibleSidebar
          v-model="sidebarOpen"
          class="learning-sidebar"
          :title="t('catalog.categoryCards')"
        >
          <p class="catalog-sidebar-category">{{ moduleNames[entry.module] }}</p>
          <RouterLink
            v-for="item in categoryEntries"
            :key="item.id"
            :to="`/catalogo/${item.id}`"
            :class="{ selected: item.id === entry.id }"
          >
            <span class="module-number">{{
              catalogMetadata(item).difficulty.slice(0, 1).toUpperCase()
            }}</span>
            <span
              ><code>{{ item.syntax }}</code
              ><small>{{ item.name }}</small></span
            >
          </RouterLink>
        </CollapsibleSidebar>
        <article class="learning-card catalog-detail">
          <p class="eyebrow">{{ moduleNames[entry.module] }}</p>
          <h2>
            <code>{{ entry.syntax }}</code>
          </h2>
          <p>{{ entry.description }}</p>
          <p>{{ entry.detail }}</p>
          <SelectorDemo :key="entry.id" :entry="entry" />
          <h3>{{ t('catalog.commonErrors') }}</h3>
          <p>{{ entry.mistake }}</p>
          <div v-if="entryMetadata" class="catalog-meta">
            <span
              >{{ t('catalog.difficulty') }}: {{ t(`catalog.${entryMetadata.difficulty}`) }}</span
            >
            <span
              >{{ t('catalog.compatibility') }}:
              {{ t(`catalog.${entryMetadata.compatibility}`) }}</span
            >
          </div>
          <p>{{ entryMetadata?.compatibilityNote }}</p>
          <a
            class="text-link"
            :href="`https://developer.mozilla.org/es/docs/Web/CSS/${entry.kind === 'cascade' ? 'CSS_cascade' : 'CSS_selectors'}`"
            target="_blank"
            rel="noopener noreferrer"
            >Consultar MDN ↗</a
          >
          <button
            class="button button-secondary"
            :aria-pressed="store.data.favorites.includes(entry.id)"
            @click="store.favorite(entry.id)"
          >
            {{
              store.data.favorites.includes(entry.id)
                ? '★ Guardado en favoritos'
                : '☆ Guardar favorito'
            }}
          </button>
        </article>
      </div>
    </template>
    <template v-else>
      <p class="section-intro">
        {{ entries.length }} fichas en {{ moduleNames.length - 1 }} categorías. Busca, prueba y
        guarda los selectores y conceptos que más utilices.
      </p>
      <div class="filter-bar">
        <label
          >Buscar una ficha<input
            v-model="query"
            type="search"
            placeholder="Prueba :has, atributo, hijo…"
        /></label>
        <label
          >Categoría<select v-model="category">
            <option value="">Todas</option>
            <option v-for="(name, index) in moduleNames.slice(1)" :key="name" :value="index + 1">
              {{ name }}
            </option>
          </select></label
        >
        <label class="check-option"
          ><input v-model="favoritesOnly" type="checkbox" />Solo favoritos</label
        >
        <label
          >{{ t('catalog.difficulty')
          }}<select v-model="difficulty">
            <option value="">{{ t('catalog.all') }}</option>
            <option value="basic">{{ t('catalog.basic') }}</option>
            <option value="intermediate">{{ t('catalog.intermediate') }}</option>
            <option value="advanced">{{ t('catalog.advanced') }}</option>
          </select></label
        >
        <label
          >{{ t('catalog.compatibility')
          }}<select v-model="compatibility">
            <option value="">{{ t('catalog.all') }}</option>
            <option value="baseline">{{ t('catalog.baseline') }}</option>
            <option value="modern">{{ t('catalog.modern') }}</option>
            <option value="recent">{{ t('catalog.recent') }}</option>
          </select></label
        >
      </div>
      <p aria-live="polite">{{ filtered.length }} fichas encontradas</p>
      <div class="learning-grid catalog-grid">
        <article v-for="item in filtered" :key="item.id" class="learning-card">
          <p class="eyebrow">M{{ item.module }} · {{ moduleNames[item.module] }}</p>
          <h2>
            <RouterLink :to="`/catalogo/${item.id}`"
              ><code>{{ item.syntax }}</code></RouterLink
            >
          </h2>
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="catalog-meta">
            <span>{{ t(`catalog.${catalogMetadata(item).difficulty}`) }}</span>
            <span>{{ t(`catalog.${catalogMetadata(item).compatibility}`) }}</span>
          </div>
          <div class="card-actions">
            <RouterLink class="text-link" :to="`/catalogo/${item.id}`">Ver en acción →</RouterLink
            ><button
              class="favorite-button"
              :aria-label="`Favorito: ${item.name}`"
              :aria-pressed="store.data.favorites.includes(item.id)"
              @click="store.favorite(item.id)"
            >
              {{ store.data.favorites.includes(item.id) ? '★' : '☆' }}
            </button>
          </div>
        </article>
      </div>
      <div v-if="!filtered.length" class="learning-card">
        <h2>No hay coincidencias</h2>
        <p>Prueba un término más corto o desactiva los filtros.</p>
        <button class="button button-secondary" @click="clearFilters">Ver todas las fichas</button>
      </div>
    </template>
  </section>
</template>
<style>
.catalog-grid article {
  min-width: 0;
}
.catalog-grid code,
.catalog-detail h2 code {
  overflow-wrap: anywhere;
  white-space: normal;
}
.catalog-page .filter-bar > label {
  min-width: 0;
}
.catalog-page .filter-bar select,
.catalog-page .filter-bar input {
  min-width: 0;
  max-width: 100%;
}
.catalog-page > .text-link {
  display: inline-block;
  margin: 0.35rem 1rem 0.35rem 0;
}
.catalog-detail-layout {
  margin-top: 1rem;
}
.catalog-sidebar-category {
  margin: 0.25rem 0.5rem 0.7rem;
  color: var(--text-muted);
  font-size: 0.75rem;
}
.catalog-detail-layout .collapsible-sidebar-body a {
  align-items: start;
}
.catalog-detail-layout .collapsible-sidebar-body a > span:last-child {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}
.catalog-detail-layout .collapsible-sidebar-body code {
  overflow-wrap: anywhere;
}
.catalog-detail-layout .collapsible-sidebar-body small {
  color: var(--text-muted);
}
.catalog-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0.7rem 0;
}
.catalog-meta span {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 0.7rem;
  text-transform: capitalize;
}
</style>
