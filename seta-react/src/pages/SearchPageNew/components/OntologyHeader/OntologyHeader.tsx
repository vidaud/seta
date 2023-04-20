import { useState } from 'react'
import type { ActionIconProps, ChipProps, SelectItem } from '@mantine/core'
import { Select, Chip, ActionIcon, Flex, Tooltip } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import * as S from './styles'

const viewOptions: SelectItem[] = [
  { label: 'Related Term Clusters', value: 'clusters' },
  { label: 'Related Terms', value: 'terms' }
]

const OntologyHeader = () => {
  const [termSelected, setTermSelected] = useState(false)
  const [enriched, setEnriched] = useState(false)
  const [currentView, setCurrentView] = useState(viewOptions[0].value)

  const termTooltip = termSelected ? 'Unselect all terms' : 'Select all terms'
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

  const handleViewChange = (value: string) => {
    setCurrentView(value)
  }

  const toggleEnriched = () => {
    setEnriched(current => !current)
  }

  return (
    <Flex align="center" justify="space-between" css={S.root}>
      <Flex align="center" gap="sm">
        <Tooltip label={termTooltip}>
          <div>
            <Chip
              css={S.termChip}
              variant={termVariant}
              color="teal"
              size="md"
              checked={termSelected}
              onChange={value => setTermSelected(value)}
            >
              test
            </Chip>
          </div>
        </Tooltip>

        <Tooltip label="Enrich query automatically">
          <ActionIcon size="lg" radius="md" onClick={toggleEnriched} {...enrichedProps}>
            <IconWand />
          </ActionIcon>
        </Tooltip>
      </Flex>

      <Select data={viewOptions} value={currentView} onChange={handleViewChange} />
    </Flex>
  )
}

export default OntologyHeader
