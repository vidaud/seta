import type { ChangeEvent } from 'react'
import { RangeSlider, Slider, Switch, Box } from '@mantine/core'

type Props = {
  value?: [number, number]
  rangeBoundaries?: { min?: number; max?: number }
  enableDateFilter?: boolean
  onEnableDateChanged?(value: boolean): void
  onValueChange?(value: [number, number]): void
  onValueChangeEnd?(value: [number, number]): void
}

const YearsRangeFilter = ({
  value,
  rangeBoundaries,
  enableDateFilter,
  onEnableDateChanged,
  onValueChange,
  onValueChangeEnd
}: Props) => {
  const _value = value ?? [1976, new Date().getFullYear()]

  const _min = rangeBoundaries?.min ?? _value[0]
  const _max = rangeBoundaries?.max ?? _value[1]

  const marks =
    _min === _max
      ? [{ value: _min, label: _min }]
      : [
          { value: _min, label: _min },
          { value: _max, label: _max }
        ]

  const step = _min === _max ? 0 : 1

  const slider =
    _min === _max ? (
      <Slider
        disabled={!enableDateFilter}
        marks={marks}
        value={_min}
        min={_min}
        max={_min + 1}
        step={step}
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
      />
    )

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onEnableDateChanged?.(event.currentTarget.checked)
  }

  return (
    <Box>
      <Switch
        checked={enableDateFilter}
        onChange={handleCheckboxChange}
        label="Filter by date range"
        onLabel="YES"
        offLabel="NO"
        size="md"
        mb={10}
      />

      {slider}
    </Box>
  )
}

export default YearsRangeFilter
