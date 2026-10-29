<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RotateCcw, Share2, ShieldCheck } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useLabStore } from './model/labStore'
import { createPreviewDocument } from './model/selectorEvaluator'
import { createDomTree } from './model/domTree'
import { decodeSharedLabDraft, encodeSharedLabDraft } from './model/shareLabDraft'
import CodeEditor from './CodeEditor.vue'
import DomTree from './DomTree.vue'
import CascadeInspector from '@/shared/ui/CascadeInspector.vue'
import { downloadFile } from '@/shared/utils/download'
import { useLearningStore } from '@/shared/model/learningStore'

type LabPanel = 'html' | 'css' | 'preview'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useLabStore()
const hoveredNode = ref<number | null>(null)
const learning = useLearningStore()
const template = ref('')
const history = ref<string[]>([])
const future = ref<string[]>([])
let changingHistory = false
watch(
  () => JSON.stringify(store.draft),
  (current, previous) => {
    if (!changingHistory) {
      history.value.push(previous)
      history.value = history.value.slice(-60)
      future.value = []
    }
    changingHistory = false
    if (JSON.parse(current).selector === '*') learning.explore('universal')
  },
)
function undoRedo(direction: 'undo' | 'redo') {
  const source = direction === 'undo' ? history : future
  const target = direction === 'undo' ? future : history
  const item = source.value.pop()
  if (!item) return
  target.value.push(JSON.stringify(store.draft))
  changingHistory = true
  store.replaceDraft(JSON.parse(item))
  editorRevision.value++
}
function loadTemplate() {
  const templates: Record<string, string> = {
    lista: '<ul class="menu"><li>Inicio</li><li>Más<ul><li>Submenú</li></ul></li></ul>',
    formulario:
      '<form><label>Correo <input type="email" required></label><button type="submit">Enviar</button></form>',
    tabla:
      '<table><caption>Práctica CSS</caption><thead><tr><th>Nombre</th><th>Curso</th></tr></thead><tbody><tr><td>Ana</td><td>DAM</td></tr></tbody></table>',
    tarjeta:
      '<article class="tarjeta"><h2>Una idea</h2><p class="destacado">Aprende seleccionando.</p><button>Explorar</button></article>',
    navegacion:
      '<nav aria-label="Ejemplo"><a href="#inicio">Inicio</a><a class="activo" href="#guia">Guía</a><a href="#ayuda">Ayuda</a></nav>',
  }
  const html = templates[template.value]
  if (html) {
    store.replaceDraft({
      html,
      css: 'body { font-family: system-ui; padding: 24px; }',
      selector: '*',
    })
    editorRevision.value++
  }
}
const copyMessage = ref('')
async function copyCode() {
  try {
    await navigator.clipboard.writeText(
      `<!doctype html><html lang="es"><head><style>${draft.value.css.replace(/</g, '\\3C ')}</style></head><body>${evaluation.value.sanitizedHtml}</body></html>`,
    )
    copyMessage.value = 'Código copiado.'
  } catch {
    copyMessage.value = 'No se pudo acceder al portapapeles. Usa Descargar HTML.'
  }
}
const { draft, evaluation, saveError } = storeToRefs(store)
const activePanel = ref<LabPanel>('html')
const editorRevision = ref(0)
const previewDocument = computed(() => {
  const preview = createPreviewDocument(evaluation.value, draft.value.css)
  if (hoveredNode.value === null) return preview
  const document = new DOMParser().parseFromString(preview, 'text/html')
  const original = new DOMParser().parseFromString(evaluation.value.sanitizedHtml, 'text/html')
  const originElement = original.querySelectorAll('*')[hoveredNode.value]
  if (!originElement) return preview
  const sourceBodyElements = Array.from(original.body.querySelectorAll('*'))
  const index = sourceBodyElements.indexOf(originElement)
  const target = index >= 0 ? document.body.querySelectorAll('*')[index] : document.body
  target?.setAttribute(
    'style',
    'outline: 3px solid #4f46e5 !important; outline-offset: 4px !important',
  )
  return `<!doctype html>${document.documentElement.outerHTML}`
})
const domTree = computed(() => createDomTree(evaluation.value))
const errorMessage = computed(() => {
  if (!evaluation.value.error) return ''
  return t(`lab.errors.${evaluation.value.error}`)
})
const specificity = computed(() => {
  const value = evaluation.value.specificity
  return value ? `${value.a}, ${value.b}, ${value.c}` : '—'
})
const shareStatus = ref<
  'loaded' | 'copied' | 'copy-failed' | 'invalid' | 'too-large' | 'error' | null
>(null)
const shareUrl = ref('')
const shareMessage = computed(() => {
  if (!shareStatus.value) return ''
  return t(`lab.share.${shareStatus.value}`)
})

const panels: { id: LabPanel; label: string }[] = [
  { id: 'html', label: 'lab.html' },
  { id: 'css', label: 'lab.css' },
  { id: 'preview', label: 'lab.preview' },
]

onMounted(async () => {
  const result = await decodeSharedLabDraft(route.hash)
  if (result.kind === 'valid') {
    store.replaceDraft(result.draft)
    editorRevision.value += 1
    shareUrl.value = window.location.href
    learning.explore('share')
    shareStatus.value = 'loaded'
  } else if (result.kind === 'invalid') {
    shareStatus.value = 'invalid'
  }
})

async function resetExample(): Promise<void> {
  store.reset()
  editorRevision.value += 1
  shareUrl.value = ''
  shareStatus.value = null

  if (route.hash.startsWith('#lab=')) {
    try {
      await router.replace({ path: route.path, query: route.query, hash: '' })
    } catch (error) {
      console.error('No se pudo limpiar el enlace compartido al restablecer el laboratorio.', error)
      shareStatus.value = 'error'
    }
  }
}

async function shareSolution(): Promise<void> {
  shareStatus.value = null
  try {
    const hash = await encodeSharedLabDraft(draft.value)
    await router.replace({ path: route.path, query: route.query, hash })
    shareUrl.value = window.location.href
  } catch (error) {
    if (error instanceof RangeError) {
      shareStatus.value = 'too-large'
      return
    }

    console.error('No se pudo preparar el enlace compartido.', error)
    shareStatus.value = 'error'
    return
  }

  try {
    await navigator.clipboard.writeText(shareUrl.value)
    shareStatus.value = 'copied'
  } catch (error) {
    console.warn('No se pudo copiar el enlace; puedes copiarlo desde el campo mostrado.', error)
    shareStatus.value = 'copy-failed'
  }
}

function selectShareUrl(event: FocusEvent): void {
  if (event.currentTarget instanceof HTMLInputElement) event.currentTarget.select()
}

function movePanel(direction: number): void {
  const currentIndex = panels.findIndex((panel) => panel.id === activePanel.value)
  const nextIndex = (currentIndex + direction + panels.length) % panels.length
  const nextPanel = panels[nextIndex]
  if (!nextPanel) return

  activePanel.value = nextPanel.id
  void nextTick(() => document.getElementById(`tab-${nextPanel.id}`)?.focus())
}
</script>

<template>
  <section class="lab-page" aria-labelledby="page-title">
    <header class="lab-heading">
      <div>
        <p class="eyebrow">{{ t('lab.eyebrow') }}</p>
        <h1 id="page-title" tabindex="-1">{{ t('nav.lab') }}</h1>
        <p class="lab-intro">{{ t('lab.intro') }}</p>
      </div>
      <div class="lab-heading-actions">
        <button class="button button-secondary" type="button" @click="shareSolution">
          <Share2 :size="16" aria-hidden="true" />
          {{ t('lab.share.action') }}
        </button>
        <button class="button button-secondary lab-reset" type="button" @click="resetExample">
          <RotateCcw :size="16" aria-hidden="true" />
          {{ t('lab.reset') }}
        </button>
      </div>
    </header>

    <div v-if="shareStatus" class="lab-share-result">
      <p role="status">{{ shareMessage }}</p>
      <input
        v-if="shareUrl"
        :aria-label="t('lab.share.urlLabel')"
        :value="shareUrl"
        readonly
        @focus="selectShareUrl"
      />
    </div>

    <div class="lab-toolbar">
      <label class="lab-selector-field" for="lab-selector">
        <span class="lab-prompt" aria-hidden="true">&gt;</span>
        <span class="sr-only">{{ t('lab.selectorLabel') }}</span>
        <input
          id="lab-selector"
          v-model="draft.selector"
          type="text"
          maxlength="160"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="t('lab.selectorPlaceholder')"
        />
      </label>
      <div class="lab-result" role="status" aria-live="polite" aria-atomic="true">
        <span class="lab-result-count" aria-hidden="true">{{
          evaluation.matchedElementIds.length
        }}</span>
        <span>{{
          errorMessage || t('lab.matches', { count: evaluation.matchedElementIds.length })
        }}</span>
      </div>
    </div>

    <div class="lab-extra-tools">
      <label
        >Plantilla HTML<select v-model="template" @change="loadTemplate">
          <option value="">Elige un ejemplo</option>
          <option value="lista">Lista</option>
          <option value="formulario">Formulario</option>
          <option value="tabla">Tabla</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="navegacion">Navegación</option>
        </select></label
      >
      <button class="button button-secondary" :disabled="!history.length" @click="undoRedo('undo')">
        Deshacer
      </button>
      <button class="button button-secondary" :disabled="!future.length" @click="undoRedo('redo')">
        Rehacer
      </button>
      <button class="button button-secondary" @click="copyCode">Copiar código</button>
      <button
        class="button button-secondary"
        @click="downloadFile('csslab.html', previewDocument, 'text/html')"
      >
        Descargar HTML
      </button>
      <span aria-live="polite">{{ copyMessage }}</span>
    </div>

    <div class="lab-workbench">
      <div class="lab-mobile-tabs" role="tablist" :aria-label="t('lab.panels')">
        <button
          v-for="panel in panels"
          :id="`tab-${panel.id}`"
          :key="panel.id"
          type="button"
          role="tab"
          :aria-selected="activePanel === panel.id"
          :aria-controls="`panel-${panel.id}`"
          :tabindex="activePanel === panel.id ? 0 : -1"
          :class="{ 'lab-tab-active': activePanel === panel.id }"
          @click="activePanel = panel.id"
          @keydown.right.prevent="movePanel(1)"
          @keydown.left.prevent="movePanel(-1)"
          @keydown.home.prevent="movePanel(-panels.findIndex((item) => item.id === activePanel))"
          @keydown.end.prevent="
            movePanel(panels.length - 1 - panels.findIndex((item) => item.id === activePanel))
          "
        >
          {{ t(panel.label) }}
        </button>
      </div>

      <section
        id="panel-html"
        class="lab-panel"
        :class="{ 'lab-panel-active': activePanel === 'html' }"
        role="tabpanel"
        aria-labelledby="tab-html"
        :tabindex="activePanel === 'html' ? 0 : -1"
      >
        <header class="lab-panel-header">
          <h2>{{ t('lab.html') }}</h2>
          <span class="lab-language">HTML</span>
        </header>
        <CodeEditor
          :key="`html-${editorRevision}`"
          v-model="draft.html"
          language="html"
          :max-length="12000"
          :label="t('lab.htmlLabel')"
        />
      </section>

      <section
        id="panel-css"
        class="lab-panel"
        :class="{ 'lab-panel-active': activePanel === 'css' }"
        role="tabpanel"
        aria-labelledby="tab-css"
        :tabindex="activePanel === 'css' ? 0 : -1"
      >
        <header class="lab-panel-header">
          <h2>{{ t('lab.css') }}</h2>
          <span class="lab-language">CSS</span>
        </header>
        <CodeEditor
          :key="`css-${editorRevision}`"
          v-model="draft.css"
          language="css"
          :max-length="12000"
          :label="t('lab.cssLabel')"
        />
      </section>

      <section
        id="panel-preview"
        class="lab-panel lab-preview-panel"
        :class="{ 'lab-panel-active': activePanel === 'preview' }"
        role="tabpanel"
        aria-labelledby="tab-preview"
        :tabindex="activePanel === 'preview' ? 0 : -1"
      >
        <header class="lab-panel-header">
          <h2>{{ t('lab.preview') }}</h2>
          <span class="lab-safe-label">
            <ShieldCheck :size="14" aria-hidden="true" />
            {{ t('lab.sandboxed') }}
          </span>
        </header>
        <iframe
          class="lab-preview-frame"
          :srcdoc="previewDocument"
          :title="t('lab.previewTitle')"
          sandbox=""
          referrerpolicy="no-referrer"
        />
      </section>
    </div>

    <section class="lab-dom-tree" aria-labelledby="lab-tree-title">
      <h2 id="lab-tree-title">{{ t('lab.treeTitle') }}</h2>
      <p>{{ t('lab.treeDescription') }}</p>
      <DomTree :nodes="domTree" @inspect="hoveredNode = $event" />
    </section>

    <div class="lab-info-row">
      <section class="lab-specificity" :aria-label="t('lab.specificityLabel')">
        <span class="specificity-label">{{ t('lab.specificityLabel') }}</span>
        <span class="specificity-value">{{ specificity }}</span>
        <span class="specificity-hint">{{ t('lab.specificityHint') }}</span>
      </section>
      <p v-if="saveError" class="lab-save-error" role="status">{{ t('lab.saveError') }}</p>
      <p v-else class="lab-save-status">{{ t('lab.savedLocally') }}</p>
      <p class="lab-limit-note">{{ t('lab.limits') }}</p>
    </div>
    <details class="lab-cascade">
      <summary>Explorar la cascada y comparar reglas</summary>
      <CascadeInspector />
    </details>
  </section>
</template>
