import { compare, selectorSpecificity } from '@csstools/selector-specificity'
import createDOMPurify from 'dompurify'
import parser from 'postcss-selector-parser'
import { DEFAULT_LAB_DRAFT } from '@/infrastructure/storage/appStorage'
import type { LabDraft } from '@/infrastructure/storage/appStorage'

export const MAX_SELECTOR_LENGTH = 160
export const MAX_HTML_LENGTH = 12_000
export const MAX_CSS_LENGTH = 12_000
export const MAX_ELEMENT_COUNT = 120

export interface SelectorEvaluation {
  sanitizedHtml: string
  matchedElementIds: number[]
  specificity: { a: number; b: number; c: number } | null
  error:
    'empty' | 'html-too-long' | 'css-too-long' | 'too-many-elements' | 'invalid-selector' | null
}

const purifierConfig = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'base', 'meta', 'link'],
  FORBID_ATTR: ['style'],
  ALLOW_DATA_ATTR: false,
}
const purifier = createDOMPurify(window)

export function sanitizeLabHtml(html: string): string {
  return purifier.sanitize(html, purifierConfig)
}

function getSpecificity(selector: string): { a: number; b: number; c: number } {
  const ast = parser().astSync(selector)
  if (ast.nodes.length === 0) throw new Error('El selector está vacío.')

  return ast.nodes
    .map((node) => selectorSpecificity(node))
    .reduce((highest, current) => (compare(current, highest) > 0 ? current : highest))
}

export function evaluateSelector(draft: LabDraft): SelectorEvaluation {
  const isHtmlWithinLimit = draft.html.length <= MAX_HTML_LENGTH
  const sanitizedHtml = isHtmlWithinLimit ? sanitizeLabHtml(draft.html) : ''
  const baseResult: SelectorEvaluation = {
    sanitizedHtml,
    matchedElementIds: [],
    specificity: null,
    error: null,
  }

  if (!isHtmlWithinLimit) return { ...baseResult, error: 'html-too-long' }
  if (draft.css.length > MAX_CSS_LENGTH) return { ...baseResult, error: 'css-too-long' }
  if (!draft.selector.trim()) return { ...baseResult, error: 'empty' }
  if (draft.selector.length > MAX_SELECTOR_LENGTH)
    return { ...baseResult, error: 'invalid-selector' }

  const document = new DOMParser().parseFromString(sanitizedHtml, 'text/html')
  if (document.querySelectorAll('*').length > MAX_ELEMENT_COUNT) {
    return { ...baseResult, error: 'too-many-elements' }
  }

  let matches: Element[]
  try {
    matches = Array.from(document.querySelectorAll(draft.selector))
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'SyntaxError' || error.name === 'DOMException')
    ) {
      return { ...baseResult, error: 'invalid-selector' }
    }
    throw error
  }

  let specificity: { a: number; b: number; c: number }
  try {
    specificity = getSpecificity(draft.selector)
  } catch (error) {
    if (error instanceof Error) return { ...baseResult, error: 'invalid-selector' }
    throw error
  }

  const allElements = Array.from(document.querySelectorAll('*'))
  return {
    ...baseResult,
    matchedElementIds: matches
      .map((element) => allElements.indexOf(element))
      .filter((index) => index !== -1),
    specificity,
  }
}

export function createPreviewDocument(evaluation: SelectorEvaluation, css: string): string {
  const document = new DOMParser().parseFromString(evaluation.sanitizedHtml, 'text/html')
  const elements = Array.from(document.querySelectorAll('*'))

  evaluation.matchedElementIds.forEach((id) => {
    const element = elements[id]
    if (element) element.setAttribute('data-csslab-match', '')
  })

  const escapedCss = css.replace(/</g, '\\3C ')
  const highlightCss =
    '[data-csslab-match] { outline: 2px dashed #b45309 !important; outline-offset: 2px !important; background-color: rgb(180 83 9 / 12%) !important; }'

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; form-action 'none'; base-uri 'none'"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${escapedCss}\n${highlightCss}</style></head><body>${document.body.innerHTML}</body></html>`
}

export const defaultLabDraft: LabDraft = { ...DEFAULT_LAB_DRAFT }
