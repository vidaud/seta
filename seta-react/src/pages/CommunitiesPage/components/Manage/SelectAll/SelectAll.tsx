import { useState } from 'react'
import { Checkbox } from '@mantine/core'

import type { TableSortProps } from '../../types'

const SelectAll = ({ data }: TableSortProps) => {
  const [selection, setSelection] = useState(['1'])
  const toggleAll = () =>
    setSelection(current => (current.length === data.length ? [] : data.map(item => item.id)))

  return (
    <Checkbox
      onChange={toggleAll}
      checked={selection.length === data.length}
      indeterminate={selection.length > 0 && selection.length !== data.length}
      transitionDuration={0}
    />
  )
}

export default SelectAll
