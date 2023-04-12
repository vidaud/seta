import { useContext } from 'react'
import './style.css'
import { Dropdown } from 'primereact/dropdown'

import { SearchContext, useSearchContext } from '../../../../context/search-context'
import { transformOntologyList, typeOfSearches } from '../../../../pages/SearchPage/constants'
import { OntologyListService } from '../../../../services/corpus/ontology-list.service'
import { SimilarsService } from '../../../../services/corpus/similars.service'
import { SuggestionsService } from '../../../../services/corpus/suggestions.service'
import type Search from '../../../../types/search'

export const SearchTypeDropdown = () => {
  const searchContext = useSearchContext()
  const suggestionsService = new SuggestionsService()
  const ontologyListService = new OntologyListService()
  const similarService = new SimilarsService()
  const {
    inputText,
    selectedTypeSearch,
    setSimilarTerms,
    setSuggestedTerms,
    callService,
    setOntologyList,
    setSelectedTypeSearch,
    setLoading
  } = useContext(SearchContext) as Search

  const onChangeOption = (e: { value }) => {
    setSelectedTypeSearch(e.value)
    callService(e.value.code)
  }

  searchContext.callService = code => {
    suggestionsService.retrieveSuggestions(inputText).then(data => {
      if (data) {
        setSuggestedTerms(data)
      }
    })

    if (code === 'RC') {
      setTimeout(() => {
        setLoading(true)
        ontologyListService.retrieveOntologyList(inputText).then(data => {
          if (data) {
            setOntologyList(transformOntologyList(data))
          }
        })
      }, 250)
    } else if (code === 'RT') {
      similarService.retrieveSimilars(inputText).then(data => {
        if (data) {
          if (data.length > 0) {
            const list: string[] = []

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
  }

  return (
    <Dropdown
      value={selectedTypeSearch}
      options={typeOfSearches}
      onChange={onChangeOption}
      optionLabel="name"
    />
  )
}

export default SearchTypeDropdown
