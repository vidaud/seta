import { InputText } from 'primereact/inputtext'

import { getWordAtNthPosition } from '../../pages/SearchPage/constants'
import './style.css'

export const SearchBox = props => {
  const onUpdateSelectedTerm = e => {
    if (e.target.value !== '') {
      setTimeout(() => {
        const keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart)

        props.onChangeInput(keyword[0])
      }, 250)

      props.op.current?.show(e, e.target)
      props.onChangeTerm(e.target.value)
    }
  }

  return (
    <InputText
      type="search"
      aria-haspopup
      value={props.current_search}
      data-text={props.text_focused}
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
