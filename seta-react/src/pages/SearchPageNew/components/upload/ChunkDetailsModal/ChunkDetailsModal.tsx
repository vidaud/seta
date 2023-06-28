import { useState } from 'react'
import { Group, Modal, ScrollArea, Text } from '@mantine/core'
import { ImEmbed } from 'react-icons/im'

import type { ChunkInfo } from '~/types/embeddings'

import * as S from './styles'

type Props = {
  chunk?: ChunkInfo
  opened: boolean
  onClose: () => void
}

const ChunkDetailsModal = ({ chunk, ...props }: Props) => {
  const [scrolled, setScrolled] = useState(false)

  const { id, chunk: chunkNumber, text } = chunk ?? {}

  const { classes: modalStyles } = S.modalStyles()

  const title = (
    <Group spacing="xs">
      <ImEmbed css={S.icon} />

      <Text size="lg" color="dimmed">
        {id}
      </Text>

      <Text size="lg" fw={500} color="gray.8">
        Chunk {chunkNumber}
      </Text>
    </Group>
  )

  return (
    <Modal
      title={title}
      size="xl"
      centered
      zIndex={300}
      classNames={{ ...modalStyles }}
      closeButtonProps={{ 'aria-label': 'Close modal' }}
      data-scrolled={scrolled}
      {...props}
    >
      <ScrollArea.Autosize
        css={S.scrollArea}
        onScrollPositionChange={({ y }) => setScrolled(y > 10)}
      >
        <div css={S.textView}>{text}</div>
      </ScrollArea.Autosize>
    </Modal>
  )
}

export default ChunkDetailsModal
