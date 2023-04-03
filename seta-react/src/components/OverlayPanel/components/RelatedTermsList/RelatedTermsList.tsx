import { useEffect, useRef } from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import './style.css'
import RelatedTermsSelect from './components/RelatedTermsSelect'

import { useSearchContext } from '../../../../context/search-context'
import {
  columns,
  getListOfTerms,
  getSelectedTerms,
  isPhrase,
  transformOntologyList
} from '../../../../pages/SearchPage/constants'
import { OntologyListService } from '../../../../services/corpus/ontology-list.service'

export const RelatedTermsList = () => {
  const selectedColumns = columns
  const searchContext = useSearchContext()
  const prevTermRef = useRef()

  const ontologyListService = new OntologyListService()

  useEffect(() => {
    ontologyListService.retrieveOntologyList(searchContext?.inputText).then(data => {
      if (data) {
        searchContext?.setOntologyList(transformOntologyList(data))
      }
    })

    toggleEnrichQuery(searchContext?.enrichButton)

    if (searchContext?.selectAll) {
      toggleAllItems()
    }
  }, [])

  const getOntologyTerms = lastKeywords => {
    const ontologyTermList: any = []

    lastKeywords.forEach(lastKeyword => {
      ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
        if (data) {
          searchContext?.setOntologyList(transformOntologyList(data))
          ontologyTermList.push(...[String(data).split(',')])
        }
      })
    })

    return ontologyTermList
  }

  const toggleEnrichQuery = value => {
    // ex: "(bin) AND (regulation OR guideline) AND (standard)"
    //send request to ontologyList for each keyword
    //send request to corpus with the ontology list of all keywords

    if (value) {
      const regExp = /\(|\)|\[|\]/g

      const splitedANDOperator = getSelectedTerms(searchContext?.listOFTerms).split(` AND `)
      const splitedOROperator: any = []

      splitedANDOperator.forEach(element => {
        const hasBrackets = regExp.test(element)

        if (hasBrackets) {
          const removedBrackets = element.slice(1, element.length - 1).split(' OR ')

          splitedOROperator.push(getOntologyTerms(removedBrackets))
        } else {
          splitedOROperator.push(getOntologyTerms(element.split(' OR ')))
        }

        searchContext?.setOntologyListItems(splitedOROperator)
      })
    }
  }

  const toggleAllItems = () => {
    if (searchContext?.selectAll) {
      selectNode(searchContext?.ontologyList)
    } else if (!searchContext?.selectAll) {
      selectNode([])
    }
  }

  const selectNode = selectedNodes => {
    searchContext?.setSelectedRelatedTermsCl(selectedNodes)
    const listOfClusterTerms: any = []

    if (prevTermRef.current === undefined) {
      prevTermRef.current = searchContext?.term
    }

    if (selectedNodes.length > 0) {
      selectedNodes.forEach(item => {
        if (item.node) {
          listOfClusterTerms.push(...item.node)
        } else {
          listOfClusterTerms.push(item)
        }
      })

      const uniqueValues = listOfClusterTerms.filter((subject, index) => {
        return listOfClusterTerms.indexOf(subject) === index
      })

      searchContext?.setOntologyValue(uniqueValues)
      transformPhrases(uniqueValues)
    }

    if (selectedNodes.length === 0) {
      searchContext?.setOntologyValue(listOfClusterTerms)
      searchContext?.setTerm(prevTermRef.current)
    }

    // toggleSelectAll(selectedNodes, ontologyList)
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result = searchContext?.term

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!searchContext?.enrichButton) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      searchContext?.setCopyQuery(copyTerm)
    } else if (searchContext?.enrichButton) {
      updateEnrichedQuery(searchContext?.ontologyListItems)
    }

    result = result + ' ' + listOfValues.join(' ')
    searchContext?.setTerm(result)
  }

  const updateEnrichedQuery = clusters => {
    if (clusters.length > 1) {
      const result = clusters.join(' AND ').split(',').join(' ')

      searchContext?.setCopyQuery(getSelectedTerms(getListOfTerms(result)))

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

      searchContext?.setCopyQuery(result)

      return result
    }
  }
  const callSelectedNode = value => {
    if (value) {
      selectNode(value)
    }
  }

  const activityBodyTemplate = rowData => {
    return <RelatedTermsSelect rowDataList={rowData} onSelectedNode={callSelectedNode} />
  }

  const columnComponents = selectedColumns.map(({ header }) => {
    return <Column key={header} showFilterMatchModes={false} body={activityBodyTemplate} />
  })

  return (
    <DataTable
      lazy={true}
      value={searchContext?.ontologyList}
      showSelectAll={false}
      className="dataTable-list"
      selection={searchContext?.selectedRelatedTermsCl}
      onSelectionChange={e => selectNode(e.value)}
      dataKey="id"
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
      {columnComponents}
    </DataTable>
  )
}

export default RelatedTermsList
