import { Grid, Badge, Text } from '@mantine/core'

import { TextChunkValues } from '../../types/filters'

type Props = {
  value?: string
  modified?: boolean
}

const TextChunkInfo = ({ value, modified }: Props) => {
  const color = modified ? 'orange' : 'green'

  let chunkLabel = ''

  if (value) {
    switch (TextChunkValues[value]) {
      case TextChunkValues.CHUNK_SEARCH:
        chunkLabel = 'Chunk'
        break

      case TextChunkValues.ALL_CHUNKS_SEARCH:
        chunkLabel = 'All chunks'
        break

      case TextChunkValues.DOCUMENT_SEARCH:
        chunkLabel = 'Document'
        break

      default:
        chunkLabel = value
        break
    }
  }

  return (
    <Grid gutter="xs">
      <Grid.Col span={3}>
        <Text span>Text chunk: </Text>
      </Grid.Col>
      <Grid.Col span={9}>
        <Badge color={color} variant="outline" styles={{ root: { textTransform: 'none' } }}>
          {chunkLabel}
        </Badge>
      </Grid.Col>
    </Grid>
  )
}

export default TextChunkInfo
