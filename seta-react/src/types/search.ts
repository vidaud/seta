import type { Term } from '../models/term.model'

export default interface Search {
  showContent: boolean
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>
  term: Term[]
  setTerm: React.Dispatch<React.SetStateAction<Term[]>>
  items: any
  setItems: React.Dispatch<any>
  aggregations: any
  setAggregations: React.Dispatch<any>
  documentList: any
  setDocumentList: React.Dispatch<any>
  typeofSearch: undefined
  setTypeofSearch: React.Dispatch<React.SetStateAction<undefined>>
  timeRangeValue: undefined
  setTimeRangeValue: React.Dispatch<React.SetStateAction<undefined>>
}
