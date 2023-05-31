import { Paper, Text } from '@mantine/core'
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
      <Tooltip allowEscapeViewBox={{ y: true }} offset={5} content={<ChartToolTip />} />
      <Bar dataKey="count" fill="#acb0b5">
        {chartData.map(entry => (
          <Cell
            cursor="pointer"
            fill={selectedKeys?.[entry.key]?.checked ? '#3B82F6' : '#acb0b5'}
            key={`cell-${entry.key}`}
          />
        ))}
      </Bar>
    </BarChart>
  )
}

export default TinyChart
