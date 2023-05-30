import { ScrollArea, Container, Group, Button, Divider, rem } from '@mantine/core'
import { IconClearAll } from '@tabler/icons-react'

import MultipleValuesInfo from './MultipleValuesInfo'
import RangeValueInfo from './RangeValueInfo'
import TextChunkInfo from './TextChunkInfo'
import { getSourceLists, getTaxonomyLists, getOtherLists, FilterStatusColors } from './utils'

import { FilterStatus } from '../../types/filter-info'
import type { FilterStatusInfo } from '../../types/filter-info'
import type { ClearAction } from '../../types/filters'
import { ClearCategory, ClearType } from '../../types/filters'

type Props = {
  status?: FilterStatusInfo
  onClear?(action: ClearAction): void
}

const FilterInfo = ({ status, onClear }: Props) => {
  const chunkModified = !!status?.chunkModified
  const chunkValue = chunkModified
    ? status?.currentFilter?.chunkValue
    : status?.appliedFilter?.chunkValue

  const rangeModified = !!status?.rangeModified
  const rangeValue = rangeModified
    ? status?.currentFilter?.rangeValue
    : status?.appliedFilter?.rangeValue
  const rangeEnabled = rangeModified
    ? status?.currentFilter?.rangeValueEnabled
    : status?.appliedFilter?.rangeValueEnabled

  const { sourceApplied, sourceDeleted, sourceAdded } = getSourceLists(status)
  const { taxonomyApplied, taxonomyDeleted, taxonomyAdded } = getTaxonomyLists(status)
  const { otherApplied, otherDeleted, otherAdded } = getOtherLists(status)

  return (
    <ScrollArea.Autosize mx="auto" mah={rem(500)}>
      <Container fluid p={5}>
        <Group position="center">
          <Button
            compact
            leftIcon={<IconClearAll size={rem(16)} />}
            color={FilterStatusColors.APPLIED}
            variant="outline"
            disabled={status?.prevStatus === FilterStatus.UNKNOWN}
            onClick={e => {
              e.stopPropagation()
              onClear?.({ type: ClearType.ALL })
            }}
          >
            Clear all
          </Button>
          <Button
            compact
            leftIcon={<IconClearAll size={rem(16)} />}
            color={FilterStatusColors.MODIFIED}
            variant="outline"
            disabled={status?.modified() === 0}
            onClick={e => {
              e.stopPropagation()
              onClear?.({ type: ClearType.ALL_MODIFIED })
            }}
          >
            Clear modified
          </Button>
        </Group>

        <Divider my="sm" mt="sm" mb="sm" />

        <TextChunkInfo value={chunkValue} modified={chunkModified} />

        <RangeValueInfo value={rangeValue} modified={rangeModified} enabled={rangeEnabled} />

        <MultipleValuesInfo
          title="Data sources"
          category={ClearCategory.SOURCE}
          applied={sourceApplied}
          deleted={sourceDeleted}
          added={sourceAdded}
          onClear={onClear}
        />

        <MultipleValuesInfo
          title="Taxonomies"
          category={ClearCategory.TAXONOMY}
          applied={taxonomyApplied}
          deleted={taxonomyDeleted}
          added={taxonomyAdded}
          onClear={onClear}
        />

        <MultipleValuesInfo
          title="Other"
          category={ClearCategory.OTHER}
          applied={otherApplied}
          deleted={otherDeleted}
          added={otherAdded}
          onClear={onClear}
        />
      </Container>
    </ScrollArea.Autosize>
  )
}

export default FilterInfo
