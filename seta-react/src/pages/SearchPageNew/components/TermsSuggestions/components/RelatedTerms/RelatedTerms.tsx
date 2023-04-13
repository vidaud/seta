import { useMemo } from 'react'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import useAllSelected from '~/pages/SearchPageNew/hooks/use-all-selected'
import useUpdateCallback from '~/pages/SearchPageNew/hooks/use-update-callback'

import { useRelatedTerms } from '~/api/search/related-terms'

import RelatedTermsContent from './RelatedTermsContent'

type Props = {
  onLoadingChange?: (loading: boolean) => void
}

const RelatedTerms = ({ onLoadingChange }: Props) => {
  const { currentToken } = useSearch()

  const searchTerm = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useRelatedTerms(searchTerm)

  const terms = useMemo(() => data?.words.map(term => term.similar_word) ?? [], [data?.words])

  useAllSelected(terms)
  useUpdateCallback(onLoadingChange, isLoading)

  return (
    <RelatedTermsContent data={data} isLoading={isLoading} error={error} onTryAgain={refetch} />
  )
}

export default RelatedTerms
