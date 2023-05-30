import { Center, Flex, SegmentedControl, Text, Tooltip } from '@mantine/core'

import { TextChunkLabels, TextChunkValues } from '../../types/filters'

type Props = {
  value?: TextChunkValues
  onChange?(value: TextChunkValues): void
}

const TextChunkFilter = ({ value, onChange }: Props) => {
  return (
    <Flex direction="row" align="center" wrap="nowrap">
      <Text span fz="lg" fw={500}>
        Text chunk
      </Text>
      <SegmentedControl
        size="md"
        value={value}
        onChange={onChange}
        data={[
          {
            value: TextChunkValues.CHUNK_SEARCH,
            label: (
              <Tooltip label={TextChunkLabels.CHUNK_SEARCH} offset={10} withinPortal>
                <Center>
                  <Text span weight="bold">
                    1
                  </Text>
                </Center>
              </Tooltip>
            )
          },
          {
            value: TextChunkValues.DOCUMENT_SEARCH,
            label: (
              <Tooltip label={TextChunkLabels.DOCUMENT_SEARCH} offset={10} withinPortal>
                <Center>
                  <Text span weight="bold">
                    ∃!
                  </Text>
                </Center>
              </Tooltip>
            )
          },
          {
            value: TextChunkValues.ALL_CHUNKS_SEARCH,
            label: (
              <Tooltip label={TextChunkLabels.ALL_CHUNKS_SEARCH} offset={10} withinPortal>
                <Center>
                  <Text span weight="bold">
                    ∃
                  </Text>
                </Center>
              </Tooltip>
            )
          }
        ]}
      />
    </Flex>
  )
}

export default TextChunkFilter
