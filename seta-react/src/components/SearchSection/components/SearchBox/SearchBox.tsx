import { useEffect } from 'react'
import { InputText } from 'primereact/inputtext'

import { useSearchContext } from '../../../../context/search-context'
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

export const SearchBox = () => {
  const searchContext = useSearchContext()
  const suggestionsService = new SuggestionsService()
  const ontologyListService = new OntologyListService()
  const similarService = new SimilarsService()

  useEffect(() => {
    if (String(searchContext?.term) !== '') {
      searchContext?.setListOFTerms(getListOfTerms(searchContext?.term))

      if (!searchContext?.enrichQuery) {
        searchContext?.setCopyQuery(getSelectedTerms(searchContext?.listOFTerms))
      } else {
        const currentSearch: any = getSelectedTerms(searchContext?.listOFTerms)

        if (searchContext?.selectedTypeSearch.code === 'RT') {
          updateSimilarsQuery(searchContext?.similarsList)
        }

        if (searchContext?.selectedTypeSearch.code === 'RC') {
          updateOntologiesQuery(searchContext?.ontologyListItems)
        }

        const result = currentSearch
          .concat(' OR ')
          .concat(
            searchContext?.selectedTypeSearch.code === 'RT'
              ? updateSimilarsQuery(searchContext?.similarsList)
              : updateOntologiesQuery(searchContext?.ontologyListItems)
          )

        searchContext?.setCopyQuery(result)
      }
    }
  }, [searchContext])

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

      searchContext?.setInputText(keyword[0])
      setTimeout(() => {
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
          if (!searchContext?.enrichQuery) {
            getOntologyList(keyword[0])
          }
        }, 250)
      } else if (searchContext?.selectedTypeSearch.code === 'RT') {
        setTimeout(() => {
          if (!searchContext?.enrichQuery) {
            getSimilarsList(keyword[0])
          }
        }, 250)
      }

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

  const updateSimilarsQuery = similarList => {
    if (searchContext?.selectedTypeSearch.code === 'RT') {
      if (similarList.length > 1) {
        const result = similarList.join(' AND ').split(',').join(' ')

        searchContext?.setCopyQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (similarList.length === 1 && similarList[0].length > 0) {
        const result = similarList[0].join(' OR ').split(',').join(' OR ')

        searchContext?.setCopyQuery(result)

        return result
      }
    }
  }

  const updateOntologiesQuery = ontologyList => {
    if (ontologyList.length > 1) {
      const result = ontologyList.join(' AND ').split(',').join(' ')

      searchContext?.setCopyQuery(getSelectedTerms(getListOfTerms(result)))

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

      searchContext?.setCopyQuery(result)

      return result
    }
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
