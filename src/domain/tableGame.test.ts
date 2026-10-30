import { expect, it } from 'vitest'
import { tableMissions } from '../../packages/content/src/tableGame'
import { lessons } from '../../packages/content/src'
import { solveTableGame, evaluateTableGame, tableTargets } from './tableGame'

it('ships stable, distinct table missions and theory ideas', () => {
  expect(tableMissions).toHaveLength(12)
  expect(new Set(tableMissions.map((mission) => mission.id)).size).toBe(12)
  for (const lesson of lessons) {
    expect(lesson.ideas.length).toBeGreaterThanOrEqual(4)
    expect(lesson.explanation.length).toBeLessThan(220)
  }
})
it('distinguishes rows, cells and column indices including row headers', () => {
  const cell = tableMissions[0]!
  expect(tableTargets(cell, null)).toEqual(['celda-2-3'])
  expect(solveTableGame(cell, cell.solution, null).correct).toBe(true)
  expect(solveTableGame(cell, '#celda-2-3', null).correct).toBe(false)
  expect(solveTableGame(cell, 'tbody > tr:nth-child(2)', null).correct).toBe(false)
  expect(solveTableGame(cell, 'tbody td:nth-child(2)', null).correct).toBe(false)
  expect(evaluateTableGame(cell, '.target-cell', null).selectedIds).toEqual([])
  expect(evaluateTableGame(cell, ':nth-child(', null).error).toBe(true)
})
it('requires hover to follow different cells and rows and to clear outside the table', () => {
  const row = tableMissions.find((mission) => mission.interaction === 'row')!
  expect(evaluateTableGame(row, 'tbody > tr:hover', 'celda-2-3').selectedIds).toEqual(['fila-2'])
  expect(evaluateTableGame(row, 'tbody > tr:hover', null).selectedIds).toEqual([])
  expect(solveTableGame(row, 'tbody > tr:hover', null).correct).toBe(true)
  expect(solveTableGame(row, 'tbody > tr:nth-child(2)', 'celda-2-3').correct).toBe(false)
  expect(solveTableGame(row, 'tbody > tr:hover:nth-child(2)', 'celda-2-3').correct).toBe(false)
  expect(solveTableGame(row, '[data-csslab-pointer]', null).error).toBe(true)
})
