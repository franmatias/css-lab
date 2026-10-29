<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { badgeDefinitions, challenges, lessons, moduleNames } from '../../../packages/content/src'
import { useLearningStore } from '@/shared/model/learningStore'
import { localDate } from '@/domain/challenges'
import { downloadFile } from '@/shared/utils/download'
const store = useLearningStore()
const message = ref('')
const confirmReset = ref(false)
function resetProgress() {
  store.reset()
  confirmReset.value = false
}
const days = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - 6 + i)
    const key = localDate(date)
    return {
      key,
      label: date.toLocaleDateString('es', { weekday: 'short' }),
      count: store.data.activity[key] ?? 0,
    }
  }),
)
const recommendation = computed(
  () =>
    store.mastery
      .map((value, i) => ({ value, module: i + 1 }))
      .sort((a, b) => a.value - b.value)[0]!,
)
const needsBackup = computed(
  () =>
    store.data.xp > 0 &&
    (!store.data.exportedAt || Date.now() - Date.parse(store.data.exportedAt) > 14 * 86_400_000),
)
const dueReviews = computed(() =>
  challenges.filter((c) => {
    const result = store.data.challenges[c.id]
    return result?.status === 'completed' && result.nextReviewAt <= localDate()
  }),
)
function exportData() {
  store.data.exportedAt = new Date().toISOString()
  downloadFile(
    `csslab-progreso-${localDate()}.json`,
    JSON.stringify(store.data, null, 2),
    'application/json',
  )
  message.value = 'Copia de progreso descargada.'
}
async function importData(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 1_000_000) {
    message.value = 'El archivo supera 1 MB.'
    return
  }
  const valid = store.importData(await file.text())
  message.value = valid
    ? 'Progreso importado correctamente.'
    : 'El archivo no tiene un progreso válido. Se conservan tus datos.'
  input.value = ''
}
function moduleCompleted(module: number) {
  const group = challenges.filter((c) => c.module === module)
  return (
    group.filter((c) => store.data.challenges[c.id]?.status === 'completed').length >=
      Math.ceil(group.length * 0.8) &&
    group
      .filter((c) => c.integrator)
      .every((c) => store.data.challenges[c.id]?.status === 'completed')
  )
}
</script>
<template>
  <section class="learning-page">
    <p class="eyebrow">Cada pequeño paso cuenta</p>
    <h1 id="page-title" tabindex="-1">Progreso</h1>
    <p class="section-intro">
      {{ store.level }} · Tu aprendizaje se guarda en este navegador. Exporta una copia para
      llevarlo contigo.
    </p>
    <div class="stats-grid">
      <article class="learning-card">
        <span class="stat-number">{{ store.data.xp }}</span>
        <h2>XP total</h2>
      </article>
      <article class="learning-card">
        <span class="stat-number">{{ store.data.streak.current }}</span>
        <h2>Días de racha</h2>
        <p>Mejor: {{ store.data.streak.best }}</p>
      </article>
      <article class="learning-card">
        <span class="stat-number">{{ store.completed }}/{{ challenges.length }}</span>
        <h2>Retos resueltos</h2>
      </article>
      <article class="learning-card">
        <span class="stat-number"
          >{{ Object.keys(store.data.lessons).length }}/{{ lessons.length }}</span
        >
        <h2>Lecciones</h2>
        <p>
          ≈ {{ Object.keys(store.data.lessons).length * 6 + store.completed * 3 }} min de práctica
          estimada
        </p>
      </article>
    </div>
    <div v-if="!store.data.xp" class="learning-card empty-state">
      <h2>Tu primera selección está a un paso</h2>
      <p>Completa una lección o resuelve un reto para empezar a ver tu avance.</p>
      <RouterLink class="button button-primary" to="/retos">Elegir mi primer reto →</RouterLink>
    </div>
    <div class="learning-grid progress-panels">
      <section v-if="dueReviews.length" class="learning-card">
        <h2>Ideas listas para repasar</h2>
        <p>
          Los repasos se espacian en cinco cajas: 1, 3, 7, 14 y 30 días. Repetir un reto no vuelve a
          sumar su XP.
        </p>
        <RouterLink
          v-for="item in dueReviews.slice(0, 5)"
          :key="item.id"
          class="review-link"
          :to="`/retos/${item.id}`"
          >{{ item.title }} →</RouterLink
        >
      </section>
      <section class="learning-card">
        <h2>Tu semana</h2>
        <div class="activity-chart" aria-label="Actividad de los últimos siete días">
          <div v-for="day in days" :key="day.key" class="activity-column">
            <span>{{ day.count }}</span>
            <div
              class="activity-bar"
              :style="{ height: `${Math.min(100, day.count * 12) + 4}px` }"
            ></div>
            <span>{{ day.label }}</span>
          </div>
        </div>
        <p>Lecciones y retos completados por día.</p>
      </section>
      <section class="learning-card">
        <h2>Qué repasar ahora</h2>
        <p>
          {{ moduleNames[recommendation.module] }}: vuelve a un ejemplo, experimenta y resuelve un
          reto sin pistas.
        </p>
        <RouterLink class="button button-secondary" :to="`/teoria/m${recommendation.module}`"
          >Repasar este módulo →</RouterLink
        ><label class="goal-setting"
          >Objetivo diario<select v-model="store.data.settings.dailyGoal">
            <option :value="1">1 actividad</option>
            <option :value="2">2 actividades</option>
            <option :value="3">3 actividades</option>
          </select></label
        >
      </section>
    </div>
    <section class="learning-card mastery-section">
      <h2>Dominio por concepto</h2>
      <p>
        Estimación según retos resueltos, intentos y pistas. Un módulo se completa con el 80 % de
        sus retos y el integrador.
      </p>
      <div v-for="(value, i) in store.mastery" :key="i" class="mastery-row">
        <label :for="`mastery-${i}`"
          >{{ moduleNames[i + 1] }} {{ moduleCompleted(i + 1) ? '✓' : '' }}</label
        ><progress :id="`mastery-${i}`" :value="value" max="1"></progress
        ><span>{{ Math.round(value * 100) }} %</span>
      </div>
    </section>
    <section class="badges-section">
      <h2>
        Tus insignias · {{ Object.keys(store.data.badges).length }}/{{ badgeDefinitions.length }}
      </h2>
      <div class="learning-grid badge-grid">
        <article
          v-for="badge in badgeDefinitions"
          :key="badge.id"
          class="learning-card badge-card"
          :class="{ earned: Boolean(store.data.badges[badge.id]) }"
        >
          <span class="badge-symbol" aria-hidden="true">{{
            store.data.badges[badge.id] ? '✦' : '◇'
          }}</span>
          <h3>{{ badge.name }}</h3>
          <p>{{ badge.description }}</p>
          <span class="eyebrow">{{
            store.data.badges[badge.id] ? '✓ Conseguida' : 'Por descubrir'
          }}</span>
        </article>
      </div>
    </section>
    <section class="learning-card settings-section">
      <h2>A tu manera</h2>
      <label class="check-option"
        ><input v-model="store.data.settings.celebrations" type="checkbox" />Anunciar
        insignias</label
      ><label class="check-option"
        ><input v-model="store.data.settings.contrast" type="checkbox" />Alto contraste</label
      ><label class="check-option"
        ><input v-model="store.data.settings.readingFont" type="checkbox" />Lectura con más
        espacio</label
      >
    </section>
    <section class="learning-card data-section">
      <h2>Tu progreso, bajo tu control</h2>
      <p v-if="needsBackup">
        Hace tiempo que no guardas una copia. Exporta tu progreso para conservarlo si borras los
        datos del navegador.
      </p>
      <div class="card-actions">
        <button class="button button-secondary" @click="exportData">Exportar progreso JSON</button
        ><label class="file-label"
          >Importar progreso JSON<input
            type="file"
            accept="application/json,.json"
            @change="importData" /></label
        ><button class="button button-secondary" @click="confirmReset = true">
          Reiniciar progreso
        </button>
      </div>
      <p role="status">{{ message }}</p>
      <div v-if="confirmReset" class="reset-confirmation">
        <h3>¿Reiniciar todo el progreso?</h3>
        <p>
          Se borrarán XP, lecciones, retos, favoritos e insignias. Exporta antes una copia si
          quieres recuperarlos.
        </p>
        <button class="button button-secondary" @click="confirmReset = false">Cancelar</button
        ><button class="button button-primary" @click="resetProgress">Sí, borrar progreso</button>
      </div>
    </section>
  </section>
</template>
