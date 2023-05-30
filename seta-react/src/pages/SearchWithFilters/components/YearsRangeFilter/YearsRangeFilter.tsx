import type { ChangeEvent } from 'react'
import { RangeSlider, Slider, Switch, Box, Divider } from '@mantine/core'

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
    <Divider size="lg" />
  ) : (_min ?? 0) === (_max ?? 0) ? (
    <Slider
      disabled={!enableDateFilter}
      marks={marks}
      value={_min}
      min={_min}
      max={_min}
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
        disabled={!value}
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
