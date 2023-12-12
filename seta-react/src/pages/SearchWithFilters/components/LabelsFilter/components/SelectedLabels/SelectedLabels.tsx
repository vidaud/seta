import { Box } from '@mantine/core'

import useGroupedLabels from '~/pages/SearchWithFilters/components/LabelsFilter/hooks/useGroupedLabels'

import type { Label } from '~/types/filters/label'

import LabelsGroup from '../LabelsGroup'
import NoLabelsSelected from '../NoLabelsSelected'

type Props = {
  labels: Label[]
  onRemoveLabels?: (labels: Label[]) => void
}

const SelectedLabels = ({ labels, onRemoveLabels }: Props) => {
  const { groupedLabels } = useGroupedLabels(labels)

  const content = labels.length ? (
    Object.entries(groupedLabels).map(([category, groupLabels]) => (
      <LabelsGroup
        key={category}
        category={category}
        labels={groupLabels}
        allSelected
        onRemoveLabels={onRemoveLabels}
      />
    ))
  ) : (
    <NoLabelsSelected />
  )

  return (
    <Box my="-0.25rem" px="0.25rem">
      {content}
    </Box>
  )
}

export default SelectedLabels
