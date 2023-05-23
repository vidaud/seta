import { useState } from 'react'
import { Grid, TextInput, Text, ActionIcon, Tooltip, Center } from '@mantine/core'
import { IconCirclePlus } from '@tabler/icons-react'

type Props = {
  onAddItem?(name: string, value: string): void
}

const AddItem = ({ onAddItem }: Props) => {
  const [name, setName] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [nameError, setNameError] = useState<string>('')
  const [valueError, setValueError] = useState<string>('')

  const handleClick = e => {
    e.stopPropagation()

    let hasErrors = false

    if (!name) {
      setNameError('Required')
      hasErrors = true
    }

    if (!value) {
      setValueError('Required')
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    try {
      onAddItem?.(name, value)
      setName('')
      setValue('')
    } catch (ex) {
      const error = ex as Error

      setNameError(error.message)
      setValueError(error.message)
    }
  }

  const handleNameChange = event => {
    setName(event.currentTarget.value)

    setNameError('')
    setValueError('')
  }

  const handleValueChange = event => {
    setValue(event.currentTarget.value)

    setNameError('')
    setValueError('')
  }

  return (
    <Grid gutter="xs" align="center">
      <Grid.Col span={5}>
        <TextInput
          value={name}
          onChange={handleNameChange}
          placeholder="name"
          error={nameError}
          aria-label="name"
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <Center>
          <Text span fw={700}>
            :
          </Text>
        </Center>
      </Grid.Col>
      <Grid.Col span={5}>
        <TextInput
          value={value}
          onChange={handleValueChange}
          placeholder="value"
          error={valueError}
          aria-label="value"
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <Tooltip label="Add item" withinPortal>
          <ActionIcon onClick={handleClick} color="blue">
            <IconCirclePlus size="1.5rem" stroke={2} />
          </ActionIcon>
        </Tooltip>
      </Grid.Col>
    </Grid>
  )
}

export default AddItem
