import React, { useState } from 'react'
import { ActionIcon, Group, TextInput } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

const AddMetadataFields = () => {
  const [formValues, setFormValues] = useState([{ field: '', value: '' }])

  const handleChange = (i, e) => {
    const newFormValues = [...formValues]

    newFormValues[i][e.target.name] = e.target.value
    setFormValues(newFormValues)
  }

  const addFormFields = () => {
    setFormValues([...formValues, { field: '', value: '' }])
  }

  const removeFormFields = i => {
    const newFormValues = [...formValues]

    newFormValues.splice(i, 1)
    setFormValues(newFormValues)
  }

  const handleSubmit = event => {
    event.preventDefault()
    alert(JSON.stringify(formValues))
  }

  return (
    <form onSubmit={handleSubmit}>
      {formValues.map((element, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Group key={index}>
          <TextInput
            label="Field"
            name="field"
            value={element.field || ''}
            onChange={e => handleChange(index, e)}
          />
          <TextInput
            label="Value"
            name="value"
            value={element.value || ''}
            onChange={e => handleChange(index, e)}
          />
          <ActionIcon color="red" onClick={() => removeFormFields(index)}>
            <IconTrash size="1.5rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      ))}
      <div className="button-section">
        <button className="button add" type="button" onClick={() => addFormFields()}>
          Add
        </button>
        <button className="button submit" type="submit">
          Submit
        </button>
      </div>
    </form>
  )
}

export default AddMetadataFields
