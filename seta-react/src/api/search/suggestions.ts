import { useQuery } from '@tanstack/react-query'

import api from '~/api'
import type { Suggestion } from '~/types/search/suggestion'

const SUGGESTIONS_API_PATH = '/suggestions'

export type SuggestionsResponse = {
  words: Suggestion[]
}

export const queryKey = {
  root: 'suggestions',
  terms: (terms?: string) => [queryKey.root, terms]
}

const getSuggestions = async (terms?: string): Promise<SuggestionsResponse> => {
  if (!terms) {
    return { words: [] }
  }

  const { data } = await api.get<SuggestionsResponse>(`${SUGGESTIONS_API_PATH}?chars=${terms}`)

  // Remove duplicates
  return {
    words: [...new Set(data.words)]
  }
}

export const useSuggestions = (terms?: string) =>
  useQuery({ queryKey: queryKey.terms(terms), queryFn: () => getSuggestions(terms) })
