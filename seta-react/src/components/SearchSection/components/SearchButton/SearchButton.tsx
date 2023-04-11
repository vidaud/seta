import { useEffect, useContext } from 'react'
import { Button } from 'primereact/button'

import { SearchContext } from '../../../../context/search-context'
import { CorpusService } from '../../../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../../../store/corpus-search-payload'
import './style.css'
import type Search from '../../../../types/search'

export const SearchButton = () => {
  const {
    term,
    lastPayload,
    setLastPayload,
    setItems,
    setAggregations,
    copyQuery,
    typeofSearch,
    timeRangeValue,
    setShowContent
  } = useContext(SearchContext) as Search
  const corpusService = new CorpusService()

  useEffect(() => {
    if (String(term) !== '') {
      setLastPayload(
        new CorpusSearchPayload({
          term: copyQuery,
          aggs: 'date_year',
          n_docs: 100,
          search_type: typeofSearch,
          date_range: timeRangeValue
        })
      )
    }
  }, [copyQuery, setLastPayload, term, timeRangeValue, typeofSearch])

  const onSearch = () => {
    if (String(term) !== null && String(term).length >= 2) {
      corpusService.getRefreshedToken()

      corpusService.getDocuments(lastPayload).then(data => {
        if (data) {
          setItems(data.documents)
          setAggregations(data.aggregations)
        }
      })

      setShowContent(true)
    } else {
      setShowContent(false)
    }
  }

  return <Button label="Search" onClick={onSearch} />
}

export default SearchButton
