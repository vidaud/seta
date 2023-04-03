import { useEffect } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import { useSearchContext } from '../../../../context/search-context'
import { isPhrase } from '../../../../pages/SearchPage/constants'
import { SuggestionsService } from '../../../../services/corpus/suggestions.service'
import './style.css'

export const SuggestionsSelect = () => {
  const searchContext = useSearchContext()

  const suggestionsService = new SuggestionsService()

  useEffect(() => {
    setTimeout(() => {
      suggestionsService.retrieveSuggestions(searchContext?.inputText).then(data => {
        if (data) {
          searchContext?.setSuggestedTerms(data)
        }
      })
    }, 1000)
  }, [])

  const suggestionsTemplate = value => {
    const string = value.substr(
      0,
      value.toLowerCase().indexOf(searchContext?.inputText.toLowerCase())
    )
    const endString = value.substr(
      value.toLowerCase().indexOf(searchContext?.inputText.toLowerCase()) +
        searchContext?.inputText.length
    )
    const highlightedText = value.substr(
      value.toLowerCase().indexOf(searchContext?.inputText.toLowerCase()),
      searchContext?.inputText.length
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

  return (
    <SelectButton
      value={searchContext?.suggestionsValue}
      className="suggestions-list"
      onChange={e => {
        searchContext?.setSuggestionsValue(e.value)

        if (String(searchContext?.term) !== '') {
          // Check for white space
          if (isPhrase(e.value)) {
            const result = searchContext?.term.replace(searchContext?.inputText, `"${e.value}"`)

            searchContext?.setTerm(result)
          } else {
            const result = searchContext?.term.replace(searchContext?.inputText, e.value)

            searchContext?.setTerm(result)
          }
        }

        searchContext?.op.current?.hide()
      }}
      itemTemplate={suggestionsTemplate}
      options={searchContext?.suggestedTerms}
    />
  )
}

export default SuggestionsSelect
