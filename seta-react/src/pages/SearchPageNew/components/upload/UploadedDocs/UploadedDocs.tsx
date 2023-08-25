import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ScrollArea, Stack } from '@mantine/core'
import { FaRegTrashAlt } from 'react-icons/fa'

import ConfirmModal from '~/components/ConfirmModal'
import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'

import useScrolled from '~/hooks/use-scrolled'
import type { ClassNameProp } from '~/types/children-props'
import type { ChunkInfo } from '~/types/embeddings'

import * as S from './styles'

import ChunkDetailsModal from '../ChunkDetailsModal'
import DocumentInfo from '../DocumentInfo'
import UploadActions from '../UploadActions'

type ChunkModalState = {
  open: boolean
  chunk?: ChunkInfo
}

type RemoveType = 'chunk' | 'document' | 'all'

type RemoveModalState = {
  open: boolean
  type?: RemoveType
  id?: string
}

const getRemoveValues = (type: RemoveType | undefined, id?: string) => {
  switch (type) {
    case 'chunk':
      return ['chunk', `the chunk ${id}`]

    case 'document':
      return ['document', `the document ${id}`]

    case 'all':
      return ['all entries', 'all the entries']

    default:
      return ['', '']
  }
}

type Props = ClassNameProp & {
  onAddText?: () => void
}

const UploadedDocs = ({ className, onAddText }: Props) => {
  const [chunkModalState, setChunkModalState] = useState<ChunkModalState>({ open: false })
  const [removeModalState, setRemoveModalState] = useState<RemoveModalState>({ open: false })

  const { scrolled, handleScrollChange } = useScrolled({ delta: 10 })

  const { documents, removeChunk, removeDocument, removeAll } = useUploadDocuments()

  const [animateRef] = useAutoAnimate<HTMLDivElement>({ duration: 200 })

  const headerStyle = [S.actions, scrolled && S.withShadow]

  const openChunkModal = (chunk: ChunkInfo) => setChunkModalState({ open: true, chunk })
  const handleChunkModalClose = () => setChunkModalState(prev => ({ ...prev, open: false }))

  const openRemoveModal = (type: RemoveType, id?: string) =>
    setRemoveModalState({ open: true, type, id })

  const closeRemoveModal = () => setRemoveModalState(prev => ({ ...prev, open: false }))

  const handleRemoveAll = () => openRemoveModal('all')

  const handleRemove = () => {
    const { type, id } = removeModalState

    closeRemoveModal()

    if (!type) {
      return
    }

    if (type === 'all') {
      removeAll()
    } else {
      if (!id) {
        return
      }

      if (type === 'chunk') {
        removeChunk(id)
      } else {
        removeDocument(id)
      }
    }
  }

  const { open: chunkModalOpen, chunk: currentChunk } = chunkModalState
  const { open: removeModalOpen, ...removeCurrent } = removeModalState

  const [removeName, removeText] = getRemoveValues(removeCurrent.type, removeCurrent.id)

  const removeModalText = `Are you sure you want to remove ${removeText}?`

  return (
    <>
      <Stack spacing={0} className={className} mah="100%">
        <UploadActions css={headerStyle} onAddText={onAddText} onRemoveAll={handleRemoveAll} />

        <ScrollArea css={S.scrollArea} onScrollPositionChange={handleScrollChange}>
          <div ref={animateRef}>
            {documents.map(doc => (
              <DocumentInfo
                key={doc.id}
                document={doc}
                onViewChunkDetails={openChunkModal}
                onRemoveChunk={chunkId => openRemoveModal('chunk', chunkId)}
                onRemoveDocument={() => openRemoveModal('document', doc.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </Stack>

      <ChunkDetailsModal
        chunk={currentChunk}
        opened={chunkModalOpen}
        onClose={handleChunkModalClose}
      />

      <ConfirmModal
        icon={<FaRegTrashAlt css={S.removeIcon} />}
        description={removeModalText}
        secondary="This action cannot be undone."
        confirmLabel={`Remove ${removeName}`}
        confirmColor="red"
        opened={removeModalOpen}
        withinPortal={false}
        onClose={closeRemoveModal}
        onConfirm={handleRemove}
      />
    </>
  )
}

export default UploadedDocs
