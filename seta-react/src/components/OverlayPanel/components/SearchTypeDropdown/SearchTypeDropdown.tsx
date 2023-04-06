import './style.css'
import { Dropdown } from 'primereact/dropdown'

import { useSearchContext } from '../../../../context/search-context'
import { transformOntologyList, typeOfSearches } from '../../../../pages/SearchPage/constants'
import { OntologyListService } from '../../../../services/corpus/ontology-list.service'
import { SimilarsService } from '../../../../services/corpus/similars.service'
import { SuggestionsService } from '../../../../services/corpus/suggestions.service'

export const SearchTypeDropdown = () => {
  const searchContext = useSearchContext()
  const suggestionsService = new SuggestionsService()
  const ontologyListService = new OntologyListService()
  const similarService = new SimilarsService()

  const onChangeOption = (e: { value }) => {
    searchContext?.setSelectedTypeSearch(e.value)
    searchContext?.callService(e.value.code)
  }

  searchContext.callService = code => {
    suggestionsService.retrieveSuggestions(searchContext?.inputText).then(data => {
      if (data) {
        searchContext?.setSuggestedTerms(data)
      }
    })

    if (code === 'RC') {
      setTimeout(() => {
        ontologyListService.retrieveOntologyList(searchContext?.inputText).then(data => {
          if (data) {
            searchContext?.setOntologyList(transformOntologyList(data))
          }
        })
      }, 250)
    } else if (code === 'RT') {
      similarService.retrieveSimilars(searchContext?.inputText).then(data => {
        if (data) {
          if (data.length > 0) {
            const list: any = []

            if (data && data.length > 0) {
              data.forEach(element => {
                list.push(element.similar_word)
              })

              searchContext?.setSimilarTerms(list)
            }
          }
        }
      })
    }
  }

  return (
    <Dropdown
      value={searchContext?.selectedTypeSearch}
      options={typeOfSearches}
      onChange={onChangeOption}
      optionLabel="name"
    />
  )
}

export default SearchTypeDropdown
