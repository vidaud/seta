import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core'
import { IconWallet } from '@tabler/icons-react'
import { FiCornerUpRight } from 'react-icons/fi'
import { GiSaveArrow } from 'react-icons/gi'
import { MdClose } from 'react-icons/md'

import ToggleTransition from '~/components/ToggleTransition'

import type { ClassNameProp } from '~/types/children-props'
import { pluralize } from '~/utils/string-utils'

import { SELECT_ALL_INFO, SELECT_NONE_INFO } from './constants'
import * as S from './styles'

type Props = ClassNameProp & {
  stagedCount: number
  selectedCount?: number
  onSelectAll?: () => void
  onSelectNone?: () => void
  onExportAll?: () => void
  onRemoveAll?: () => void
  onSaveSelected?: () => void
  onExportSelected?: () => void
  onRemoveSelected?: () => void
}

const StagedActions = ({
  className,
  stagedCount,
  selectedCount,
  onSelectAll,
  onSelectNone,
  onRemoveAll,
  onExportAll,
  onSaveSelected,
  onExportSelected,
  onRemoveSelected
}: Props) => {
  const anySelected = !!selectedCount

  const selectAction = anySelected ? SELECT_NONE_INFO : SELECT_ALL_INFO

  const selectAllIcon = SELECT_ALL_INFO.icon
  const selectNoneIcon = SELECT_NONE_INFO.icon

  const handleSelectAllToggle = () => {
    if (anySelected) {
      onSelectNone?.()
    } else {
      onSelectAll?.()
    }
  }

  const handleRemoveSelected = () => {
    if (selectedCount === stagedCount) {
      onRemoveAll?.()

      return
    }

    onRemoveSelected?.()
  }

  const docsLabel = pluralize('document', stagedCount)

  const info = selectedCount
    ? `${selectedCount} of ${stagedCount} ${docsLabel} selected`
    : `${stagedCount} ${docsLabel} staged`

  const defaultActions = (
    <Group spacing="xs" css={S.defaultActions}>
      <Tooltip label="Export all staged documents">
        <ActionIcon variant="outline" size="lg" radius="xl" color="blue" onClick={onExportAll}>
          <FiCornerUpRight size="1.2rem" />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Clear all staged documents">
        <ActionIcon variant="outline" size="lg" radius="xl" color="red" onClick={onRemoveAll}>
          <MdClose size="1.3rem" />
        </ActionIcon>
      </Tooltip>
    </Group>
  )

  const selectedActions = (
    <Group spacing="xs" css={S.selectedActions}>
      <Tooltip label="Add selected to my documents">
        <ActionIcon variant="filled" size="lg" radius="xl" color="orange" onClick={onSaveSelected}>
          <IconWallet size="1.3rem" />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Export selected">
        <ActionIcon variant="filled" size="lg" radius="xl" color="blue" onClick={onExportSelected}>
          <FiCornerUpRight size="1.2rem" />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Remove selected">
        <ActionIcon
          variant="filled"
          size="lg"
          radius="xl"
          color="red"
          onClick={handleRemoveSelected}
        >
          <MdClose size="1.3rem" />
        </ActionIcon>
      </Tooltip>
    </Group>
  )

  return (
    <Group className={className} css={S.root} position="apart" align="center">
      <Tooltip.Group openDelay={300} closeDelay={200}>
        <Group spacing="xs">
          <Tooltip label={selectAction.tooltip}>
            <ActionIcon
              variant="outline"
              size="lg"
              radius="xl"
              color={selectAction.color}
              mr="sm"
              onClick={handleSelectAllToggle}
            >
              <ToggleTransition
                transitionIn="slide-up"
                transitionOut="slide-down"
                toggled={anySelected}
                toggledElement={selectNoneIcon}
              >
                {selectAllIcon}
              </ToggleTransition>
            </ActionIcon>
          </Tooltip>

          {anySelected ? selectedActions : defaultActions}
        </Group>
      </Tooltip.Group>

      <Stack spacing={3} css={S.info}>
        <Group spacing="sm">
          <GiSaveArrow />

          <Text size="sm" weight={500} color="gray.6">
            {info}
          </Text>
        </Group>

        <Text size="sm" color="gray.5">
          Use the buttons on the left to perform bulk actions
        </Text>
      </Stack>
    </Group>
  )
}

export default StagedActions
