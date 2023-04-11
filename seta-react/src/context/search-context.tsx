import * as React from 'react'
import type { OverlayPanel } from 'primereact/overlaypanel'

import type { Term } from '../models/term.model'
import { defaultTypeOfSearch } from '../pages/SearchPage/constants'
import type { CorpusSearchPayload } from '../store/corpus-search-payload'
import type Search from '../types/search'

export const SearchContext = React.createContext<Search | null>(null)

export type Props = {
  children: React.ReactNode
}
type Aggregation = {
  years: string[]
}

export const SearchProvider = ({ children }: Props) => {
  const [showContent, setShowContent] = React.useState(false)
  const [term, setTerm] = React.useState<Term[] | string | undefined>([])
  const [items, setItems] = React.useState<[]>([])
  const [aggregations, setAggregations] = React.useState<Aggregation>()
  const [typeofSearch, setTypeofSearch] = React.useState<string>('CHUNK_SEARCH')
  const [timeRangeValue, setTimeRangeValue] = React.useState<string | undefined>()
  const [selectedTypeSearch, setSelectedTypeSearch] = React.useState(defaultTypeOfSearch)
  const [inputText, setInputText] = React.useState<string>('')
  const [listOFTerms, setListOFTerms] = React.useState<Term[]>([])
  const [enrichQuery, setEnrichQuery] = React.useState(false)
  const [copyQuery, setCopyQuery] = React.useState<string | undefined>('')
  const [lastPayload, setLastPayload] = React.useState<CorpusSearchPayload | undefined>()
  const [selectAll, setSelectAll] = React.useState(false)
  const [enrichButton, setEnrichButton] = React.useState(false)
  const [similarsList, setSimilarsList] = React.useState<string[]>([])
  const [ontologyValue, setOntologyValue] = React.useState(null)
  const [ontologyList, setOntologyList] = React.useState<any[]>([])
  const [ontologyListItems, setOntologyListItems] = React.useState<string[]>([])
  const [suggestedTerms, setSuggestedTerms] = React.useState<any>(null)
  const [similarTerms, setSimilarTerms] = React.useState<any>(null)
  const [selectedRelatedTermsCl, setSelectedRelatedTermsCl] = React.useState<any[] | null>(null)
  const [similarValues, setSimilarValues] = React.useState(null)
  const selectNode = () => void {}
  const selectAllTerms = () => void {}
  const callService = () => void {}
  const toggleEnrichQuery = () => void {}
  const op = React.useRef<OverlayPanel>(null)

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
        typeofSearch,
        setTypeofSearch,
        timeRangeValue,
        setTimeRangeValue,
        op,
        selectedTypeSearch,
        setSelectedTypeSearch,
        inputText,
        setInputText,
        listOFTerms,
        setListOFTerms,
        enrichQuery,
        setEnrichQuery,
        copyQuery,
        setCopyQuery,
        lastPayload,
        setLastPayload,
        selectAll,
        setSelectAll,
        enrichButton,
        setEnrichButton,
        similarsList,
        setSimilarsList,
        ontologyValue,
        setOntologyValue,
        ontologyList,
        setOntologyList,
        ontologyListItems,
        setOntologyListItems,
        suggestedTerms,
        setSuggestedTerms,
        similarTerms,
        setSimilarTerms,
        selectNode,
        selectAllTerms,
        callService,
        toggleEnrichQuery,
        selectedRelatedTermsCl,
        setSelectedRelatedTermsCl,
        similarValues,
        setSimilarValues
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => {
  const searchContext = React.useContext(SearchContext)

  if (!searchContext) {
    throw new Error('You need to use the contex inside your component')
  }

  return searchContext
}
