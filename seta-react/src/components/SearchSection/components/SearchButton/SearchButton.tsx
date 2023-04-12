import { useEffect, useContext, useCallback } from 'react'
import { Button } from 'primereact/button'

import { SearchContext } from '../../../../context/search-context'
import { getListOfTerms, getSelectedTerms, isPhrase } from '../../../../pages/SearchPage/constants'
import { CorpusService } from '../../../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../../../store/corpus-search-payload'
import './style.css'
import type Search from '../../../../types/search'

export const SearchButton = () => {
  const {
    term,
    setItems,
    setAggregations,
    copyQuery,
    typeofSearch,
    timeRangeValue,
    setShowContent,
    setListOFTerms,
    setCopyQuery,
    enrichQuery,
    listOFTerms,
    selectedTypeSearch,
    similarsList,
    ontologyListItems
  } = useContext(SearchContext) as Search
  const corpusService = new CorpusService()

  const updateSimilarsQuery = useCallback(
    similarList => {
      if (selectedTypeSearch.code === 'RT') {
        if (similarList.length > 1) {
          const result = similarList.join(' AND ').split(',').join(' ')

          setCopyQuery(getSelectedTerms(getListOfTerms(result)))

          return getSelectedTerms(getListOfTerms(result))
        } else if (similarList.length === 1 && similarList[0].length > 0) {
          // setCopyQuery(result)

          const currentSearch: any = getSelectedTerms(listOFTerms)
          const result = currentSearch
            .concat(' OR ')
            .concat(similarList[0].join(' OR ').split(',').join(' OR '))

          setCopyQuery(result)

          return result
        }
      }
    },
    [selectedTypeSearch, setCopyQuery, listOFTerms]
  )

  const updateOntologiesQuery = useCallback(
    ontologyList => {
      if (ontologyList.length > 1) {
        const result = ontologyList.join(' AND ').split(',').join(' ')

        setCopyQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (ontologyList.length === 1 && ontologyList[0].length > 0) {
        const newOntologyList = ontologyList[0]
        const newItems: any = []

        if (newOntologyList !== '' || newOntologyList.length > 0) {
          newOntologyList.forEach(list => {
            list.forEach(li => {
              isPhrase(li) ? newItems.push(`"${li}"`) : newItems.push(li)
            })
          })
        }

        // setCopyQuery(result)
        const currentSearch: any = getSelectedTerms(listOFTerms)
        const result = currentSearch
          .concat(' OR ')
          .concat(newItems.join(' OR ').split(',').join(' OR '))

        setCopyQuery(result)

        return result
      }
    },
    [setCopyQuery, listOFTerms]
  )

  const callApi = useCallback(() => {
    if (String(term) !== null && String(term).length >= 2) {
      if (!enrichQuery) {
        corpusService
          .getDocuments(
            new CorpusSearchPayload({
              term: copyQuery,
              aggs: 'date_year',
              n_docs: 100,
              search_type: typeofSearch,
              date_range: timeRangeValue
            })
          )
          .then(data => {
            if (data) {
              setItems(data.documents)
              setAggregations(data.aggregations)
            }
          })
      } else {
        if (selectedTypeSearch.code === 'RT') {
          updateSimilarsQuery(similarsList)
          corpusService
            .getDocuments(
              new CorpusSearchPayload({
                term: updateSimilarsQuery(similarsList),
                aggs: 'date_year',
                n_docs: 100,
                search_type: typeofSearch,
                date_range: timeRangeValue
              })
            )
            .then(data => {
              if (data) {
                setItems(data.documents)
                setAggregations(data.aggregations)
              }
            })
        }

        if (selectedTypeSearch.code === 'RC') {
          updateOntologiesQuery(ontologyListItems)
          corpusService
            .getDocuments(
              new CorpusSearchPayload({
                term: updateOntologiesQuery(ontologyListItems),
                aggs: 'date_year',
                n_docs: 100,
                search_type: typeofSearch,
                date_range: timeRangeValue
              })
            )
            .then(data => {
              if (data) {
                setItems(data.documents)
                setAggregations(data.aggregations)
              }
            })
        }
      }
    }
  }, [
    copyQuery,
    corpusService,
    enrichQuery,
    ontologyListItems,
    selectedTypeSearch,
    setAggregations,
    setItems,
    similarsList,
    term,
    updateOntologiesQuery,
    updateSimilarsQuery,
    timeRangeValue,
    typeofSearch
  ])

  useEffect(() => {
    if (String(term) !== '') {
      setListOFTerms(getListOfTerms(term))
    }
  }, [term, setListOFTerms])

  useEffect(() => {
    if (String(term) !== '') {
      if (!enrichQuery) {
        setCopyQuery(getSelectedTerms(listOFTerms))
      }
    }
  }, [copyQuery, enrichQuery, term, listOFTerms, setCopyQuery])

  const onSearch = () => {
    if (String(term) !== null && String(term).length >= 2) {
      corpusService.getRefreshedToken()

      callApi()

      setShowContent(true)
    } else {
      setShowContent(false)
    }
  }

  return <Button label="Search" onClick={onSearch} />
}

export default SearchButton
