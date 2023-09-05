import { NumberInput, TextInput } from '@mantine/core'

import type { Value, InputProps } from './types'

export const getInputElement = <T extends Value>({
  value,
  maxLength = 50,
  maxValue,
  onChange,
  ...inputProps
}: InputProps<T>) => {
  if (typeof value === 'string') {
    return (
      <TextInput
        value={value}
        maxLength={maxLength}
        onChange={e => onChange(e.currentTarget.value as T)}
        {...inputProps}
      />
    )
  }

  return <NumberInput value={value} max={maxValue} onChange={v => onChange(v as T)} />
}
