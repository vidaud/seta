import { useMemo } from 'react'
import { ScrollArea } from '@mantine/core'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '~/pages/SearchPageNew/components/common'
import type { TermsClusterProps } from '~/pages/SearchPageNew/components/TermsSuggestions/components/TermsCluster'
import TermsCluster from '~/pages/SearchPageNew/components/TermsSuggestions/components/TermsCluster'

import type { RelatedTermsResponse } from '~/api/search/related-terms'
import type { DataProps } from '~/types/data-props'

type Props = Omit<TermsClusterProps, 'terms'> & DataProps<RelatedTermsResponse>

const RelatedTermsContent = ({ data, isLoading, error, onTryAgain, ...props }: Props) => {
  // Memoize the terms array so that it doesn't have a different reference on every render
  const terms = useMemo(() => data?.words.map(term => term.similar_word) ?? [], [data?.words])

  if (error) {
    return <SuggestionsError onTryAgain={onTryAgain} />
  }

  if (isLoading || !data) {
    return <SuggestionsLoading />
  }

  if (!data.words.length) {
    return <SuggestionsEmpty />
  }

  return (
    <ScrollArea>
      <TermsCluster terms={terms} {...props} />
    </ScrollArea>
  )
}

export default RelatedTermsContent
