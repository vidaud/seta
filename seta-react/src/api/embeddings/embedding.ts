import { useQuery } from '@tanstack/react-query'

import api from '../api'

const EMBEDDINGS_API_PATH = '/compute_embeddings'

export type EmbeddingsResponse = {
  vector: number[]
  version: string
}

export const queryKey = {
  root: 'embeddings',
  terms: (terms?: string) => [queryKey.root, terms]
}

const getEmbeddings = async (terms?: string): Promise<EmbeddingsResponse> => {
  if (!terms) {
    return { vector: [], version: '' }
  }

  const { data } = await api.get<EmbeddingsResponse>(`${EMBEDDINGS_API_PATH}?text=${terms}`)

  // Remove duplicates
  return {
    vector: data.vector,
    version: data.version
  }
}

export const useEmbedding = (terms?: string) =>
  useQuery({ queryKey: queryKey.terms(terms), queryFn: () => getEmbeddings(terms) })
