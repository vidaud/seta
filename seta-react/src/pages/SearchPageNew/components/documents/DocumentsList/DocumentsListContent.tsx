import type { ReactElement } from 'react'
import { forwardRef } from 'react'
import { Flex } from '@mantine/core'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '~/pages/SearchPageNew/components/common'

import type { DocumentsResponse } from '~/api/search/documents'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import DocumentInfo from '../DocumentInfo'

type Props = DataProps<DocumentsResponse> & {
  queryTerms: string[]
  paginator?: ReactElement | false | null
  info?: ReactElement | false | null
}

const DocumentsListContent = forwardRef<HTMLDivElement, Props>(
  ({ data, isLoading, error, onTryAgain, queryTerms, paginator, info }, ref) => {
    if (error) {
      return <SuggestionsError size="md" subject="documents" withIcon onTryAgain={onTryAgain} />
    }

    if (isLoading || !data) {
      return <SuggestionsLoading size="lg" color="blue" variant="bars" />
    }

    const { documents } = data

    if (!documents.length) {
      return (
        <SuggestionsEmpty
          size="md"
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
          <DocumentInfo key={document.document_id} document={document} queryTerms={queryTerms} />
        ))}

        {paginator}
      </Flex>
    )
  }
)

export default DocumentsListContent