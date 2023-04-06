import { useEffect, useRef, useContext } from 'react'
import { Button } from 'primereact/button'

import SearchBox from './components/SearchBox'
import SearchButton from './components/SearchButton'

import { SearchContext } from '../../context/search-context'
import { CorpusService } from '../../services/corpus/corpus.service'
import type Search from '../../types/search'
import OverlayPanelDialog from '../OverlayPanel/OverlayPanel'
import './style.css'

export const SearchSection = () => {
  const isMounted = useRef(false)
  const corpusService = new CorpusService()

  const { term, setTerm, op } = useContext(SearchContext) as Search

  useEffect(() => {
    if (isMounted) {
      op.current?.hide()
    }
  }, [op])

  useEffect(() => {
    isMounted.current = true

    const result = String(term).split(',').join(' ')

    setTerm(result)

    //update corpus api call parameters

    corpusService.getRefreshedToken()
  }, [term])

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
