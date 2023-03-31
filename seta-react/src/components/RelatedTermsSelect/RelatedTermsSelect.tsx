import { SelectButton } from 'primereact/selectbutton'

export const RelatedTermsSelect = (rowDataList, ontologyValues, onSelectedNode) => {
  const getSelectedNode = e => {
    onSelectedNode(e.value)
  }

  return (
    <SelectButton
      value={ontologyValues}
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
