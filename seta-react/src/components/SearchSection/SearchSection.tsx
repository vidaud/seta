import { useEffect, useRef } from 'react'
import { Button } from 'primereact/button'

import SearchBox from './components/SearchBox'
import SearchButton from './components/SearchButton'

import { useSearchContext } from '../../context/search-context'
import { getListOfTerms, getSelectedTerms } from '../../pages/SearchPage/constants'
import { CorpusService } from '../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../store/corpus-search-payload'
import OverlayPanelDialog from '../OverlayPanel/OverlayPanel'
import './style.css'

export const SearchSection = () => {
  const isMounted = useRef(false)
  const corpusService = new CorpusService()

  const searchContext = useSearchContext()

  useEffect(() => {
    if (isMounted) {
      searchContext?.op.current?.hide()
    }
  }, [searchContext?.op])

  useEffect(() => {
    isMounted.current = true

    if (String(searchContext?.term) !== '') {
      if (!searchContext?.enrichQuery) {
        searchContext?.setListOFTerms(getListOfTerms(String(searchContext?.term)))
        searchContext?.setCopyQuery(getSelectedTerms(searchContext?.listOFTerms))
      }
    }

    const result = String(searchContext?.term).split(',').join(' ')

    searchContext?.setTerm(result)
    //update corpus api call parameters
    searchContext?.setLastPayload(
      new CorpusSearchPayload({
        term: searchContext?.copyQuery,
        aggs: 'date_year',
        n_docs: 100,
        search_type: searchContext?.typeofSearch,
        date_range: searchContext?.timeRangeValue
      })
    )

    corpusService.getRefreshedToken()
    corpusService.getDocuments(searchContext?.lastPayload).then(data => {
      if (data) {
        searchContext?.setItems(data.documents)
        searchContext?.setAggregations(data.aggregations)
      }
    })
  }, [])

  const toggleOverlayPanel = () => {
    // console.log(event)
  }

  return (
    <>
      <SearchBox />
      <OverlayPanelDialog />
      <Button icon="pi pi-ellipsis-v" className="ellipsis-v" onClick={toggleOverlayPanel} />
      <SearchButton />
    </>
  )
}

export default SearchSection
