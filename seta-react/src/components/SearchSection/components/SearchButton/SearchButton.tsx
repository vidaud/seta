import { Button } from 'primereact/button'

import { useSearchContext } from '../../../../context/search-context'
import { getListOfTerms, getSelectedTerms, isPhrase } from '../../../../pages/SearchPage/constants'
import { CorpusService } from '../../../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../../../store/corpus-search-payload'

import './style.css'

export const SearchButton = () => {
  const searchContext = useSearchContext()
  const corpusService = new CorpusService()

  const onSearch = () => {
    if (String(searchContext?.term) !== null && searchContext?.term.length >= 2) {
      corpusService.getRefreshedToken()
      let details

      if (searchContext?.enrichQuery) {
        const currentSearch: any = getSelectedTerms(searchContext?.listOFTerms)
        const result = currentSearch
          .concat(' OR ')
          .concat(
            updateEnrichedQuery(searchContext?.similarsList, searchContext?.ontologyListItems)
          )

        details = new CorpusSearchPayload({
          term: result,
          aggs: 'date_year',
          n_docs: 100,
          search_type: searchContext?.typeofSearch,
          date_range: searchContext?.timeRangeValue
        })
      } else {
        details = searchContext?.lastPayload
      }

      corpusService.getDocuments(details).then(data => {
        if (data) {
          searchContext?.setItems(data.documents)
          searchContext?.setAggregations(data.aggregations)
        }
      })

      searchContext?.setShowContent(true)
    } else {
      searchContext?.setShowContent(false)
    }
  }

  const updateEnrichedQuery = (similars, clusters) => {
    if (searchContext?.selectedTypeSearch.code === 'RT') {
      updateSimilarsQuery(similars)
    }

    if (searchContext?.selectedTypeSearch.code === 'RC') {
      updateOntologiesQuery(clusters)
    }
  }

  const updateSimilarsQuery = similarList => {
    if (searchContext?.selectedTypeSearch.code === 'RT') {
      if (similarList.length > 1) {
        const result = similarList.join(' AND ').split(',').join(' ')

        searchContext?.setCopyQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (similarList.length === 1 && similarList[0].length > 0) {
        const result = similarList[0].join(' OR ').split(',').join(' OR ')

        searchContext?.setCopyQuery(result)

        return result
      }
    }
  }

  const updateOntologiesQuery = ontologyList => {
    if (ontologyList.length > 1) {
      const result = ontologyList.join(' AND ').split(',').join(' ')

      searchContext?.setCopyQuery(getSelectedTerms(getListOfTerms(result)))

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

      const result = newItems.join(' OR ').split(',').join(' OR ')

      searchContext?.setCopyQuery(result)

      return result
    }
  }

  return <Button label="Search" onClick={onSearch} />
}

export default SearchButton
