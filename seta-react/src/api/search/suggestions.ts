import { useQuery } from '@tanstack/react-query'

import api from '~/api'
import type { Suggestion } from '~/models/suggestion'

export type SuggestionsResponse = {
  words: Suggestion[]
}

export const cacheKey = (terms?: string) => ['suggestions', terms]

const getSuggestions = async (terms?: string): Promise<SuggestionsResponse> => {
  if (!terms) {
    return { words: [] }
  }

  const results = (await api.get<SuggestionsResponse>(`/suggestions?chars=${terms}`)).data

  // Remove duplicates
  return {
    words: results.words.filter((word, index, self) => self.findIndex(w => w === word) === index)
  }
}

export const useSuggestions = (terms?: string) =>
  useQuery(cacheKey(terms), () => getSuggestions(terms))
