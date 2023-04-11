import { useState, useContext } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import { SearchContext } from '../../../../context/search-context'
import { isPhrase } from '../../../../pages/SearchPage/constants'
import './style.css'
import type Search from '../../../../types/search'

export const SuggestionsSelect = () => {
  const { op, inputText, term, setTerm, suggestedTerms } = useContext(SearchContext) as Search
  const [suggestionsValue, setSuggestionsValue] = useState(null)

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

  return (
    <SelectButton
      value={suggestionsValue}
      className="suggestions-list"
      onChange={e => {
        setSuggestionsValue(e.value)

        if (String(term) !== '') {
          // Check for white space
          if (isPhrase(e.value)) {
            const result = String(term).replace(inputText, `"${e.value}"`)

            setTerm(result)
          } else {
            const result = String(term).replace(inputText, e.value)

            setTerm(result)
          }
        }

        op.current?.hide()
      }}
      itemTemplate={suggestionsTemplate}
      options={suggestedTerms}
    />
  )
}

export default SuggestionsSelect
