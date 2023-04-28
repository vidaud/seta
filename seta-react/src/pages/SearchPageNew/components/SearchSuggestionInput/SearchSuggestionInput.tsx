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

  const handleTermsAdded = (terms: string[]) => {
    const newTerms = terms.map(term => (term.match(/\s/g) ? `"${term}"` : term))
    const newValue = `${value} ${newTerms.join(' ')}`

    setValue(newValue)
  }

  const handleTermsRemoved = (terms: string[]) => {
    const newValue = terms.reduce(
      (acc, term) => acc.replace(term.match(/\s/g) ? ` "${term}"` : ` ${term}`, ''),
      value
    )

    setValue(newValue)
  }

  return (
    <SearchProvider
      inputValue={value}
      setInputValue={setValue}
      currentToken={currentToken}
      setCurrentToken={setCurrentToken}
      onSuggestionSelected={handleSuggestionSelected}
      onSelectedTermsAdd={handleTermsAdded}
      onSelectedTermsRemove={handleTermsRemoved}
    >
      <SuggestionsPopup />
    </SearchProvider>
  )
}

export default SearchSuggestionInput
