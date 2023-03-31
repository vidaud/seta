import { Button } from 'primereact/button'

import { getListOfTerms, getSelectedTerms, isPhrase } from '../../pages/SearchPage/constants'
import { CorpusService } from '../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../store/corpus-search-payload'

import './style.css'

export const SearchButton = props => {
  const corpusService = new CorpusService()
  const onSearch = () => {
    if (props.current_search.length >= 2) {
      corpusService.getRefreshedToken()
      let details

      if (props.enrichQuery) {
        const currentSearch: any = getSelectedTerms(props.listofTerms)
        const result = currentSearch
          .concat(' OR ')
          .concat(updateEnrichedQuery(props.similarsList, props.ontologyListItems))

        details = new CorpusSearchPayload({
          term: result,
          aggs: 'date_year',
          n_docs: 100,
          search_type: props.typeofSearch,
          date_range: props.timeRangeValue
        })
      } else {
        details = props.lastPayload
      }

      corpusService.getDocuments(details).then(data => {
        if (data) {
          props.onChangeItems(data.documents)
          props.onChangeAggregations(data.aggregations)
        }
      })

      props.onChangeShowContent(true)
    } else {
      props.onChangeShowContent(false)
    }
  }

  const updateEnrichedQuery = (similars, clusters) => {
    if (props.onSelectedTypeSearch.code === 'RT') {
      updateSimilarsQuery(similars)
    }

    if (props.onSelectedTypeSearch.code === 'RC') {
      updateOntologiesQuery(clusters)
    }
  }

  const updateSimilarsQuery = similarList => {
    if (props.onSelectedTypeSearch.code === 'RT') {
      if (similarList.length > 1) {
        const result = similarList.join(' AND ').split(',').join(' ')

        props.onChangeQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (similarList.length === 1 && similarList[0].length > 0) {
        const result = similarList[0].join(' OR ').split(',').join(' OR ')

        props.onChangeQuery(result)

        return result
      }
    }
  }

  const updateOntologiesQuery = ontologyList => {
    if (ontologyList.length > 1) {
      const result = ontologyList.join(' AND ').split(',').join(' ')

      props.onChangeQuery(getSelectedTerms(getListOfTerms(result)))

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

      props.onChangeQuery(result)

      return result
    }
  }

  return <Button label="Search" onClick={onSearch} />
}

export default SearchButton
