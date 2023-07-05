import type { ScrollAreaProps } from '@mantine/core'
import { ScrollArea } from '@mantine/core'
import { HttpStatusCode, isAxiosError } from 'axios'

import {
  SuggestionsError,
  SuggestionsLoading,
  SuggestionsEmpty
} from '~/pages/SearchPageNew/components/common'
import type { TermsClusterProps } from '~/pages/SearchPageNew/components/TermsSuggestions/components/TermsCluster'
import TermsCluster from '~/pages/SearchPageNew/components/TermsSuggestions/components/TermsCluster'

import type { RelatedClustersResponse } from '~/api/search/related-clusters'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

type Props = Omit<TermsClusterProps, 'terms'> &
  DataProps<RelatedClustersResponse> & {
    onScrollPositionChange?: ScrollAreaProps['onScrollPositionChange']
  }

const RelatedClustersContent = ({
  data,
  isLoading,
  error,
  onTryAgain,
  onScrollPositionChange,
  ...props
}: Props) => {
  if (error) {
    if (isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound) {
      return <SuggestionsEmpty />
    }

    return <SuggestionsError onTryAgain={onTryAgain} />
  }

  if (isLoading || !data) {
    return <SuggestionsLoading />
  }

  if (!data.nodes.length) {
    return <SuggestionsEmpty />
  }

  const { nodes } = data

  return (
    <ScrollArea css={S.root} onScrollPositionChange={onScrollPositionChange}>
      {nodes.map((terms, index) => (
        <TermsCluster
          // The API returns an array of arrays of terms, so we need to use the index as the key
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          terms={terms}
          clickable
          {...props}
        />
      ))}
    </ScrollArea>
  )
}

export default RelatedClustersContent
