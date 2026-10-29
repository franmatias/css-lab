<script setup lang="ts">
import { ref } from 'vue'
import { useLearningStore } from '@/shared/model/learningStore'
const store = useLearningStore()
const step = ref(0)
const steps = [
  {
    title: 'Bienvenido a tu laboratorio',
    text: 'Empieza con una lección breve. Cada ejemplo es editable: cambia el selector y mira qué ocurre.',
  },
  {
    title: 'Experimenta con libertad',
    text: 'En el Laboratorio puedes escribir HTML y CSS, inspeccionar el DOM y comparar reglas sin instalar nada.',
  },
  {
    title: 'Pon a prueba una idea',
    text: 'Resuelve retos sin límite de intentos. Las pistas te acercan a la solución; equivocarte no resta puntos.',
  },
  {
    title: 'Llévate tu progreso',
    text: 'Tu avance se guarda solo en este navegador. En Progreso puedes exportarlo e importarlo en otro dispositivo.',
  },
]
function next() {
  if (step.value === 3) store.explore('tour')
  else step.value++
}
</script>
<template>
  <aside
    v-if="!store.data.flags.includes('tour')"
    class="welcome-tour learning-card"
    aria-label="Guía de bienvenida"
  >
    <div>
      <p class="eyebrow">Tu primera visita · {{ step + 1 }} de 4</p>
      <h2>{{ steps[step]!.title }}</h2>
      <p>{{ steps[step]!.text }}</p>
    </div>
    <div class="card-actions">
      <button class="button button-primary" @click="next">
        {{ step === 3 ? 'Empezar a explorar' : 'Siguiente' }}</button
      ><button class="button button-secondary" @click="store.explore('tour')">Omitir guía</button>
    </div>
  </aside>
</template>
