import { Center, Flex, SegmentedControl, Text, Tooltip, Indicator, rem } from '@mantine/core'

import { TextChunkValues } from '../../types/filters'

type Props = {
  value?: TextChunkValues
  onChange?(value: TextChunkValues): void
  modified?: boolean
}

const TextChunkFilter = ({ value, onChange, modified }: Props) => {
  return (
    <Flex direction="row" align="center" wrap="nowrap">
      <Indicator inline pr={rem(10)} mr={rem(10)} color="orange" disabled={!modified}>
        <Text span fz="lg" fw={500}>
          Text chunk
        </Text>
      </Indicator>
      <SegmentedControl
        size="md"
        value={value}
        onChange={onChange}
        data={[
          {
            value: TextChunkValues.CHUNK_SEARCH,
            label: (
              <Tooltip label="Chunk" offset={10} withinPortal>
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
              <Tooltip label="Document" offset={10} withinPortal>
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
              <Tooltip label="All chunks" offset={10} withinPortal>
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
