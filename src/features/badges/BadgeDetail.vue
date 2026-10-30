<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { BadgeDefinition } from '@/domain/badges'
import { badgeFamily, badgeProgress } from '@/domain/badges'
import { challenges } from '../../../packages/content/src'
import { useLearningStore } from '@/shared/model/learningStore'
import BadgeMedal from '@/shared/ui/BadgeMedal.vue'
import { badgeDestination, medalArt, medalTiers } from './badgeArt'
const props = defineProps<{ badge: BadgeDefinition | null }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const store = useLearningStore()
function sync() {
  if (props.badge && !dialog.value?.open) dialog.value?.showModal()
  else if (!props.badge && dialog.value?.open) dialog.value.close()
}
watch(() => props.badge, sync, { flush: 'post' })
onMounted(sync)
</script>
<template>
  <dialog
    ref="dialog"
    class="medal-detail"
    aria-labelledby="medal-detail-title"
    @close="emit('close')"
  >
    <template v-if="badge"
      ><button
        class="medal-detail-close"
        aria-label="Cerrar detalle de insignia"
        @click="dialog?.close()"
      >
        ×</button
      ><BadgeMedal :badge="badge" :unlocked="Boolean(store.data.badges[badge.id])" :size="280" />
      <p class="eyebrow">
        {{ badgeFamily(badge.metric) }} · {{ medalTiers[medalArt(badge).tier] }}
      </p>
      <h2 id="medal-detail-title">{{ badge.name }}</h2>
      <p>{{ badge.description }}</p>
      <p class="medal-detail-state">
        {{
          store.data.badges[badge.id]
            ? '✓ Ya forma parte de tu colección'
            : 'Tu próxima conquista empieza con un paso'
        }}
      </p>
      <progress
        :value="
          store.data.badges[badge.id]
            ? 1
            : badgeProgress(badge, store.data, challenges).current /
              badgeProgress(badge, store.data, challenges).target
        "
        max="1"
        :aria-label="`Progreso de ${badge.name}`"
      />
      <p v-if="!store.data.badges[badge.id]">
        {{ badgeProgress(badge, store.data, challenges).current }} de
        {{ badgeProgress(badge, store.data, challenges).target }} ·
        {{
          badgeProgress(badge, store.data, challenges).target -
          badgeProgress(badge, store.data, challenges).current
        }}
        para conseguirla
      </p>
      <RouterLink
        class="button button-primary"
        :to="badgeDestination(badge)"
        @click="dialog?.close()"
        >{{
          store.data.badges[badge.id] ? 'Seguir practicando' : 'Ir a por esta insignia'
        }}
        →</RouterLink
      ></template
    >
  </dialog>
</template>
<style>
.medal-detail {
  position: fixed;
  inset: 0;
  width: min(92vw, 520px);
  max-height: 90dvh;
  margin: auto;
  padding: 1.5rem 2rem 2rem;
  overflow: auto;
  border: 1px solid var(--border-strong);
  border-radius: 1.5rem;
  text-align: center;
  color: var(--text);
  background:
    radial-gradient(
      ellipse at 50% 18%,
      color-mix(in srgb, var(--primary) 12%, transparent),
      transparent 60%
    ),
    var(--surface);
  box-shadow: 0 24px 90px #0006;
}
.medal-detail::backdrop {
  background: #080d24bb;
  backdrop-filter: blur(7px);
}
.medal-detail h2 {
  font-size: 1.8rem;
  margin: 0.4rem 0;
}
.medal-detail p {
  line-height: 1.6;
}
.medal-detail progress {
  width: 100%;
  accent-color: var(--primary);
}
.medal-detail-close {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  height: 44px;
  width: 44px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.6rem;
}
.medal-detail-state {
  color: var(--primary);
  font-weight: 700;
}
@media (max-width: 450px) {
  .medal-detail {
    padding: 1.1rem;
  }
  .medal-detail .badge-medal-art {
    width: 220px;
  }
}
</style>
