<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RotateCcw, Share2, ShieldCheck } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useLabStore } from './model/labStore'
import { createPreviewDocument, evaluateSelector } from './model/selectorEvaluator'
import { createDomTree } from './model/domTree'
import { decodeSharedLabDraft, encodeSharedLabDraft } from './model/shareLabDraft'
import CodeEditor from './CodeEditor.vue'
import DomTree from './DomTree.vue'
import CascadeInspector from '@/shared/ui/CascadeInspector.vue'
import { downloadFile } from '@/shared/utils/download'
import { useLearningStore } from '@/shared/model/learningStore'
import { readLabPreferences, writeLabPreferences } from '@/infrastructure/storage/appStorage'
import { formatCode } from './model/formatCode'
import { detectPreviewChanges, type PreviewChanges } from './model/previewChanges'

type LabPanel = 'html' | 'css' | 'preview'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useLabStore()
const preferences = ref(readLabPreferences())
const panelColumns = computed(() => {
  const weights =
    preferences.value.layout === 'code'
      ? ['1.3fr', '1.3fr', '1fr']
      : preferences.value.layout === 'preview'
        ? ['.8fr', '.8fr', '1.6fr']
        : ['1fr', '1fr', '1.18fr']
  return {
    '--html-column': preferences.value.collapsed.html ? '54px' : weights[0],
    '--css-column': preferences.value.collapsed.css ? '54px' : weights[1],
    '--preview-column': preferences.value.collapsed.preview ? '54px' : weights[2],
  }
})
function togglePanel(panel: LabPanel) {
  const collapsed = preferences.value.collapsed
  collapsed[panel] = !collapsed[panel]
  if (collapsed.html && collapsed.css && collapsed.preview)
    collapsed[panel === 'preview' ? 'html' : 'preview'] = false
}
function selectPanel(panel: LabPanel) {
  activePanel.value = panel
  preferences.value.collapsed[panel] = false
}
function restorePanels() {
  preferences.value.collapsed = { html: false, css: false, preview: false, tree: false }
  preferences.value.layout = 'balanced'
  focusPreview.value = false
}
const settingsOpen = ref(false)
const focusPreview = ref(false)
const formatting = ref<'html' | 'css' | 'both' | null>(null)
const formatMessage = ref('')
const formatError = ref(false)
watch(preferences, (value) => writeLabPreferences(value), { deep: true })
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
async function loadTemplate() {
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
    const css =
      'body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; line-height: 1.6; color: #24233a; }\nbutton { padding: 8px 16px; border: 0; border-radius: 8px; background: #4f46e5; color: white; }\nli, td, th { padding: 8px; }\na { display: inline-block; margin: 8px; color: #4f46e5; }'
    const [formattedHtml, formattedCss] = await Promise.all([
      formatCode(html, 'html', preferences.value),
      formatCode(css, 'css', preferences.value),
    ])
    store.replaceDraft({
      html: formattedHtml,
      css: formattedCss,
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
const previewEvaluation = ref(evaluation.value)
const previewCss = ref(draft.value.css)
const appliedDraft = ref(JSON.stringify(draft.value))
const changes = ref<PreviewChanges>({ ids: [], added: 0, removed: 0, modified: 0 })
const previewRevision = ref(0)
const animateUpdate = ref(true)
const hasPendingChanges = computed(() => JSON.stringify(draft.value) !== appliedDraft.value)
function refreshPreview() {
  const next = evaluateSelector(draft.value)
  changes.value = detectPreviewChanges(
    previewEvaluation.value.sanitizedHtml,
    next,
    previewCss.value,
    draft.value.css,
  )
  previewEvaluation.value = next
  previewCss.value = draft.value.css
  appliedDraft.value = JSON.stringify(draft.value)
  previewRevision.value++
  animateUpdate.value = true
}
watch(evaluation, () => {
  if (preferences.value.live) refreshPreview()
})
watch(
  () => preferences.value.live,
  (live) => {
    if (live) refreshPreview()
  },
)
watch(hoveredNode, () => {
  animateUpdate.value = false
})
const previewDocument = computed(() =>
  createPreviewDocument(previewEvaluation.value, previewCss.value, {
    ...preferences.value,
    changedIds: changes.value.ids,
    inspectedId: hoveredNode.value,
    animations: preferences.value.animations && animateUpdate.value,
  }),
)
const domTree = computed(() => createDomTree(previewEvaluation.value))
async function formatEditors(language: 'html' | 'css' | 'both' = 'both') {
  if (formatting.value) return
  formatting.value = language
  formatMessage.value = ''
  formatError.value = false
  const snapshot = { ...draft.value }
  try {
    const [html, css] = await Promise.all([
      language === 'css' ? snapshot.html : formatCode(snapshot.html, 'html', preferences.value),
      language === 'html' ? snapshot.css : formatCode(snapshot.css, 'css', preferences.value),
    ])
    if (html.length > 12000 || css.length > 12000) throw new Error(t('lab.editor.tooLong'))
    if (draft.value.html !== snapshot.html || draft.value.css !== snapshot.css) {
      formatMessage.value = t('lab.editor.changed')
      return
    }
    store.replaceDraft({ ...snapshot, html, css })
    formatMessage.value = t('lab.editor.formatted')
  } catch (error) {
    formatError.value = true
    formatMessage.value = t('lab.editor.error', {
      message: error instanceof Error ? error.message : '',
    })
  } finally {
    formatting.value = null
  }
}
function toggleFocusPreview() {
  focusPreview.value = !focusPreview.value
  if (focusPreview.value) selectPanel('preview')
}
function downloadCode() {
  const cleanEvaluation = { ...evaluateSelector(draft.value), matchedElementIds: [] }
  downloadFile(
    'csslab.html',
    createPreviewDocument(cleanEvaluation, draft.value.css, {
      highlight: 'none',
      animations: false,
    }),
    'text/html',
  )
}
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
const highlightModes = ['border', 'fill', 'both', 'none'] as const

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
  } else if (
    draft.value.html ===
    '<main class="demo"><h2 class="featured">Aprende seleccionando</h2><p>Prueba un selector y observa el resultado.</p><button class="action" type="button">Probar</button></main>'
  ) {
    await formatEditors()
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
    learning.explore('share')
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

  selectPanel(nextPanel.id)
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
        :disabled="Boolean(formatting)"
        :title="t('lab.editor.shortcut')"
        @click="formatEditors()"
      >
        {{ t('lab.editor.formatAll') }}
      </button>
      <button
        class="button button-secondary"
        :aria-pressed="preferences.live"
        @click="preferences.live = !preferences.live"
      >
        {{ preferences.live ? t('lab.previewControls.live') : t('lab.previewControls.paused') }}
      </button>
      <button
        v-if="!preferences.live"
        class="button button-primary"
        :disabled="!hasPendingChanges"
        @click="refreshPreview"
      >
        {{ t('lab.previewControls.apply') }}
      </button>
      <button
        class="button button-secondary"
        :aria-expanded="settingsOpen"
        aria-controls="lab-preferences"
        @click="settingsOpen = !settingsOpen"
      >
        {{ t('lab.editor.settings') }}
      </button>
      <button class="button button-secondary" @click="downloadCode">Descargar HTML</button>
      <span aria-live="polite">{{ copyMessage }}</span>
    </div>

    <fieldset v-if="settingsOpen" id="lab-preferences" class="lab-preferences">
      <legend>{{ t('lab.editor.settings') }}</legend>
      <label
        >{{ t('lab.editor.fontSize')
        }}<select v-model="preferences.fontSize">
          <option v-for="size in [12, 14, 16, 18]" :key="size" :value="size">{{ size }} px</option>
        </select></label
      >
      <label
        >{{ t('lab.editor.indentation')
        }}<select v-model="preferences.useTabs">
          <option :value="false">{{ t('lab.editor.spaces') }}</option>
          <option :value="true">{{ t('lab.editor.tabs') }}</option>
        </select></label
      >
      <label
        >{{ t('lab.editor.tabWidth')
        }}<select v-model="preferences.tabWidth">
          <option :value="2">2</option>
          <option :value="4">4</option>
        </select></label
      >
      <label class="lab-check"
        ><input v-model="preferences.wrap" type="checkbox" />{{ t('lab.editor.wrap') }}</label
      >
      <label
        >{{ t('panels.layout')
        }}<select v-model="preferences.layout">
          <option value="balanced">{{ t('panels.balanced') }}</option>
          <option value="code">{{ t('panels.code') }}</option>
          <option value="preview">{{ t('panels.preview') }}</option>
        </select></label
      >
      <button type="button" class="button button-secondary" @click="restorePanels">
        {{ t('panels.restore') }}
      </button>
      <p>{{ t('lab.editor.keyboardHelp') }}</p>
    </fieldset>
    <p
      v-if="formatMessage"
      class="lab-format-message"
      :class="{ 'is-error': formatError }"
      aria-live="polite"
    >
      {{ formatMessage }}
    </p>

    <div class="lab-workbench" :class="{ 'lab-focus-preview': focusPreview }" :style="panelColumns">
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
          @click="selectPanel(panel.id)"
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
        :class="{
          'lab-panel-active': activePanel === 'html',
          'lab-panel-collapsed': preferences.collapsed.html,
        }"
        role="tabpanel"
        aria-labelledby="tab-html"
        :tabindex="activePanel === 'html' ? 0 : -1"
      >
        <header class="lab-panel-header">
          <h2>{{ t('lab.html') }}</h2>
          <button
            type="button"
            class="lab-panel-toggle"
            :aria-label="
              t(preferences.collapsed.html ? 'panels.expand' : 'panels.collapse', {
                panel: t('lab.html'),
              })
            "
            :aria-expanded="!preferences.collapsed.html"
            aria-controls="panel-html"
            @click="togglePanel('html')"
          >
            {{ preferences.collapsed.html ? '›' : '‹' }}
          </button>
          <span class="lab-language">HTML</span>
        </header>
        <CodeEditor
          :key="`html-${editorRevision}`"
          v-model="draft.html"
          language="html"
          :max-length="12000"
          :label="t('lab.htmlLabel')"
          :font-size="preferences.fontSize"
          :wrap="preferences.wrap"
          :use-tabs="preferences.useTabs"
          :tab-width="preferences.tabWidth"
          :formatting="formatting === 'html' || formatting === 'both'"
          @format="formatEditors('html')"
        />
      </section>

      <section
        id="panel-css"
        class="lab-panel"
        :class="{
          'lab-panel-active': activePanel === 'css',
          'lab-panel-collapsed': preferences.collapsed.css,
        }"
        role="tabpanel"
        aria-labelledby="tab-css"
        :tabindex="activePanel === 'css' ? 0 : -1"
      >
        <header class="lab-panel-header">
          <h2>{{ t('lab.css') }}</h2>
          <button
            type="button"
            class="lab-panel-toggle"
            :aria-label="
              t(preferences.collapsed.css ? 'panels.expand' : 'panels.collapse', {
                panel: t('lab.css'),
              })
            "
            :aria-expanded="!preferences.collapsed.css"
            aria-controls="panel-css"
            @click="togglePanel('css')"
          >
            {{ preferences.collapsed.css ? '›' : '‹' }}
          </button>
          <span class="lab-language">CSS</span>
        </header>
        <CodeEditor
          :key="`css-${editorRevision}`"
          v-model="draft.css"
          language="css"
          :max-length="12000"
          :label="t('lab.cssLabel')"
          :font-size="preferences.fontSize"
          :wrap="preferences.wrap"
          :use-tabs="preferences.useTabs"
          :tab-width="preferences.tabWidth"
          :formatting="formatting === 'css' || formatting === 'both'"
          @format="formatEditors('css')"
        />
      </section>

      <section
        id="panel-preview"
        class="lab-panel lab-preview-panel"
        :class="{
          'lab-panel-active': activePanel === 'preview',
          'lab-panel-collapsed': preferences.collapsed.preview,
        }"
        role="tabpanel"
        aria-labelledby="tab-preview"
        :tabindex="activePanel === 'preview' ? 0 : -1"
      >
        <header class="lab-panel-header">
          <h2>{{ t('lab.preview') }}</h2>
          <button
            type="button"
            class="lab-panel-toggle"
            :aria-label="
              t(preferences.collapsed.preview ? 'panels.expand' : 'panels.collapse', {
                panel: t('lab.preview'),
              })
            "
            :aria-expanded="!preferences.collapsed.preview"
            aria-controls="panel-preview"
            @click="togglePanel('preview')"
          >
            {{ preferences.collapsed.preview ? '›' : '‹' }}
          </button>
          <span class="lab-safe-label">
            <ShieldCheck :size="14" aria-hidden="true" />
            {{ t('lab.sandboxed') }}
          </span>
        </header>
        <div class="lab-preview-controls">
          <div
            class="lab-highlight-modes"
            role="group"
            :aria-label="t('lab.previewControls.highlight')"
          >
            <button
              v-for="mode in highlightModes"
              :key="mode"
              type="button"
              :aria-pressed="preferences.highlight === mode"
              @click="preferences.highlight = mode"
            >
              {{ t(`lab.previewControls.${mode}`) }}
            </button>
          </div>
          <div class="lab-preview-quick">
            <label
              >{{ t('lab.previewControls.color')
              }}<select v-model="preferences.color">
                <option value="amber">{{ t('lab.previewControls.amber') }}</option>
                <option value="indigo">{{ t('lab.previewControls.indigo') }}</option>
                <option value="cyan">{{ t('lab.previewControls.cyan') }}</option>
              </select></label
            >
            <button
              type="button"
              class="lab-small-button"
              :aria-pressed="focusPreview"
              @click="toggleFocusPreview"
            >
              {{
                focusPreview
                  ? t('lab.previewControls.backEditors')
                  : t('lab.previewControls.expand')
              }}
            </button>
          </div>
          <details class="lab-preview-options">
            <summary>{{ t('lab.previewControls.more') }}</summary>
            <div class="lab-preview-option-grid">
              <label
                >{{ t('lab.previewControls.viewport')
                }}<select v-model="preferences.width">
                  <option value="auto">{{ t('lab.previewControls.autoWidth') }}</option>
                  <option value="375">{{ t('lab.previewControls.mobileWidth') }}</option>
                  <option value="768">{{ t('lab.previewControls.tabletWidth') }}</option>
                </select></label
              >
              <label
                >{{ t('lab.previewControls.background')
                }}<select v-model="preferences.background">
                  <option value="light">{{ t('lab.previewControls.light') }}</option>
                  <option value="dark">{{ t('lab.previewControls.dark') }}</option>
                  <option value="checker">{{ t('lab.previewControls.checker') }}</option>
                </select></label
              >
              <label class="lab-check"
                ><input v-model="preferences.numbers" type="checkbox" />{{
                  t('lab.previewControls.numbers')
                }}</label
              >
              <label class="lab-check"
                ><input v-model="preferences.grid" type="checkbox" />{{
                  t('lab.previewControls.grid')
                }}</label
              >
              <label class="lab-check"
                ><input v-model="preferences.animations" type="checkbox" />{{
                  t('lab.previewControls.animations')
                }}</label
              >
            </div>
          </details>
        </div>
        <div class="lab-preview-ruler">
          <span>{{
            preferences.width === 'auto'
              ? t('lab.previewControls.autoWidth')
              : `${preferences.width} px`
          }}</span
          ><span>{{
            !preferences.live && hasPendingChanges
              ? t('lab.previewControls.pending')
              : t('lab.previewControls.updated')
          }}</span>
        </div>
        <div class="lab-preview-viewport">
          <iframe
            class="lab-preview-frame"
            :style="{ width: preferences.width === 'auto' ? '100%' : `${preferences.width}px` }"
            :srcdoc="previewDocument"
            :title="t('lab.previewTitle')"
            sandbox=""
            referrerpolicy="no-referrer"
          />
        </div>
        <p class="lab-change-summary" aria-live="polite">
          {{
            t('lab.previewControls.changes', {
              count: changes.ids.length,
              added: changes.added,
              removed: changes.removed,
            })
          }}
        </p>
      </section>
    </div>

    <section class="lab-dom-tree" aria-labelledby="lab-tree-title">
      <h2 id="lab-tree-title">
        <button
          class="lab-tree-toggle"
          type="button"
          :aria-label="
            t(preferences.collapsed.tree ? 'panels.expand' : 'panels.collapse', {
              panel: t('panels.tree'),
            })
          "
          :aria-expanded="!preferences.collapsed.tree"
          aria-controls="lab-tree-content"
          @click="preferences.collapsed.tree = !preferences.collapsed.tree"
        >
          {{ t('lab.treeTitle') }}
          <span aria-hidden="true">{{ preferences.collapsed.tree ? '＋' : '−' }}</span>
        </button>
      </h2>
      <div v-show="!preferences.collapsed.tree" id="lab-tree-content">
        <p>{{ t('lab.treeDescription') }}</p>
        <DomTree :nodes="domTree" @inspect="hoveredNode = $event" />
      </div>
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

<style src="./lab.css"></style>
