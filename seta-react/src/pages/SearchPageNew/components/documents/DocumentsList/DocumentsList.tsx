import { useEffect, useRef, useState } from 'react'

import { useEnrichLoading } from '~/pages/SearchPageNew/contexts/enrich-loading-context'

import type { DocumentsOptions, DocumentsResponse } from '~/api/search/documents'
import { useDocuments } from '~/api/search/documents'
import usePaginator from '~/hooks/use-paginator'
import type { EmbeddingInfo } from '~/types/embeddings'

import DocumentsListContent from './DocumentsListContent'

const PER_PAGE = 10

type Props = {
  query: string | undefined
  terms: string[]
  embeddings?: EmbeddingInfo[]
  searchOptions?: DocumentsOptions
  onDocumentsChanged?: (documents: DocumentsResponse) => void
}

const DocumentsList = ({ query, terms, embeddings, searchOptions, onDocumentsChanged }: Props) => {
  const documentsChangedRef = useRef(onDocumentsChanged)

  const [page, setPage] = useState(1)

  const { loading: enrichLoading } = useEnrichLoading()

  const { data, isLoading, error, refetch } = useDocuments(query, embeddings, {
    page,
    perPage: PER_PAGE,
    searchOptions
  })

  useEffect(() => {
    if (data) {
      documentsChangedRef.current?.(data)
    }
  }, [data])

  const { total_docs } = data ?? {}

  const { scrollTargetRef, paginator, info } = usePaginator({
    total: total_docs ?? 0,
    perPage: PER_PAGE,
    page,
    info: {
      singular: 'document'
    },
    resetPageDependencies: [query, searchOptions],
    scrollOffset: 80,
    onPageChange: setPage
  })

  return (
    <DocumentsListContent
      ref={scrollTargetRef}
      data={data}
      isLoading={isLoading || enrichLoading}
      error={error}
      onTryAgain={refetch}
      queryTerms={terms}
      paginator={paginator}
      info={info}
    />
  )
}

export default DocumentsList
