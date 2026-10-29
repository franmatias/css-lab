<script setup lang="ts">
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror'
import { tags } from '@lezer/highlight'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Extension } from '@codemirror/state'

const accessibleHighlightStyle = HighlightStyle.define([
  { tag: [tags.comment, tags.docComment], color: 'var(--text-muted)' },
  { tag: [tags.keyword, tags.tagName, tags.className], color: 'var(--primary)' },
  { tag: [tags.attributeName, tags.name, tags.propertyName], color: 'var(--text)' },
  { tag: [tags.string, tags.attributeValue], color: 'var(--primary)' },
  {
    tag: [tags.number, tags.bool, tags.literal, tags.operator, tags.punctuation],
    color: 'var(--text-muted)',
  },
])

const props = defineProps<{
  modelValue: string
  language: 'html' | 'css'
  label: string
  maxLength: number
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const host = ref<HTMLDivElement | null>(null)
let editor: EditorView | null = null

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    minHeight: '360px',
    color: 'var(--text)',
    backgroundColor: 'var(--surface-2)',
    fontSize: '0.77rem',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'ui-monospace, "SFMono-Regular", Consolas, monospace',
    lineHeight: '1.65',
  },
  '.cm-gutters': {
    borderRight: '1px solid var(--border)',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--surface-2)',
  },
  '.cm-activeLine, .cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--primary)',
  },
  '&.cm-focused': {
    outline: '3px solid var(--primary)',
    outlineOffset: '-3px',
  },
})

const maxLengthFilter = EditorState.transactionFilter.of((transaction) => {
  if (transaction.newDoc.length > props.maxLength) return []
  return transaction
})

function getLanguageExtension(): Extension {
  return props.language === 'html' ? html() : css()
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && editor) {
    event.preventDefault()
    editor.contentDOM.blur()
  }
}

onMounted(() => {
  if (!host.value) return

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      syntaxHighlighting(accessibleHighlightStyle),
      getLanguageExtension(),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({
        'aria-label': props.label,
        'aria-multiline': 'true',
        autocapitalize: 'off',
        autocomplete: 'off',
        spellcheck: 'false',
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) emit('update:modelValue', update.state.doc.toString())
      }),
      EditorView.domEventHandlers({ keydown: handleKeydown }),
      maxLengthFilter,
      editorTheme,
    ],
  })

  editor = new EditorView({ state, parent: host.value })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editor || editor.state.doc.toString() === value) return
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value },
    })
  },
)

watch(
  () => props.label,
  (label) => editor?.contentDOM.setAttribute('aria-label', label),
)

onBeforeUnmount(() => {
  editor?.destroy()
  editor = null
})
</script>

<template>
  <div ref="host" class="lab-code-editor" />
</template>
