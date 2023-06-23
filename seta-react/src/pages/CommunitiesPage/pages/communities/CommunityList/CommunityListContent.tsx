import type { ReactElement } from 'react'
import { forwardRef } from 'react'
import { Flex } from '@mantine/core'

import type { CommunityResponse } from '~/api/types/community-types'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '../../../../SearchPageNew/components/common'
import CommunityInfo from '../CommunityInfo/CommunityInfo'

const MARGIN_TOP = '4rem'

type Props = DataProps<CommunityResponse[]> & {
  queryTerms: string
  paginator?: ReactElement | false | null
  info?: ReactElement | false | null
}

const CommunityListContent = forwardRef<HTMLDivElement, Props>(
  ({ data, error, queryTerms, isLoading, onTryAgain, paginator, info }, ref) => {
    if (error) {
      return (
        <SuggestionsError
          size="md"
          mt={MARGIN_TOP}
          subject="documents"
          withIcon
          onTryAgain={onTryAgain}
        />
      )
    }

    if (isLoading || !data) {
      return <SuggestionsLoading size="lg" mt={MARGIN_TOP} color="blue" variant="bars" />
    }

    const documents = data

    if (!documents.length) {
      return (
        <SuggestionsEmpty
          size="md"
          mt={MARGIN_TOP}
          withIcon
          message="No documents found."
          secondary="Please refine your search and try again."
        />
      )
    }

    return (
      <Flex ref={ref} direction="column" css={S.root}>
        {info}

        {documents.map(document => (
          <CommunityInfo key={document.community_id} document={document} queryTerms={queryTerms} />
        ))}

        {paginator}
      </Flex>
    )
  }
)

export default CommunityListContent
