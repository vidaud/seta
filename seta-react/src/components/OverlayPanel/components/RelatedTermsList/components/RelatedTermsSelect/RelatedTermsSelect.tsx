import { SelectButton } from 'primereact/selectbutton'

import { useSearchContext } from '../../../../../../context/search-context'

export const RelatedTermsSelect = rowDataList => {
  const searchContext = useSearchContext()

  return (
    <SelectButton
      value={searchContext?.ontologyValue}
      className="suggestions-list"
      onChange={e => {
        searchContext?.selectNode(e.value)
      }}
      options={rowDataList.rowDataList.node}
      multiple={true}
    />
  )
}

export default RelatedTermsSelect
