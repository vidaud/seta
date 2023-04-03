import './style.css'
import { Dropdown } from 'primereact/dropdown'

import { useSearchContext } from '../../../../context/search-context'
import { typeOfSearches } from '../../../../pages/SearchPage/constants'

export const SearchTypeDropdown = () => {
  const searchContext = useSearchContext()

  const onChangeOption = (e: { value }) => {
    searchContext?.setSelectedTypeSearch(e.value)
  }

  return (
    <Dropdown
      value={searchContext?.selectedTypeSearch}
      options={typeOfSearches}
      onChange={onChangeOption}
      optionLabel="name"
    />
  )
}

export default SearchTypeDropdown
