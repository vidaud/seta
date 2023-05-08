import { useState } from 'react'
import type { ActionIconProps, ChipProps, SelectItem } from '@mantine/core'
import { Text, Select, Chip, ActionIcon, Flex, Tooltip } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'

import * as S from './styles'

const viewOptions: SelectItem[] = [
  { label: 'Related Term Clusters', value: 'clusters' },
  { label: 'Related Terms', value: 'terms' }
]

type Props = {
  className?: string
  onSelectAllChange?: (value: boolean) => void
}

const OntologyHeader = ({ className, onSelectAllChange }: Props) => {
  const { currentToken } = useSearch()

  const [termSelected, setTermSelected] = useState(false)
  const [enriched, setEnriched] = useState(false)
  const [currentView, setCurrentView] = useState(viewOptions[0].value)

  const termTooltip = termSelected ? 'Unselect all related terms' : 'Select all related terms'
  const termVariant: ChipProps['variant'] = termSelected ? 'filled' : 'outline'

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
    setTermSelected(value)
    onSelectAllChange?.(value)
  }

  const handleViewChange = (value: string) => {
    setCurrentView(value)
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
          checked={termSelected}
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
