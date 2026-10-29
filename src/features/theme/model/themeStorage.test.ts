import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_LAB_DRAFT,
  readLabDraft,
  readThemePreference,
  writeLabDraft,
  writeThemePreference,
} from '@/infrastructure/storage/appStorage'

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('theme preference storage', () => {
  it('uses the system preference when no theme has been saved', () => {
    expect(readThemePreference()).toBe('system')
  })

  it('accepts a known theme and preserves other stored sections', () => {
    localStorage.setItem('csslab:v1', JSON.stringify({ theme: 'dark', progress: { xp: 20 } }))

    expect(readThemePreference()).toBe('dark')

    writeThemePreference('light')
    expect(JSON.parse(localStorage.getItem('csslab:v1') ?? '{}')).toEqual({
      theme: 'light',
      progress: { xp: 20 },
    })
  })

  it('backs up malformed data and falls back to the system preference', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const malformedState = '{"theme":'
    localStorage.setItem('csslab:v1', malformedState)

    expect(readThemePreference()).toBe('system')
    expect(localStorage.getItem('csslab:v1:backup')).toBe(malformedState)
    expect(warning).toHaveBeenCalled()
  })

  it('stores the lab draft under the shared versioned root', () => {
    const draft = { ...DEFAULT_LAB_DRAFT, selector: 'main > p' }

    expect(writeLabDraft(draft)).toBe(true)
    expect(readLabDraft()).toEqual(draft)
    expect(readThemePreference()).toBe('system')
    expect(JSON.parse(localStorage.getItem('csslab:v1') ?? '{}')).toMatchObject({ lab: draft })
  })

  it('falls back to the example when the saved lab draft is invalid', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem('csslab:v1', JSON.stringify({ theme: 'dark', lab: { html: '<p>' } }))

    expect(readLabDraft()).toEqual(DEFAULT_LAB_DRAFT)
    expect(localStorage.getItem('csslab:v1:backup')).not.toBeNull()
    expect(warning).toHaveBeenCalled()
  })

  it('rejects oversized drafts instead of persisting invalid data', () => {
    expect(() => writeLabDraft({ ...DEFAULT_LAB_DRAFT, html: 'x'.repeat(12_001) })).toThrow(
      'El borrador supera los límites permitidos y no se guardó.',
    )
  })
})
