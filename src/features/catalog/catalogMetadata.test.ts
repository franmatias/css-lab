import { describe, expect, it } from 'vitest'
import { entries } from '../../../packages/content/src/catalog'
import { catalogMetadata } from './catalogMetadata'

describe('catalogMetadata', () => {
  it('classifies every card with filterable difficulty and compatibility', () => {
    const metadata = entries.map(catalogMetadata)
    expect(metadata).toHaveLength(100)
    expect(new Set(metadata.map((item) => item.difficulty))).toEqual(
      new Set(['basic', 'intermediate', 'advanced']),
    )
    expect(new Set(metadata.map((item) => item.compatibility))).toEqual(
      new Set(['baseline', 'modern', 'recent']),
    )
  })

  it('marks :has as recent and advanced', () => {
    const item = entries.find((entry) => entry.syntax.includes(':has('))!
    expect(catalogMetadata(item)).toMatchObject({ difficulty: 'advanced', compatibility: 'recent' })
  })
})
