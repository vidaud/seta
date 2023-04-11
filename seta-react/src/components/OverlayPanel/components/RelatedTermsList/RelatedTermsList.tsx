import { useRef, useState, useContext } from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import './style.css'
import RelatedTermsSelect from './components/RelatedTermsSelect'

import { SearchContext, useSearchContext } from '../../../../context/search-context'
import type { Term } from '../../../../models/term.model'
import {
  columns,
  getListOfTerms,
  getSelectedTerms,
  isPhrase,
  transformOntologyList
} from '../../../../pages/SearchPage/constants'
import { OntologyListService } from '../../../../services/corpus/ontology-list.service'
import type Search from '../../../../types/search'

export const RelatedTermsList = () => {
  const selectedColumns = columns
  const searchContext = useSearchContext()
  const prevTermRef = useRef<Term[] | string | undefined>()
  const [selectSingle, setSelectSingle] = useState(false)
  const {
    term,
    setTerm,
    listOFTerms,
    enrichQuery,
    setCopyQuery,
    ontologyValue,
    selectNode,
    setSelectedRelatedTermsCl,
    ontologyList,
    setSelectAll,
    setOntologyList,
    selectedRelatedTermsCl,
    ontologyListItems,
    setOntologyListItems,
    setOntologyValue,
    selectedTypeSearch,
    callService,
    toggleEnrichQuery
  } = useContext(SearchContext) as Search

  const ontologyListService = new OntologyListService()

  const getOntologyTerms = lastKeywords => {
    const ontologyTermList: any = []

    lastKeywords.forEach(lastKeyword => {
      ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
        if (data) {
          setOntologyList(transformOntologyList(data))
          ontologyTermList.push(...[String(data).split(',')])
        }
      })
    })

    return ontologyTermList
  }

  searchContext.toggleEnrichQuery = value => {
    // ex: "(bin) AND (regulation OR guideline) AND (standard)"
    //send request to ontologyList for each keyword
    //send request to corpus with the ontology list of all keywords

    if (value) {
      const regExp = /\(|\)|\[|\]/g

      const splitedANDOperator = getSelectedTerms(listOFTerms).split(` AND `)
      const splitedOROperator: any = []

      splitedANDOperator.forEach(element => {
        const hasBrackets = regExp.test(element)

        if (hasBrackets) {
          const removedBrackets = element.slice(1, element.length - 1).split(' OR ')

          splitedOROperator.push(getOntologyTerms(removedBrackets))
        } else {
          splitedOROperator.push(getOntologyTerms(element.split(' OR ')))
        }

        setOntologyListItems(splitedOROperator)
      })
    } else {
      callService(selectedTypeSearch.code)
    }
  }

  searchContext.selectNode = selectedNodes => {
    const listOfClusterTerms: any = []

    if (prevTermRef.current === undefined) {
      prevTermRef.current = term
    }

    if (selectedNodes.length > 0) {
      selectedNodes.forEach(item => {
        if (item.node) {
          setSelectedRelatedTermsCl(selectedNodes)
          listOfClusterTerms.push(...item.node)
          setSelectSingle(true)
        } else {
          listOfClusterTerms.push(item)
        }
      })

      const uniqueValues = listOfClusterTerms.filter((subject, index) => {
        return listOfClusterTerms.indexOf(subject) === index
      })

      setOntologyValue(uniqueValues)
      transformPhrases(uniqueValues)
    }

    if (selectedNodes.length === 0) {
      setSelectedRelatedTermsCl(selectedNodes)
      setOntologyValue(listOfClusterTerms)
      setTerm(prevTermRef.current)
    }

    if (selectSingle) {
      toggleSelectAll(selectedNodes, ontologyList)
    } else if (!selectSingle && ontologyValue !== null) {
      toggleSelectAll(selectedNodes, ontologyValue)
    }
  }

  const toggleSelectAll = (items, allList) => {
    if (items.length === allList.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result = term

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!enrichQuery) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      setCopyQuery(copyTerm)
    } else if (enrichQuery) {
      updateEnrichedQuery(ontologyListItems)
    }

    if (prevTermRef.current) {
      result = prevTermRef.current + ' ' + listOfValues.join(' ')
    } else {
      result = listOfValues.join(' ')
    }

    setTerm(result)
  }

  const updateEnrichedQuery = clusters => {
    if (clusters.length > 1) {
      const result = clusters.join(' AND ').split(',').join(' ')

      setCopyQuery(getSelectedTerms(getListOfTerms(result)))

      return getSelectedTerms(getListOfTerms(result))
    } else if (clusters.length === 1 && clusters[0].length > 0) {
      const newOntologyList = clusters[0]
      const newItems: any = []

      if (newOntologyList !== '' || newOntologyList.length > 0) {
        newOntologyList.forEach(list => {
          list.forEach(li => {
            isPhrase(li) ? newItems.push(`"${li}"`) : newItems.push(li)
          })
        })
      }

      const result = newItems.join(' OR ').split(',').join(' OR ')

      setCopyQuery(result)

      return result
    }
  }

  const activityBodyTemplate = rowData => {
    return <RelatedTermsSelect rowDataList={rowData} />
  }

  const columnComponents = selectedColumns.map(({ header }) => {
    return <Column key={header} showFilterMatchModes={false} body={activityBodyTemplate} />
  })

  return (
    <DataTable
      lazy={true}
      value={ontologyList}
      showSelectAll={false}
      className="dataTable-list"
      selection={selectedRelatedTermsCl}
      onSelectionChange={e => {
        selectNode(e.value)
      }}
      dataKey="id"
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
      {columnComponents}
    </DataTable>
  )
}

export default RelatedTermsList
