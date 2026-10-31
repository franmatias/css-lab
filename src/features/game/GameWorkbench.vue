<template>
  <div class="game-workbench">
    <div class="game-code-column"><slot name="source" /><slot name="editor" /></div>
    <div class="game-preview-column"><slot name="preview" /></div>
  </div>
</template>
<style>
.main-content:has(.game-guided-page) {
  width: min(100% - 3rem, 1600px);
  padding-top: 1.5rem;
}
.game-guided-page.learning-page {
  padding-top: 0.5rem;
}
.game-guided-page .learning-card {
  display: block;
  min-height: 0;
}
.game-guided-page .learning-card:hover {
  transform: none;
}
.game-guided-page .studio-layout,
.game-guided-page .table-game-layout {
  grid-template-columns: 260px minmax(0, 1fr);
}
.game-guided-page .sidebar-collapsed {
  grid-template-columns: 56px minmax(0, 1fr);
}
.game-guide {
  display: grid;
  gap: 1rem;
  min-width: 0;
  position: sticky;
  top: 96px;
  max-height: calc(100dvh - 110px);
  overflow: auto;
  padding: 2px;
  scrollbar-width: thin;
}
.game-guide .learning-card {
  padding: 1rem;
}
.game-guide .learning-card h2 {
  font-size: 1.1rem;
}
.game-guide .learning-card p {
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}
.game-guide .collapsible-sidebar {
  position: static;
}
.game-guide nav {
  counter-reset: mission;
}
.game-guide nav a {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  counter-increment: mission;
}
.game-guide nav a::before {
  content: counter(mission);
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  font-size: 0.8rem;
  background: var(--surface);
}
.game-guide nav a[aria-current]::before {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
}
.game-guide nav a.mission-done::before {
  content: '✓';
  background: var(--primary);
  color: var(--on-primary);
}
.game-guided-page .studio-content {
  display: block;
}
.game-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}
.game-code-column,
.game-preview-column {
  display: grid;
  gap: 1rem;
  min-width: 0;
}
.game-preview-column {
  position: sticky;
  top: 96px;
}
.game-code-panel,
.game-base-source {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}
.game-code-panel h2 {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.95rem;
  padding: 0.8rem 1rem;
  margin: 0;
  border-bottom: 1px solid var(--border);
}
.game-code-panel small {
  font-size: 0.7rem;
  color: var(--text-muted);
}
.game-html-editor {
  height: 250px;
  min-width: 0;
}
.game-html-editor .lab-editor-shell {
  height: 100%;
}
.game-html-editor .lab-code-editor {
  min-height: 0;
  height: 0;
}
.game-html-editor .cm-editor {
  min-height: 0 !important;
}
.game-base-source summary {
  padding: 0.8rem 1rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.game-size-buttons,
.game-preview-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.game-size-buttons button,
.game-preview-tabs button {
  min-height: 40px;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font:
    600 0.8rem 'Inter Variable',
    sans-serif;
  cursor: pointer;
}
.game-size-buttons button[aria-pressed='true'],
.game-preview-tabs button[aria-pressed='true'] {
  background: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}
.game-preview-column .studio-view-controls {
  margin: 0;
  font-size: 0.8rem;
  gap: 0.7rem;
}
.game-preview-column .studio-compare {
  display: block;
}
.game-preview-column .studio-compare .learning-card {
  padding: 1rem;
}
.game-preview-column .studio-compare h2 {
  margin: 0 0 0.5rem;
}
.game-preview-column .studio-compare p {
  min-height: 0;
}
.game-code-column .studio-answer {
  padding: 1rem;
}
.game-code-column .table-answer {
  position: static;
  display: grid;
  padding: 1rem;
}
.game-table-boundary {
  width: 100%;
  overflow: auto;
}
.game-guided-page .table-scroll {
  box-sizing: border-box;
}
@media (max-width: 1150px) {
  .game-guided-page .studio-layout,
  .game-guided-page .table-game-layout {
    grid-template-columns: 210px minmax(0, 1fr);
  }
  .game-workbench {
    grid-template-columns: minmax(0, 1fr);
  }
  .game-preview-column {
    position: static;
  }
}
@media (max-width: 760px) {
  .game-guided-page .studio-layout,
  .game-guided-page .table-game-layout,
  .game-guided-page .sidebar-collapsed {
    grid-template-columns: minmax(0, 1fr);
  }
  .game-guide {
    position: static;
    max-height: none;
    overflow: visible;
  }
}
</style>
