import { InputText } from 'primereact/inputtext'

import { useSearchContext } from '../../../../context/search-context'
import { getWordAtNthPosition } from '../../../../pages/SearchPage/constants'
import './style.css'

export const SearchBox = () => {
  const searchContext = useSearchContext()

  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      setTimeout(() => {
        const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

        searchContext?.setInputText(keyword[0])
      }, 250)

      searchContext?.op.current?.show(e, e.target)
      searchContext?.setTerm(e.target.value)
    }
  }

  return (
    <InputText
      type="search"
      aria-haspopup
      value={searchContext?.term}
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
