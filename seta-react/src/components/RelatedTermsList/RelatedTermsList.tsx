import { useEffect, useState, useRef } from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import './style.css'
import {
  columns,
  getListOfTerms,
  getSelectedTerms,
  isPhrase,
  transformOntologyList
} from '../../pages/SearchPage/constants'
import { OntologyListService } from '../../services/corpus/ontology-list.service'
import RelatedTermsSelect from '../RelatedTermsSelect'

export const RelatedTermsList = ({
  current_search,
  text_focused,
  onChangeTerm,
  onChangeSelectAll,
  enrichQueryButton,
  onChangeQuery,
  listofTerms
}) => {
  const [ontologyValue, setOntologyValue] = useState<any>(null)
  const [ontologyList, setOntologyList] = useState<any>(null)
  const [ontologyListItems, setOntologyListItems] = useState<any>([])
  const [selectedColumns, setSelectedColumns] = useState(columns)
  const [selectedRelatedTermsCl, setSelectedRelatedTermsCl] = useState(null)
  const prevTermRef = useRef()

  const ontologyListService = new OntologyListService()

  useEffect(() => {
    ontologyListService.retrieveOntologyList(text_focused).then(data => {
      if (data) {
        setOntologyList(transformOntologyList(data))
      }
    })

    toggleEnrichQuery(enrichQueryButton)

    if (onChangeSelectAll) {
      toggleAllItems()
    }
  }, [ontologyValue, ontologyList, selectedColumns, selectedRelatedTermsCl])

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

  const toggleEnrichQuery = value => {
    // ex: "(bin) AND (regulation OR guideline) AND (standard)"
    //send request to ontologyList for each keyword
    //send request to corpus with the ontology list of all keywords

    if (value) {
      const regExp = /\(|\)|\[|\]/g

      const splitedANDOperator = getSelectedTerms(listofTerms).split(` AND `)
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
    }
  }

  const toggleAllItems = () => {
    if (onChangeSelectAll) {
      selectNode(ontologyList)
    } else if (!onChangeSelectAll) {
      selectNode([])
    }
  }

  const selectNode = selectedNodes => {
    setSelectedRelatedTermsCl(selectedNodes)
    const listOfClusterTerms: any = []

    if (prevTermRef.current === undefined) {
      prevTermRef.current = current_search
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

      setOntologyValue(uniqueValues)
      transformPhrases(uniqueValues)
    }

    if (selectedNodes.length === 0) {
      setOntologyValue(listOfClusterTerms)
      onChangeTerm(prevTermRef.current)
    }

    // toggleSelectAll(selectedNodes, ontologyList)
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result: any = current_search

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!enrichQueryButton) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      onChangeQuery(copyTerm)
    } else if (enrichQueryButton) {
      updateEnrichedQuery(ontologyListItems)
    }

    result = result + ' ' + listOfValues.join(' ')
    onChangeTerm(result)
  }

  // const toggleSelectAll = (items, allList) => {
  //   if (items.length === allList.length) {
  //     onChangeSelectAll(true)
  //   } else {
  //     onChangeSelectAll(false)
  //   }
  // }

  const updateEnrichedQuery = clusters => {
    if (clusters.length > 1) {
      const result = clusters.join(' AND ').split(',').join(' ')

      onChangeQuery(getSelectedTerms(getListOfTerms(result)))

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

      onChangeQuery(result)

      return result
    }
  }
  const callSelectedNode = value => {
    if (value) {
      selectNode(value)
    }
  }

  const activityBodyTemplate = rowData => {
    return (
      <RelatedTermsSelect
        rowDataList={rowData}
        ontologyValues={ontologyValue}
        onSelectedNode={callSelectedNode}
      />
    )
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
