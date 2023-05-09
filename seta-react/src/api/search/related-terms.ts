import { useQuery } from '@tanstack/react-query'

import api from '~/api'
import type { SimilarTerm } from '~/models/similar-term'

const RELATED_TERMS_API_PATH = '/similar'

export type RelatedTermsResponse = {
  words: SimilarTerm[]
}

export const cacheKey = (words?: string) => ['related-terms', words]

const getRelatedTerms = async (words?: string): Promise<RelatedTermsResponse> => {
  if (!words) {
    return { words: [] }
  }

  const { data } = await api.get<RelatedTermsResponse>(`${RELATED_TERMS_API_PATH}?term=${words}`)

  // Remove duplicates
  const result = [
    ...data.words
      .reduce((map, term) => map.set(term.similar_word, term), new Map<string, SimilarTerm>())
      .values()
  ]

  return {
    words: result
  }
}

export const useRelatedTerms = (words?: string) =>
  useQuery(cacheKey(words), () => getRelatedTerms(words))
