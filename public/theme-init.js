;(() => {
  const storageKey = 'csslab:v1'
  let preference = 'system'

  function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  try {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const state = JSON.parse(stored)
      if (isRecord(state) && ['system', 'light', 'dark'].includes(state.theme)) {
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
})()
