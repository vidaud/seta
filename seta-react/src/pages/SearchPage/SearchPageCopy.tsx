import { useEffect, useRef, useState } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import type { OverlayPanel } from 'primereact/overlaypanel'

import {
  defaultTypeOfSearch,
  itemsBreadCrumb,
  home,
  getWordAtNthPosition,
  isPhrase,
  getSelectedTerms,
  getListOfTerms
} from './constants'

import './style.css'

import DialogButton from '../../components/DialogButton'
import OverlayPanelDialog from '../../components/OverlayPanel/OverlayPanel'
import TabMenus from '../../components/TabMenu'
import type { Term } from '../../models/term.model'
import { CorpusService } from '../../services/corpus/corpus.service'
import { CorpusSearchPayload } from '../../store/corpus-search-payload'

const SearchPage = () => {
  const [showContent, setShowContent] = useState(false)
  const [term, setTerm] = useState<Term[] | any>([])
  const [similarsList, setSimilarsList] = useState<any>([])
  const [ontologyListItems, setOntologyListItems] = useState<any>([])
  const [listOFTerms, setListOFTerms] = useState<Term[] | any>([])
  const [items, setItems] = useState<any>([])
  const [aggregations, setAggregations] = useState<any>([])
  const [documentList, setDocumentList] = useState([])
  const [typeofSearch, setTypeofSearch] = useState()
  const [timeRangeValue, setTimeRangeValue] = useState()
  const [lastPayload, setLastPayload] = useState<any>()
  const [inputText, setInputText] = useState<Term[] | any>('')
  const [copyQyery, setCopyQuery] = useState<Term[] | any>([])
  const [enrichQuery, setEnrichQuery] = useState(false)
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch)
  const isMounted = useRef(false)
  const op = useRef<OverlayPanel>(null)
  let cp: CorpusSearchPayload

  const corpusService = new CorpusService()

  useEffect(() => {
    if (isMounted) {
      op.current?.hide()
    }
  }, [])

  useEffect(() => {
    isMounted.current = true

    if (String(term) !== '') {
      if (!enrichQuery) {
        setListOFTerms(getListOfTerms(String(term)))
        setCopyQuery(getSelectedTerms(listOFTerms))
      }
    }

    const result = String(term).split(',').join(' ')

    setTerm(result)
    //update corpus api call parameters
    setLastPayload(
      new CorpusSearchPayload({
        ...cp,
        term: copyQyery,
        aggs: 'date_year',
        n_docs: 100,
        search_type: typeofSearch,
        date_range: timeRangeValue
      })
    )

    corpusService.getRefreshedToken()
  }, [
    showContent,
    term,
    aggregations,
    inputText,
    enrichQuery,
    typeofSearch,
    timeRangeValue,
    copyQyery,
    selectedTypeSearch,
    ontologyListItems,
    similarsList
  ])

  const onSearch = () => {
    if (term.length >= 2) {
      corpusService.getRefreshedToken()
      let details

      if (enrichQuery) {
        const currentSearch: any = getSelectedTerms(listOFTerms)
        const result = currentSearch
          .concat(' OR ')
          .concat(updateEnrichedQuery(similarsList, ontologyListItems))

        details = new CorpusSearchPayload({
          ...cp,
          term: result,
          aggs: 'date_year',
          n_docs: 100,
          search_type: typeofSearch,
          date_range: timeRangeValue
        })
      } else {
        details = lastPayload
      }

      corpusService.getDocuments(details).then(data => {
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

  const getDocumentList = list => {
    setDocumentList(items)
  }

  const getTextValue = text => {
    if (text !== '') {
      setTerm(text)
    }
  }

  const getFileName = filename => {
    if (filename !== '') {
      setTerm(filename)
    }
  }

  const toggleListVisibility = show => {
    if (show) {
      setShowContent(true)
    }
  }

  const getSelectedSuggestion = value => {
    if (value !== '') {
      setTerm(value)
    }
  }

  const changeSelectedTypeSearch = value => {
    setSelectedTypeSearch(value)
  }

  const onChangeQuery = value => {
    setCopyQuery(value)
  }

  // eslint-disable-next-line complexity
  const updateEnrichedQuery = (similars, clusters) => {
    if (selectedTypeSearch.code === 'RT') {
      if (similars.length > 1) {
        const result = similars.join(' AND ').split(',').join(' ')

        setCopyQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (similars.length === 1 && similars[0].length > 0) {
        const result = similars[0].join(' OR ').split(',').join(' OR ')

        setCopyQuery(result)

        return result
      }
    }

    // eslint-disable-next-line max-lines
    if (selectedTypeSearch.code === 'RC') {
      if (clusters.length > 1) {
        const result = clusters.join(' AND ').split(',').join(' ')

        setCopyQuery(getSelectedTerms(getListOfTerms(result)))

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

        setCopyQuery(result)

        return result
      }
    }
  }

  const toggleEnrichQuery = value => {
    setEnrichQuery(value)
  }

  const toggleOverlayPanel = event => {
    console.log(event)
  }

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      setTimeout(() => {
        const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

        setInputText(keyword[0])
      }, 250)

      op.current?.show(e, e.target)
      setTerm(e.target.value)
    }
  }

  return (
    <>
      <BreadCrumb model={itemsBreadCrumb} home={home} />
      <div className="page">
        {showContent ? null : <div>Discover and Link Knowledge in EU Documents</div>}
        <div className="col-8">
          <div className="p-inputgroup">
            <DialogButton
              onChange={getDocumentList}
              onChangeText={getTextValue}
              onChangeFile={getFileName}
              onChangeContentVisibility={toggleListVisibility}
            />
            <InputText
              type="search"
              aria-haspopup
              value={term}
              data-text={inputText}
              aria-controls="overlay_panel1"
              className="select-product-button"
              placeholder="Type term and/or drag and drop here document"
              onChange={e => {
                onUpdateSelectedTerm(e)
              }}
              onClick={e => {
                onUpdateSelectedTerm(e)
              }}
            />
            <OverlayPanelDialog
              text_focused={inputText}
              current_search={term}
              enrichQuery={enrichQuery}
              op={op}
              onToggleEnrichQuery={toggleEnrichQuery}
              onSelectedTypeSearch={changeSelectedTypeSearch}
              onChangeTerm={getSelectedSuggestion}
              listofTerms={listOFTerms}
              onChangeQuery={onChangeQuery}
              selectionValue={selectedTypeSearch}
            />
            <Button icon="pi pi-ellipsis-v" className="ellipsis-v" onClick={toggleOverlayPanel} />
            <Button label="Search" onClick={onSearch} />
          </div>
        </div>
        <div>
          {showContent ? (
            <TabMenus
              data={items}
              term={term}
              aggregations={aggregations}
              typeofSearch={typeofSearch}
              setTypeofSearch={setTypeofSearch}
              timeRangeValue={timeRangeValue}
              setTimeRangeValue={setTimeRangeValue}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default SearchPage
