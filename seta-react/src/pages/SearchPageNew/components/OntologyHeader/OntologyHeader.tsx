import { useState } from 'react'
import type { ActionIconProps, ChipProps, SelectItem } from '@mantine/core'
import { Text, Select, Chip, ActionIcon, Flex, Tooltip } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useTermsSelection } from '~/pages/SearchPageNew/contexts/terms-selection-context'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import * as S from './styles'

const viewOptions: SelectItem[] = [
  { label: 'Related Term Clusters', value: TermsView.TermsClusters },
  { label: 'Related Terms', value: TermsView.RelatedTerms }
]

type Props = {
  className?: string
  currentView?: TermsView
  onViewChange?: (value: TermsView) => void
}

const OntologyHeader = ({ className, currentView, onViewChange }: Props) => {
  const [termSelected, setTermSelected] = useState(false)
  const [enriched, setEnriched] = useState(false)

  const { currentToken } = useSearch()
  const { allSelected, setAllSelected } = useTermsSelection()

  const termTooltip = allSelected ? 'Unselect all terms' : 'Select all terms'
  const termVariant: ChipProps['variant'] = allSelected ? 'filled' : 'outline'

  const enrichedProps: Partial<ActionIconProps> = enriched
    ? {
        color: 'teal',
        variant: 'filled'
      }
    : {
        color: 'gray',
        variant: 'subtle'
      }

  const handleSelectAllChange = (value: boolean) => {
    // setTermSelected(value)
    setAllSelected(value)
  }

  const handleViewChange = (value: string) => {
    const view: TermsView = TermsView[value]

    onViewChange?.(view)
  }

  const toggleEnriched = () => {
    setEnriched(current => !current)
  }

  const hasToken = !!currentToken?.token

  const token = hasToken ? (
    <Tooltip label={termTooltip}>
      <div>
        <Chip
          css={S.termChip}
          variant={termVariant}
          color="teal"
          size="md"
          checked={allSelected}
          onChange={handleSelectAllChange}
        >
          {currentToken.token}
        </Chip>
      </div>
    </Tooltip>
  ) : (
    <Text size="sm" color="gray">
      Type or select a term to see related suggestions
    </Text>
  )

  const enrichButton = hasToken && (
    <Tooltip label="Enrich query automatically">
      <ActionIcon size="lg" radius="md" onClick={toggleEnriched} {...enrichedProps}>
        <IconWand />
      </ActionIcon>
    </Tooltip>
  )

  return (
    <Flex css={S.root} className={className} align="center" justify="space-between">
      <Flex align="center" gap="sm">
        {token}
        {enrichButton}
      </Flex>

      <Select data={viewOptions} value={currentView} onChange={handleViewChange} />
    </Flex>
  )
}

export default OntologyHeader
