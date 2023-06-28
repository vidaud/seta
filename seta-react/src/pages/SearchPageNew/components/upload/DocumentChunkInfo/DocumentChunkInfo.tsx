import { useRef, type MouseEventHandler } from 'react'
import { ActionIcon, Flex, Group, Text } from '@mantine/core'
import { FiEye } from 'react-icons/fi'
import { ImEmbed } from 'react-icons/im'
import { MdClose } from 'react-icons/md'

import type { ChunkInfo } from '~/types/embeddings'

import * as S from './styles'

type Props = {
  chunk: ChunkInfo
  onViewDetails?: () => void
  onRemove?: () => void
}

const DocumentChunkInfo = ({ chunk: { id, brief }, onViewDetails, onRemove }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null)

  const handleInfoClick: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    onViewDetails?.()
  }

  const handleRemoveClick: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation()
    onRemove?.()
  }

  return (
    <div css={S.root} ref={rootRef} onClick={onViewDetails}>
      <Group spacing="xs">
        <ImEmbed css={S.icon} />

        <Text color="dimmed" size="md">
          {id}
        </Text>
      </Group>

      <Text truncate mr="sm">
        {brief}
      </Text>

      <Flex align="center" className="actions" gap={4}>
        <ActionIcon variant="subtle" color="gray.5" data-action-view onClick={handleInfoClick}>
          <FiEye />
        </ActionIcon>

        <ActionIcon variant="subtle" color="gray.5" data-action-remove onClick={handleRemoveClick}>
          <MdClose />
        </ActionIcon>
      </Flex>
    </div>
  )
}

export default DocumentChunkInfo
