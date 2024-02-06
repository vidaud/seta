import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import type { DataProps } from '~/types/data-props'
import type { Chunk } from '~/types/search/documents'

import DocumentChunk from './DocumentChunk'
import * as S from './styles'

type Props = {
  currentChunkNumber: number
  currentChunkRef?: ForwardedRef<HTMLDivElement>
  totalChunks: number
  selectedAnnotationId?: string
  queryTerms?: string[]
} & DataProps<Chunk[]>

const DocumentChunks = forwardRef<HTMLDivElement, Props>(
  (
    {
      currentChunkNumber,
      currentChunkRef,
      selectedAnnotationId,
      queryTerms,
      data,
      isLoading,
      error,
      onTryAgain
    },
    ref
  ) => {
    if (error) {
      return (
        <SuggestionsError size="md" mt={0} subject="the chunks" withIcon onTryAgain={onTryAgain} />
      )
    }

    if (isLoading || !data) {
      return <SuggestionsLoading size="md" mt={0} color="blue" variant="bars" />
    }

    return (
      <div css={S.root} ref={ref}>
        {data.map(chunk => (
          <DocumentChunk
            key={chunk.chunk_number}
            ref={chunk.chunk_number === currentChunkNumber ? currentChunkRef : undefined}
            chunk={chunk}
            selectedAnnotationId={selectedAnnotationId}
            queryTerms={queryTerms}
            isCurrent={chunk.chunk_number === currentChunkNumber}
          />
        ))}
      </div>
    )
  }
)

export default DocumentChunks
