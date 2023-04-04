import { InputText } from 'primereact/inputtext'

import { useSearchContext } from '../../../../context/search-context'
import { getWordAtNthPosition, transformOntologyList } from '../../../../pages/SearchPage/constants'
import './style.css'
import { OntologyListService } from '../../../../services/corpus/ontology-list.service'
import { SimilarsService } from '../../../../services/corpus/similars.service'
import { SuggestionsService } from '../../../../services/corpus/suggestions.service'

export const SearchBox = () => {
  const searchContext = useSearchContext()
  const suggestionsService = new SuggestionsService()
  const ontologyListService = new OntologyListService()
  const similarService = new SimilarsService()

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      setTimeout(() => {
        const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

        searchContext?.setInputText(keyword[0])

        if (!searchContext?.enrichQuery) {
          suggestionsService.retrieveSuggestions(keyword[0]).then(data => {
            if (data) {
              searchContext?.setSuggestedTerms(data)
            }
          })
        }
      }, 250)

      if (searchContext?.selectedTypeSearch.code === 'RC') {
        setTimeout(() => {
          const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

          searchContext?.setInputText(keyword[0])

          if (!searchContext?.enrichQuery) {
            getOntologyList(keyword[0])
          }
        }, 250)

        searchContext?.op.current?.show(e, e.target)
        searchContext?.setTerm(e.target.value)
      }
    } else if (searchContext?.selectedTypeSearch.code === 'RT') {
      setTimeout(() => {
        const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

        searchContext?.setInputText(keyword[0])

        if (!searchContext?.enrichQuery) {
          getSimilarsList(keyword[0])
        }
      }, 250)

      searchContext?.op.current?.show(e, e.target)
      searchContext?.setTerm(e.target.value)
    } else {
      searchContext?.setTerm(e.target.value)
      searchContext?.setSuggestedTerms([])
      searchContext?.setOntologyList([])
      searchContext?.setSimilarTerms([])
    }
  }

  const getOntologyList = lastKeyword => {
    ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
      if (data) {
        searchContext?.setOntologyList(transformOntologyList(data))
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

            searchContext?.setSimilarTerms(list)
          }
        }
      }
    })
  }

  return (
    <InputText
      type="search"
      aria-haspopup
      value={String(searchContext?.term)}
      data-text={searchContext?.inputText}
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
