import * as React from 'react'
import type { OverlayPanel } from 'primereact/overlaypanel'

import type { Term } from '../models/term.model'
import { defaultTypeOfSearch } from '../pages/SearchPage/constants'
import type { CorpusSearchPayload } from '../store/corpus-search-payload'
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
  const [typeofSearch, setTypeofSearch] = React.useState<any>('CHUNK_SEARCH')
  const [timeRangeValue, setTimeRangeValue] = React.useState<string | undefined>()
  const [selectedTypeSearch, setSelectedTypeSearch] = React.useState(defaultTypeOfSearch)
  const [inputText, setInputText] = React.useState<string>('')
  const [listOFTerms, setListOFTerms] = React.useState<Term[]>([])
  const [enrichQuery, setEnrichQuery] = React.useState(false)
  const [copyQuery, setCopyQuery] = React.useState<Term[] | any>([])
  const [lastPayload, setLastPayload] = React.useState<CorpusSearchPayload | any>()
  const [range, setRange] = React.useState<any>([1958, 2023])
  const [includeZero, setIncludeZero] = React.useState<boolean>(false)
  const [selectAll, setSelectAll] = React.useState(false)
  const [enrichButton, setEnrichButton] = React.useState(false)
  const [suggestionsValue, setSuggestionsValue] = React.useState(null)
  const [suggestedTerms, setSuggestedTerms] = React.useState<any>(null)
  const [similarValues, setSimilarValues] = React.useState(null)
  const [similarsList, setSimilarsList] = React.useState<any>([])
  const [similarTerms, setSimilarTerms] = React.useState<any>(null)
  const [ontologyValue, setOntologyValue] = React.useState(null)
  const [ontologyList, setOntologyList] = React.useState<any>(null)
  const [ontologyListItems, setOntologyListItems] = React.useState<any>([])
  const [selectedRelatedTermsCl, setSelectedRelatedTermsCl] = React.useState(null)
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
        documentList,
        setDocumentList,
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
        range,
        setRange,
        includeZero,
        setIncludeZero,
        selectAll,
        setSelectAll,
        enrichButton,
        setEnrichButton,
        suggestionsValue,
        setSuggestionsValue,
        suggestedTerms,
        setSuggestedTerms,
        similarValues,
        setSimilarValues,
        similarsList,
        setSimilarsList,
        similarTerms,
        setSimilarTerms,
        ontologyValue,
        setOntologyValue,
        ontologyList,
        setOntologyList,
        ontologyListItems,
        setOntologyListItems,
        selectedRelatedTermsCl,
        setSelectedRelatedTermsCl
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
