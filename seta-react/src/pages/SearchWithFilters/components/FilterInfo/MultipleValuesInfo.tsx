import type { AccordionControlProps } from '@mantine/core'
import { Tooltip, Badge, Flex, Accordion, Box, ActionIcon, rem } from '@mantine/core'
import { IconX, IconEraser, IconEraserOff } from '@tabler/icons-react'

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
        size="xs"
        color={color}
        radius="xl"
        variant="transparent"
        onClick={e => clearKey(e, key)}
      >
        <IconX size={rem(10)} />
      </ActionIcon>
    )
  }

  const badge = (node: NodeInfo, color: string, strike: boolean) => {
    const label = strike ? <s>{node.label}</s> : node.label

    return (
      <Badge
        key={node.key}
        color={color}
        variant="outline"
        styles={{ root: { textTransform: 'none' } }}
        pr={3}
        rightSection={removeButton(color, node.key)}
      >
        {label}
      </Badge>
    )
  }

  const appliedBadges = applied?.map(a => badge(a, 'green', false))

  const deletedBadges = deleted?.map(a => badge(a, 'orange', true))

  const addedBadges = added?.map(a => badge(a, 'orange', false))

  const appliedCount = applied?.length ?? 0
  const modifiedCount = (deleted?.length ?? 0) + (added?.length ?? 0)

  const AccordionControl = (props: AccordionControlProps) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 5 }}>
        <Accordion.Control {...props} />
        <Tooltip label={'Clear ' + appliedCount + ' applied'}>
          <ActionIcon
            variant="outline"
            color="green"
            m={2}
            disabled={appliedCount === 0}
            onClick={clearApplied}
          >
            <IconEraser size="0.8rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={'Clear ' + modifiedCount + ' modified'}>
          <ActionIcon
            variant="outline"
            color="orange"
            m={2}
            disabled={modifiedCount === 0}
            onClick={clearModified}
          >
            <IconEraserOff size="0.8rem" />
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
