import { createI18n } from 'vue-i18n'
import { es } from '@/shared/i18n/es'

export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es },
})
