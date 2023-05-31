import type { ChangeEvent } from 'react'
import { RangeSlider, Slider, Switch, Box, Divider } from '@mantine/core'

import type { FilterData } from '../../types/filter-data'
import type { RangeValue, SelectionKeys } from '../../types/filters'
import TinyChart from '../FiltersPanel/TinyChart'

type Props = {
  value?: [number, number]
  rangeBoundaries?: { min?: number; max?: number }
  enableDateFilter?: boolean
  chartData?: FilterData[]
  chartSelectedKeys?: SelectionKeys | null
  onEnableDateChanged?(value: boolean): void
  onValueChange?(value: [number, number]): void
  onValueChangeEnd?(value: [number, number]): void
}

const computeSelectedYears = (enabled?: boolean, range?: RangeValue): SelectionKeys | undefined => {
  if (!enabled || !range) {
    return undefined
  }

  const keys: SelectionKeys = {}

  if (range[0] === range[1]) {
    keys[range[0]] = { checked: true }
  } else {
    for (let i = range[0]; i <= range[1]; i++) {
      keys[i] = { checked: true }
    }
  }

  return keys
}

const YearsRangeFilter = ({
  value,
  rangeBoundaries,
  enableDateFilter,
  chartData,
  onEnableDateChanged,
  onValueChange,
  onValueChangeEnd
}: Props) => {
  const _min = rangeBoundaries?.min
  const _max = rangeBoundaries?.max

  const marks: { value: number; label?: string }[] | undefined = []

  if (!!_min) {
    marks.push({ value: _min, label: _min + '' })
  }

  if (!!_max && _min !== _max) {
    marks.push({ value: _max, label: _max + '' })
  }

  const step = (_min ?? 0) === (_max ?? 0) ? 0 : 1

  const slider = !value ? (
    <Divider size="lg" mt={10} />
  ) : (_min ?? 0) === (_max ?? 0) ? (
    <Slider
      disabled={!enableDateFilter}
      marks={marks}
      value={_min}
      min={_min}
      max={_min}
      step={step}
      mt={10}
    />
  ) : (
    <RangeSlider
      disabled={!enableDateFilter}
      step={step}
      value={value}
      min={_min}
      max={_max}
      minRange={step}
      marks={marks}
      onChange={onValueChange}
      onChangeEnd={onValueChangeEnd}
      mt={10}
    />
  )

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onEnableDateChanged?.(event.currentTarget.checked)
  }

  return (
    <Box>
      <Switch
        checked={enableDateFilter}
        disabled={!value}
        onChange={handleCheckboxChange}
        label="Filter by date range"
        onLabel="YES"
        offLabel="NO"
        size="md"
      />

      <TinyChart
        chartData={chartData}
        selectedKeys={computeSelectedYears(enableDateFilter, value)}
      />

      {slider}
    </Box>
  )
}

export default YearsRangeFilter
