import type { AccordionControlProps } from '@mantine/core'
import { Tooltip, Badge, Flex, Accordion, Box, ActionIcon, rem } from '@mantine/core'
import { IconX, IconEraser, IconEraserOff } from '@tabler/icons-react'

import { FilterStatusColors } from './utils'

import type { NodeInfo } from '../../types/filter-info'
import type { ClearAction, ClearCategory } from '../../types/filters'
import { ClearType } from '../../types/filters'

type Props = {
  title?: string
  category?: ClearCategory
  applied?: NodeInfo[] | null
  deleted?: NodeInfo[] | null
  added?: NodeInfo[] | null
  onClear?(action: ClearAction): void
}

const MultipleValuesInfo = ({ title, category, applied, deleted, added, onClear }: Props) => {
  if (!applied?.length && !deleted?.length && !added?.length) {
    return null
  }

  const clearKey = (e, key: string) => {
    e.stopPropagation()
    onClear?.({ type: ClearType.KEY, value: { category: category, key: key } })
  }

  const clearApplied = e => {
    e.stopPropagation()
    onClear?.({ type: ClearType.ALL_APPLIED_IN_CATEGORY, value: { category: category } })
  }

  const clearModified = e => {
    e.stopPropagation()
    onClear?.({ type: ClearType.ALL_MODIFIED_IN_CATEGORY, value: { category: category } })
  }

  const removeButton = (color: string, key: string) => {
    return (
      <ActionIcon
        size="md"
        color={color}
        radius="xl"
        variant="transparent"
        onClick={e => clearKey(e, key)}
      >
        <IconX size={rem(16)} />
      </ActionIcon>
    )
  }

  const badge = (node: NodeInfo, color: string, strike: boolean) => {
    const label = strike ? <s>{node.label}</s> : node.label

    return (
      <Tooltip label={node.key} multiline withArrow color="gray" offset={-0.5}>
        <Badge
          size="lg"
          key={node.key}
          color={color}
          radius="sm"
          variant="outline"
          styles={{ root: { textTransform: 'none' } }}
          pr={3}
          rightSection={removeButton(color, node.key)}
          maw={400}
        >
          {label}
        </Badge>
      </Tooltip>
    )
  }

  const appliedBadges = applied?.map(a => badge(a, FilterStatusColors.APPLIED, false))

  const deletedBadges = deleted?.map(a => badge(a, FilterStatusColors.DELETED, true))

  const addedBadges = added?.map(a => badge(a, FilterStatusColors.MODIFIED, false))

  const appliedCount = applied?.length ?? 0
  const modifiedCount = (deleted?.length ?? 0) + (added?.length ?? 0)

  const AccordionControl = (props: AccordionControlProps) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 5 }}>
        <Accordion.Control {...props} />
        <Tooltip label={'Clear ' + appliedCount + ' applied'} withArrow color="gray">
          <ActionIcon
            size="md"
            variant="outline"
            color={FilterStatusColors.APPLIED}
            m={2}
            disabled={appliedCount === 0}
            onClick={clearApplied}
          >
            <IconEraser size="1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={'Clear ' + modifiedCount + ' modified'} withArrow color="gray">
          <ActionIcon
            size="md"
            variant="outline"
            color={FilterStatusColors.MODIFIED}
            m={2}
            disabled={modifiedCount === 0}
            onClick={clearModified}
          >
            <IconEraserOff size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Accordion defaultValue="item" chevronPosition="left" mt={10} maw={480} variant="filled">
      <Accordion.Item value="item">
        <AccordionControl>{title}</AccordionControl>
        <Accordion.Panel>
          <Flex gap="sm" wrap="wrap">
            {appliedBadges}
            {deletedBadges}
            {addedBadges}
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

export default MultipleValuesInfo
