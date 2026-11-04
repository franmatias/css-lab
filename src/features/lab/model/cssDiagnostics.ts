export interface CssDiagnostic {
  line: number
  column: number
  severity: 'error' | 'warning'
  message: string
  suggestion: string
}

const commonProperties = [
  'align-items',
  'animation',
  'background',
  'background-color',
  'border',
  'border-radius',
  'box-shadow',
  'color',
  'display',
  'flex',
  'flex-direction',
  'font-family',
  'font-size',
  'font-weight',
  'gap',
  'grid-template-columns',
  'height',
  'justify-content',
  'line-height',
  'margin',
  'max-width',
  'min-height',
  'opacity',
  'overflow',
  'padding',
  'position',
  'transform',
  'transition',
  'width',
  'z-index',
]

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]!
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]!
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[b.length]!
}

function closestProperty(property: string): string | null {
  const candidate = commonProperties
    .map((name) => ({ name, score: distance(property, name) }))
    .sort((a, b) => a.score - b.score)[0]
  return candidate && candidate.score <= 3 ? candidate.name : null
}

export function diagnoseCss(css: string): CssDiagnostic[] {
  const diagnostics: CssDiagnostic[] = []
  const stack: { line: number; column: number }[] = []
  let line = 1,
    column = 0,
    quote = '',
    comment = false
  for (let index = 0; index < css.length; index++) {
    const char = css[index]!,
      next = css[index + 1]
    if (char === '\n') {
      line++
      column = 0
      continue
    }
    column++
    if (comment) {
      if (char === '*' && next === '/') {
        comment = false
        index++
        column++
      }
      continue
    }
    if (!quote && char === '/' && next === '*') {
      comment = true
      index++
      column++
      continue
    }
    if (quote) {
      if (char === quote && css[index - 1] !== '\\') quote = ''
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (char === '{') stack.push({ line, column })
    if (char === '}') {
      if (stack.length) stack.pop()
      else
        diagnostics.push({
          line,
          column,
          severity: 'error',
          message: 'Hay una llave de cierre sin su llave de apertura.',
          suggestion: 'Elimina esta llave o añade la apertura correspondiente.',
        })
    }
  }
  for (const opening of stack)
    diagnostics.push({
      ...opening,
      severity: 'error',
      message: 'Este bloque CSS no tiene llave de cierre.',
      suggestion: 'Añade } al final de las declaraciones del bloque.',
    })

  let depth = 0
  css.split('\n').forEach((source, index) => {
    const clean = source.replace(/\/\*.*?\*\//g, '').trim()
    const depthBefore = depth
    depth += (clean.match(/{/g)?.length ?? 0) - (clean.match(/}/g)?.length ?? 0)
    if (depthBefore < 1 || !clean || /[{}]/.test(clean)) return
    for (const part of clean
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)) {
      if (!part.includes(':')) {
        diagnostics.push({
          line: index + 1,
          column: source.indexOf(part) + 1,
          severity: 'error',
          message: `No se reconoce la declaración «${part}».`,
          suggestion: 'Separa la propiedad y el valor con dos puntos, por ejemplo: color: blue;',
        })
        continue
      }
      const [rawProperty, ...rawValue] = part.split(':')
      const property = rawProperty!.trim()
      const value = rawValue
        .join(':')
        .trim()
        .replace(/!important\s*$/, '')
        .trim()
      if (!value) {
        diagnostics.push({
          line: index + 1,
          column: source.indexOf(':') + 2,
          severity: 'error',
          message: `La propiedad ${property} no tiene valor.`,
          suggestion: `Escribe un valor después de ${property}: o elimina la declaración.`,
        })
      } else if (!property.startsWith('--')) {
        const supports = globalThis.CSS?.supports?.bind(globalThis.CSS)
        const known = supports ? supports(property, 'initial') : commonProperties.includes(property)
        const invalid = supports ? !supports(property, value) : !known
        if (!invalid) continue
        const closest = closestProperty(property)
        diagnostics.push({
          line: index + 1,
          column: source.indexOf(property) + 1,
          severity: 'warning',
          message: known
            ? `Valor no válido para ${property}.`
            : `La propiedad «${property}» no se reconoce.`,
          suggestion: known
            ? `El navegador no reconoce «${value}» para ${property}. Prueba otro valor válido.`
            : closest
              ? `¿Querías escribir «${closest}»?`
              : 'Comprueba el nombre de la propiedad en la guía rápida o en MDN.',
        })
      }
    }
  })
  return diagnostics.slice(0, 12)
}
