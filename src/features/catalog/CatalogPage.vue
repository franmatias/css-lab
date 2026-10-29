<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { entries, moduleNames } from '../../../packages/content/src'
import { useLearningStore } from '@/shared/model/learningStore'
import SelectorDemo from '@/shared/ui/SelectorDemo.vue'
const route = useRoute()
const store = useLearningStore()
const query = ref('')
const category = ref('')
const favoritesOnly = ref(false)
function clearFilters() {
  query.value = ''
  category.value = ''
  favoritesOnly.value = false
}
const entry = computed(() => entries.find((e) => e.id === route.params.slug))
const filtered = computed(() =>
  entries.filter(
    (e) =>
      `${e.name} ${e.syntax} ${e.description}`.toLowerCase().includes(query.value.toLowerCase()) &&
      (!category.value || e.module === Number(category.value)) &&
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
  <section class="learning-page">
    <p class="eyebrow">Tu referencia de bolsillo</p>
    <h1 id="page-title" tabindex="-1">{{ entry?.name ?? 'Catálogo' }}</h1>
    <template v-if="entry">
      <RouterLink class="text-link" to="/catalogo">← Todas las fichas</RouterLink>
      <article class="learning-card catalog-detail">
        <p class="eyebrow">{{ moduleNames[entry.module] }}</p>
        <h2>
          <code>{{ entry.syntax }}</code>
        </h2>
        <p>{{ entry.description }}</p>
        <p>{{ entry.detail }}</p>
        <pre><code>{{ entry.html }}</code></pre>
        <SelectorDemo :entry="entry" />
        <h3>Errores frecuentes</h3>
        <p>{{ entry.mistake }}</p>
        <p>
          Compatibilidad: navegadores modernos. :has() requiere Chrome/Edge 105+, Safari 15.4+ o
          Firefox 121+.
        </p>
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
    </template>
    <template v-else>
      <p class="section-intro">
        46 selectores y 5 conceptos de cascada. Busca, prueba y guarda los que más utilices.
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
