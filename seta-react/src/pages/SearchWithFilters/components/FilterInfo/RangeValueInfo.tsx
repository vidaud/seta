import { Grid, Badge, Text } from '@mantine/core'

import type { RangeValue } from '../../types/filters'

type Props = {
  enabled?: boolean
  value?: RangeValue
  modified?: boolean
}

const RangeValueInfo = ({ enabled, value, modified }: Props) => {
  const color = modified ? 'orange' : 'green'

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
      <Grid.Col span={3}>
        <Text span>Date range: </Text>
      </Grid.Col>
      <Grid.Col span={9}>
        {enabled && (
          <Badge
            color={color}
            variant="outline"
            styles={{ root: { textTransform: 'none' } }}
            mr={5}
          >
            Enabled
          </Badge>
        )}
        {value && (
          <Badge color={color} variant="outline" styles={{ root: { textTransform: 'none' } }}>
            {label}
          </Badge>
        )}
      </Grid.Col>
    </Grid>
  )
}

export default RangeValueInfo
