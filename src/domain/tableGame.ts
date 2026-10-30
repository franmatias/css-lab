import parser from 'postcss-selector-parser'
import {
  tableHtml,
  tableRows,
  tableColumns,
  type TableMission,
} from '../../packages/content/src/tableGame'
import type { GameVerdict } from './visualGame'

const empty = (): GameVerdict => ({
  correct: false,
  selectedIds: [],
  containers: 0,
  extra: 0,
  missing: 0,
  error: false,
})
export const tableCellIds = tableRows.flatMap((_, r) =>
  tableColumns.map((_, c) => `celda-${r + 1}-${c + 1}`),
)

export function tableTargets(mission: TableMission, cellId: string | null): string[] {
  const document = new DOMParser().parseFromString(tableHtml, 'text/html')
  if (mission.interaction === 'static')
    return [...document.body.querySelectorAll(mission.solution)].map((node) => node.id)
  if (!cellId || !tableCellIds.includes(cellId)) return []
  const [, row, column] = cellId.split('-')
  if (mission.interaction === 'cell') return [cellId]
  if (mission.interaction === 'row') return [`fila-${row}`]
  return column === '3' ? tableRows.map((_, r) => `celda-${r + 1}-3`) : []
}

/** Only trusted fixture HTML is parsed. Pointer/focus state is reproduced on this inert tree. */
export function evaluateTableGame(
  mission: TableMission,
  answer: string,
  cellId: string | null,
): GameVerdict {
  if (!answer.trim()) return empty()
  if (answer.length > 160) return { ...empty(), error: true }
  const document = new DOMParser().parseFromString(tableHtml, 'text/html')
  try {
    const ast = parser().astSync(answer)
    let forbidden = false
    ast.walkAttributes((node) => {
      if (node.attribute.toLowerCase() === 'data-csslab-pointer') forbidden = true
    })
    if (forbidden) return { ...empty(), error: true }
    ast.walkPseudos((node) => {
      if (node.value === ':hover')
        node.replaceWith(
          parser.attribute({ attribute: 'data-csslab-pointer', raws: {}, value: undefined }),
        )
    })
    let hovered: Element | null =
      cellId && tableCellIds.includes(cellId) ? document.getElementById(cellId) : null
    while (hovered) {
      hovered.setAttribute('data-csslab-pointer', '')
      hovered = hovered.parentElement
    }
    const targets = new Set(tableTargets(mission, cellId))
    const selected = [...document.body.querySelectorAll(ast.toString())]
    const selectedIds = selected.map((node) => node.id).filter(Boolean)
    const extra = selected.filter((node) => !targets.has(node.id)).length
    const missing = [...targets].filter((id) => !selectedIds.includes(id)).length
    return {
      correct: extra === 0 && missing === 0,
      selectedIds,
      containers: selected.length - selectedIds.length,
      extra,
      missing,
      error: false,
    }
  } catch {
    return { ...empty(), error: true }
  }
}

export function solveTableGame(
  mission: TableMission,
  answer: string,
  cellId: string | null,
): GameVerdict {
  const current = evaluateTableGame(mission, answer, cellId)
  if (current.error) return current
  try {
    const pseudos = new Set<string>()
    parser()
      .astSync(answer)
      .walkPseudos((node) => {
        pseudos.add(node.value)
      })
    if (mission.requiredPseudos.some((pseudo) => !pseudos.has(pseudo)))
      return { ...current, correct: false }
    if (mission.interaction === 'static') return current
    // Check every cell and the outside state, so a hard-coded row cannot solve a hover mission.
    const correct = [null, ...tableCellIds].every(
      (id) => evaluateTableGame(mission, answer, id).correct,
    )
    return { ...current, correct }
  } catch {
    return { ...current, correct: false, error: true }
  }
}
