<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import type { TheoryExample } from '../../../packages/content/src/practicalTheory'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import GameFrame from '@/features/game/GameFrame.vue'
import { formatCode } from '@/features/lab/model/formatCode'
import { createPreviewDocument, evaluateSelector } from '@/features/lab/model/selectorEvaluator'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
import '@/features/lab/lab.css'
const props = defineProps<{ example: TheoryExample }>()
const router = useRouter()
const html = ref(props.example.html)
const css = ref(props.example.css)
const rendered = ref({ html: html.value, css: css.value })
const width = ref('768')
const fit = ref(true)
const message = ref('')
const resetPending = ref(false)
const preparing = ref(true)
watch(
  () => props.example,
  async (example) => {
    preparing.value = true
    try {
      const [formattedHtml, formattedCss] = await Promise.all([
        formatCode(example.html, 'html', { useTabs: false, tabWidth: 2 }),
        formatCode(example.css, 'css', { useTabs: false, tabWidth: 2 }),
      ])
      if (props.example === example && html.value === example.html && css.value === example.css) {
        html.value = formattedHtml
        css.value = formattedCss
        rendered.value = { html: formattedHtml, css: formattedCss }
      }
    } finally {
      preparing.value = false
    }
  },
  { immediate: true },
)
const update = useDebounceFn(() => {
  rendered.value = { html: html.value, css: css.value }
}, 160)
watch([html, css], () => {
  message.value = ''
  void update()
})
const preview = computed(() => {
  const result = evaluateSelector({ ...rendered.value, selector: '*' })
  return createPreviewDocument({ ...result, matchedElementIds: [] }, rendered.value.css, {
    highlight: 'none',
    animations: false,
  })
})
async function format(language: 'html' | 'css') {
  const target = language === 'html' ? html : css
  const original = target.value
  try {
    const formatted = await formatCode(original, language, { useTabs: false, tabWidth: 2 })
    if (target.value === original) target.value = formatted
  } catch {
    message.value = 'No se pudo formatear. Revisa la sintaxis; se conserva tu código.'
  }
}
async function openLab() {
  await router.push(
    `/laboratorio${await encodeSharedLabDraft({ html: html.value, css: css.value, selector: props.example.selector })}`,
  )
}
async function reset() {
  const [newHtml, newCss] = await Promise.all([
    formatCode(props.example.html, 'html', { useTabs: false, tabWidth: 2 }),
    formatCode(props.example.css, 'css', { useTabs: false, tabWidth: 2 }),
  ])
  html.value = newHtml
  css.value = newCss
  resetPending.value = false
}
</script>
<template>
  <section class="theory-design-example" :aria-busy="preparing">
    <h2>{{ example.title }}</h2>
    <p>
      Edita un cambio cada vez y observa el resultado. Los cambios de este ejemplo son temporales;
      ábrelo en el Laboratorio para guardar tu trabajo.
    </p>
    <div class="theory-example-code">
      <section>
        <h3>Código HTML</h3>
        <div class="theory-code-editor">
          <CodeEditor
            v-model="html"
            language="html"
            :label="`HTML del ejemplo: ${example.title}`"
            :max-length="10000"
            @format="format('html')"
          />
        </div>
      </section>
      <section>
        <h3>Código CSS</h3>
        <div class="theory-code-editor">
          <CodeEditor
            v-model="css"
            language="css"
            :label="`CSS del ejemplo: ${example.title}`"
            :max-length="20000"
            @format="format('css')"
          />
        </div>
      </section>
    </div>
    <div class="theory-preview-controls">
      <label
        >Ancho del ejemplo<select v-model="width">
          <option value="375">375 px · Móvil</option>
          <option value="768">768 px · Tableta</option>
          <option value="1200">1200 px · Escritorio</option>
        </select></label
      ><label class="check-option"
        ><input v-model="fit" type="checkbox" />Ajustar la vista al panel</label
      ><button class="button button-secondary" @click="resetPending = !resetPending">
        Restaurar ejemplo</button
      ><button class="button button-primary" @click="openLab">
        Experimentar en el Laboratorio ↗
      </button>
    </div>
    <div v-if="resetPending" class="theory-reset">
      <p>¿Quieres sustituir tus cambios por el código inicial?</p>
      <button class="button button-secondary" @click="reset">Sí, restaurar el ejemplo</button
      ><button class="button button-secondary" @click="resetPending = false">Cancelar</button>
    </div>
    <p v-if="message" role="status">{{ message }}</p>
    <h3>Vista previa</h3>
    <GameFrame
      :document="preview"
      :width="width"
      :fit="fit"
      :title="`Vista de teoría: ${example.title}`"
    />
    <h3>Observa y experimenta</h3>
    <ol class="theory-experiment-steps">
      <li v-for="step in example.steps" :key="step">{{ step }}</li>
    </ol>
    <details>
      <summary>Error frecuente</summary>
      <p>{{ example.pitfall }}</p>
    </details>
  </section>
</template>
<style>
.theory-design-example {
  width: 100%;
  max-width: 100%;
  border-block: 1px solid var(--border);
  padding-block: 1.5rem;
  margin-block: 1.5rem;
  min-width: 0;
}
.theory-example-code {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.theory-example-code > section {
  min-width: 0;
}
.theory-example-code h3 {
  font-size: 0.95rem;
}
.theory-code-editor {
  height: 340px;
  border: 1px solid var(--border-strong);
  border-radius: 0.5rem;
  overflow: hidden;
}
.theory-code-editor .lab-editor-shell {
  height: 100%;
}
.theory-code-editor .lab-code-editor {
  height: 0;
  min-height: 0;
}
.theory-code-editor .cm-editor {
  min-height: 0 !important;
}
.theory-preview-controls {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
  margin-block: 1rem;
}
.theory-preview-controls > label:first-child {
  display: grid;
  gap: 0.4rem;
}
.theory-reset {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}
.theory-reset button {
  margin: 0.2rem;
}
.theory-experiment-steps {
  list-style: decimal;
  padding-inline-start: 1.5rem;
}
.theory-experiment-steps li {
  padding-inline-start: 0.3rem;
  margin: 0.7rem 0;
}
.theory-design-example summary {
  cursor: pointer;
}
@media (max-width: 700px) {
  .theory-example-code {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
