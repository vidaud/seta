import { RangeSlider, Slider, Box, Divider } from '@mantine/core'

import { computeSelectedYears, getProps } from './utils'

import type { FilterData } from '../../types/filter-data'
import type { SelectionKeys } from '../../types/filters'
import TinyChart from '../FiltersPanel/TinyChart'

type Props = {
  value?: [number, number] | null
  rangeBoundaries?: { min?: number; max?: number }
  chartData?: FilterData[]
  chartSelectedKeys?: SelectionKeys | null
  onValueChange?(value: [number, number]): void
  onValueChangeEnd?(value: [number, number]): void
}

const YearsRangeFilter = ({
  value,
  rangeBoundaries,
  chartData,
  onValueChange,
  onValueChangeEnd
}: Props) => {
  const { rangeValue, color, _min, _max, marks, step } = getProps(value, rangeBoundaries)

  const slider = !rangeValue ? (
    <Divider size="lg" mt={10} />
  ) : (_min ?? 0) === (_max ?? 0) ? (
    <Slider marks={marks} value={_min} min={_min} max={_min} step={step} mt={10} />
  ) : (
    <RangeSlider
      color={color}
      step={step}
      value={rangeValue}
      min={_min}
      max={_max}
      minRange={step}
      marks={marks}
      onChange={onValueChange}
      onChangeEnd={onValueChangeEnd}
      mt={10}
    />
  )

  return (
    <Box>
      <TinyChart chartData={chartData} selectedKeys={computeSelectedYears(rangeValue)} />

      {slider}
    </Box>
  )
}

export default YearsRangeFilter
