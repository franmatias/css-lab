<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { BadgeDefinition } from '@/domain/badges'
import { medalArt, medalTiers } from '@/features/badges/badgeArt'
import BadgeMedal from './BadgeMedal.vue'
defineProps<{ badge: BadgeDefinition }>()
defineEmits<{ dismiss: [] }>()
</script>
<template>
  <aside class="badge-celebration" aria-label="Nueva insignia">
    <BadgeMedal :badge="badge" unlocked :size="112" />
    <div>
      <p class="eyebrow">Una nueva conquista · {{ medalTiers[medalArt(badge).tier] }}</p>
      <p class="badge-celebration-title" role="status">Insignia conseguida: {{ badge.name }}</p>
      <p>{{ badge.description }}</p>
      <RouterLink class="text-link" :to="`/insignias?medalla=${badge.id}`"
        >Ver mi nueva medalla →</RouterLink
      >
    </div>
    <button class="badge-celebration-close" aria-label="Cerrar aviso" @click="$emit('dismiss')">
      ×
    </button>
  </aside>
</template>
<style>
.badge-celebration {
  display: flex;
  position: relative;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem auto;
  padding: 0.8rem 3rem 0.8rem 0.8rem;
  border: 1px solid var(--primary);
  border-radius: 1rem;
  max-width: 1184px;
  background:
    radial-gradient(
      ellipse at 5% 50%,
      color-mix(in srgb, var(--primary) 14%, transparent),
      transparent 65%
    ),
    var(--surface);
  animation: medal-reveal 0.55s ease-out;
}
.badge-celebration p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}
.badge-celebration .badge-celebration-title {
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--text);
}
.badge-celebration .eyebrow {
  font-size: 0.68rem;
}
.badge-celebration-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  font-size: 1.6rem;
  cursor: pointer;
}
@keyframes medal-reveal {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 500px) {
  .badge-celebration {
    gap: 0.5rem;
  }
  .badge-celebration .badge-medal-art {
    width: 76px;
  }
  .badge-celebration .badge-celebration-title {
    font-size: 1rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .badge-celebration {
    animation: none;
  }
}
</style>
