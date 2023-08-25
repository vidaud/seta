import type { Ref, KeyboardEvent } from 'react'

export type Value = string | (number | '')

export type InputProps<T extends Value> = {
  value: T
  error: string | null
  maxLength?: number
  maxValue?: number
  placeholder?: string
  ref: Ref<HTMLInputElement>
  onChange: (value: T) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}
