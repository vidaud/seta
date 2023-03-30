import { useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import './style.css'

const TextareaInput = ({ onChange }) => {
  const [text, setText] = useState('')

  const onChangeValue = e => {
    setText(e.target.value)
    onChange(text)
  }

  return (
    <div>
      <InputTextarea
        placeholder="Paste text here ..."
        value={text}
        onChange={onChangeValue}
        rows={5}
      />
    </div>
  )
}

export default TextareaInput
