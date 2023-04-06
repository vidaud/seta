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

        if (searchContext?.selectedTypeSearch.code === 'RC') {
          if (e.value) {
            searchContext?.selectNode(searchContext?.ontologyList)
          } else if (!e.value) {
            searchContext?.selectNode([])
          }
        }

        if (searchContext?.selectedTypeSearch.code === 'RT') {
          if (e.value) {
            searchContext?.selectAllTerms(searchContext?.similarTerms)
          } else if (!e.value) {
            searchContext?.selectAllTerms([])
          }
        }
      }}
    />
  )
}

export default SelectAllTerms
