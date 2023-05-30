import { Grid, Badge, Text } from '@mantine/core'

import { FilterStatusColors } from './utils'

import { TextChunkLabels, TextChunkValues } from '../../types/filters'

type Props = {
  value?: string
  modified?: boolean
}

const TextChunkInfo = ({ value, modified }: Props) => {
  const color = modified ? FilterStatusColors.MODIFIED : FilterStatusColors.APPLIED

  const chunkLabel = TextChunkLabels[TextChunkValues[value ?? 'CHUNK_SEARCH']]

  return (
    <Grid gutter="xs">
      <Grid.Col span={3}>
        <Text span>Text chunk: </Text>
      </Grid.Col>
      <Grid.Col span={9}>
        <Badge
          color={color}
          variant="outline"
          size="lg"
          styles={{ root: { textTransform: 'none' } }}
        >
          {chunkLabel}
        </Badge>
      </Grid.Col>
    </Grid>
  )
}

export default TextChunkInfo
