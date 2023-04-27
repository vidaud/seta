import { useState } from 'react'

import SuggestionsPopup from '~/pages/SearchPageNew/components/SuggestionsPopup'
import { SearchProvider } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import type { TokenMatch } from '~/pages/SearchPageNew/components/SuggestionsPopup/types/token'

const SearchSuggestionInput = () => {
  const [value, setValue] = useState('')
  const [currentToken, setCurrentToken] = useState<TokenMatch | null>(null)

  const handleSuggestionSelected = (suggestion: string) => {
    const replaceWith = suggestion.match(/\s/g) ? `"${suggestion}"` : suggestion

    if (currentToken) {
      const { index, token } = currentToken

      const newValue = value.slice(0, index) + replaceWith + value.slice(index + token.length)

      setValue(newValue)
    }
  }

  return (
    <SearchProvider
      inputValue={value}
      setInputValue={setValue}
      currentToken={currentToken}
      setCurrentToken={setCurrentToken}
      onSuggestionSelected={handleSuggestionSelected}
    >
      <SuggestionsPopup />
    </SearchProvider>
  )
}

export default SearchSuggestionInput
