import { afterEach, describe, expect, it, vi } from 'vitest'
import { readThemePreference, writeThemePreference } from './themeStorage'

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
})
