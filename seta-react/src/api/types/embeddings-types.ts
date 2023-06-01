export type EmbeddingsValue = {
  vector: number[]
  chunk: number
  version: string
  text: string
}

export type EmbeddingsResponse = {
  emb_with_chunk_text: EmbeddingsValue[]
}
