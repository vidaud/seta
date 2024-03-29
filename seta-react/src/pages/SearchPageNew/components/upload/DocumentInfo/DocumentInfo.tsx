import { useRef, type MouseEventHandler, type ReactElement } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ActionIcon, Collapse, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CgFileDocument } from 'react-icons/cg'
import { GrTextAlignLeft } from 'react-icons/gr'
import { MdClose } from 'react-icons/md'

import ChevronToggleIcon from '~/components/ChevronToggleIcon'

import useKeyboardAction from '~/hooks/use-spacebar-action'
import type { ChunkInfo, EmbeddingInfo, EmbeddingType } from '~/types/embeddings'

import * as S from './styles'

import DocumentChunkInfo from '../DocumentChunkInfo'

type Props = {
  document: EmbeddingInfo
  onViewChunkDetails?: (chunk: ChunkInfo) => void
  onRemoveChunk?: (chunkId: string) => void
  onRemoveDocument?: () => void
}

const icon: Record<EmbeddingType, ReactElement> = {
  file: <CgFileDocument css={S.icon} />,
  text: (
    <GrTextAlignLeft
      css={S.icon}
      preserveAspectRatio="none"
      style={{ width: '18px', marginLeft: '3px', marginRight: '2px' }}
    />
  )
}

const DocumentInfo = ({ document, onViewChunkDetails, onRemoveChunk, onRemoveDocument }: Props) => {
  const [open, { toggle }] = useDisclosure()
  const [animateRef] = useAutoAnimate<HTMLDivElement>({ duration: 200 })

  const headerRef = useRef<HTMLDivElement>(null)

  const { preventKeyDownScroll, handleActionKeyUp } = useKeyboardAction(toggle)

  const { id, type, name, chunks } = document

  const handleHeaderClick = () => {
    // Prevent the header from staying focused when the user toggles it off
    if (open) {
      headerRef.current?.blur()
    }

    toggle()
  }

  const handleRemoveClick: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    onRemoveDocument?.()
  }

  const { handleActionKeyUp: handleRemoveKeyUp } = useKeyboardAction(handleRemoveClick)

  const chunksCount = chunks?.length === 1 ? '1 chunk' : `${chunks?.length} chunks`

  return (
    <div css={S.root} data-open={open}>
      <div
        css={S.header}
        ref={headerRef}
        onClick={handleHeaderClick}
        onKeyDown={preventKeyDownScroll}
        onKeyUp={handleActionKeyUp}
        data-open={open}
        tabIndex={0}
      >
        <Group spacing="xs">
          {icon[type]}

          <Text color="dimmed" size="md">
            {id}
          </Text>
        </Group>

        <Group miw={0}>
          <Text size="lg" style={{ flex: 1 }} truncate>
            {name}
          </Text>

          <Group mr={6}>
            <Text color="gray.5" size="xs">
              {chunksCount}
            </Text>

            <ChevronToggleIcon toggled={open} />
          </Group>
        </Group>

        <ActionIcon
          variant="subtle"
          color="gray"
          className="remove-button"
          onClick={handleRemoveClick}
          onKeyUp={handleRemoveKeyUp}
        >
          <MdClose />
        </ActionIcon>
      </div>

      <Collapse in={open} css={S.details}>
        <div ref={animateRef}>
          {chunks?.map(chunk => (
            <DocumentChunkInfo
              key={chunk.id}
              chunk={chunk}
              onViewDetails={() => onViewChunkDetails?.(chunk)}
              onRemove={() => onRemoveChunk?.(chunk.id)}
            />
          ))}
        </div>
      </Collapse>
    </div>
  )
}

export default DocumentInfo
