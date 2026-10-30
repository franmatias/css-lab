<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { workshops } from '../../../packages/content/src/design'
import { checkWorkshop } from '@/domain/designWorkshop'
import { useLearningStore } from '@/shared/model/learningStore'
import CodeEditor from '@/features/lab/CodeEditor.vue'
import CollapsibleSidebar from '@/shared/ui/CollapsibleSidebar.vue'
import { evaluateSelector, createPreviewDocument } from '@/features/lab/model/selectorEvaluator'
import { encodeSharedLabDraft } from '@/features/lab/model/shareLabDraft'
import { formatCode } from '@/features/lab/model/formatCode'
import '@/features/lab/lab.css'
import './design.css'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const learning = useLearningStore()
const current = computed(() => workshops.find((item) => item.id === route.params.id))
const category = ref('')
const query = ref('')
const categories = [...new Set(workshops.map((item) => item.category))]
const items = computed(() =>
  workshops.filter(
    (item) =>
      (!category.value || item.category === category.value) &&
      `${item.title} ${item.summary}`.toLowerCase().includes(query.value.toLowerCase()),
  ),
)
const expanded = ref(true)
const width = ref('375')
const css = ref('')
const answer = ref('')
const renderedCss = ref('')
const message = ref('')
const verdict = ref<ReturnType<typeof checkWorkshop> | null>(null)
const resetPending = ref(false)
watch(
  current,
  (item) => {
    const saved = item && learning.data.workshops[item.id]
    css.value = saved?.css ?? (item ? `${item.baseCss}\n\n${item.starter}` : '')
    renderedCss.value = css.value
    answer.value = saved?.answer ?? ''
    message.value = ''
    verdict.value = null
    resetPending.value = false
  },
  { immediate: true },
)
const renderLater = useDebounceFn(() => {
  renderedCss.value = css.value
}, 180)
watch(
  [css, answer],
  () => {
    if (current.value) learning.saveWorkshop(current.value.id, css.value, answer.value)
    verdict.value = null
    message.value = ''
    void renderLater()
  },
  { flush: 'sync' },
)
const preview = computed(() => {
  if (!current.value) return ''
  const evaluation = evaluateSelector({
    html: current.value.html,
    css: renderedCss.value,
    selector: '*',
  })
  return createPreviewDocument({ ...evaluation, matchedElementIds: [] }, renderedCss.value, {
    highlight: 'none',
    animations: false,
  })
})
function check() {
  if (!current.value) return
  renderedCss.value = css.value
  verdict.value = checkWorkshop(current.value, css.value, answer.value)
  if (verdict.value.quiz && verdict.value.declarations.every(Boolean)) {
    learning.saveWorkshop(current.value.id, css.value, answer.value)
    const points = learning.completeWorkshop(current.value.id)
    message.value = t(points ? 'design.won' : 'design.repeated', { points })
  } else message.value = t('design.retry')
}
async function format() {
  const item = current.value
  const original = css.value
  try {
    const formatted = await formatCode(original, 'css', { useTabs: false, tabWidth: 2 })
    if (current.value === item && css.value === original) css.value = formatted
  } catch {
    message.value = t('design.formatError')
  }
}
async function solution() {
  if (!current.value) return
  const item = current.value
  const original = css.value
  const formatted = await formatCode(`${item.baseCss}\n\n${item.solution}`, 'css', {
    useTabs: false,
    tabWidth: 2,
  })
  if (current.value === item && css.value === original) css.value = formatted
}
function restart() {
  if (!current.value) return
  css.value = `${current.value.baseCss}\n\n${current.value.starter}`
  answer.value = ''
  resetPending.value = false
}
async function openLab() {
  if (current.value)
    await router.push(
      `/laboratorio${await encodeSharedLabDraft({ html: current.value.html, css: css.value, selector: current.value.checks[0]!.selector })}`,
    )
}
const next = computed(
  () => workshops[workshops.findIndex((item) => item.id === current.value?.id) + 1],
)
</script>

<template>
  <section class="learning-page design-page">
    <p class="eyebrow">{{ t('design.eyebrow') }}</p>
    <h1 id="page-title" tabindex="-1">{{ current?.title ?? t('nav.design') }}</h1>
    <p class="section-intro">{{ current?.summary ?? t('design.intro') }}</p>
    <p class="design-progress">
      {{ t('design.progress', { count: learning.workshopsCompleted, total: workshops.length }) }} ·
      {{ t('design.reward') }}
    </p>
    <template v-if="current">
      <div class="card-actions">
        <RouterLink class="text-link" to="/diseno">← {{ t('design.all') }}</RouterLink>
        <button class="button button-primary" @click="openLab">{{ t('examples.open') }}</button>
      </div>
      <div class="design-layout" :class="{ 'sidebar-collapsed': !expanded }">
        <CollapsibleSidebar v-model="expanded" :title="t('design.route')">
          <nav :aria-label="t('design.route')">
            <RouterLink
              v-for="(item, index) in workshops"
              :key="item.id"
              :to="`/diseno/${item.id}`"
              :aria-current="item.id === current.id ? 'page' : undefined"
              ><span>{{ learning.data.workshops[item.id]?.completedAt ? '✓' : index + 1 }}</span>
              {{ item.title }}</RouterLink
            >
          </nav>
        </CollapsibleSidebar>
        <div class="design-content">
          <article class="learning-card">
            <p class="eyebrow">{{ current.category }} · {{ current.minutes }} min</p>
            <h2>{{ t('design.concepts') }}</h2>
            <ul>
              <li v-for="concept in current.concepts" :key="concept">{{ concept }}</li>
            </ul>
            <h3>{{ t('examples.pitfall') }}</h3>
            <p>{{ current.pitfall }}</p>
            <a class="text-link" :href="current.source" target="_blank" rel="noopener noreferrer">{{
              t('examples.source')
            }}</a>
          </article>
          <div class="design-workbench">
            <article class="learning-card">
              <h2>{{ t('design.practice') }}</h2>
              <ol>
                <li v-for="step in current.steps" :key="step">{{ step }}</li>
              </ol>
              <p class="design-task">{{ current.task }}</p>
              <p class="design-scope">{{ t('design.scope') }}</p>
              <div class="card-actions">
                <button class="button button-secondary" @click="format">
                  {{ t('design.format') }}
                </button>
                <button class="button button-secondary" @click="solution">
                  {{ t('design.solution') }}
                </button>
                <button class="button button-secondary" @click="resetPending = !resetPending">
                  {{ t('design.restart') }}
                </button>
              </div>
              <div v-if="resetPending" class="design-reset">
                <p>{{ t('design.resetQuestion') }}</p>
                <button class="button button-secondary" @click="restart">
                  {{ t('design.resetConfirm') }}</button
                ><button class="button button-secondary" @click="resetPending = false">
                  {{ t('design.cancel') }}
                </button>
              </div>
              <div class="design-editor">
                <CodeEditor
                  v-model="css"
                  language="css"
                  :label="t('design.editor')"
                  :max-length="20000"
                  @format="format"
                />
              </div>
              <details class="design-html">
                <summary>{{ t('design.html') }}</summary>
                <pre><code>{{ current.html }}</code></pre>
              </details>
            </article>
            <section class="learning-card design-preview-panel">
              <div class="design-preview-heading">
                <h2>{{ t('design.preview') }}</h2>
                <label
                  >{{ t('design.width') }}
                  <select v-model="width">
                    <option value="375">375 px · Móvil</option>
                    <option value="768">768 px · Tableta</option>
                    <option value="1200">1200 px · Escritorio</option>
                  </select></label
                >
              </div>
              <p>{{ t('design.previewHelp') }}</p>
              <div
                class="design-preview-scroll"
                tabindex="0"
                role="region"
                :aria-label="t('design.previewScroll')"
              >
                <iframe
                  :key="current.id"
                  :srcdoc="preview"
                  :style="{ width: `${width}px` }"
                  :title="`${t('design.preview')}: ${current.title}`"
                  sandbox=""
                  referrerpolicy="no-referrer"
                />
              </div>
            </section>
          </div>
          <section class="learning-card design-check">
            <h2>{{ t('design.checkTitle') }}</h2>
            <fieldset>
              <legend>{{ current.question }}</legend>
              <label v-for="(option, index) in current.options" :key="option"
                ><input
                  v-model="answer"
                  type="radio"
                  :name="`quiz-${current.id}`"
                  :value="String(index)"
                />
                {{ option }}</label
              >
            </fieldset>
            <button class="button button-primary" @click="check">{{ t('design.check') }}</button>
            <div v-if="verdict" class="design-verdict">
              <ul>
                <li
                  v-for="(rule, index) in current.checks"
                  :key="`${rule.selector}-${rule.property}`"
                >
                  {{ verdict.declarations[index] ? '✓' : '○' }}
                  <code>{{ rule.selector }} · {{ rule.property }}: {{ rule.value }}</code
                  ><span v-if="rule.media"> · @media {{ rule.media }}</span>
                </li>
              </ul>
              <p>
                {{ verdict.quiz ? '✓' : '○' }}
                {{ t(verdict.quiz ? 'design.quizCorrect' : 'design.quizRetry') }}
              </p>
              <p v-if="verdict.quiz">{{ current.reason }}</p>
            </div>
            <p role="status">{{ message }}</p>
            <p v-if="learning.data.workshops[current.id]?.completedAt" class="design-completed">
              ✓ {{ t('design.completed') }}
            </p>
            <RouterLink v-if="next" class="text-link" :to="`/diseno/${next.id}`"
              >{{ t('design.next') }}: {{ next.title }} →</RouterLink
            >
          </section>
        </div>
      </div>
    </template>
    <template v-else>
      <p v-if="route.params.id" role="status">{{ t('design.notFound') }}</p>
      <div class="design-filters">
        <label
          >{{ t('design.search')
          }}<input v-model="query" type="search" :placeholder="t('design.placeholder')" /></label
        ><label
          >{{ t('design.category')
          }}<select v-model="category">
            <option value="">{{ t('design.allCategories') }}</option>
            <option v-for="item in categories" :key="item">{{ item }}</option>
          </select></label
        >
      </div>
      <p aria-live="polite">{{ t('design.count', { count: items.length }) }}</p>
      <div class="learning-grid design-grid">
        <article v-for="item in items" :key="item.id" class="learning-card">
          <p class="eyebrow">{{ item.category }} · {{ item.minutes }} min</p>
          <h2>
            <RouterLink :to="`/diseno/${item.id}`">{{ item.title }}</RouterLink>
          </h2>
          <p>{{ item.summary }}</p>
          <p v-if="learning.data.workshops[item.id]?.completedAt">✓ {{ t('design.completed') }}</p>
          <RouterLink class="text-link" :to="`/diseno/${item.id}`"
            >{{ t('design.start') }} →</RouterLink
          >
        </article>
      </div>
      <p v-if="!items.length">{{ t('examples.empty') }}</p>
    </template>
  </section>
</template>
