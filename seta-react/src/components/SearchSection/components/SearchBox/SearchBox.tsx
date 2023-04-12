import { useContext } from 'react'
import { InputText } from 'primereact/inputtext'

import { SearchContext } from '../../../../context/search-context'
import { getWordAtNthPosition, transformOntologyList } from '../../../../pages/SearchPage/constants'
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
    enrichQuery,
    selectedTypeSearch,
    setInputText,
    setSuggestedTerms,
    setOntologyList,
    setSimilarTerms,
    inputText,
    setLoading
  } = useContext(SearchContext) as Search

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

      setLoading(true)
      setInputText(keyword[0])
      setTimeout(() => {
        if (!enrichQuery) {
          suggestionsService.retrieveSuggestions(keyword[0]).then(data => {
            if (data) {
              setSuggestedTerms(data)
            }
          })
        }
      }, 500)

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

    setLoading(false)
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
