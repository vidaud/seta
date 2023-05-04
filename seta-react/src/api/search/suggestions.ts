import { useQuery } from '@tanstack/react-query'

import api from '~/api'
import type { Suggestion } from '~/models/suggestion'

export type SuggestionsResponse = {
  words: Suggestion[]
}

export const cacheKey = (terms: string) => ['suggestions', terms]

const getSuggestions = async (terms: string) =>
  (await api.get<SuggestionsResponse>(`/suggestions?chars=${terms}`)).data

export const useSuggestions = (terms: string) => {
  return useQuery(cacheKey(terms), () => getSuggestions(terms))
}
