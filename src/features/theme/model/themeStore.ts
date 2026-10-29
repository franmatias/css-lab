import { useEventListener, usePreferredDark } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { readThemePreference, STORAGE_KEY, writeThemePreference } from './themeStorage'
import type { ThemePreference } from './themeStorage'

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>(readThemePreference())
  const prefersDark = usePreferredDark()
  const resolvedTheme = computed(() =>
    preference.value === 'system' ? (prefersDark.value ? 'dark' : 'light') : preference.value,
  )

  watch(
    resolvedTheme,
    (theme) => {
      document.documentElement.dataset.theme = theme
    },
    { immediate: true },
  )

  watch(preference, (theme) => writeThemePreference(theme))

  useEventListener(window, 'storage', (event) => {
    if (event.key === STORAGE_KEY) preference.value = readThemePreference()
  })

  function cyclePreference(): void {
    const options: ThemePreference[] = ['system', 'light', 'dark']
    const currentIndex = options.indexOf(preference.value)
    preference.value = options[(currentIndex + 1) % options.length] ?? 'system'
  }

  return { preference, resolvedTheme, cyclePreference }
})
