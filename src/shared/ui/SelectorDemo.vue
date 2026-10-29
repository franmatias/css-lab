<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Entry } from '../../../packages/content/src'
import { resolveSelector } from '@/domain/challenges'
import {
  sanitizeLabHtml,
  createPreviewDocument,
  evaluateSelector,
} from '@/features/lab/model/selectorEvaluator'
const props = defineProps<{ entry: Entry }>()
const selector = ref(props.entry.selector)
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
    <label :for="`demo-${entry.id}`">Selector editable</label>
    <input
      :id="`demo-${entry.id}`"
      v-model="selector"
      maxlength="160"
      spellcheck="false"
      autocomplete="off"
    />
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
</template>
