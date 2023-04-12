import type { OverlayPanel } from 'primereact/overlaypanel'

import type { Term } from '../models/term.model'

export default interface Search {
  showContent: boolean
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>
  term: Term[] | string | undefined
  setTerm: React.Dispatch<React.SetStateAction<Term[] | string | undefined>>
  items: []
  setItems: React.Dispatch<[]>
  aggregations:
    | {
        years: string[]
      }
    | undefined
  setAggregations: React.Dispatch<
    | {
        years: string[]
      }
    | undefined
  >
  typeofSearch: string
  setTypeofSearch: React.Dispatch<React.SetStateAction<string>>
  timeRangeValue: string | undefined
  setTimeRangeValue: React.Dispatch<React.SetStateAction<string | undefined>>
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
  copyQuery: string | undefined
  setCopyQuery: React.Dispatch<string | undefined>
  selectAll: boolean
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>
  enrichButton: boolean
  setEnrichButton: React.Dispatch<React.SetStateAction<boolean>>
  similarsList: string[]
  setSimilarsList: React.Dispatch<React.SetStateAction<string[]>>
  ontologyValue: any
  setOntologyValue: React.Dispatch<React.SetStateAction<any>>
  ontologyList: any[]
  setOntologyList: React.Dispatch<string[]>
  ontologyListItems: string[]
  setOntologyListItems: React.Dispatch<React.SetStateAction<string[]>>
  suggestedTerms: any
  setSuggestedTerms: React.Dispatch<any>
  similarTerms: any
  setSimilarTerms: React.Dispatch<any>
  selectNode: (selectedNodes: any) => void
  selectAllTerms: (selectedNodes: any) => void
  callService: (selectedNodes: any) => void
  toggleEnrichQuery: (selectedNodes: any) => void
  selectedRelatedTermsCl: any[] | null
  setSelectedRelatedTermsCl: React.Dispatch<React.SetStateAction<any[] | null>>
  similarValues: null
  setSimilarValues: React.Dispatch<React.SetStateAction<null>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
