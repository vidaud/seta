import { useState } from 'react'

import type { DocumentsOptions, DocumentsResponse } from '~/api/search/documents'
import { useDocuments } from '~/api/search/documents'
import usePaginator from '~/hooks/use-paginator'

import DocumentsListContent from './DocumentsListContent'

const PER_PAGE = 10

type Props = {
  query: string
  terms: string[]
  searchOptions?: DocumentsOptions
  onDocumentsLoaded?: (documents: DocumentsResponse) => void
}

const DocumentsList = ({ query, terms, searchOptions, onDocumentsLoaded }: Props) => {
  const [page, setPage] = useState(1)

  const { data, isLoading, error, refetch } = useDocuments(query, {
    page,
    perPage: PER_PAGE,
    searchOptions,
    onSuccess: onDocumentsLoaded
  })

  const { total_docs, documents } = data ?? {}

  const { scrollTargetRef, paginator, info } = usePaginator({
    total: total_docs ?? 0,
    perPage: PER_PAGE,
    page,
    info: {
      singular: 'document',
      currentPageItems: documents?.length ?? 0
    },
    resetPageDependencies: [query],
    scrollDependencies: [data],
    onPageChange: setPage
  })

  return (
    <DocumentsListContent
      ref={scrollTargetRef}
      data={data}
      isLoading={isLoading}
      error={error}
      onTryAgain={refetch}
      queryTerms={terms}
      paginator={paginator}
      info={info}
    />
  )
}

export default DocumentsList
