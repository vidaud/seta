import { useEffect } from 'react'
import { Button } from 'primereact/button'

import { useSearchContext } from '../../../../context/search-context'
import { CorpusService } from '../../../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../../../store/corpus-search-payload'

import './style.css'

export const SearchButton = () => {
  const searchContext = useSearchContext()
  const corpusService = new CorpusService()

  useEffect(() => {
    if (String(searchContext?.term) !== '') {
      searchContext?.setLastPayload(
        new CorpusSearchPayload({
          term: searchContext?.copyQuery,
          aggs: 'date_year',
          n_docs: 100,
          search_type: searchContext?.typeofSearch,
          date_range: searchContext?.timeRangeValue
        })
      )
    }
  }, [searchContext])

  const onSearch = () => {
    if (String(searchContext?.term) !== null && String(searchContext?.term).length >= 2) {
      corpusService.getRefreshedToken()

      corpusService.getDocuments(searchContext?.lastPayload).then(data => {
        if (data) {
          searchContext?.setItems(data.documents)
          searchContext?.setAggregations(data.aggregations)
        }
      })

      searchContext?.getAggregations(searchContext?.aggregations)
      searchContext?.setShowContent(true)
    } else {
      searchContext?.setShowContent(false)
    }
  }

  return <Button label="Search" onClick={onSearch} />
}

export default SearchButton
