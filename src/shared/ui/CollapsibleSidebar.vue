<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
defineProps<{ title: string }>()
const expanded = defineModel<boolean>({ default: true })
const id = useId()
const { t } = useI18n()
</script>
<template>
  <aside class="collapsible-sidebar" :class="{ 'is-collapsed': !expanded }" :aria-label="title">
    <button
      class="sidebar-toggle"
      type="button"
      :aria-label="t(expanded ? 'panels.collapse' : 'panels.expand', { panel: title })"
      :aria-expanded="expanded"
      :aria-controls="id"
      @click="expanded = !expanded"
    >
      <span class="sidebar-title">{{ title }}</span
      ><span aria-hidden="true">{{ expanded ? '‹' : '›' }}</span>
    </button>
    <div v-show="expanded" :id="id" class="collapsible-sidebar-body"><slot /></div>
  </aside>
</template>
<style>
.collapsible-sidebar {
  position: sticky;
  top: 96px;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  overflow: hidden;
  align-self: start;
}
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: 48px;
  padding: 0.7rem;
  color: var(--primary);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--surface-2);
  border: 0;
  cursor: pointer;
}
.collapsible-sidebar.learning-sidebar {
  display: block;
}
.sidebar-toggle > span:last-child {
  font-size: 1.5rem;
  line-height: 1;
}
.collapsible-sidebar-body {
  padding: 0.5rem;
  max-height: calc(100dvh - 170px);
  overflow: auto;
}
.collapsible-sidebar.is-collapsed .sidebar-title {
  display: none;
}
.collapsible-sidebar.is-collapsed .sidebar-toggle {
  justify-content: center;
}
.learning-layout.sidebar-collapsed {
  grid-template-columns: 56px minmax(0, 1fr);
}
@media (max-width: 700px) {
  .collapsible-sidebar {
    position: static;
  }
  .learning-layout.sidebar-collapsed {
    grid-template-columns: 1fr;
  }
  .collapsible-sidebar.is-collapsed .sidebar-title {
    display: block;
  }
  .collapsible-sidebar.is-collapsed .sidebar-toggle {
    justify-content: space-between;
  }
  .collapsible-sidebar-body {
    max-height: 320px;
  }
}
</style>
