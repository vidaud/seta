import { createContext, useContext } from 'react'

import type { ChildrenProp } from '~/types/children-props'

type SearchInputProviderProps = {
  inputValue: string
  setInputValue: (value: string) => void
}

type SearchInputContextProps = SearchInputProviderProps

const SearchInputContext = createContext<SearchInputContextProps | undefined>(undefined)

export const SearchInputProvider = ({
  children,
  inputValue,
  setInputValue
}: SearchInputProviderProps & ChildrenProp) => {
  const value: SearchInputContextProps = {
    inputValue,
    setInputValue
  }

  return <SearchInputContext.Provider value={value}>{children}</SearchInputContext.Provider>
}

export const useSearchInput = () => {
  const context = useContext(SearchInputContext)

  if (context === undefined) {
    throw new Error('useSearchInput must be used within a SearchInputProvider')
  }

  return context
}
