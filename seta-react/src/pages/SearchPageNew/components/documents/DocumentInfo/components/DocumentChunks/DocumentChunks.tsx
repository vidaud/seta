import type { ForwardedRef } from 'react'
import { forwardRef, useMemo } from 'react'

import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import useHighlight from '~/hooks/use-highlight'
import type { DataProps } from '~/types/data-props'
import type { Chunk } from '~/types/search/documents'

import DocumentChunk from './DocumentChunk'
import * as S from './styles'

type Props = {
  currentChunkNumber: number
  currentChunkRef?: ForwardedRef<HTMLDivElement>
  totalChunks: number
  queryTerms?: string[]
} & DataProps<Chunk[]>

const DocumentChunks = forwardRef<HTMLDivElement, Props>(
  (
    { currentChunkNumber, currentChunkRef, queryTerms, data, isLoading, error, onTryAgain },
    ref
  ) => {
    const chunksText = useMemo(
      () =>
        data?.map(({ chunk_text }) => chunk_text).filter((text): text is string => text !== null) ??
        [],
      [data]
    )

    const chunksTextHl = useHighlight(queryTerms, ...chunksText)

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
        {data.map(({ chunk_number }, index) => (
          <DocumentChunk
            key={chunk_number}
            ref={chunk_number === currentChunkNumber ? currentChunkRef : undefined}
            chunkNumber={chunk_number}
            isCurrent={chunk_number === currentChunkNumber}
          >
            <div css={S.chunk}>{chunksTextHl[index]}</div>
          </DocumentChunk>
        ))}
      </div>
    )
  }
)

export default DocumentChunks
