import type { OverlayPanel } from 'primereact/overlaypanel'

import type { Term } from '../models/term.model'
import type { CorpusSearchPayload } from '../store/corpus-search-payload'

export default interface Search {
  showContent: boolean
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>
  term: Term[] | any
  setTerm: React.Dispatch<React.SetStateAction<Term[] | any>>
  items: any
  setItems: React.Dispatch<any>
  aggregations: any
  setAggregations: React.Dispatch<any>
  documentList: any
  setDocumentList: React.Dispatch<any>
  typeofSearch: undefined
  setTypeofSearch: React.Dispatch<React.SetStateAction<undefined>>
  timeRangeValue: any
  setTimeRangeValue: React.Dispatch<React.SetStateAction<any>>
  op: React.RefObject<OverlayPanel>
  selectedTypeSearch: {
    code: string
    name: string
  }
  setSelectedTypeSearch: React.Dispatch<
    React.SetStateAction<{
      code: string
      name: string
    }>
  >
  inputText: string
  setInputText: React.Dispatch<React.SetStateAction<string>>
  listOFTerms: Term[]
  setListOFTerms: React.Dispatch<React.SetStateAction<Term[]>>
  enrichQuery: boolean
  setEnrichQuery: React.Dispatch<React.SetStateAction<boolean>>
  copyQuery: any
  setCopyQuery: React.Dispatch<any>
  lastPayload: Partial<CorpusSearchPayload> | any
  setLastPayload: React.Dispatch<React.SetStateAction<CorpusSearchPayload | any>>
  range: any
  setRange: React.Dispatch<any>
  includeZero: boolean
  setIncludeZero: React.Dispatch<React.SetStateAction<boolean>>
  selectAll: boolean
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>
  enrichButton: boolean
  setEnrichButton: React.Dispatch<React.SetStateAction<boolean>>
  suggestionsValue: null
  setSuggestionsValue: React.Dispatch<React.SetStateAction<null>>
  suggestedTerms: any
  setSuggestedTerms: React.Dispatch<any>
  similarValues: null
  setSimilarValues: React.Dispatch<React.SetStateAction<null>>
  similarsList: any[]
  setSimilarsList: React.Dispatch<React.SetStateAction<any[]>>
  similarTerms: any
  setSimilarTerms: React.Dispatch<any>
  ontologyValue: null
  setOntologyValue: React.Dispatch<React.SetStateAction<null>>
  ontologyList: any
  setOntologyList: React.Dispatch<any>
  ontologyListItems: any[]
  setOntologyListItems: React.Dispatch<React.SetStateAction<any[]>>
  selectedRelatedTermsCl: null
  setSelectedRelatedTermsCl: React.Dispatch<React.SetStateAction<null>>
}
