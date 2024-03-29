import { useMemo } from 'react'
import type { ScrollAreaProps } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import useAllSelected from '~/pages/SearchPageNew/hooks/use-all-selected'
import useUpdateCallback from '~/pages/SearchPageNew/hooks/use-update-callback'

import { useRelatedClusters } from '~/api/search/related-clusters'

import RelatedClustersContent from './RelatedClustersContent'

type Props = {
  onLoadingChange?: (loading: boolean) => void
  onScrollPositionChange?: ScrollAreaProps['onScrollPositionChange']
}

const RelatedClusters = ({ onLoadingChange, onScrollPositionChange }: Props) => {
  const { currentToken } = useSearch()

  const searchTerm = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useRelatedClusters(searchTerm)

  const terms = useMemo(() => data?.nodes.map(term => term) ?? [], [data?.nodes]).flat()

  useAllSelected(terms)
  useUpdateCallback(onLoadingChange, isLoading)

  return (
    <RelatedClustersContent
      data={data}
      isLoading={isLoading}
      error={error}
      onTryAgain={refetch}
      onScrollPositionChange={onScrollPositionChange}
    />
  )
}

export default RelatedClusters
