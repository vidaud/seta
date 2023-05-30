import { useState } from 'react'
import type { DefaultMantineColor } from '@mantine/core'
import { Alert, Box } from '@mantine/core'
import { IconAlertCircle, IconListSearch, IconSearch, IconWallet } from '@tabler/icons-react'

import ToggleSection from '~/components/ToggleSection'
import { FilterStatus } from '~/pages/SearchWithFilters/types/filter-info'

import type { AdvancedFilterProps } from '../../types/contracts'
import FiltersPanel from '../FiltersPanel'

const markerColor: Record<FilterStatus, DefaultMantineColor | null> = {
  [FilterStatus.UNKNOWN]: null,
  [FilterStatus.PROCESSING]: null,
  [FilterStatus.MODIFIED]: 'orange',
  [FilterStatus.APPLIED]: 'teal'
}

const SidePanel = ({
  className,
  queryContract,
  onApplyFilter,
  filtersDisabled
}: AdvancedFilterProps) => {
  const [filtersStatus, setFiltersStatus] = useState<FilterStatus | null>(null)

  const marker = markerColor[filtersStatus ?? FilterStatus.UNKNOWN]

  return (
    <Box className={className}>
      <ToggleSection
        icon={<IconListSearch size={20} />}
        color="teal"
        title="Filters"
        marker={marker}
        open={!filtersDisabled}
        disabled={filtersDisabled}
      >
        <FiltersPanel
          queryContract={queryContract}
          onApplyFilter={onApplyFilter}
          onStatusChange={setFiltersStatus}
        />
      </ToggleSection>

      <ToggleSection icon={<IconSearch size={20} />} color="grape" title="My Search">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Not implemented yet!" color="red">
          This panel will contain my search library.
        </Alert>
      </ToggleSection>

      <ToggleSection icon={<IconWallet size={20} />} color="orange" title="My Documents">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Not implemented yet!" color="red">
          This panel will contain my documents library.
        </Alert>
      </ToggleSection>
    </Box>
  )
}

export default SidePanel
