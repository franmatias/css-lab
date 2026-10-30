<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { BookOpenText, X } from '@lucide/vue'
import { quickReference } from '../../../packages/content/src/quickReference'
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const search = ref('')
const category = ref('')
const categories = [...new Set(quickReference.map((block) => block.category))]
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
const blocks = computed(() =>
  quickReference
    .filter((block) => !category.value || block.category === category.value)
    .map((block) => ({
      ...block,
      items: block.items.filter(([code, text]) =>
        normalize(`${block.title} ${code} ${text}`).includes(normalize(search.value.trim())),
      ),
    }))
    .filter((block) => block.items.length),
)
const count = computed(() => blocks.value.reduce((sum, block) => sum + block.items.length, 0))
onMounted(() => dialog.value?.showModal())
function close() {
  dialog.value?.close()
}
</script>
<template>
  <dialog
    ref="dialog"
    class="quick-guide"
    aria-labelledby="quick-guide-title"
    @close="emit('close')"
  >
    <header class="quick-guide-header">
      <div>
        <p class="eyebrow">TENLO A MANO · 1.º DAM</p>
        <h2 id="quick-guide-title">
          <BookOpenText :size="25" aria-hidden="true" />Guía rápida de CSS
        </h2>
      </div>
      <button class="theme-button" aria-label="Cerrar guía rápida" @click="close">
        <X :size="22" aria-hidden="true" />
      </button>
    </header>
    <div class="quick-guide-body">
      <p class="quick-guide-intro">
        Busca un selector, una propiedad o una técnica. Los ejemplos son una referencia: adapta el
        selector y los valores al HTML de tu ejercicio.
      </p>
      <div class="quick-guide-filters">
        <label
          >Buscar en la guía<input
            v-model="search"
            type="search"
            placeholder=":has, búho, clamp, border…" /></label
        ><label
          >Tema de referencia<select v-model="category">
            <option value="">Todos los temas</option>
            <option v-for="item in categories" :key="item">{{ item }}</option>
          </select></label
        >
      </div>
      <p class="quick-guide-count" role="status">
        {{ count }} {{ count === 1 ? 'referencia' : 'referencias' }} en {{ blocks.length }}
        {{ blocks.length === 1 ? 'bloque' : 'bloques' }}
      </p>
      <div class="quick-guide-grid">
        <section v-for="block in blocks" :key="block.title" class="quick-guide-card">
          <p class="eyebrow">{{ block.category }}</p>
          <h3>{{ block.title }}</h3>
          <dl>
            <div v-for="[code, text] in block.items" :key="code">
              <dt>
                <code>{{ code }}</code>
              </dt>
              <dd>{{ text }}</dd>
            </div>
          </dl>
        </section>
      </div>
      <p v-if="!blocks.length">No hay coincidencias. Prueba otra palabra o cambia el tema.</p>
      <footer class="quick-guide-footer">
        <p>Para practicar paso a paso o ampliar una idea:</p>
        <RouterLink class="text-link" to="/talleres" @click="close">Abrir talleres →</RouterLink
        ><RouterLink class="text-link" to="/teoria" @click="close">Ver teoría →</RouterLink
        ><RouterLink class="text-link" to="/laboratorio" @click="close"
          >Experimentar en el Laboratorio →</RouterLink
        >
      </footer>
    </div>
  </dialog>
</template>
<style>
.quick-guide {
  margin: auto;
  width: min(1120px, calc(100% - 2rem));
  max-width: calc(100% - 2rem);
  max-height: calc(100dvh - 2rem);
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  color: var(--text);
  background: var(--surface);
  box-shadow: 0 24px 100px #0005;
  overflow: hidden;
}
.quick-guide::backdrop {
  background: #080c20b8;
  backdrop-filter: blur(5px);
}
.quick-guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface-2);
}
.quick-guide-header h2 {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font:
    700 clamp(1.1rem, 3vw, 1.7rem)/1.2 'Space Grotesk Variable',
    sans-serif;
  margin: 0.35rem 0 0;
}
.quick-guide-header h2 svg {
  color: var(--primary);
  flex-shrink: 0;
}
.quick-guide-header .eyebrow {
  font-size: 0.65rem;
  margin: 0;
}
.quick-guide-header .theme-button {
  flex-shrink: 0;
}
.quick-guide-body {
  padding: 1.25rem 1.5rem;
  overflow: auto;
  max-height: calc(100dvh - 10rem);
  scrollbar-gutter: stable;
}
.quick-guide-intro {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}
.quick-guide-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.quick-guide-filters label {
  display: grid;
  flex: 1 1 12rem;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 0;
}
.quick-guide-filters label:first-child {
  flex: 2 1 18rem;
}
.quick-guide-filters input,
.quick-guide-filters select {
  width: 100%;
  min-height: 44px;
  min-width: 0;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  color: var(--text);
  background: var(--surface-2);
  font: inherit;
}
.quick-guide-count {
  margin: 1rem 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.quick-guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}
.quick-guide-card {
  min-width: 0;
  padding: 1.2rem;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: var(--surface-2);
}
.quick-guide-card .eyebrow {
  font-size: 0.65rem;
  margin: 0 0 0.5rem;
  color: var(--primary);
}
.quick-guide-card h3 {
  font:
    650 1.05rem/1.4 'Space Grotesk Variable',
    sans-serif;
  margin: 0 0 1rem;
}
.quick-guide-card dl {
  margin: 0;
  display: grid;
  gap: 0.8rem;
}
.quick-guide-card dt {
  margin: 0 0 0.2rem;
}
.quick-guide-card code {
  font:
    500 0.8rem/1.6 'JetBrains Mono Variable',
    monospace;
  color: var(--code-property);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.quick-guide-card dd {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.6;
}
.quick-guide-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--border);
  margin-top: 1.5rem;
  padding-top: 1rem;
}
.quick-guide-footer p {
  flex-basis: 100%;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
@media (max-width: 650px) {
  .quick-guide-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .quick-guide {
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }
  .quick-guide-header {
    padding: 1rem;
  }
  .quick-guide-body {
    padding: 1rem;
  }
  .quick-guide-card {
    padding: 1rem;
  }
}
</style>
