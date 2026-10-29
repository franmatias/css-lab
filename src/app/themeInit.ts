const storageKey = 'csslab:v1'
let preference: 'system' | 'light' | 'dark' = 'system'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

try {
  const stored = localStorage.getItem(storageKey)
  if (stored) {
    const state: unknown = JSON.parse(stored)
    if (
      isRecord(state) &&
      (state.theme === 'system' || state.theme === 'light' || state.theme === 'dark')
    ) {
      preference = state.theme
    } else {
      console.warn('La preferencia de tema guardada no es válida; se usará el tema del sistema.')
    }
  }
} catch (error) {
  console.warn('No se pudo leer la preferencia de tema antes del primer pintado.', error)
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.dataset.theme =
  preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference
