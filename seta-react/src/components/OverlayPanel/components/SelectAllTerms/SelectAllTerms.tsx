import { useContext } from 'react'
import './style.css'
import { ToggleButton } from 'primereact/togglebutton'

import { SearchContext, useSearchContext } from '../../../../context/search-context'
import type Search from '../../../../types/search'

export const SelectAllTerms = () => {
  const {
    inputText,
    similarTerms,
    selectedTypeSearch,
    ontologyList,
    selectAll,
    setSelectAll,
    enrichQuery
  } = useContext(SearchContext) as Search
  const searchContext = useSearchContext()

  return (
    <ToggleButton
      checked={selectAll}
      className="custom"
      aria-label={inputText}
      onLabel={inputText}
      offLabel={inputText}
      disabled={enrichQuery || ontologyList.length === 0 ? true : false}
      tooltip={selectAll ? 'Unselect all terms' : 'Select all terms'}
      tooltipOptions={{ position: 'top' }}
      onChange={e => {
        setSelectAll(e.value)

        if (selectedTypeSearch.code === 'RC') {
          if (e.value) {
            searchContext.selectNode(ontologyList)
          } else if (!e.value) {
            searchContext.selectNode([])
          }
        }

        if (selectedTypeSearch.code === 'RT') {
          if (e.value) {
            searchContext.selectAllTerms(similarTerms)
          } else if (!e.value) {
            searchContext.selectAllTerms([])
          }
        }
      }}
    />
  )
}

export default SelectAllTerms
