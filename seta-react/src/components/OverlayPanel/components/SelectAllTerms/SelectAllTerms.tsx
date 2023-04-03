import './style.css'
import { ToggleButton } from 'primereact/togglebutton'

import { useSearchContext } from '../../../../context/search-context'

export const SelectAllTerms = () => {
  const searchContext = useSearchContext()

  return (
    <ToggleButton
      checked={searchContext?.selectAll}
      className="custom"
      aria-label={searchContext?.inputText}
      onLabel={searchContext?.inputText}
      offLabel={searchContext?.inputText}
      tooltip={searchContext?.selectAll ? 'Unselect all terms' : 'Select all terms'}
      tooltipOptions={{ position: 'top' }}
      onChange={e => {
        searchContext?.setSelectAll(e.value)
      }}
    />
  )
}

export default SelectAllTerms
