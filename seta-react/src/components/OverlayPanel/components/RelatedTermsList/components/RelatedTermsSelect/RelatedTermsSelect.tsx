import { useContext, useEffect } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import { SearchContext } from '../../../../../../context/search-context'
import type Search from '../../../../../../types/search'

export const RelatedTermsSelect = rowDataList => {
  const { ontologyValue, selectNode, setSelectedRelatedTermsCl, ontologyList, setSelectAll } =
    useContext(SearchContext) as Search

  useEffect(() => {
    test()
  })

  const toggleSelectAll = (items, allList) => {
    if (items.length === allList.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }

  const onSelect = e => {
    selectNode(e.value)
    toggleSelectAll(e.value, ontologyValue)
  }

  const test = () => {
    const newList2: any = []

    ontologyList.forEach(element => {
      if (Object.keys(checkSubset(ontologyValue, element.node)).length !== 0) {
        newList2.push(checkSubset(ontologyValue, element.node))
      }
    })

    setSelectedRelatedTermsCl([...newList2])
  }

  const checkSubset = (parentArray, subsetArray) => {
    const set = new Set(parentArray)
    let nodes: any = {}

    if (subsetArray.every(x => set.has(x))) {
      nodes = {
        id: subsetArray[0],
        node: subsetArray
      }
    }

    return nodes
  }

  return (
    <SelectButton
      value={ontologyValue}
      className="suggestions-list"
      onChange={e => {
        onSelect(e)
      }}
      options={rowDataList.rowDataList.node}
      multiple={true}
    />
  )
}

export default RelatedTermsSelect
