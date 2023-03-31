import './style.css'
import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'

export const SearchTypeDropdown = ({ onSelectedTypeSearch }) => {
  const defaultTypeOfSearch = {
    code: 'RC',
    name: 'Related term clusters'
  }

  const typeOfSearches = [
    { name: 'Related term clusters', code: 'RC' },
    { name: 'Related terms', code: 'RT' }
  ]

  const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch)
  const onChangeOption = (e: { value: any }) => {
    setSelectedTypeSearch(e.value)
    onSelectedTypeSearch(e.value)
  }

  return (
    <Dropdown
      value={selectedTypeSearch}
      options={typeOfSearches}
      onChange={onChangeOption}
      optionLabel="name"
    />
  )
}

export default SearchTypeDropdown
