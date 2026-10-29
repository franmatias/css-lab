// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { DEFAULT_LAB_DRAFT } from '@/infrastructure/storage/appStorage'
import { decodeSharedLabDraft, encodeSharedLabDraft } from './shareLabDraft'

describe('shared lab drafts', () => {
  it('compresses and restores a validated draft', async () => {
    const draft = { ...DEFAULT_LAB_DRAFT, selector: 'main:has(.featured)' }
    const hash = await encodeSharedLabDraft(draft)

    expect(hash).toMatch(/^#lab=[\w-]+$/)
    expect(await decodeSharedLabDraft(hash)).toEqual({ kind: 'valid', draft })
  })

  it('distinguishes unrelated hashes from invalid shared drafts', async () => {
    expect(await decodeSharedLabDraft('#section')).toEqual({ kind: 'absent' })
    expect(await decodeSharedLabDraft('#lab=not-a-valid-payload')).toEqual({ kind: 'invalid' })
  })
})
