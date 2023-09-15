import type { RangeValue, SelectionKeys } from '../../types/filters'

const getRangeValue = (
  value: RangeValue | undefined | null,
  rangeBoundaries: { min?: number; max?: number } | undefined
) => {
  let rangeValue: RangeValue | undefined = undefined

  if (value) {
    rangeValue = value
  } else {
    if (rangeBoundaries) {
      rangeValue = [rangeBoundaries.min ?? 0, rangeBoundaries.max ?? 0]
    }
  }

  return rangeValue
}

export const getProps = (
  value: RangeValue | undefined | null,
  rangeBoundaries: { min?: number; max?: number } | undefined
) => {
  const _min = rangeBoundaries?.min
  const _max = rangeBoundaries?.max

  const rangeValue = getRangeValue(value, rangeBoundaries)

  let color = 'gray'

  if (rangeValue && (rangeValue[0] !== (_min ?? 0) || rangeValue[1] !== (_max ?? 0))) {
    color = 'blue'
  }

  const marks: { value: number; label?: string }[] | undefined = []

  if (!!_min) {
    marks.push({ value: _min, label: _min + '' })
  }

  if (!!_max && _min !== _max) {
    marks.push({ value: _max, label: _max + '' })
  }

  const step = (_min ?? 0) === (_max ?? 0) ? 0 : 1

  return { rangeValue, color, _min, _max, marks, step }
}

export const computeSelectedYears = (range?: RangeValue): SelectionKeys | undefined => {
  if (!range) {
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
