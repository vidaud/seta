import './style.css'
import { useState, useEffect } from 'react'
import { ToggleButton } from 'primereact/togglebutton'

export const SelectAllTerms = ({ text, onSelectedAllButton }) => {
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    onSelectedAllButton(selectAll)
  }, [selectAll, onSelectedAllButton])

  return (
    <ToggleButton
      checked={selectAll}
      className="custom"
      aria-label={text}
      onLabel={text}
      offLabel={text}
      tooltip={selectAll ? 'Unselect all terms' : 'Select all terms'}
      tooltipOptions={{ position: 'top' }}
      onChange={e => {
        setSelectAll(e.value)
      }}
    />
  )
}

export default SelectAllTerms
