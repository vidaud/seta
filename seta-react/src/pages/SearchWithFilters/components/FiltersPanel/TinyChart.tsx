import { Paper, Text, useMantineTheme } from '@mantine/core'
import { BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts'

import type { FilterData } from '../../types/filter-data'
import type { SelectionKeys } from '../../types/filters'

type Props = {
  chartData?: FilterData[]
  selectedKeys?: SelectionKeys | null
  width?: number
  height?: number
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartToolTip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper shadow="xs" p="xs" withBorder>
        <Text fz="sm">{`${label} : ${payload[0].value}`}</Text>
      </Paper>
    )
  }

  return null
}

const TinyChart = ({ chartData, selectedKeys, margin, height, width }: Props) => {
  const { colors } = useMantineTheme()

  if (!chartData?.length) {
    return null
  }

  return (
    <BarChart
      width={width ?? 320}
      height={height ?? 50}
      data={chartData}
      maxBarSize={10}
      margin={margin}
      style={{ zIndex: 2 }}
    >
      <XAxis dataKey="label" hide={true} />

      <Tooltip
        allowEscapeViewBox={{ y: true }}
        offset={5}
        content={<ChartToolTip />}
        cursor={{ fill: colors.gray[2] }}
      />

      <Bar dataKey="count">
        {chartData.map(entry => (
          <Cell
            fill={selectedKeys?.[entry.key]?.checked ? colors.blue[5] : colors.gray[4]}
            key={`cell-${entry.key}`}
          />
        ))}
      </Bar>
    </BarChart>
  )
}

export default TinyChart
