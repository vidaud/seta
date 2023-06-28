export type Embedding = {
  vector: number[]
  chunk: number
  version: string
  text: string
}

export enum EmbeddingType {
  File = 'file',
  Text = 'text'
}

export type EmbeddingIdPrefix = 'T' | 'D'
export type EmbeddingId = `${EmbeddingIdPrefix}${number}`
export type ChunkId = `${EmbeddingId}-C${number}`

export const EmbeddingPrefixMapping = {
  [EmbeddingType.Text]: 'T',
  [EmbeddingType.File]: 'D'
} as const

export type ChunkInfo = {
  id: ChunkId
  brief: string
} & Embedding

export type EmbeddingInfo = {
  id: EmbeddingId
  type: EmbeddingType
  name: string
  text: string
  chunks?: ChunkInfo[]
}
