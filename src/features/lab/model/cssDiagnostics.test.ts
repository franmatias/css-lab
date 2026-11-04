import { describe, expect, it } from 'vitest'
import { diagnoseCss } from './cssDiagnostics'

describe('diagnoseCss', () => {
  it('locates structural errors and suggests likely property names', () => {
    expect(diagnoseCss('.a {\n color red;\n}')[0]).toMatchObject({ line: 2, severity: 'error' })
    expect(diagnoseCss('.a { color: red;')[0]).toMatchObject({
      message: expect.stringContaining('llave'),
    })
    expect(diagnoseCss('.a {\n paddng: 1rem;\n}')[0]?.suggestion).toContain('padding')
  })
  it('accepts valid declarations and custom properties', () => {
    expect(diagnoseCss('.a {\n color: red;\n --accent: #fff;\n}')).toEqual([])
  })
})
