import { Anchor, Loader, ScrollArea, Text } from '@mantine/core'

import type { TermsClusterProps } from '~/pages/SearchPageNew/components/TermClusters/components/TermsCluster'
import TermsCluster from '~/pages/SearchPageNew/components/TermClusters/components/TermsCluster'

import type { RelatedTermsResponse } from '~/api/search/related-terms'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

type Props = Omit<TermsClusterProps, 'terms'> & DataProps<RelatedTermsResponse>

const TermClustersContent = ({ data, isLoading, error, onTryAgain, ...props }: Props) => {
  if (error) {
    return (
      <S.Container>
        <Text fz="sm" color="red.6">
          There was an error fetching suggestions.
          <br />
          Please <Anchor onClick={onTryAgain}>try again</Anchor>.
        </Text>
      </S.Container>
    )
  }

  if (isLoading || !data) {
    return (
      <S.Container>
        <Loader color="gray" />
      </S.Container>
    )
  }

  if (!data.nodes.length) {
    return (
      <S.Container>
        <Text fz="sm" color="gray.6">
          No results
        </Text>
      </S.Container>
    )
  }

  const { nodes } = data

  return (
    <ScrollArea.Autosize mah={330} type="scroll" mt="md">
      {nodes.map((terms, index) => (
        <TermsCluster
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          terms={terms}
          allSelected={index === 1}
          {...props}
        />
      ))}
    </ScrollArea.Autosize>
  )
}

export default TermClustersContent
