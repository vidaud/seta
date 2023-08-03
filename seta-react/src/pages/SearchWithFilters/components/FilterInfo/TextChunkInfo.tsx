import { Grid, Badge, Text } from '@mantine/core'

import { FilterStatusColors } from './utils'

import { TextChunkValues } from '../../types/filters'

type Props = {
  value?: string
  modified?: boolean
}

const TextChunkInfo = ({ value, modified }: Props) => {
  const chunkValue = TextChunkValues[value ?? 'CHUNK_SEARCH']

  if (!modified && chunkValue === TextChunkValues.CHUNK_SEARCH) {
    return null
  }

  const color = modified ? FilterStatusColors.MODIFIED : FilterStatusColors.APPLIED

  const chunkLabel = chunkValue === TextChunkValues.CHUNK_SEARCH ? 'No' : 'Yes'

  return (
    <Grid gutter="xs">
      <Grid.Col span={5}>
        <Text span>Show multiple chunks: </Text>
      </Grid.Col>
      <Grid.Col span={7}>
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
