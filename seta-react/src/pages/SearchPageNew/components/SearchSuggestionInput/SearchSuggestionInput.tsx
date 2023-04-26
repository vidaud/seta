import { useState } from 'react'

import SuggestionsPopup from '~/pages/SearchPageNew/components/SuggestionsPopup'
import { SearchProvider } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'

const SearchSuggestionInput = () => {
  const [value, setValue] = useState('')

  const handleSuggestionSelected = (suggestion: string) => {
    const replaceWith = suggestion.match(/\s/g) ? `"${suggestion}"` : suggestion

    setValue(current => `${current} ${replaceWith}`)
  }

  return (
    <SearchProvider
      inputValue={value}
      setInputValue={setValue}
      onSuggestionSelected={handleSuggestionSelected}
    >
      <SuggestionsPopup />
    </SearchProvider>
  )
}

export default SearchSuggestionInput
