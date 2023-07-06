import type { ActionIconProps, ChipProps, SelectItem } from '@mantine/core'
import { ActionIcon, Text, Select, Chip, Flex, Tooltip, Group } from '@mantine/core'
import { IconWand } from '@tabler/icons-react'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import { useTermsSelection } from '~/pages/SearchPageNew/contexts/terms-selection-context'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'
import { TokenType } from '~/pages/SearchPageNew/types/token'

import * as S from './styles'

const viewOptions: SelectItem[] = [
  { label: 'Related Term Clusters', value: TermsView.TermsClusters },
  { label: 'Related Terms', value: TermsView.RelatedTerms }
]

type Props = {
  className?: string
  currentView?: TermsView
  enrichQuery?: boolean
  loading?: boolean
  onViewChange?: (value: TermsView) => void
  onEnrichToggle?: () => void
}

const OntologyHeader = ({
  className,
  currentView,
  enrichQuery,
  loading,
  onViewChange,
  onEnrichToggle
}: Props) => {
  const { currentToken } = useSearch()
  const { allSelectedChecked, setAllSelectedChecked, setAllSelected } = useTermsSelection()

  const termTooltip = allSelectedChecked ? 'Unselect all terms' : 'Select all terms'
  const termVariant: ChipProps['variant'] = allSelectedChecked ? 'filled' : 'outline'

  const disabled = loading || enrichQuery

  const enrichedProps: Partial<ActionIconProps> = enrichQuery
    ? {
        color: 'teal',
        variant: 'filled'
      }
    : {
        color: 'gray',
        variant: 'subtle'
      }

  const handleSelectAllChange = (value: boolean) => {
    setAllSelectedChecked(value)
    setAllSelected(value)
  }

  const handleViewChange = (value: string) => {
    const view: TermsView = TermsView[value]

    setAllSelectedChecked(false)
    onViewChange?.(view)
  }

  const hasToken = !!currentToken?.token
  const isOperator = currentToken?.type === TokenType.OPERATOR

  const { rawValue, operator } = currentToken ?? {}

  const token = isOperator ? (
    <Group spacing="xs">
      <div css={S.operator} data-operator={operator}>
        {rawValue}
      </div>

      <Text size="sm" color="dimmed">
        [operator]
      </Text>
    </Group>
  ) : hasToken ? (
    <Tooltip label={termTooltip} disabled={disabled}>
      <div>
        <Chip
          css={S.termChip}
          variant={termVariant}
          color="teal"
          size="md"
          checked={!disabled && allSelectedChecked}
          disabled={disabled}
          onChange={handleSelectAllChange}
        >
          {rawValue}
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
      <ActionIcon size="lg" radius="sm" onClick={onEnrichToggle} {...enrichedProps}>
        <IconWand />
      </ActionIcon>
    </Tooltip>
  )

  return (
    <Flex css={S.root} className={className} align="center" justify="space-between">
      {token}

      <Flex align="center" gap="sm">
        {enrichButton}

        <Select data={viewOptions} value={currentView} onChange={handleViewChange} />
      </Flex>
    </Flex>
  )
}

export default OntologyHeader
