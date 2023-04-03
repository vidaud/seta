import * as React from 'react'

import type { Term } from '../models/term.model'
import type Search from '../types/search'

export const SearchContext = React.createContext<null | Search>(null)

type Props = {
  children: React.ReactNode
}

export const SearchProvider = ({ children }: Props) => {
  const [showContent, setShowContent] = React.useState(false)
  const [term, setTerm] = React.useState<Term[]>([])
  const [items, setItems] = React.useState<any>([])
  const [aggregations, setAggregations] = React.useState<any>([])
  const [documentList, setDocumentList] = React.useState<any>([])
  const [typeofSearch, setTypeofSearch] = React.useState()
  const [timeRangeValue, setTimeRangeValue] = React.useState()

  return (
    <SearchContext.Provider
      value={{
        showContent,
        setShowContent,
        term,
        setTerm,
        items,
        setItems,
        aggregations,
        setAggregations,
        documentList,
        setDocumentList,
        typeofSearch,
        setTypeofSearch,
        timeRangeValue,
        setTimeRangeValue
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
