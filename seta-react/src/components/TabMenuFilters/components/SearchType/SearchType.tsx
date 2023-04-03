import { useState } from 'react'
import { SelectButton } from 'primereact/selectbutton'
import { Tooltip } from 'primereact/tooltip'

import './style.css'
import { useSearchContext } from '../../../../context/search-context'

const SearchType = () => {
  const [searchTooltip, setSearchTooltip] = useState('Look at the first paragraph only')
  const searchContext = useSearchContext()

  const searchOptions = [
    { name: '1', value: 'CHUNK_SEARCH', tooltip: 'Look at the first paragraph only' },
    { name: '∃!', value: 'DOCUMENT_SEARCH', tooltip: 'Find one most related paragraph' },
    { name: '∃', value: 'ALL_CHUNKS_SEARCH', tooltip: 'Find any related paragraphs' }
  ]

  const onFocusOption = e => {
    searchOptions.forEach(option => {
      if (option.name === e.target.ariaLabel) {
        setSearchTooltip(option.tooltip)
      }
    })
  }

  const onChangeSearchType = e => {
    searchContext?.setTypeofSearch(e.value)
  }

  return (
    <div>
      <h5>Search Type</h5>
      <Tooltip
        target=".select>.p-button"
        content={`${searchTooltip}`}
        position="top"
        event="both"
        className="hoverClass"
      />
      <SelectButton
        className="select"
        value={searchContext?.typeofSearch}
        options={searchOptions}
        onChange={onChangeSearchType}
        onMouseEnter={onFocusOption}
        optionLabel="name"
      />
    </div>
  )
}

export default SearchType
