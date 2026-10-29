<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { entries, lessons } from '../../../packages/content/src'
import { useLearningStore } from '@/shared/model/learningStore'
import SelectorDemo from '@/shared/ui/SelectorDemo.vue'
import CascadeInspector from '@/shared/ui/CascadeInspector.vue'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
const route = useRoute()
const router = useRouter()
const store = useLearningStore()
const lesson = computed(() => lessons.find((l) => l.id === route.params.slug))
const lessonEntries = computed(() => entries.filter((e) => e.module === lesson.value?.module))
const answers = ref<Record<number, number>>({})
const checked = ref(false)
const passed = computed(
  () => lesson.value?.quiz.every((q, i) => answers.value[i] === q.answer) ?? false,
)
async function openLab() {
  const example = lessonEntries.value[0] ?? entries[1]!
  const hash = await encodeSharedLabDraft({
    html: example.html,
    css: 'body { font-family: system-ui; padding: 24px; }',
    selector: example.selector,
  })
  await router.push(`/laboratorio${hash}`)
}
</script>
<template>
  <section class="learning-page">
    <p class="eyebrow">Una idea, un experimento</p>
    <h1 id="page-title" tabindex="-1">{{ lesson?.name ?? 'Teoría' }}</h1>
    <p class="section-intro">
      Diez módulos abiertos. Sigue la ruta recomendada o elige lo que quieras repasar.
    </p>
    <div class="learning-layout">
      <aside class="learning-sidebar" aria-label="Mapa de aprendizaje">
        <RouterLink
          v-for="item in lessons"
          :key="item.id"
          :to="`/teoria/${item.id}`"
          :class="{ selected: lesson?.id === item.id }"
        >
          <span class="module-number">{{
            store.data.lessons[item.id] ? '✓' : item.id.toUpperCase()
          }}</span
          >{{ item.name }}
        </RouterLink>
      </aside>
      <article v-if="lesson" class="learning-card lesson-body">
        <p class="eyebrow">{{ lesson.minutes }} minutos · Módulo {{ lesson.module }}</p>
        <h2>Al terminar podrás…</h2>
        <p>{{ lesson.objective }}</p>
        <p>{{ lesson.explanation }}</p>
        <pre v-if="lesson.module === 0"><code>p {\n  color: blue;\n}</code></pre>
        <section v-for="entry in lessonEntries" :key="entry.id" class="lesson-example">
          <h2>{{ entry.name }}</h2>
          <p>{{ entry.detail }}</p>
          <pre><code>{{ entry.html }}</code></pre>
          <SelectorDemo :entry="entry" />
          <details>
            <summary>Error frecuente</summary>
            <p>{{ entry.mistake }}</p>
          </details>
        </section>
        <button class="button button-secondary" @click="openLab">Abrir en el Laboratorio ↗</button>
        <CascadeInspector v-if="lesson.module === 9" />
        <form class="quiz" @submit.prevent="checked = true">
          <h2>Comprueba lo aprendido</h2>
          <fieldset v-for="(question, index) in lesson.quiz" :key="index">
            <legend>{{ question.question }}</legend>
            <label
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              class="radio-option"
              ><input
                v-model="answers[index]"
                type="radio"
                :name="`quiz-${index}`"
                :value="optionIndex"
                required
              />{{ option }}</label
            >
          </fieldset>
          <button class="button button-secondary" type="submit">Comprobar respuestas</button>
          <p v-if="checked" role="status">
            {{
              passed
                ? '¡Eso es! Ya puedes completar la lección.'
                : 'Revisa tus respuestas: el selector encuentra elementos y una regla sin coincidencias no se aplica.'
            }}
          </p>
        </form>
        <button
          class="button button-primary"
          :disabled="!passed || Boolean(store.data.lessons[lesson.id])"
          @click="store.completeLesson(lesson.id)"
        >
          {{
            store.data.lessons[lesson.id] ? '✓ Lección completada' : 'Completar lección · +40 XP'
          }}
        </button>
        <RouterLink class="text-link" :to="`/retos/m${Math.max(1, lesson.module)}`"
          >Practicar este módulo →</RouterLink
        >
      </article>
      <div v-else class="learning-grid">
        <RouterLink
          v-for="item in lessons"
          :key="item.id"
          class="learning-card module-card"
          :to="`/teoria/${item.id}`"
        >
          <span class="eyebrow">{{ item.id.toUpperCase() }} · {{ item.minutes }} min</span>
          <h2>{{ item.name }}</h2>
          <p>{{ item.objective }}</p>
          <span class="text-link">{{
            store.data.lessons[item.id] ? 'Repasar ✓' : 'Empezar →'
          }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
