import { Grid, Badge, Text } from '@mantine/core'

import { FilterStatusColors } from './utils'

import type { RangeValue } from '../../types/filters'

type Props = {
  enabled?: boolean
  value?: RangeValue
  modified?: boolean
}

const RangeValueInfo = ({ enabled, value, modified }: Props) => {
  const color = modified ? FilterStatusColors.MODIFIED : FilterStatusColors.APPLIED

  if (!value && !enabled) {
    return null
  }

  const label =
    modified && !enabled ? (
      <s>
        {value?.[0]} &mdash; {value?.[1]}
      </s>
    ) : (
      <span>
        {value?.[0]} &mdash; {value?.[1]}
      </span>
    )

  return (
    <Grid gutter="xs">
      <Grid.Col span={5}>
        <Text span>Date range: </Text>
      </Grid.Col>
      <Grid.Col span={7}>
        {value && (
          <Badge
            size="lg"
            color={color}
            variant="outline"
            styles={{ root: { textTransform: 'none' } }}
          >
            {label}
          </Badge>
        )}
      </Grid.Col>
    </Grid>
  )
}

export default RangeValueInfo
