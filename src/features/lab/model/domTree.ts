import type { SelectorEvaluation } from './selectorEvaluator'

export interface DomTreeNode {
  key: number
  label: string
  matches: boolean
  children: DomTreeNode[]
}

export function createDomTree(evaluation: SelectorEvaluation): DomTreeNode[] {
  const document = new DOMParser().parseFromString(evaluation.sanitizedHtml, 'text/html')
  const elements = Array.from(document.querySelectorAll('*'))
  const elementIndexes = new Map(elements.map((element, index) => [element, index]))
  const matchedIds = new Set(evaluation.matchedElementIds)

  function createNode(element: Element): DomTreeNode {
    const key = elementIndexes.get(element) ?? -1
    const attributes = [
      element.id && `id="${element.id}"`,
      element.classList.length > 0 && `class="${Array.from(element.classList).join(' ')}"`,
    ].filter(Boolean)

    return {
      key,
      label: `<${element.localName}${attributes.length ? ` ${attributes.join(' ')}` : ''}>`,
      matches: matchedIds.has(key),
      children: Array.from(element.children, createNode),
    }
  }

  return [createNode(document.body)]
}

/** A usable selector for the exact node, including a position when siblings repeat. */
export function getDomNodeSelector(evaluation: SelectorEvaluation, key: number | null): string {
  if (key === null) return ''
  const doc = new DOMParser().parseFromString(evaluation.sanitizedHtml, 'text/html')
  let element: Element | null = doc.querySelectorAll('*')[key] ?? null
  const parts: string[] = []
  while (element) {
    let part =
      element.localName +
      (element.id
        ? `#${CSS.escape(element.id)}`
        : Array.from(element.classList)
            .map((name) => `.${CSS.escape(name)}`)
            .join(''))
    const siblings = Array.from(element.parentElement?.children ?? []).filter(
      (sibling) => sibling.localName === element!.localName,
    )
    if (!element.id && siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(element) + 1})`
    parts.unshift(part)
    const selector = parts.join(' > ')
    if (doc.querySelectorAll(selector).length === 1) return selector
    element = element.parentElement
  }
  return parts.join(' > ')
}
