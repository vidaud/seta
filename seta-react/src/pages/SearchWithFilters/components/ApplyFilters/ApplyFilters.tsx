import { Button, Indicator } from '@mantine/core'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'

import { FilterStatus } from '../../types/filters'
import type { FilterStatusInfo } from '../../types/filters'

type Props = {
  status?: FilterStatusInfo
  onApplyFilters?(): void
}

const ApplyFilters = ({ status, onApplyFilters }: Props) => {
  let color: string | undefined = undefined
  let processing = false

  switch (status?.status) {
    case FilterStatus.APPLIED:
      color = 'green'
      break

    case FilterStatus.MODIFIED:
      color = 'orange'
      break

    case FilterStatus.PROCESSING:
      color = 'blue'
      processing = true
      break

    default:
      color = 'gray'
  }

  let modified: number | null | undefined = status?.modified()

  if (modified === 0) {
    modified = null
  }

  return (
    <Indicator color={color} size={24} inline withBorder label={modified} processing={processing}>
      <Button
        leftIcon={<IconAdjustmentsHorizontal />}
        radius="md"
        size="lg"
        variant="outline"
        onClick={onApplyFilters}
      >
        Apply Filters
      </Button>
    </Indicator>
  )
}

export default ApplyFilters
