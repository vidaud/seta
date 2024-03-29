import type { ReactElement } from 'react'
import { forwardRef } from 'react'
import { Flex } from '@mantine/core'

import type { DocumentsResponse } from '~/api/search/documents'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import { SuggestionsEmpty, SuggestionsError, SuggestionsLoading } from '../../common'
import DocumentInfo from '../DocumentInfo'

export const MARGIN_TOP = '5rem'

type Props = DataProps<DocumentsResponse> & {
  queryTerms?: string[]
  paginator?: ReactElement | false | null
  info?: ReactElement | false | null
}

const DocumentsListContent = forwardRef<HTMLDivElement, Props>(
  ({ data, isLoading, error, onTryAgain, queryTerms, paginator, info }, ref) => {
    // Only show the error if there is no data
    // Otherwise, the data is used from the cache and the error notification is shown in the parent component
    if (error && !data) {
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

    const { documents } = data

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
      <Flex ref={ref} direction="column" css={S.root} id="document-list">
        {info}

        {documents.map(document => (
          <DocumentInfo key={document._id} document={document} queryTerms={queryTerms} />
        ))}

        {paginator}
      </Flex>
    )
  }
)

export default DocumentsListContent
