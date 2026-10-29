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
