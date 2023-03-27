import { useEffect, useRef, useState } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import { SelectButton } from 'primereact/selectbutton'
import { ToggleButton } from 'primereact/togglebutton'

import {
  defaultTypeOfSearch,
  itemsBreadCrumb,
  home,
  typeOfSearches,
  columns,
  getWordAtNthPosition,
  isPhrase,
  getSelectedTerms,
  getListOfTerms,
  transformOntologyList
} from './constants'

import './style.css'

import DialogButton from '../../components/DialogButton'
import TabMenus from '../../components/TabMenu'
import type { Term } from '../../models/term.model'
import { CorpusService } from '../../services/corpus/corpus.service'
import { OntologyListService } from '../../services/corpus/ontology-list.service'
import { SimilarsService } from '../../services/corpus/similars.service'
import { SuggestionsService } from '../../services/corpus/suggestions.service'
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
  const [suggestedTerms, setSuggestedTerms] = useState<any>(null)
  const [ontologyList, setOntologyList] = useState<any>(null)
  const [inputText, setInputText] = useState<Term[] | any>('')
  const [copyQyery, setCopyQuery] = useState<Term[] | any>([])
  const [loading, setLoading] = useState(true)
  const [selectAll, setSelectAll] = useState(false)
  const [enrichQuery, setEnrichQuery] = useState(false)
  const [similarTerms, setSimilarTerms] = useState<any>(null)
  const [ontologyValue, setOntologyValue] = useState<any>(null)
  const [suggestionsValue, setSuggestionsValue] = useState<any>(null)
  const [similarValues, setSimilarValues] = useState<any>(null)
  const [selectedRelatedTermsCl, setSelectedRelatedTermsCl] = useState(null)
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch)
  const [selectedColumns, setSelectedColumns] = useState(columns)
  const prevTermRef = useRef()
  const isMounted = useRef(false)
  const op = useRef<OverlayPanel>(null)
  let cp: CorpusSearchPayload

  const corpusService = new CorpusService()
  const suggestionsService = new SuggestionsService()
  const ontologyListService = new OntologyListService()
  const similarService = new SimilarsService()

  useEffect(() => {
    if (isMounted) {
      op.current?.hide()
    }
  }, [selectedColumns])

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
    loading,
    enrichQuery,
    selectAll,
    selectedRelatedTermsCl,
    typeofSearch,
    timeRangeValue,
    copyQyery,
    selectedTypeSearch,
    suggestionsValue,
    similarValues,
    ontologyValue,
    ontologyListItems,
    similarsList
  ])

  const selectAllTerms = selectedNodes => {
    const listOfTerms: any = []

    if (selectedNodes.length > 0) {
      prevTermRef.current = term
      selectedNodes.forEach(item => {
        listOfTerms.push(item)
      })

      const uniqueTerms = listOfTerms.filter((subject, index) => {
        return listOfTerms.indexOf(subject) === index
      })

      setSimilarValues(uniqueTerms)
      transformPhrases(uniqueTerms)
    }

    if (selectedNodes.length === 0) {
      setSimilarValues(listOfTerms)
      setTerm(prevTermRef.current)
    }

    toggleSelectAll(selectedNodes, similarTerms)
  }

  const selectNode = selectedNodes => {
    setSelectedRelatedTermsCl(selectedNodes)
    const listOfClusterTerms: any = []

    if (selectedNodes.length > 0) {
      prevTermRef.current = term
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
      setTerm(prevTermRef.current)
    }

    toggleSelectAll(selectedNodes, ontologyList)
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result: any = term

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!enrichQuery) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      setCopyQuery(copyTerm)
    } else if (enrichQuery) {
      updateEnrichedQuery(similarsList, ontologyListItems)
    }

    result = result + ' ' + listOfValues.join(' ')
    setTerm(result)
  }

  const toggleSelectAll = (items, allList) => {
    if (items.length === allList.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }

  const getOntologyList = lastKeyword => {
    ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
      if (data) {
        setOntologyList(transformOntologyList(data))
      }

      setLoading(false)
    })
  }

  const getOntologyTerms = lastKeywords => {
    const ontologyTermList: any = []

    lastKeywords.forEach(lastKeyword => {
      ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
        if (data) {
          setOntologyList(transformOntologyList(data))
          ontologyTermList.push(...[String(data).split(',')])
        }

        setLoading(false)
      })
    })

    return ontologyTermList
  }

  const getSimilarsList = lastKeyword => {
    similarService.retrieveSimilars(lastKeyword).then(data => {
      if (data) {
        if (data.length > 0) {
          const list: any = []

          if (data && data.length > 0) {
            data.forEach(element => {
              list.push(element.similar_word)
            })

            setSimilarTerms(list)
          }
        }
      }
    })
  }

  const getSimilarsTerms = lastKeywords => {
    const similarsTermsList: any = []

    lastKeywords.forEach(lastKeyword => {
      similarService.retrieveSimilars(lastKeyword).then(data => {
        if (data) {
          if (data.length > 0) {
            const list: any = []

            if (data && data.length > 0) {
              data.forEach(element => {
                isPhrase(element.similar_word)
                  ? list.push(`"${element.similar_word}"`)
                  : list.push(element.similar_word)
              })

              setSimilarTerms(list)
              similarsTermsList.push(...[list])
            }
          }
        }
      })
    })

    return similarsTermsList
  }

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

  const onChangeOption = (e: { value: any }) => {
    setSelectedTypeSearch(e.value)

    if (String(term) !== '') {
      callService(e.value.code)
    }
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

  const toggleEnrichButton = () => {
    const toggled = !enrichQuery

    setEnrichQuery(toggled)
    toggleEnrichQuery(toggled)
  }

  const toggleEnrichQuery = value => {
    // ex: "(bin) AND (regulation OR guideline) AND (standard)"
    //send request to ontologyList for each keyword
    //send request to corpus with the ontology list of all keywords
    setEnrichQuery(value)

    if (value) {
      const regExp = /\(|\)|\[|\]/g

      if (selectedTypeSearch.code === 'RT') {
        const splitedANDOperator = getSelectedTerms(listOFTerms).split(` AND `)
        const splitedOROperator: any = []

        splitedANDOperator.forEach(element => {
          const hasBrackets = regExp.test(element)

          if (hasBrackets) {
            const removedBrackets = element.slice(1, element.length - 1).split(' OR ')

            splitedOROperator.push(getSimilarsTerms(removedBrackets))
          } else {
            splitedOROperator.push(getSimilarsTerms(element.split(' OR ')))
          }

          setSimilarsList(splitedOROperator)
        })
      }

      if (selectedTypeSearch.code === 'RC') {
        const splitedANDOperator = getSelectedTerms(listOFTerms).split(` AND `)
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
    } else {
      callService(selectedTypeSearch.code)
    }
  }

  const toggleOverlayPanel = event => {
    console.log(event)
  }

  const suggestionsTemplate = value => {
    const string = value.substr(0, value.toLowerCase().indexOf(inputText.toLowerCase()))
    const endString = value.substr(
      value.toLowerCase().indexOf(inputText.toLowerCase()) + inputText.length
    )
    const highlightedText = value.substr(
      value.toLowerCase().indexOf(inputText.toLowerCase()),
      inputText.length
    )

    return (
      <div className="country-item">
        <div>
          {string}
          <span className="highlight-text">{highlightedText}</span>
          {endString}
        </div>
      </div>
    )
  }

  const callService = code => {
    suggestionsService.retrieveSuggestions(inputText).then(data => {
      if (data) {
        setSuggestedTerms(data)
      }
    })

    if (code === 'RC') {
      setTimeout(() => {
        setLoading(true)
        getOntologyList(inputText)
      }, 250)
    } else if (code === 'RT') {
      getSimilarsList(inputText)
    }
  }

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      setTimeout(() => {
        const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

        setInputText(keyword[0])

        if (!enrichQuery) {
          suggestionsService.retrieveSuggestions(keyword[0]).then(data => {
            if (data) {
              setSuggestedTerms(data)
            }
          })
        }
      }, 250)

      if (selectedTypeSearch.code === 'RC') {
        setTimeout(() => {
          const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

          setLoading(true)

          setInputText(keyword[0])

          if (!enrichQuery) {
            getOntologyList(keyword[0])
          }
        }, 250)

        op.current?.show(e, e.target)
        setTerm(e.target.value)
      } else if (selectedTypeSearch.code === 'RT') {
        setTimeout(() => {
          const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

          setInputText(keyword[0])

          if (!enrichQuery) {
            getSimilarsList(keyword[0])
          }
        }, 250)

        op.current?.show(e, e.target)
        setTerm(e.target.value)
      }
    } else {
      setTerm(e.target.value)
      setSuggestedTerms([])
      setOntologyList([])
      setSimilarTerms([])
    }
  }

  const activityBodyTemplate = rowData => {
    return (
      <SelectButton
        value={ontologyValue}
        className="suggestions-list"
        onChange={e => {
          selectNode(e.value)
        }}
        options={rowData.node}
        multiple={true}
      />
    )
  }

  const columnComponents = selectedColumns.map(({ header }) => {
    return <Column key={header} showFilterMatchModes={false} body={activityBodyTemplate} />
  })

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
            <OverlayPanel
              ref={op}
              showCloseIcon
              id="overlay_panel1"
              style={{ width: '55%', left: '19%' }}
              className="overlay_panel"
            >
              <div className="overlayPanelHeader">
                <div className="div-size-1">
                  <h5>Autocomplete</h5>
                </div>
                <div className="alingItems">
                  <div className="div-size-button">
                    {inputText ? (
                      <ToggleButton
                        checked={selectAll}
                        disabled={enrichQuery || ontologyList.length === 0 ? true : false}
                        className="custom"
                        aria-label={inputText}
                        onLabel={inputText}
                        offLabel={inputText}
                        tooltip={selectAll ? 'Unselect all terms' : 'Select all terms'}
                        tooltipOptions={{ position: 'top' }}
                        onChange={e => {
                          setSelectAll(e.value)

                          if (selectedTypeSearch.code === 'RC') {
                            if (e.value) {
                              selectNode(ontologyList)
                            } else if (!e.value) {
                              selectNode([])
                            }
                          }

                          if (selectedTypeSearch.code === 'RT') {
                            if (e.value) {
                              selectAllTerms(similarTerms)
                            } else if (!e.value) {
                              selectAllTerms([])
                            }
                          }
                        }}
                      />
                    ) : (
                      <span />
                    )}
                  </div>
                  <div className="search_dropdown div-size-2">
                    <Button
                      className={enrichQuery ? 'custom-magic' : 'custom-magic magic'}
                      aria-label={inputText}
                      tooltip="Enrich query automatically"
                      tooltipOptions={{ position: 'bottom' }}
                      onClick={toggleEnrichButton}
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707L14 2.707ZM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707L7.293 4Zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1h1.829Zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1h1.829ZM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707L13.293 10ZM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0v1.829Zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0L8.354 9.06Z" />
                      </svg>
                    </Button>
                    <Dropdown
                      value={selectedTypeSearch}
                      options={typeOfSearches}
                      onChange={onChangeOption}
                      optionLabel="name"
                    />
                  </div>
                </div>
              </div>
              <div className="overlayPanelBody">
                <div className="div-size-1">
                  <>
                    <div className="card flex justify-content-center">
                      <SelectButton
                        value={suggestionsValue}
                        className="suggestions-list"
                        onChange={e => {
                          setSuggestionsValue(e.value)

                          // Check for white space
                          if (String(term) === '') {
                            setTerm('')
                          } else {
                            if (isPhrase(e.value)) {
                              const result = term.replace(inputText, `"${e.value}"`)

                              setTerm(result)
                            } else {
                              const result = term.replace(inputText, e.value)

                              setTerm(result)
                            }
                          }

                          op.current?.hide()
                        }}
                        itemTemplate={suggestionsTemplate}
                        options={suggestedTerms}
                      />
                    </div>
                  </>
                </div>
                <div className="div-size-2">
                  {selectedTypeSearch.code === 'RC' && enrichQuery === false ? (
                    <>
                      <DataTable
                        lazy={true}
                        loading={loading}
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
                    </>
                  ) : selectedTypeSearch.code === 'RT' && enrichQuery === false ? (
                    <>
                      <div className="card flex justify-content-center similars">
                        <SelectButton
                          value={similarValues}
                          className="suggestions-list"
                          onChange={e => {
                            selectAllTerms(e.value)
                          }}
                          options={similarTerms}
                          multiple={true}
                        />
                      </div>
                    </>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </OverlayPanel>
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
