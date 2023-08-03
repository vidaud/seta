import { Switch } from '@mantine/core'

import { TextChunkValues } from '../../types/filters'

type Props = {
  value?: TextChunkValues
  disabled?: boolean
  onChange?(value: TextChunkValues): void
}

const TextChunkFilter = ({ value, disabled, onChange }: Props) => {
  const showMultipleChunks = value === TextChunkValues.ALL_CHUNKS_SEARCH

  const handleChange = event => {
    const checked = event.currentTarget.checked

    onChange?.(checked ? TextChunkValues.ALL_CHUNKS_SEARCH : TextChunkValues.CHUNK_SEARCH)
  }

  return (
    <Switch
      checked={showMultipleChunks}
      disabled={disabled}
      onChange={handleChange}
      label="Show multiple chunks"
      labelPosition="left"
      onLabel="YES"
      offLabel="NO"
      size="md"
    />
  )
}

export default TextChunkFilter
