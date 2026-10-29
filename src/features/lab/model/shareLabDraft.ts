import { parseLabDraft } from '@/infrastructure/storage/appStorage'
import type { LabDraft } from '@/infrastructure/storage/appStorage'

const SHARE_PREFIX = '#lab='
const MAX_SHARE_PAYLOAD_LENGTH = 32_000
const MAX_SHARED_DRAFT_BYTES = 150_000

export type SharedDraftResult =
  { kind: 'absent' } | { kind: 'invalid' } | { kind: 'valid'; draft: LabDraft }

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(payload: string): Uint8Array | null {
  if (!/^[\w-]+$/.test(payload)) return null

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export async function encodeSharedLabDraft(draft: LabDraft): Promise<string> {
  const validatedDraft = parseLabDraft(draft)
  if (!validatedDraft) throw new Error('El borrador supera los límites permitidos.')

  const compressedStream = new Blob([JSON.stringify(validatedDraft)])
    .stream()
    .pipeThrough(new CompressionStream('deflate'))
  const compressedBytes = new Uint8Array(await new Response(compressedStream).arrayBuffer())
  const payload = bytesToBase64Url(compressedBytes)

  if (payload.length > MAX_SHARE_PAYLOAD_LENGTH) {
    throw new RangeError('El borrador es demasiado grande para compartirlo en un enlace.')
  }

  return `${SHARE_PREFIX}${payload}`
}

async function decompressDraft(payload: string): Promise<unknown | null> {
  const compressedBytes = base64UrlToBytes(payload)
  if (!compressedBytes) return null

  const reader = new Blob([compressedBytes])
    .stream()
    .pipeThrough(new DecompressionStream('deflate'))
    .getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > MAX_SHARED_DRAFT_BYTES) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const jsonBytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    jsonBytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return JSON.parse(new TextDecoder().decode(jsonBytes)) as unknown
  } catch {
    return null
  }
}

export async function decodeSharedLabDraft(hash: string): Promise<SharedDraftResult> {
  if (!hash.startsWith(SHARE_PREFIX)) return { kind: 'absent' }

  const payload = hash.slice(SHARE_PREFIX.length)
  if (!payload || payload.length > MAX_SHARE_PAYLOAD_LENGTH) return { kind: 'invalid' }

  try {
    const parsedDraft = await decompressDraft(payload)
    const draft = parseLabDraft(parsedDraft)
    return draft ? { kind: 'valid', draft } : { kind: 'invalid' }
  } catch {
    return { kind: 'invalid' }
  }
}
