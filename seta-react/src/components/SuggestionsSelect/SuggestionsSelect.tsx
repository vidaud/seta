import { useEffect, useState } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import { isPhrase } from '../../pages/SearchPage/constants'
import { SuggestionsService } from '../../services/corpus/suggestions.service'
import './style.css'

export const SuggestionsSelect = ({ current_search, text_focused, dialog, onChangeTerm }) => {
  const [suggestionsValue, setSuggestionsValue] = useState<any>(null)
  const [suggestedTerms, setSuggestedTerms] = useState<any>(null)

  const suggestionsService = new SuggestionsService()

  useEffect(() => {
    setTimeout(() => {
      suggestionsService.retrieveSuggestions(text_focused).then(data => {
        if (data) {
          setSuggestedTerms(data)
        }
      })
    }, 1000)
  }, [suggestedTerms, suggestionsValue])

  const suggestionsTemplate = value => {
    const string = value.substr(0, value.toLowerCase().indexOf(text_focused.toLowerCase()))
    const endString = value.substr(
      value.toLowerCase().indexOf(text_focused.toLowerCase()) + text_focused.length
    )
    const highlightedText = value.substr(
      value.toLowerCase().indexOf(text_focused.toLowerCase()),
      text_focused.length
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
      value={suggestionsValue}
      className="suggestions-list"
      onChange={e => {
        setSuggestionsValue(e.value)

        if (String(current_search) !== '') {
          // Check for white space
          if (isPhrase(e.value)) {
            const result = current_search.replace(text_focused, `"${e.value}"`)

            // setTerm(result)
            onChangeTerm(result)
          } else {
            const result = current_search.replace(text_focused, e.value)

            // setTerm(result)
            onChangeTerm(result)
          }
        }

        dialog.current?.hide()
      }}
      itemTemplate={suggestionsTemplate}
      options={suggestedTerms}
    />
  )
}

export default SuggestionsSelect
