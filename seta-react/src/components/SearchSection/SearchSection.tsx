import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import type { OverlayPanel } from 'primereact/overlaypanel'

import type { Term } from '../../models/term.model'
import {
  defaultTypeOfSearch,
  getListOfTerms,
  getSelectedTerms
} from '../../pages/SearchPage/constants'
import { CorpusService } from '../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../store/corpus-search-payload'
import OverlayPanelDialog from '../OverlayPanel/OverlayPanel'
import SearchBox from '../SearchBox'
import './style.css'
import SearchButton from '../SearchButton'

export const SearchSection = props => {
  const [inputText, setInputText] = useState<Term[] | any>('')
  const [listOFTerms, setListOFTerms] = useState<Term[]>([])
  const [lastPayload, setLastPayload] = useState<any>()
  const [copyQyery, setCopyQuery] = useState<Term[] | any>([])
  const [enrichQuery, setEnrichQuery] = useState(false)
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch)
  const isMounted = useRef(false)
  const op = useRef<OverlayPanel>(null)
  const corpusService = new CorpusService()

  useEffect(() => {
    if (isMounted) {
      op.current?.hide()
    }
  }, [])

  useEffect(() => {
    isMounted.current = true

    if (String(props.current_search) !== '') {
      if (!enrichQuery) {
        setListOFTerms(getListOfTerms(String(props.current_search)))
        setCopyQuery(getSelectedTerms(listOFTerms))
      }
    }

    const result = String(props.current_search).split(',').join(' ')

    props.onChangeTerm(result)
    //update corpus api call parameters
    setLastPayload(
      new CorpusSearchPayload({
        term: copyQyery,
        aggs: 'date_year',
        n_docs: 100,
        search_type: props.typeofSearch,
        date_range: props.timeRangeValue
      })
    )

    corpusService.getRefreshedToken()
  }, [props, enrichQuery, copyQyery, selectedTypeSearch, listOFTerms])

  const getInputText = value => {
    if (value !== '') {
      setInputText(value)
    }
  }

  const toggleOverlayPanel = () => {
    // console.log(event)
  }

  const changeSelectedTypeSearch = value => {
    setSelectedTypeSearch(value)
  }

  const toggleEnrichQuery = value => {
    setEnrichQuery(value)
  }

  const onChangeQuery = value => {
    setCopyQuery(value)
  }

  return (
    <>
      <SearchBox
        text_focused={inputText}
        current_search={props.current_search}
        onChangeTerm={props.onChangeTerm}
        onChangeInput={getInputText}
        op={props.op}
      />
      <OverlayPanelDialog
        text_focused={inputText}
        current_search={props.current_search}
        enrichQuery={enrichQuery}
        op={props.op}
        onToggleEnrichQuery={toggleEnrichQuery}
        onSelectedTypeSearch={changeSelectedTypeSearch}
        onChangeTerm={props.onChangeTerm}
        listofTerms={listOFTerms}
        onChangeQuery={onChangeQuery}
        selectionValue={selectedTypeSearch}
      />
      <Button icon="pi pi-ellipsis-v" className="ellipsis-v" onClick={toggleOverlayPanel} />
      <SearchButton
        current_search={props.current_search}
        enrichQuery={enrichQuery}
        listofTerms={listOFTerms}
        lastPayload={lastPayload}
        typeofSearch={props.typeofSearch}
        timeRangeValue={props.timeRangeValue}
        onChangeTerm={props.onChangeTerm}
        onChangeItems={props.onChangeItems}
        onChangeAggregations={props.onChangeAggregations}
        onChangeShowContent={props.onChangeShowContent}
        onSelectedTypeSearch={changeSelectedTypeSearch}
        onChangeQuery={onChangeQuery}
      />
    </>
  )
}

export default SearchSection
