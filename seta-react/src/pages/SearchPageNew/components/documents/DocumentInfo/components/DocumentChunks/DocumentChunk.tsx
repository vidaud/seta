import { forwardRef } from 'react'
import { Tooltip } from '@mantine/core'

import AnnotatedText from '~/components/AnnotatedText'
import { KEYWORD_SELECTED_ID } from '~/pages/SearchPageNew/components/AnnotationsPreview/AnnotationsPreview'

import { useHighlightWords } from '~/hooks/use-highlight'
import type { Chunk } from '~/types/search/documents'

import * as S from './styles'

type Props = {
  chunk: Chunk
  selectedAnnotationId?: string
  isCurrent?: boolean
  queryTerms?: string[]
}

const DocumentChunk = forwardRef<HTMLDivElement, Props>(
  ({ chunk, selectedAnnotationId, isCurrent, queryTerms }, ref) => {
    const { chunk_number: chunkNumber, chunk_text: chunkText, other } = chunk

    const annotations = other?.annotation_position

    const chunkTextHl = useHighlightWords(queryTerms, chunkText ?? '')

    const content =
      selectedAnnotationId === KEYWORD_SELECTED_ID ? (
        <div css={S.chunk}>{chunkTextHl}</div>
      ) : (
        <AnnotatedText
          css={S.chunk}
          text={chunkText}
          annotations={annotations}
          visibleAnnotationId={selectedAnnotationId}
        />
      )

    return (
      <div ref={ref} css={S.chunkRoot}>
        {isCurrent && (
          <Tooltip label="Current chunk" position="right">
            <div css={S.currentChunkMarker} />
          </Tooltip>
        )}

        <div css={S.chunkNumber}>- {chunkNumber} -</div>

        {content}
      </div>
    )
  }
)

export default DocumentChunk
