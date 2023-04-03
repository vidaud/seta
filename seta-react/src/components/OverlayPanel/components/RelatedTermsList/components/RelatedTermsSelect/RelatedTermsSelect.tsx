import { SelectButton } from 'primereact/selectbutton'

import { useSearchContext } from '../../../../../../context/search-context'

export const RelatedTermsSelect = (rowDataList, onSelectedNode) => {
  const searchContext = useSearchContext()
  const getSelectedNode = e => {
    onSelectedNode(e.value)
  }

  return (
    <SelectButton
      value={searchContext?.ontologyValue}
      className="suggestions-list"
      onChange={e => {
        getSelectedNode(e)
      }}
      options={rowDataList.rowDataList.node}
      multiple={true}
    />
  )
}

export default RelatedTermsSelect
