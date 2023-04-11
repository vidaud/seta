import { useEffect, useContext } from 'react'
import { InputText } from 'primereact/inputtext'

import { SearchContext } from '../../../../context/search-context'
import {
  getListOfTerms,
  getSelectedTerms,
  getWordAtNthPosition,
  isPhrase,
  transformOntologyList
} from '../../../../pages/SearchPage/constants'
import './style.css'
import { OntologyListService } from '../../../../services/corpus/ontology-list.service'
import { SimilarsService } from '../../../../services/corpus/similars.service'
import { SuggestionsService } from '../../../../services/corpus/suggestions.service'
import type Search from '../../../../types/search'

export const SearchBox = () => {
  const suggestionsService = new SuggestionsService()
  const ontologyListService = new OntologyListService()
  const similarService = new SimilarsService()
  const {
    term,
    setTerm,
    op,
    setCopyQuery,
    setListOFTerms,
    enrichQuery,
    listOFTerms,
    selectedTypeSearch,
    similarsList,
    ontologyListItems,
    setInputText,
    setSuggestedTerms,
    setOntologyList,
    setSimilarTerms,
    inputText
  } = useContext(SearchContext) as Search

  useEffect(() => {
    if (String(term) !== '') {
      setListOFTerms(getListOfTerms(term))

      if (!enrichQuery) {
        setCopyQuery(getSelectedTerms(listOFTerms))
      } else {
        const currentSearch: any = getSelectedTerms(listOFTerms)

        if (selectedTypeSearch.code === 'RT') {
          updateSimilarsQuery(similarsList)
        }

        if (selectedTypeSearch.code === 'RC') {
          updateOntologiesQuery(ontologyListItems)
        }

        const result = currentSearch
          .concat(' OR ')
          .concat(
            selectedTypeSearch.code === 'RT'
              ? updateSimilarsQuery(similarsList)
              : updateOntologiesQuery(ontologyListItems)
          )

        setCopyQuery(result)
      }
    }
  }, [
    enrichQuery,
    listOFTerms,
    ontologyListItems,
    selectedTypeSearch,
    setCopyQuery,
    setListOFTerms,
    similarsList,
    term
  ])

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

      setInputText(keyword[0])
      setTimeout(() => {
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
          if (!enrichQuery) {
            getOntologyList(keyword[0])
          }
        }, 250)
      } else if (selectedTypeSearch.code === 'RT') {
        setTimeout(() => {
          if (!enrichQuery) {
            getSimilarsList(keyword[0])
          }
        }, 250)
      }

      op.current?.show(e, e.target)
      setTerm(e.target.value)
    } else {
      setTerm(e.target.value)
      setSuggestedTerms([])
      setOntologyList([])
      setSimilarTerms([])
    }
  }

  const getOntologyList = lastKeyword => {
    ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
      if (data) {
        setOntologyList(transformOntologyList(data))
      }
    })
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

  const updateSimilarsQuery = similarList => {
    if (selectedTypeSearch.code === 'RT') {
      if (similarList.length > 1) {
        const result = similarList.join(' AND ').split(',').join(' ')

        setCopyQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (similarList.length === 1 && similarList[0].length > 0) {
        const result = similarList[0].join(' OR ').split(',').join(' OR ')

        setCopyQuery(result)

        return result
      }
    }
  }

  const updateOntologiesQuery = ontologyList => {
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

      const result = newItems.join(' OR ').split(',').join(' OR ')

      setCopyQuery(result)

      return result
    }
  }

  return (
    <InputText
      type="search"
      aria-haspopup
      value={String(term)}
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
  )
}

export default SearchBox
