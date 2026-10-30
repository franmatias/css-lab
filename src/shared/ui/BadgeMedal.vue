<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  LayoutTemplate,
  Landmark,
  MoveHorizontal,
  MoveVertical,
  Grid2X2,
  LayoutGrid,
  Smartphone,
  MonitorSmartphone,
} from '@lucide/vue'
import {
  MousePointer2,
  Zap,
  Target,
  ShieldCheck,
  Trophy,
  Gem,
  Crown,
  BookOpen,
  Braces,
  Layers,
  ListFilter,
  GitBranch,
  Binary,
  Crosshair,
  Network,
  WandSparkles,
  Scale,
  Flame,
  Sunrise,
  Sun,
  Milestone,
  CalendarCheck,
  RotateCcw,
  Compass,
  Bookmark,
  MoonStar,
  Share2,
  Swords,
  Sparkles,
  Eye,
  AlarmClock,
  Rocket,
  Orbit,
  Telescope,
  Satellite,
  Focus,
  Bird,
  Palette,
  Paintbrush,
  GraduationCap,
  Table2,
  TableProperties,
  Medal,
} from '@lucide/vue'
import type { BadgeDefinition } from '@/domain/badges'
import { medalArt, medalPalette } from '@/features/badges/badgeArt'
const props = withDefaults(
  defineProps<{ badge: BadgeDefinition; unlocked?: boolean; size?: number }>(),
  { unlocked: false, size: 184 },
)
const id = `medal-${useId()}`
const art = computed(() => medalArt(props.badge))
const icons: Record<string, typeof Medal> = {
  MousePointer2,
  Zap,
  Target,
  ShieldCheck,
  Trophy,
  Gem,
  Crown,
  BookOpen,
  Braces,
  Layers,
  ListFilter,
  GitBranch,
  Binary,
  Crosshair,
  Network,
  WandSparkles,
  Scale,
  Flame,
  Sunrise,
  Sun,
  Milestone,
  CalendarCheck,
  RotateCcw,
  Compass,
  Bookmark,
  MoonStar,
  Share2,
  Swords,
  Sparkles,
  Eye,
  AlarmClock,
  Rocket,
  Orbit,
  Telescope,
  Satellite,
  Focus,
  Bird,
  Palette,
  Paintbrush,
  GraduationCap,
  Table2,
  TableProperties,
  Medal,
}
Object.assign(icons, {
  LayoutTemplate,
  Landmark,
  MoveHorizontal,
  MoveVertical,
  Grid2X2,
  LayoutGrid,
  Smartphone,
  MonitorSmartphone,
})
</script>
<template>
  <span
    class="badge-medal-art"
    :class="[
      `medal-${medalPalette(badge.metric)}`,
      `medal-tier-${art.tier}`,
      { 'medal-unlocked': unlocked },
    ]"
    :style="{ '--medal-size': `${size}px` }"
    :data-badge-art="badge.id"
    aria-hidden="true"
  >
    <svg viewBox="0 0 240 262" class="medal-illustration" focusable="false">
      <defs>
        <linearGradient
          :id="`${id}-metal`"
          x1="0"
          y1="0"
          x2=".85"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#fff9d8" />
          <stop offset=".25" stop-color="#e9b44c" />
          <stop offset=".45" stop-color="#fff0ac" />
          <stop offset=".65" stop-color="#a76221" />
          <stop offset=".83" stop-color="#f6d279" />
          <stop offset="1" stop-color="#c58935" />
        </linearGradient>
        <linearGradient :id="`${id}-core`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="var(--medal-light)" />
          <stop offset=".4" stop-color="var(--medal-accent)" />
          <stop offset="1" stop-color="var(--medal-deep)" />
        </linearGradient>
        <radialGradient :id="`${id}-enamel`" cx=".4" cy=".25" r=".9">
          <stop stop-color="#364269" />
          <stop offset=".7" stop-color="#101b35" />
          <stop offset="1" stop-color="#080e20" />
        </radialGradient>
      </defs>
      <g class="medal-ribbons">
        <path d="M65 170 57 250 88 231 108 257 124 174Z" :fill="`url(#${id}-core)`" />
        <path d="m115 173 18 84 21-26 30 19-12-80Z" :fill="`url(#${id}-core)`" />
        <path
          d="m72 190-6 43 19-12 14 18 12-50m20 0 12 50 13-18 19 12-7-43"
          fill="none"
          stroke="#fff0ac"
          stroke-opacity=".5"
          stroke-width="2"
        />
      </g>
      <g v-if="art.tier >= 3" :fill="`url(#${id}-metal)`" opacity=".95">
        <path d="M57 172C22 157 16 118 28 92c-2 31 9 48 29 64Z" />
        <path
          d="M40 143C9 133 12 116 14 109c17 1 27 11 26 34ZM32 119C9 109 13 91 18 85c14 8 19 20 14 34ZM33 95C17 82 24 67 32 63c10 9 12 20 1 32ZM183 172c35-15 41-54 29-80 2 31-9 48-29 64Z"
        />
        <path
          d="M200 143c31-10 28-27 26-34-17 1-27 11-26 34ZM208 119c23-10 19-28 14-34-14 8-19 20-14 34ZM207 95c16-13 9-28 1-32-10 9-12 20-1 32Z"
        />
      </g>
      <path
        v-if="art.tier === 4"
        d="m78 39-9-26 25 12L120 3l26 22 25-12-9 26Z"
        :fill="`url(#${id}-metal)`"
        stroke="#fff1b8"
        stroke-width="1.5"
      />
      <path
        d="m120 24 23 9 25 1 13 20 21 14 2 25 9 23-9 23-2 25-21 14-13 20-25 1-23 9-23-9-25-1-13-20-21-14-2-25-9-23 9-23 2-25 21-14 13-20 25-1Z"
        :fill="`url(#${id}-metal)`"
        stroke="#6f411d"
        stroke-width="2"
      />
      <circle
        cx="120"
        cy="116"
        r="78"
        :fill="`url(#${id}-core)`"
        stroke="#fff1b8"
        stroke-width="2"
      />
      <circle cx="120" cy="116" r="68" fill="none" :stroke="`url(#${id}-metal)`" stroke-width="3" />
      <circle
        cx="120"
        cy="116"
        r="60"
        :fill="`url(#${id}-enamel)`"
        stroke="#e8b853"
        stroke-width="1"
      />
      <path
        d="M67 101c4-30 30-47 57-45 22 1 38 12 46 25-34-16-66-12-103 20Z"
        fill="white"
        opacity=".12"
      />
      <g :fill="`url(#${id}-metal)`">
        <path
          d="m120 37 4 7-4 7-4-7ZM120 181l4 7-4 7-4-7ZM43 116l7-4 7 4-7 4ZM183 116l7-4 7 4-7 4Z"
        />
      </g>
      <g
        v-for="star in art.tier"
        :key="star"
        :transform="`translate(${120 + (star - (art.tier + 1) / 2) * 15} 167)`"
        fill="#fff1b8"
      >
        <path d="m0-5 1.5 3 3.5.5-2.5 2.4.6 3.5L0 2.8-3.1 4.4l.6-3.5L-5-1.5l3.5-.5Z" />
      </g>
      <path d="m77 206 43 15 43-15-7 20-36 13-36-13Z" :fill="`url(#${id}-metal)`" />
      <path
        class="medal-glint"
        d="m181 35 3 10 10 3-10 3-3 10-3-10-10-3 10-3ZM48 178l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"
        fill="#fff9dc"
      />
    </svg>
    <component :is="icons[art.icon] ?? Medal" class="medal-emblem" :stroke-width="1.6" />
    <span v-if="!unlocked" class="medal-lock"
      ><svg viewBox="0 0 20 20" fill="none">
        <path d="M6 9V6a4 4 0 0 1 8 0v3M5 9h10v8H5Z" stroke="currentColor" stroke-width="1.8" />
        <circle cx="10" cy="13" r="1" fill="currentColor" /></svg
    ></span>
  </span>
</template>
<style>
.badge-medal-art {
  --medal-accent: #7256e5;
  --medal-light: #c4b5fd;
  --medal-deep: #30216f;
  display: inline-block;
  position: relative;
  width: var(--medal-size);
  max-width: 100%;
  aspect-ratio: 240/262;
  flex-shrink: 0;
  isolation: isolate;
  filter: saturate(0.5);
  transition:
    filter 0.25s,
    transform 0.25s;
}
.badge-medal-art::before {
  content: '';
  position: absolute;
  inset: 15% 0 10%;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--medal-accent) 25%, transparent),
    transparent 67%
  );
  transform: scale(1.3);
  opacity: 0.55;
}
.medal-illustration {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 9px 6px #060b2433);
}
.medal-emblem {
  position: absolute;
  width: 30%;
  height: 30%;
  left: 35%;
  top: 26%;
  color: #f9e5ad;
  filter: drop-shadow(0 3px 0 #050b1e)
    drop-shadow(0 0 6px color-mix(in srgb, var(--medal-light) 40%, transparent));
}
.medal-unlocked {
  filter: saturate(1);
}
.medal-unlocked::before {
  opacity: 1;
}
.medal-lock {
  position: absolute;
  right: 14%;
  bottom: 21%;
  width: 24px;
  height: 24px;
  padding: 4px;
  border-radius: 50%;
  background: #14203a;
  color: #f9e5ad;
  border: 1px solid #d8b775;
}
.medal-lock svg {
  width: 100%;
  height: 100%;
}
.medal-cosmos {
  --medal-accent: #7c3aed;
  --medal-light: #e9b5ff;
  --medal-deep: #3b1479;
}
.medal-ocean {
  --medal-accent: #0891b2;
  --medal-light: #a5f3fc;
  --medal-deep: #164e63;
}
.medal-rose {
  --medal-accent: #db2777;
  --medal-light: #fbcfe8;
  --medal-deep: #831843;
}
.medal-ember {
  --medal-accent: #e65b16;
  --medal-light: #fed7aa;
  --medal-deep: #9a3412;
}
.medal-emerald {
  --medal-accent: #059669;
  --medal-light: #a7f3d0;
  --medal-deep: #064e3b;
}
.medal-amber {
  --medal-accent: #d49b1f;
  --medal-light: #fef3c7;
  --medal-deep: #78350f;
}
.medal-tier-4 .medal-illustration {
  filter: drop-shadow(0 9px 7px #060b2444)
    drop-shadow(0 0 9px color-mix(in srgb, var(--medal-accent) 20%, transparent));
}
@media (prefers-reduced-motion: reduce) {
  .badge-medal-art {
    transition: none;
  }
}
</style>
