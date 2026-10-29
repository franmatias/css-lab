import { z } from 'zod'

export const STORAGE_KEY = 'csslab:v1'
const BACKUP_KEY = 'csslab:v1:backup'
const themePreferenceSchema = z.enum(['system', 'light', 'dark'])
const labDraftSchema = z.object({
  html: z.string().max(12_000),
  css: z.string().max(12_000),
  selector: z.string().max(160),
})
const appStorageSchema = z
  .object({
    theme: themePreferenceSchema.default('system'),
    lab: labDraftSchema.optional(),
  })
  .passthrough()

export type ThemePreference = z.infer<typeof themePreferenceSchema>
export type LabDraft = z.infer<typeof labDraftSchema>

export function parseLabDraft(value: unknown): LabDraft | null {
  const result = labDraftSchema.safeParse(value)
  return result.success ? result.data : null
}

export const DEFAULT_LAB_DRAFT: LabDraft = {
  html: '<main class="demo"><h2 class="featured">Aprende seleccionando</h2><p>Prueba un selector y observa el resultado.</p><button class="action" type="button">Probar</button></main>',
  css: '.demo { padding: 1.5rem; font-family: system-ui, sans-serif; color: #24233a; }\n.featured { color: #4f46e5; }\n.action { padding: .5rem .85rem; border: 0; border-radius: .5rem; background: #4f46e5; color: white; }',
  selector: '.featured',
}

function getStorage(): Storage | null {
  try {
    return window.localStorage
  } catch (error) {
    console.warn(
      'El almacenamiento local no está disponible; los cambios no se conservarán.',
      error,
    )
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

export function readLabDraft(storage: Storage | null = getStorage()): LabDraft {
  if (!storage) return { ...DEFAULT_LAB_DRAFT }

  const root = readRoot(storage)
  const draft = parseLabDraft(root.lab)
  if (!draft) {
    if (root.lab !== undefined) {
      console.warn('El borrador del laboratorio no es válido; se usará el ejemplo inicial.')
    }
    return { ...DEFAULT_LAB_DRAFT }
  }

  return draft
}

export function writeLabDraft(draft: LabDraft, storage: Storage | null = getStorage()): boolean {
  if (!storage) return false

  const validatedDraft = parseLabDraft(draft)
  if (!validatedDraft) {
    throw new Error('El borrador supera los límites permitidos y no se guardó.')
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...readRoot(storage), lab: validatedDraft }))
    return true
  } catch (error) {
    console.error('No se pudo guardar el borrador del laboratorio.', error)
    return false
  }
}
