import { Button, Indicator, HoverCard } from '@mantine/core'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'

import { useStyles } from './styles'

import type { FilterStatusInfo } from '../../types/filter-info'
import { FilterStatus } from '../../types/filter-info'
import type { ClearAction } from '../../types/filters'
import FilterInfo from '../FilterInfo'

type Props = {
  status?: FilterStatusInfo
  onApplyFilters?(): void
  onClear?(action: ClearAction): void
}

const ApplyFilters = ({ status, onApplyFilters, onClear }: Props) => {
  const { classes } = useStyles()

  let color: string | undefined = undefined
  let processing = false
  let hoverDisabled = false
  let modified: number | null = null

  switch (status?.status) {
    case FilterStatus.APPLIED:
      color = 'teal'
      modified = status?.applied()
      break

    case FilterStatus.MODIFIED:
      color = 'orange'
      modified = status?.modified()
      break

    case FilterStatus.PROCESSING:
      color = 'blue'
      processing = true
      hoverDisabled = true
      modified = status?.modified()
      break

    default:
      hoverDisabled = true
      color = 'gray'

      break
  }

  if (modified === 0) {
    modified = null
  }

  return (
    <HoverCard
      classNames={classes}
      withinPortal
      position="right-start"
      width={500}
      offset={{ mainAxis: 20, crossAxis: -15 }}
      arrowOffset={10}
      shadow="lg"
      withArrow
      openDelay={400}
      closeDelay={400}
      keepMounted={true}
      disabled={hoverDisabled}
    >
      <HoverCard.Target>
        <Indicator
          color={color}
          size={24}
          inline
          withBorder
          label={modified}
          processing={processing}
        >
          <Button
            leftIcon={<IconAdjustmentsHorizontal />}
            radius="sm"
            size="lg"
            variant="outline"
            onClick={onApplyFilters}
            disabled={processing}
          >
            Apply Filters
          </Button>
        </Indicator>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <FilterInfo status={status} onClear={onClear} />
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default ApplyFilters
