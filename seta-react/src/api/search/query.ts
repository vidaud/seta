import type { AxiosRequestConfig } from 'axios'

import type { EnrichType } from '~/pages/SearchPageNew/types/search'

import api from '~/api'

const ENRICH_API_PATH = '/term_enrichment'

type EnrichedTermsResponse = {
  words: string[]
}

export const getEnrichedTerms = async (
  terms: string[],
  enrichType: EnrichType,
  config?: AxiosRequestConfig
): Promise<EnrichedTermsResponse> => {
  if (!terms?.length) {
    return { words: [] }
  }

  const termsString = terms.join(',')

  const { data } = await api.get<EnrichedTermsResponse>(`${ENRICH_API_PATH}`, {
    ...config,
    params: {
      terms: termsString,
      enrichment_type: enrichType
    }
  })

  return data
}
