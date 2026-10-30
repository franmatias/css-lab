<script setup lang="ts">
import { computed, ref, watch, useId } from 'vue'
import { formatCode } from '@/features/lab/model/formatCode'
import type { Entry } from '../../../packages/content/src'
import { resolveSelector } from '@/domain/challenges'
import {
  sanitizeLabHtml,
  createPreviewDocument,
  evaluateSelector,
} from '@/features/lab/model/selectorEvaluator'
const props = defineProps<{ entry: Entry }>()
const selector = ref(props.entry.selector)
const id = useId()
const formattedHtml = ref(props.entry.html)
watch(
  () => props.entry,
  async (entry) => {
    selector.value = entry.selector
    formattedHtml.value = entry.html
    const formatted = await formatCode(entry.html, 'html', { useTabs: false, tabWidth: 2 })
    if (props.entry === entry) formattedHtml.value = formatted
  },
  { immediate: true },
)
const result = computed(() => {
  try {
    const resolved = resolveSelector(selector.value)
    return evaluateSelector({
      html: sanitizeLabHtml(props.entry.html),
      css: '',
      selector: resolved.selector,
    })
  } catch {
    return evaluateSelector({ html: props.entry.html, css: '', selector: ':not(' })
  }
})
const srcdoc = computed(() =>
  createPreviewDocument(
    result.value,
    'body{font:16px/1.6 system-ui;padding:16px;color:#1a1b2e;background:#fff} p,li,button,input{margin:8px;padding:8px}',
  ),
)
</script>
<template>
  <div class="selector-demo">
    <section class="selector-demo-source">
      <h3>Código HTML</h3>
      <pre tabindex="0" aria-label="Código HTML del ejemplo"><code>{{ formattedHtml }}</code></pre>
    </section>
    <div class="selector-demo-controls">
      <label :for="id">Selector editable</label>
      <input :id="id" v-model="selector" maxlength="160" spellcheck="false" autocomplete="off" />
      <p aria-live="polite">
        {{
          result.error
            ? 'Revisa la sintaxis del selector.'
            : `${result.matchedElementIds.length} elementos coinciden`
        }}
        · Especificidad:
        {{
          result.specificity
            ? `${result.specificity.a}, ${result.specificity.b}, ${result.specificity.c}`
            : '—'
        }}
      </p>
      <p v-if="entry.kind === 'state'" class="muted">
        Estado simulado: el nodo con la clase sim-… representa la interacción indicada.
      </p>
      <p v-if="entry.kind === 'pseudo'" class="muted">
        El contorno marca los elementos de origen del pseudoelemento.
      </p>
      <iframe
        :srcdoc="srcdoc"
        :title="`Ejemplo de ${entry.name}`"
        sandbox=""
        referrerpolicy="no-referrer"
      />
    </div>
  </div>
</template>
<style>
.selector-demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}
.selector-demo-source,
.selector-demo-controls {
  min-width: 0;
}
.selector-demo-source h3 {
  margin: 0 0 0.7rem;
  font-size: 0.9rem;
}
.selector-demo-source pre {
  margin-top: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 460px;
  overflow: auto;
}
.selector-demo-controls label {
  display: block;
  margin-bottom: 0.7rem;
  font-weight: 600;
  font-size: 0.9rem;
}
.selector-demo-controls input {
  width: 100%;
  min-width: 0;
}
.lesson-ideas {
  list-style: disc;
  padding-inline-start: 1.4rem;
}
.lesson-ideas li {
  padding-inline-start: 0.3rem;
  margin-block: 0.8rem;
}
@media (max-width: 700px) {
  .selector-demo {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
