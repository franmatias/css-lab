<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Award, Sparkles, Star, Trophy, X } from '@lucide/vue'
import { badgeDefinitions } from '../../../packages/content/src/badges'
import type { LearningCelebration } from '@/shared/model/learningStore'
import BadgeMedal from './BadgeMedal.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ celebration: LearningCelebration; level: string }>()
const { t } = useI18n()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLElement | null>(null)
const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
const badges = badgeDefinitions.filter((badge) => props.celebration.badgeIds.includes(badge.id))

function close() {
  emit('close')
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
  if (event.key !== 'Tab' || !dialog.value) return
  const items = Array.from(
    dialog.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'),
  )
  if (!items.length) return
  const first = items[0]!
  const last = items.at(-1)!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
onMounted(() => {
  document.body.style.overflow = 'hidden'
  void nextTick(() => dialog.value?.focus())
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  void nextTick(() => returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }))
})
</script>

<template>
  <div class="completion-backdrop" @click.self="close">
    <section
      ref="dialog"
      class="completion-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      tabindex="-1"
      @keydown="onKeydown"
    >
      <div class="completion-burst" aria-hidden="true">
        <span v-for="index in 12" :key="index" :style="{ '--ray': index }"></span>
      </div>
      <button
        class="completion-close"
        type="button"
        :aria-label="t('completion.close')"
        @click="close"
      >
        <X :size="22" aria-hidden="true" />
      </button>
      <div class="completion-trophy" aria-hidden="true">
        <Trophy :size="62" :stroke-width="1.8" />
        <Sparkles class="completion-spark" :size="28" />
      </div>
      <p class="eyebrow">{{ t('completion.eyebrow') }}</p>
      <h2 id="completion-title">{{ celebration.title }}</h2>
      <p class="completion-message">{{ t('completion.message') }}</p>
      <dl class="completion-summary">
        <div>
          <dt><Star :size="19" aria-hidden="true" /> {{ t('completion.points') }}</dt>
          <dd>+{{ celebration.points }} XP</dd>
        </div>
        <div>
          <dt><Award :size="19" aria-hidden="true" /> {{ t('completion.level') }}</dt>
          <dd>{{ level }}</dd>
        </div>
        <div>
          <dt>{{ t('completion.total') }}</dt>
          <dd>{{ celebration.totalXp }} XP</dd>
        </div>
      </dl>
      <section v-if="badges.length" class="completion-badges" aria-label="Insignias obtenidas">
        <h3>{{ t(badges.length === 1 ? 'completion.badge' : 'completion.badges') }}</h3>
        <div>
          <article v-for="badge in badges" :key="badge.id">
            <BadgeMedal :badge="badge" unlocked :size="108" />
            <strong>{{ badge.name }}</strong>
          </article>
        </div>
      </section>
      <button class="button button-primary completion-continue" type="button" @click="close">
        {{ t('completion.continue') }}
      </button>
    </section>
  </div>
</template>

<style>
.completion-backdrop {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgb(15 23 42 / 72%);
  backdrop-filter: blur(8px);
}
.completion-dialog {
  position: relative;
  width: min(100%, 620px);
  max-height: calc(100dvh - 2rem);
  overflow: auto;
  padding: clamp(1.4rem, 4vw, 2.5rem);
  border: 1px solid color-mix(in srgb, var(--primary) 55%, var(--border));
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 50% 0%,
      color-mix(in srgb, var(--primary) 20%, transparent),
      transparent 42%
    ),
    var(--surface);
  box-shadow: 0 28px 80px rgb(15 23 42 / 45%);
  text-align: center;
  animation: completion-enter 0.5s cubic-bezier(0.2, 0.9, 0.25, 1.2);
}
.completion-dialog:focus {
  outline: 3px solid color-mix(in srgb, var(--primary) 65%, transparent);
  outline-offset: 4px;
}
.completion-close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text);
  background: var(--surface);
  cursor: pointer;
}
.completion-trophy {
  position: relative;
  display: grid;
  place-items: center;
  width: 112px;
  height: 112px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  color: #f59e0b;
  background: linear-gradient(145deg, #fff7d6, #fde68a);
  box-shadow:
    0 0 0 10px rgb(245 158 11 / 10%),
    0 18px 35px rgb(245 158 11 / 24%);
  animation: completion-float 2.2s ease-in-out infinite;
}
.completion-spark {
  position: absolute;
  top: 4px;
  right: 3px;
  color: var(--primary);
}
.completion-dialog h2 {
  margin: 0.35rem 0;
  font-size: clamp(1.55rem, 4vw, 2.25rem);
}
.completion-message {
  color: var(--text-muted);
}
.completion-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin: 1.4rem 0;
}
.completion-summary div {
  padding: 0.85rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-2);
}
.completion-summary dt {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-muted);
  font-size: 0.72rem;
}
.completion-summary dd {
  margin: 0.4rem 0 0;
  color: var(--primary);
  font-weight: 800;
  font-size: 1.05rem;
}
.completion-badges > div {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.completion-badges article {
  display: grid;
  justify-items: center;
  gap: 0.25rem;
}
.completion-continue {
  margin-top: 1.3rem;
}
.completion-burst {
  position: absolute;
  inset: 38px 50% auto;
  pointer-events: none;
}
.completion-burst span {
  --angle: calc(var(--ray) * 30deg);
  position: absolute;
  width: 8px;
  height: 20px;
  border-radius: 9px;
  background: hsl(calc(var(--ray) * 30) 85% 58%);
  transform: rotate(var(--angle)) translateY(-84px);
  animation: completion-ray 0.8s calc(var(--ray) * 28ms) ease-out both;
}
@keyframes completion-enter {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.9);
  }
}
@keyframes completion-float {
  50% {
    transform: translateY(-7px) rotate(2deg);
  }
}
@keyframes completion-ray {
  from {
    opacity: 0;
    transform: rotate(var(--angle)) translateY(-30px) scale(0.3);
  }
  to {
    opacity: 1;
  }
}
@media (max-width: 560px) {
  .completion-summary {
    grid-template-columns: 1fr;
  }
  .completion-summary div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .completion-summary dd {
    margin: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .completion-dialog,
  .completion-trophy,
  .completion-burst span {
    animation: none;
  }
}
</style>
