import { ScrollArea } from '@mantine/core'

import {
  SuggestionsError,
  SuggestionsLoading,
  SuggestionsEmpty
} from '~/pages/SearchPageNew/components/common'
import type { TermsClusterProps } from '~/pages/SearchPageNew/components/TermsCluster'
import TermsCluster from '~/pages/SearchPageNew/components/TermsCluster'

import type { RelatedClustersResponse } from '~/api/search/related-clusters'
import type { DataProps } from '~/types/data-props'

type Props = Omit<TermsClusterProps, 'terms'> & DataProps<RelatedClustersResponse>

const RelatedClustersContent = ({ data, isLoading, error, onTryAgain, ...props }: Props) => {
  if (error) {
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
    <ScrollArea.Autosize mah={330} type="scroll" mt="md">
      {nodes.map((terms, index) => (
        <TermsCluster
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          terms={terms}
          clickable
          {...props}
        />
      ))}
    </ScrollArea.Autosize>
  )
}

export default RelatedClustersContent
