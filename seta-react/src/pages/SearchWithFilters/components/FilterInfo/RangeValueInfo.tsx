import { ActionIcon, Grid, Badge, Text, Tooltip } from '@mantine/core'
import { IconEraser, IconEraserOff } from '@tabler/icons-react'

import { FilterStatusColors } from './utils'

import { ClearCategory, ClearType } from '../../types/filters'
import type { RangeValue, ClearAction } from '../../types/filters'

type Props = {
  current?: RangeValue
  applied?: RangeValue
  modified?: boolean
  onClear?: (action: ClearAction) => void
}

const RangeValueInfo = ({ current, applied, modified, onClear }: Props) => {
  const color = modified ? FilterStatusColors.MODIFIED : FilterStatusColors.APPLIED

  if (!current && !applied) {
    return null
  }

  const label =
    modified && !current ? (
      <s>
        {applied?.[0]} &mdash; {applied?.[1]}
      </s>
    ) : (
      <span>
        {current?.[0]} &mdash; {current?.[1]}
      </span>
    )

  const clearApplied = e => {
    e.stopPropagation()
    onClear?.({ type: ClearType.ALL_APPLIED_IN_CATEGORY, value: { category: ClearCategory.DATE } })
  }

  const clearModified = e => {
    e.stopPropagation()
    onClear?.({ type: ClearType.ALL_MODIFIED_IN_CATEGORY, value: { category: ClearCategory.DATE } })
  }

  const clearModifiedAction = (
    <Tooltip label="Clear filter" withArrow color="gray">
      <ActionIcon
        size="md"
        variant="outline"
        color={FilterStatusColors.MODIFIED}
        m={2}
        onClick={clearModified}
      >
        <IconEraserOff size="1rem" />
      </ActionIcon>
    </Tooltip>
  )

  const clearAppliedAction = (
    <Tooltip label="Clear applied" withArrow color="gray">
      <ActionIcon
        size="md"
        variant="outline"
        color={FilterStatusColors.APPLIED}
        m={2}
        onClick={clearApplied}
      >
        <IconEraser size="1rem" />
      </ActionIcon>
    </Tooltip>
  )

  return (
    <Grid gutter="xs">
      <Grid.Col span={5}>
        <Text span>Date range: </Text>
      </Grid.Col>
      <Grid.Col span={6}>
        <Badge
          size="lg"
          color={color}
          variant="outline"
          styles={{ root: { textTransform: 'none' } }}
        >
          {label}
        </Badge>
      </Grid.Col>
      <Grid.Col span={1}>{modified ? clearModifiedAction : clearAppliedAction}</Grid.Col>
    </Grid>
  )
}

export default RangeValueInfo
