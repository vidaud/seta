import { Text } from '@mantine/core'

import { useHighlightWords } from '~/hooks/use-highlight'
import useModalState from '~/hooks/use-modal-state'
import type { Annotation } from '~/types/search/annotations'

import * as S from './styles'

import DocumentChunksModal from '../DocumentChunksModal'
import InfoContainer from '../InfoContainer'

type Props = {
  text: string
  queryTerms?: string[]
  documentId: string
  documentTitle: string
  documentAnnotations?: Annotation[]
  chunkNumber: number
}

const ChunkPreview = ({
  text,
  queryTerms,
  documentTitle,
  documentId,
  documentAnnotations,
  chunkNumber
}: Props) => {
  const { modalOpen, openModal, closeModal } = useModalState()

  const [textHl] = useHighlightWords(queryTerms, text)

  return (
    <>
      <InfoContainer
        withQuotes
        expandable
        expandTitle="Expand document chunks"
        onExpand={openModal}
      >
        <Text color="gray.7" css={S.text}>
          {textHl}
        </Text>
      </InfoContainer>

      <DocumentChunksModal
        title={documentTitle}
        documentId={documentId}
        documentAnnotations={documentAnnotations}
        chunkNumber={chunkNumber}
        queryTerms={queryTerms}
        opened={modalOpen}
        onClose={closeModal}
      />
    </>
  )
}

export default ChunkPreview
