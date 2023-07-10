import { Group, Text } from '@mantine/core'
import { ImEmbed } from 'react-icons/im'

import ScrollModal from '~/components/ScrollModal'

import type { ChunkInfo } from '~/types/embeddings'
import type { ModalStateProps } from '~/types/lib-props'

import * as S from './styles'

type Props = {
  chunk?: ChunkInfo
} & ModalStateProps

const ChunkDetailsModal = ({ chunk, ...props }: Props) => {
  const { id, chunk: chunkNumber, text } = chunk ?? {}

  const title = (
    <Group spacing="xs">
      <Text size="lg" color="dimmed">
        {id}
      </Text>

      <div>Chunk {chunkNumber}</div>
    </Group>
  )

  return (
    <ScrollModal title={title} icon={<ImEmbed />} zIndex={300} fullScreenToggle {...props}>
      <div css={S.textView}>{text}</div>
    </ScrollModal>
  )
}

export default ChunkDetailsModal
