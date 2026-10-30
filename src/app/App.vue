<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useEventListener, useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  BookOpenText,
  Braces,
  ChartNoAxesColumnIncreasing,
  Flame,
  FlaskConical,
  LibraryBig,
  Moon,
  Monitor,
  Sun,
  Target,
  Menu,
  X,
  Award,
  Orbit,
} from '@lucide/vue'
import { useThemeStore } from '@/features/theme/model/themeStore'
import { useLearningStore } from '@/shared/model/learningStore'

const { t } = useI18n()
const route = useRoute()
const themeStore = useThemeStore()
const learning = useLearningStore()
const { preference } = storeToRefs(themeStore)
const themeIcons = { system: Monitor, light: Sun, dark: Moon }
const menuOpen = ref(false)
const header = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const compact = useMediaQuery('(max-width: 1200px)')
function closeMenu(returnFocus = false) {
  menuOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}
async function toggleMenu() {
  if (menuOpen.value) {
    closeMenu(true)
    return
  }
  menuOpen.value = true
  await nextTick()
  document.querySelector<HTMLElement>('#responsive-menu a')?.focus()
}
useEventListener(document, 'keydown', (event) => {
  if (menuOpen.value && event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  }
})
useEventListener(document, 'pointerdown', (event) => {
  if (menuOpen.value && event.target instanceof Node && !header.value?.contains(event.target))
    closeMenu()
})
watch(compact, (value) => {
  if (!value) closeMenu()
})
const sections = [
  { label: 'nav.home', to: '/', icon: Braces },
  { label: 'nav.theory', to: '/teoria', icon: BookOpenText },
  { label: 'nav.catalog', to: '/catalogo', icon: LibraryBig },
  { label: 'nav.lab', to: '/laboratorio', icon: FlaskConical },
  { label: 'nav.design', to: '/diseno', icon: Braces },
  { label: 'nav.game', to: '/juego', icon: Orbit },
  { label: 'nav.challenges', to: '/retos', icon: Target },
  { label: 'nav.progress', to: '/progreso', icon: ChartNoAxesColumnIncreasing },
  { label: 'nav.badges', to: '/insignias', icon: Award },
] as const
const mobileSections = sections.filter(
  (section) => !['/juego', '/insignias', '/diseno'].includes(section.to),
)
const desktopSections = sections.filter((section) => section.to !== '/insignias')
const currentPage = computed(() => t(route.meta.titleKey ?? 'nav.home'))
const themeLabel = computed(() => t(`app.themes.${preference.value}`))
watch(
  () => themeStore.resolvedTheme,
  (theme) => {
    if (theme === 'dark') learning.explore('dark')
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  async () => {
    closeMenu()
    await nextTick()
    document.getElementById('page-title')?.focus({ preventScroll: true })
  },
)
</script>

<template>
  <a class="skip-link" href="#main-content">{{ t('app.skip') }}</a>
  <div class="app-shell">
    <header ref="header" class="site-header">
      <div class="header-inner">
        <RouterLink class="brand" to="/">
          <span class="brand-mark" aria-hidden="true">
            <Braces :size="22" :stroke-width="2.4" />
            <span class="brand-spark"></span>
          </span>
          <span class="brand-copy">
            <span class="brand-name">CSS Lab</span>
            <span class="brand-tagline">{{ t('app.tagline') }}</span>
          </span>
        </RouterLink>

        <nav class="desktop-nav" :aria-label="t('app.menuLabel')">
          <RouterLink
            v-for="section in desktopSections"
            :key="section.to"
            :to="section.to"
            class="nav-link"
            :exact-active-class="section.to === '/' ? 'nav-link-active' : undefined"
            active-class="nav-link-active"
          >
            {{ t(section.label) }}
          </RouterLink>
        </nav>

        <div class="header-actions">
          <RouterLink
            class="badge-shortcut"
            to="/insignias"
            :aria-label="t('app.badgeCount', { count: Object.keys(learning.data.badges).length })"
            ><Award :size="19" aria-hidden="true" /><span>{{
              Object.keys(learning.data.badges).length
            }}</span></RouterLink
          >
          <div class="streak-pill" :aria-label="t('app.streak')">
            <Flame :size="16" aria-hidden="true" />
            <span>{{
              learning.data.streak.current
                ? `${learning.data.streak.current} días de racha`
                : t('app.streak')
            }}</span>
          </div>
          <button
            class="theme-button"
            type="button"
            :aria-label="t('app.themeLabel', { theme: themeLabel })"
            :title="t('app.themeLabel', { theme: themeLabel })"
            @click="themeStore.cyclePreference"
          >
            <component :is="themeIcons[preference]" :size="18" aria-hidden="true" />
          </button>
          <button
            id="menu-button"
            ref="menuButton"
            class="menu-toggle"
            type="button"
            :aria-label="t(menuOpen ? 'app.closeMenu' : 'app.openMenu')"
            :aria-expanded="menuOpen"
            aria-controls="responsive-menu"
            @click="toggleMenu"
          >
            <component :is="menuOpen ? X : Menu" :size="22" aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav
        v-show="menuOpen"
        id="responsive-menu"
        class="responsive-menu"
        :aria-label="t('app.responsiveMenu')"
      >
        <RouterLink
          v-for="section in sections"
          :key="section.to"
          :to="section.to"
          active-class="responsive-link-active"
          @click="closeMenu(true)"
          ><component :is="section.icon" :size="19" aria-hidden="true" />{{
            t(section.label)
          }}</RouterLink
        >
        <RouterLink to="/ejemplos" @click="closeMenu(true)"
          ><Braces :size="19" aria-hidden="true" />{{ t('nav.examples') }}</RouterLink
        >
      </nav>
    </header>

    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{ t('app.currentPage', { page: currentPage }) }}
    </p>

    <main id="main-content" class="main-content">
      <p v-if="learning.notice" class="achievement-notice" role="status">
        ✦ {{ learning.notice }}
        <button aria-label="Cerrar aviso" @click="learning.notice = ''">×</button>
      </p>
      <p v-if="learning.saveFailed" class="feedback" role="status">
        No se puede guardar en este navegador. Exporta tu progreso antes de cerrar.
      </p>
      <RouterView v-slot="{ Component, route: activeRoute }">
        <component :is="Component" :key="activeRoute.fullPath" />
      </RouterView>
    </main>

    <footer class="site-footer">
      <span class="footer-mark" aria-hidden="true">{ }</span>
      <span>{{ t('app.footer') }}</span>
      <span class="footer-dot" aria-hidden="true"></span>
      <span>CSS Lab · 2026</span>
    </footer>

    <nav class="mobile-nav" :aria-label="t('app.mobileMenuLabel')">
      <RouterLink
        v-for="section in mobileSections"
        :key="section.to"
        :to="section.to"
        class="mobile-nav-link"
        :exact-active-class="section.to === '/' ? 'mobile-nav-link-active' : undefined"
        active-class="mobile-nav-link-active"
      >
        <component :is="section.icon" :size="19" aria-hidden="true" />
        <span>{{ t(section.label) }}</span>
      </RouterLink>
    </nav>
  </div>
</template>
