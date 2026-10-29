import { useDebounceFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { readLabDraft, writeLabDraft } from '@/infrastructure/storage/appStorage'
import type { LabDraft } from '@/infrastructure/storage/appStorage'
import { evaluateSelector } from './selectorEvaluator'
import type { SelectorEvaluation } from './selectorEvaluator'
import { defaultLabDraft } from './selectorEvaluator'

export const useLabStore = defineStore('lab', () => {
  const draft = ref<LabDraft>(readLabDraft())
  const evaluation = ref<SelectorEvaluation>(evaluateSelector(draft.value))
  const saveError = ref(false)

  watch(
    draft,
    useDebounceFn((currentDraft: LabDraft) => {
      evaluation.value = evaluateSelector(currentDraft)
      try {
        saveError.value = !writeLabDraft(currentDraft)
      } catch (error) {
        saveError.value = true
        console.error('No se pudo validar el borrador del laboratorio.', error)
      }
    }, 180),
    { deep: true },
  )

  function reset(): void {
    replaceDraft(defaultLabDraft)
  }

  function replaceDraft(nextDraft: LabDraft): void {
    draft.value = { ...nextDraft }
    evaluation.value = evaluateSelector(draft.value)
  }

  return { draft, evaluation, saveError, reset, replaceDraft }
})
