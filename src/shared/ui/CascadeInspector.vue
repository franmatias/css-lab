<script setup lang="ts">
import { computed, ref } from 'vue'
import { cascadeReason, compareCascade, specificity, type CascadeRule } from '@/domain/cascade'
const selectors = ref(['.tarjeta.destacada', '#principal'])
const values = ref(['coral', 'indigo'])
const important = ref([false, false])
const layers = ref(['none', 'none'])
const rules = computed(() =>
  selectors.value.map((selector, index): CascadeRule => ({
    selector,
    value: values.value[index]!,
    important: important.value[index]!,
    layer: layers.value[index] === 'none' ? null : Number(layers.value[index]),
    order: index,
    specificity: specificity(selector),
  })),
)
const comparison = computed(() => {
  try {
    return {
      winner: compareCascade(rules.value[0]!, rules.value[1]!) > 0 ? 0 : 1,
      reason: cascadeReason(rules.value[0]!, rules.value[1]!),
      error: '',
    }
  } catch {
    return { winner: -1, reason: '', error: 'Revisa la sintaxis de los selectores.' }
  }
})
</script>
<template>
  <section class="learning-page learning-card cascade-inspector">
    <h2>¿Qué regla gana?</h2>
    <p>
      Compara dos declaraciones del mismo origen aplicadas al mismo elemento. La importancia y la
      capa se comparan antes de la especificidad.
    </p>
    <div class="learning-grid">
      <div v-for="(_, index) in selectors" :key="index">
        <label class="answer-label"
          >Selector de la regla {{ index + 1
          }}<input v-model="selectors[index]" maxlength="160" spellcheck="false"
        /></label>
        <label class="answer-label"
          >Capa<select v-model="layers[index]">
            <option value="none">Sin capa</option>
            <option value="0">Primera capa</option>
            <option value="1">Segunda capa</option>
          </select></label
        >
        <label class="check-option"
          ><input v-model="important[index]" type="checkbox" />!important en regla
          {{ index + 1 }}</label
        >
        <pre><code>{{ selectors[index] }} { color: {{ values[index] }}{{ important[index] ? ' !important' : '' }}; }</code></pre>
      </div>
    </div>
    <p role="status">
      {{ comparison.error || `Gana la regla ${comparison.winner + 1}. ${comparison.reason}` }}
    </p>
    <p class="muted">
      La herencia se usa cuando el elemento no tiene una declaración aplicable; no compite con una
      declaración propia. Las transiciones y animaciones quedan fuera de este comparador.
    </p>
  </section>
</template>
