import { createContext, useContext, useState } from 'react'

import type { ChildrenProp } from '~/types/children-props'

import type { TokenMatch } from '../types/token'

type SearchProviderProps = {
  onSuggestionSelected?: (suggestion: string) => void
  inputValue: string
  setInputValue: (value: string) => void
}

type SearchContextProps = SearchProviderProps & {
  currentToken: TokenMatch | null
  setCurrentToken: (token: TokenMatch | null) => void
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined)

export const SearchProvider = ({
  children,
  onSuggestionSelected,
  inputValue,
  setInputValue
}: SearchProviderProps & ChildrenProp) => {
  const [currentToken, setCurrentToken] = useState<TokenMatch | null>(null)

  const value: SearchContextProps = {
    onSuggestionSelected,
    currentToken,
    setCurrentToken,
    inputValue,
    setInputValue
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }

  return context
}
