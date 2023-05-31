import type { SegmentedControlItem } from '@mantine/core'
import { Center, Flex, SegmentedControl, Text, Tooltip } from '@mantine/core'

import { TextChunkLabels, TextChunkValues } from '../../types/filters'

type Props = {
  value?: TextChunkValues
  disabled?: boolean
  onChange?(value: TextChunkValues): void
}

const chunkValues: { value: string; tooltip: string; label: string }[] = [
  {
    value: TextChunkValues.CHUNK_SEARCH,
    tooltip: TextChunkLabels.CHUNK_SEARCH,
    label: '1'
  },
  {
    value: TextChunkValues.DOCUMENT_SEARCH,
    tooltip: TextChunkLabels.DOCUMENT_SEARCH,
    label: '∃!'
  },
  {
    value: TextChunkValues.ALL_CHUNKS_SEARCH,
    tooltip: TextChunkLabels.ALL_CHUNKS_SEARCH,
    label: '∃'
  }
]

const chunks: SegmentedControlItem[] = chunkValues.map(({ value, tooltip, label }) => ({
  value,
  label: (
    <Tooltip label={tooltip} offset={10} withinPortal>
      <Center>
        <Text span weight="bold">
          {label}
        </Text>
      </Center>
    </Tooltip>
  )
}))

const TextChunkFilter = ({ value, disabled, onChange }: Props) => (
  <Flex align="center" wrap="nowrap" gap="sm">
    <Text span fz="lg" fw={500}>
      Text chunk:
    </Text>

    <SegmentedControl
      size="md"
      value={value}
      onChange={onChange}
      data={chunks}
      disabled={disabled}
    />
  </Flex>
)

export default TextChunkFilter
