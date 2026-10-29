import { z } from 'zod'

export const STORAGE_KEY = 'csslab:v1'
const BACKUP_KEY = 'csslab:v1:backup'
const themePreferenceSchema = z.enum(['system', 'light', 'dark'])
const appStorageSchema = z.object({ theme: themePreferenceSchema.default('system') }).passthrough()

export type ThemePreference = z.infer<typeof themePreferenceSchema>

function getStorage(): Storage | null {
  try {
    return window.localStorage
  } catch (error) {
    console.warn('El almacenamiento local no está disponible; el tema no se conservará.', error)
    return null
  }
}

function preserveInvalidData(storage: Storage, raw: string): void {
  try {
    storage.setItem(BACKUP_KEY, raw)
  } catch (error) {
    console.error('No se pudo conservar una copia de los datos locales no válidos.', error)
  }
}

function readRoot(storage: Storage): Record<string, unknown> {
  let raw: string | null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch (error) {
    console.warn('No se pudo leer el almacenamiento local; se usará el estado inicial.', error)
    return {}
  }

  if (raw === null) return {}

  try {
    const parsed: unknown = JSON.parse(raw)
    const result = appStorageSchema.safeParse(parsed)
    if (result.success) return result.data

    console.warn('Los datos locales no superan la validación; se guardará una copia de respaldo.')
  } catch (error) {
    console.warn(
      'Los datos locales no contienen JSON válido; se guardará una copia de respaldo.',
      error,
    )
  }

  preserveInvalidData(storage, raw)
  return {}
}

export function readThemePreference(storage: Storage | null = getStorage()): ThemePreference {
  if (!storage) return 'system'

  const result = appStorageSchema.safeParse(readRoot(storage))
  return result.success ? result.data.theme : 'system'
}

export function writeThemePreference(
  preference: ThemePreference,
  storage: Storage | null = getStorage(),
): void {
  if (!storage) return

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...readRoot(storage), theme: preference }))
  } catch (error) {
    console.error('No se pudo guardar la preferencia de tema.', error)
  }
}
