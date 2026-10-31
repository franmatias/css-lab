<script setup lang="ts">
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { HighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { Compartment, EditorState, Prec } from '@codemirror/state'
import {
  abbreviationTracker,
  expandAbbreviation,
  EmmetKnownSyntax,
} from '@emmetio/codemirror6-plugin'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { basicSetup, EditorView } from 'codemirror'
import { tags } from '@lezer/highlight'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    modelValue: string
    language: 'html' | 'css'
    label: string
    maxLength: number
    fontSize?: number
    wrap?: boolean
    useTabs?: boolean
    tabWidth?: number
    formatting?: boolean
    readOnly?: boolean
  }>(),
  {
    fontSize: 14,
    wrap: true,
    useTabs: false,
    tabWidth: 2,
    formatting: false,
    readOnly: false,
  },
)
const emit = defineEmits<{ 'update:modelValue': [value: string]; format: [] }>()
const { t } = useI18n()
const host = ref<HTMLDivElement | null>(null)
const position = ref({ line: 1, column: 1, lines: 1 })
const emmetMessage = ref('')
let editor: EditorView | null = null
const wrapping = new Compartment()
const indentation = new Compartment()
function expandEmmet() {
  if (!editor || props.readOnly) return false
  emmetMessage.value = ''
  try {
    const expanded = expandAbbreviation({
      state: editor.state,
      dispatch: (transaction) => {
        // The editor's size filter may already have rejected the snippet changes.
        if (!transaction.docChanged || transaction.newDoc.length > props.maxLength)
          throw new Error('limit')
        editor?.dispatch(transaction)
      },
    })
    if (!expanded) emmetMessage.value = t('lab.editor.emmetEmpty')
    editor.focus()
    return expanded
  } catch {
    emmetMessage.value = t('lab.editor.emmetInvalid')
    editor.focus()
    return false
  }
}
const highlight = HighlightStyle.define([
  { tag: [tags.comment, tags.docComment], color: 'var(--code-comment)', fontStyle: 'italic' },
  { tag: [tags.tagName, tags.className, tags.labelName], color: 'var(--code-tag)' },
  { tag: [tags.attributeName, tags.propertyName], color: 'var(--code-property)' },
  { tag: [tags.string, tags.attributeValue], color: 'var(--code-string)' },
  { tag: [tags.number, tags.unit, tags.bool], color: 'var(--code-number)' },
  {
    tag: [tags.keyword, tags.modifier, tags.function(tags.variableName)],
    color: 'var(--code-keyword)',
  },
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: 'var(--text-muted)' },
])
const theme = EditorView.theme({
  '&': {
    height: '100%',
    minHeight: '360px',
    color: 'var(--text)',
    background: 'var(--surface-2)',
    fontSize: 'var(--editor-font-size)',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"JetBrains Mono Variable", Consolas, monospace',
    fontSize: 'inherit',
    lineHeight: '1.75',
    fontVariantLigatures: 'none',
  },
  '.cm-content': { padding: '12px 0', caretColor: 'var(--primary)' },
  '.cm-line': { padding: '0 14px' },
  '.cm-gutters': {
    borderRight: '1px solid var(--border)',
    color: 'var(--text-muted)',
    background: 'var(--surface-2)',
    padding: '0',
    font: 'inherit',
  },
  '.cm-gutterElement': { padding: '0 8px 0 12px', font: 'inherit' },
  '.cm-activeLine, .cm-activeLineGutter': {
    background: 'color-mix(in srgb, var(--primary) 7%, transparent)',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    background: 'color-mix(in srgb, var(--primary) 18%, transparent)',
  },
  '.cm-cursor': { borderLeftColor: 'var(--primary)' },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-card)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul': {
    fontFamily: '"JetBrains Mono Variable", Consolas, monospace',
  },
  '.cm-tooltip-autocomplete > ul > li': { color: 'var(--text)' },
  '.cm-tooltip-autocomplete > ul > li:hover': { backgroundColor: 'var(--surface-2)' },
  '.cm-tooltip-autocomplete > ul > li[aria-selected="true"], .cm-tooltip-autocomplete > ul > li[aria-selected="true"]:hover':
    {
      backgroundColor: 'var(--primary)',
      color: 'var(--on-primary)',
    },
  '.cm-completionDetail, .cm-completionIcon': { color: 'inherit', opacity: '1' },
  '.cm-completionMatchedText': { color: 'inherit', fontWeight: '700', textUnderlineOffset: '3px' },
  '.cm-completionInfo, .cm-completionInfo code': {
    color: 'var(--text)',
    backgroundColor: 'var(--surface)',
  },
  '.emmet-tracker': { textDecorationColor: 'var(--primary)', textUnderlineOffset: '3px' },
  '&.cm-focused': { outline: '3px solid var(--primary)', outlineOffset: '-3px' },
})
function indentExtensions() {
  return [
    EditorState.tabSize.of(props.tabWidth),
    indentUnit.of(props.useTabs ? '\t' : ' '.repeat(props.tabWidth)),
  ]
}
function emmetPreviewExtensions() {
  return [
    syntaxHighlighting(highlight),
    EditorView.theme({
      '&': {
        color: 'var(--text)',
        backgroundColor: 'var(--surface)',
        fontSize: '12px',
        maxHeight: '180px',
        maxWidth: 'min(360px, 80vw)',
      },
      '.cm-scroller': {
        fontFamily: '"JetBrains Mono Variable", Consolas, monospace',
        overflow: 'auto',
      },
      '.cm-content': { padding: '6px 8px' },
      '.cm-line': { padding: '0' },
    }),
  ]
}
function updatePosition(view: EditorView) {
  const head = view.state.selection.main.head
  const line = view.state.doc.lineAt(head)
  position.value = { line: line.number, column: head - line.from + 1, lines: view.state.doc.lines }
}
onMounted(() => {
  if (!host.value) return
  editor = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        props.readOnly
          ? []
          : Prec.high(
              abbreviationTracker({
                syntax: props.language === 'html' ? EmmetKnownSyntax.html : EmmetKnownSyntax.css,
                previewEnabled: false,
                preview: { html: emmetPreviewExtensions, css: emmetPreviewExtensions },
                markTagPairs: false,
                autoRenameTags: false,
                autocompleteTab: ['stylesheet'],
              }),
            ),
        basicSetup,
        EditorState.readOnly.of(props.readOnly),
        EditorView.editable.of(!props.readOnly),
        syntaxHighlighting(highlight),
        props.language === 'html' ? html() : css(),
        theme,
        wrapping.of(props.wrap ? EditorView.lineWrapping : []),
        indentation.of(indentExtensions()),
        keymap.of([
          {
            key: 'Mod-Shift-e',
            run: () => {
              expandEmmet()
              return true
            },
            preventDefault: true,
          },
          {
            key: 'Mod-Shift-f',
            run: () => {
              emit('format')
              return true
            },
          },
          indentWithTab,
        ]),
        EditorView.contentAttributes.of({
          tabindex: '0',
          'aria-label': props.label,
          'aria-multiline': 'true',
          'aria-readonly': String(props.readOnly),
          role: 'textbox',
          autocapitalize: 'off',
          autocomplete: 'off',
          spellcheck: 'false',
        }),
        EditorState.transactionFilter.of((transaction) =>
          transaction.newDoc.length <= props.maxLength ? transaction : [],
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) emmetMessage.value = ''
          if (update.docChanged) emit('update:modelValue', update.state.doc.toString())
          if (update.docChanged || update.selectionSet) updatePosition(update.view)
        }),
        EditorView.domEventHandlers({
          keydown: (event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              editor?.contentDOM.blur()
              return true
            }
            return false
          },
        }),
      ],
    }),
  })
  updatePosition(editor)
  void document.fonts?.ready.then(() => editor?.requestMeasure())
})
watch(
  () => props.modelValue,
  (value) => {
    if (!editor || editor.state.doc.toString() === value) return
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
  },
)
watch(
  () => props.wrap,
  (value) =>
    editor?.dispatch({ effects: wrapping.reconfigure(value ? EditorView.lineWrapping : []) }),
)
watch(
  () => [props.useTabs, props.tabWidth],
  () => editor?.dispatch({ effects: indentation.reconfigure(indentExtensions()) }),
)
watch(
  () => props.fontSize,
  () => editor?.requestMeasure(),
  { flush: 'post' },
)
onBeforeUnmount(() => {
  editor?.destroy()
  editor = null
})
</script>
<template>
  <div class="lab-editor-shell" :style="{ '--editor-font-size': `${fontSize}px` }">
    <div ref="host" class="lab-code-editor" />
    <div class="lab-editor-status">
      <span
        >{{ t('lab.editor.position', { line: position.line, column: position.column }) }} ·
        {{ t('lab.editor.lines', { count: position.lines }) }}</span
      >
      <div v-if="!readOnly" class="lab-editor-actions">
        <button
          type="button"
          :aria-label="t('lab.editor.emmetExpand', { language: language.toUpperCase() })"
          :title="t('lab.editor.emmetShortcut')"
          aria-keyshortcuts="Control+Shift+E Meta+Shift+E"
          @mousedown.prevent
          @click="expandEmmet"
        >
          Emmet
        </button>
        <button
          v-if="!readOnly"
          type="button"
          :disabled="formatting"
          :aria-label="t('lab.editor.formatLanguage', { language: language.toUpperCase() })"
          :title="t('lab.editor.shortcut')"
          @click="emit('format')"
        >
          {{ formatting ? t('lab.editor.formatting') : t('lab.editor.format') }}
        </button>
      </div>
    </div>
    <p v-if="emmetMessage" class="lab-emmet-message" role="status">{{ emmetMessage }}</p>
  </div>
</template>
<style>
.lab-editor-status {
  flex-wrap: wrap;
}
.lab-editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.lab-emmet-message {
  margin: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  color: var(--text);
  background: var(--surface-2);
  border-top: 1px solid var(--border);
}
</style>
