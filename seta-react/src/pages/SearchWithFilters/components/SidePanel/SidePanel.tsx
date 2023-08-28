import { useState } from 'react'
import type { DefaultMantineColor } from '@mantine/core'
import { Box } from '@mantine/core'
import { IconListSearch, IconSearch, IconWallet } from '@tabler/icons-react'

import ToggleSection from '~/components/ToggleSection'
import UnderDevelopment from '~/components/UnderDevelopment/UnderDevelopment'
import DocumentsTree from '~/pages/SearchPageNew/components/documents/DocumentsTree'
import { FilterStatus } from '~/pages/SearchWithFilters/types/filter-info'

import { useLibrary } from '~/api/search/library'

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

  const { data: libraryData, isLoading, error, refetch } = useLibrary()

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
        <UnderDevelopment variant="coming-soon" />
      </ToggleSection>

      <ToggleSection icon={<IconWallet size={20} />} color="orange" title="My Documents">
        <DocumentsTree
          data={libraryData?.items}
          isLoading={isLoading}
          error={error}
          onTryAgain={refetch}
        />
      </ToggleSection>
    </Box>
  )
}

export default SidePanel
