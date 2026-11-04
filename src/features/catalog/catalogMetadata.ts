import type { Entry } from '../../../packages/content/src'

export type CatalogDifficulty = 'basic' | 'intermediate' | 'advanced'
export type CatalogCompatibility = 'baseline' | 'modern' | 'recent'

export interface CatalogMetadata {
  difficulty: CatalogDifficulty
  compatibility: CatalogCompatibility
  compatibilityNote: string
}

export function catalogMetadata(entry: Entry): CatalogMetadata {
  const syntax = entry.syntax
  const advanced = /:has\(|:is\(|:where\(|:not\(|:nth-|\s[+~]\s|!important|@layer/i.test(syntax)
  const intermediate = /\[.+\]|:{1,2}[\w-]+|\s>\s|\s/.test(syntax)
  const compatibility: CatalogCompatibility = /:has\(/.test(syntax)
    ? 'recent'
    : /:focus-visible|:focus-within|:is\(|:where\(/.test(syntax)
      ? 'modern'
      : 'baseline'
  return {
    difficulty: advanced ? 'advanced' : intermediate ? 'intermediate' : 'basic',
    compatibility,
    compatibilityNote:
      compatibility === 'recent'
        ? 'Compatibilidad reciente: :has() requiere Chrome/Edge 105+, Safari 15.4+ o Firefox 121+.'
        : compatibility === 'modern'
          ? 'Disponible en las versiones modernas de los navegadores principales.'
          : 'Compatibilidad consolidada en navegadores de escritorio y móviles.',
  }
}
