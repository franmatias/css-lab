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

export interface PreviewOptions {
  highlight?: 'border' | 'fill' | 'both' | 'none'
  color?: 'amber' | 'indigo' | 'cyan'
  numbers?: boolean
  grid?: boolean
  animations?: boolean
  background?: 'light' | 'dark' | 'checker'
  changedIds?: number[]
  inspectedId?: number | null
  inspectedSelector?: string
}

export function createPreviewDocument(
  evaluation: SelectorEvaluation,
  css: string,
  options: PreviewOptions = {},
): string {
  const document = new DOMParser().parseFromString(evaluation.sanitizedHtml, 'text/html')
  const elements = Array.from(document.querySelectorAll('*'))

  evaluation.matchedElementIds.forEach((id) => {
    const element = elements[id]
    if (element) element.setAttribute('data-csslab-match', '')
  })

  for (const id of options.changedIds ?? []) elements[id]?.setAttribute('data-csslab-changed', '')
  if (options.inspectedId !== null && options.inspectedId !== undefined)
    elements[options.inspectedId]?.setAttribute('data-csslab-inspect', '')
  if (options.numbers) {
    let index = 1
    for (const id of evaluation.matchedElementIds) {
      const element = elements[id]
      if (element && element !== document.body && document.body.contains(element))
        element.setAttribute('data-csslab-label', String(index++))
    }
  }

  const escapedCss = css.replace(/</g, '\\3C ')
  // Presentation-only adaptation. The student's source is preserved verbatim.
  const darkCss =
    options.background === 'dark'
      ? `html, body { background-color: #111827 !important; color: #f3f4f6 !important; color-scheme: dark; }
    body * { color: #e5e7eb !important; }
    body :where(div, article, aside, header, footer, main, section, nav, ul, ol, li, table, form, fieldset, input, select, textarea) { background-color: #1f2937 !important; border-color: #64748b !important; }
    body :where(th, td) { border-color: #64748b !important; }
    body :where(thead, tbody tr:nth-child(even)) { background-color: #273449 !important; }
    body a { color: #c7d2fe !important; } body button { background-color: #3730a3 !important; color: #fff !important; }`
      : ''
  const colors = {
    amber: ['#b45309', '180 83 9'],
    indigo: ['#4f46e5', '79 70 229'],
    cyan: ['#0e7490', '14 116 144'],
  }
  const [color, rgb] = colors[options.color ?? 'amber']
  const mode = options.highlight ?? 'both'
  const border = mode === 'border' || mode === 'both'
  const fill = mode === 'fill' || mode === 'both'
  const highlightCss = `[data-csslab-match] { ${border ? `outline: 2px dashed ${color} !important; outline-offset: 3px !important;` : ''} ${fill ? `background-color: rgb(${rgb} / 14%) !important;` : ''} }
    [data-csslab-inspect] { outline: 2px solid #f59e0b !important; outline-offset: 2px !important; box-shadow: 0 0 0 4px rgb(245 158 11 / 16%) !important; }
    [data-csslab-inspection-caption] { position: fixed; top: 4px; right: 4px; z-index: 2147483647; max-width: calc(100% - 8px); padding: 3px 8px; border-radius: 4px; background: #fbbf24 !important; color: #111827 !important; font: 700 12px/1.5 monospace; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; pointer-events: none; }
    ${options.numbers ? `[data-csslab-label] { position: relative; } [data-csslab-label]::after { content: attr(data-csslab-label); position: absolute; top: -11px; right: -11px; z-index: 1000; min-width: 20px; height: 20px; padding: 0 4px; border-radius: 10px; background: ${color}; color: white; font: bold 12px/20px system-ui; text-align: center; }` : ''}
    ${options.animations ? '@keyframes csslab-change { from { box-shadow: 0 0 0 6px rgb(79 70 229 / 35%); filter: brightness(1.12); } to { box-shadow: 0 0 0 0 transparent; filter: none; } } [data-csslab-changed] { animation: csslab-change 650ms ease-out 1; } @keyframes csslab-arrive { from { opacity: .55; } to { opacity: 1; } } body { animation: csslab-arrive 180ms ease-out 1; }' : ''}
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }`
  const background = options.background === 'dark' ? '#111827' : '#ffffff'
  const baseCss = `html { min-height: 100%; background: ${background}; ${options.background === 'checker' ? 'background-image: conic-gradient(#e5e7eb 25%, transparent 0 50%, #e5e7eb 0 75%, transparent 0); background-size: 20px 20px;' : ''} } body { margin: 0; padding: 20px; min-height: 100vh; box-sizing: border-box; font: 16px/1.6 system-ui, sans-serif; color: ${options.background === 'dark' ? '#f3f4f6' : '#1a1b2e'}; } *, *::before, *::after { box-sizing: border-box; } ${options.grid ? '* { outline: 1px dotted rgb(100 116 139 / 55%); outline-offset: -1px; }' : ''}`
  const internalAttributes = (element: Element) =>
    ['data-csslab-match', 'data-csslab-changed', 'data-csslab-inspect', 'data-csslab-label']
      .filter((name) => element.hasAttribute(name))
      .map((name) => ` ${name}="${element.getAttribute(name)}"`)
      .join('')

  if (
    options.inspectedSelector &&
    options.inspectedId !== null &&
    options.inspectedId !== undefined
  ) {
    const caption = document.createElement('div')
    caption.setAttribute('data-csslab-inspection-caption', '')
    caption.setAttribute('aria-hidden', 'true')
    caption.textContent = options.inspectedSelector
    document.body.appendChild(caption)
  }
  return `<!doctype html><html lang="es"${internalAttributes(document.documentElement)}><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; form-action 'none'; base-uri 'none'"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${baseCss}\n${escapedCss}\n${darkCss}\n${highlightCss}</style></head><body${internalAttributes(document.body)}>${document.body.innerHTML}</body></html>`
}

export const defaultLabDraft: LabDraft = { ...DEFAULT_LAB_DRAFT }
