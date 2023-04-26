import { createContext, useContext } from 'react'

import type { ChildrenProp } from '~/types/children-props'

type SearchContextProps = {
  onSuggestionSelected?: (suggestion: string) => void
}

type SearchProviderProps = ChildrenProp & SearchContextProps

const SearchContext = createContext<SearchContextProps | undefined>(undefined)

export const SearchProvider = ({ children, onSuggestionSelected }: SearchProviderProps) => {
  const value: SearchContextProps = {
    onSuggestionSelected
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
