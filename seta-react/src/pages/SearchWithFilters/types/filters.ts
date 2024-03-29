export enum TextChunkValues {
  CHUNK_SEARCH = 'CHUNK_SEARCH',
  DOCUMENT_SEARCH = 'DOCUMENT_SEARCH',
  ALL_CHUNKS_SEARCH = 'ALL_CHUNKS_SEARCH'
}

export const TextChunkLabels: Record<TextChunkValues, string> = {
  CHUNK_SEARCH: 'First chunk',
  DOCUMENT_SEARCH: 'Single chunk only',
  ALL_CHUNKS_SEARCH: 'Any chunks'
}

export type RangeValue = [number, number]

type SelectionKeyType = {
  checked?: boolean
  partialChecked?: boolean
}

export type SelectionKeys = {
  [key: string]: SelectionKeyType
}

export enum ClearType {
  ALL = 'ALL',
  ALL_MODIFIED = 'ALL_MODIFIED',
  ALL_APPLIED_IN_CATEGORY = 'ALL_APPLIED_IN_CATEGORY',
  ALL_MODIFIED_IN_CATEGORY = 'ALL_MODIFIED_IN_CATEGORY',
  KEY = 'KEY'
}

export enum ClearCategory {
  DATE = 'date',
  SOURCE = 'source',
  TAXONOMY = 'taxonomy',
  LABELS = 'labels',
  OTHER = 'other'
}

export type ClearAction = {
  type: ClearType
  value?: { category?: ClearCategory; key?: string }
}
