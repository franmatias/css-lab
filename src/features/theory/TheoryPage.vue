<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { entries, lessons } from '../../../packages/content/src'
import { useLearningStore } from '@/shared/model/learningStore'
import SelectorDemo from '@/shared/ui/SelectorDemo.vue'
import CascadeInspector from '@/shared/ui/CascadeInspector.vue'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
import { useI18n } from 'vue-i18n'
const TheoryDesignExample = defineAsyncComponent(() => import('./TheoryDesignExample.vue'))
const { t } = useI18n()
const sidebarOpen = ref(true)
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
const route = useRoute()
const router = useRouter()
const store = useLearningStore()
const lesson = computed(() => lessons.find((l) => l.id === route.params.slug))
const lessonEntries = computed(() => entries.filter((e) => e.module === lesson.value?.module))
const answers = ref<Record<number, number>>({})
const checked = ref(false)
watch(lesson, () => {
  answers.value = {}
  checked.value = false
})
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
      {{ lessons.length }} lecciones abiertas: selectores, componentes y diseño de páginas. Sigue la
      ruta recomendada o elige lo que quieras repasar.
    </p>
    <div class="learning-layout" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <CollapsibleSidebar v-model="sidebarOpen" class="learning-sidebar" :title="t('panels.map')">
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
        <RouterLink to="/ejemplos">{{ t('examples.discover') }}</RouterLink>
      </CollapsibleSidebar>
      <article v-if="lesson" class="learning-card lesson-body">
        <p class="eyebrow">{{ lesson.minutes }} minutos · Módulo {{ lesson.module }}</p>
        <h2>Al terminar podrás…</h2>
        <p>{{ lesson.objective }}</p>
        <p>{{ lesson.explanation }}</p>
        <h2>Ideas clave</h2>
        <ul class="lesson-ideas">
          <li v-for="idea in lesson.ideas" :key="idea">{{ idea }}</li>
        </ul>
        <section
          v-for="section in lesson.sections"
          :key="section.title"
          class="theory-explanation-section"
        >
          <h2>{{ section.title }}</h2>
          <p>{{ section.paragraph }}</p>
          <ul class="lesson-ideas">
            <li v-for="point in section.points" :key="point">{{ point }}</li>
          </ul>
        </section>
        <TheoryDesignExample v-if="lesson.example" :key="lesson.id" :example="lesson.example" />
        <RouterLink v-if="[5, 6].includes(lesson.module)" class="text-link" to="/juego/tablas"
          >Practicar con una tabla interactiva →</RouterLink
        >
        <pre v-if="lesson.module === 0"><code>p {
  color: blue;
}</code></pre>
        <section v-for="entry in lessonEntries" :key="entry.id" class="lesson-example">
          <h2>{{ entry.name }}</h2>
          <p>{{ entry.detail }}</p>
          <SelectorDemo :entry="entry" />
          <details>
            <summary>Error frecuente</summary>
            <p>{{ entry.mistake }}</p>
          </details>
        </section>
        <button v-if="!lesson.example" class="button button-secondary" @click="openLab">
          Abrir en el Laboratorio ↗
        </button>
        <p v-if="lesson.reference">
          <a class="text-link" :href="lesson.reference" target="_blank" rel="noopener noreferrer"
            >Ampliar la explicación en MDN ↗</a
          >
        </p>
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
                : 'Revisa las ideas clave y las explicaciones de esta lección y vuelve a comprobar tus respuestas.'
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
        <section v-if="lesson.links?.length" class="theory-practice-links">
          <h2>Ponlo en práctica</h2>
          <RouterLink v-for="link in lesson.links" :key="link.to" class="text-link" :to="link.to"
            >{{ link.label }} →</RouterLink
          >
        </section>
        <RouterLink v-else class="text-link" :to="`/retos/m${Math.max(1, lesson.module)}`"
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
<style>
.theory-explanation-section {
  margin-block: 1.6rem;
}
.theory-explanation-section h2 {
  font-size: 1.25rem;
}
.theory-practice-links {
  display: grid;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.lesson-body {
  min-width: 0;
}
.lesson-body .lesson-ideas {
  list-style: disc;
  padding-inline-start: 1.4rem;
}
.lesson-body .lesson-ideas li {
  margin-block: 0.8rem;
  padding-inline-start: 0.3rem;
}
</style>
