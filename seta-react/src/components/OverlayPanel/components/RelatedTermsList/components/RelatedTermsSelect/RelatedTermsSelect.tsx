import { useContext, useEffect } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import { SearchContext } from '../../../../../../context/search-context'
import { checkSubset } from '../../../../../../pages/SearchPage/constants'
import type Search from '../../../../../../types/search'

export const RelatedTermsSelect = rowDataList => {
  const { ontologyValue, selectNode, setSelectedRelatedTermsCl, ontologyList, setSelectAll } =
    useContext(SearchContext) as Search

  useEffect(() => {
    const newList2: any = []

    ontologyList.forEach(element => {
      if (Object.keys(checkSubset(ontologyValue, element.node)).length !== 0) {
        newList2.push(checkSubset(ontologyValue, element.node))
      }
    })

    setSelectedRelatedTermsCl([...newList2])
  }, [ontologyList, ontologyValue, setSelectedRelatedTermsCl])

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

  //   setSelectedRelatedTermsCl([...newList2])
  // }

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
