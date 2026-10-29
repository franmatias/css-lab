import type { SelectorEvaluation } from './selectorEvaluator'

export interface PreviewChanges {
  ids: number[]
  added: number
  removed: number
  modified: number
}
function nodes(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html')
  const all = Array.from(document.querySelectorAll('*'))
  const result = new Map<string, { id: number; signature: string }>()
  function walk(element: Element, path: string) {
    const attributes = Array.from(element.attributes)
      .map((a) => `${a.name}=${a.value}`)
      .sort()
      .join('|')
    const text = Array.from(element.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .join('')
      .replace(/\s+/g, ' ')
    result.set(path, { id: all.indexOf(element), signature: `${attributes}:${text}` })
    Array.from(element.children).forEach((child, index) =>
      walk(child, `${path}/${child.localName}:${index}`),
    )
  }
  walk(document.body, 'body')
  return { document, all, result }
}
function cssRules(css: string): Map<string, string> {
  // This is only a visual change hint; selector correctness uses the actual evaluator.
  return new Map(
    Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g), (match) => [
      match[1]!.trim(),
      match[2]!.trim(),
    ]),
  )
}
export function detectPreviewChanges(
  previousHtml: string,
  evaluation: SelectorEvaluation,
  previousCss: string,
  css: string,
): PreviewChanges {
  const previous = nodes(previousHtml)
  const current = nodes(evaluation.sanitizedHtml)
  const changed = new Set<number>()
  let added = 0
  let removed = 0
  let modified = 0
  for (const [path, node] of current.result) {
    const old = previous.result.get(path)
    if (!old) {
      added++
      changed.add(node.id)
    } else if (old.signature !== node.signature) {
      modified++
      changed.add(node.id)
    }
  }
  for (const path of previous.result.keys()) if (!current.result.has(path)) removed++
  if (previousCss !== css) {
    const oldRules = cssRules(previousCss)
    const newRules = cssRules(css)
    const selectors = new Set([...oldRules.keys(), ...newRules.keys()])
    for (const selector of selectors) {
      if (oldRules.get(selector) === newRules.get(selector)) continue
      try {
        current.document
          .querySelectorAll(selector)
          .forEach((element) => changed.add(current.all.indexOf(element)))
      } catch {
        /* Nested CSS and pseudoelements are only approximate hints. */
      }
    }
  }
  return { ids: [...changed].filter((id) => id >= 0), added, removed, modified }
}
