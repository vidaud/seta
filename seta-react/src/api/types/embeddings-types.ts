import type { Embedding } from '~/types/embeddings'

export type EmbeddingsResponse = {
  emb_with_chunk_text: Embedding[]
}
