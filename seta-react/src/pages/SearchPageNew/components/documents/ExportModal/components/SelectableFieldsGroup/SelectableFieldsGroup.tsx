import { useMemo } from 'react'
import { Stack, Text } from '@mantine/core'

import type { ExportField } from '~/types/library/library-export'

import SelectableField from '../SelectableField'

type Props = {
  fields: ExportField[]
  selected: ExportField[]
  onSelect: (selected: ExportField[]) => void
}

const SelectableFieldsGroup = ({ fields, selected, onSelect }: Props) => {
  const selectedValues = useMemo(() => selected.map(({ name }) => name), [selected])

  const allSelected = fields.length === selected.length

  const handleItemChange = (field: ExportField, value: boolean) => {
    const newSelected = value
      ? [...selected, field]
      : selected.filter(({ name }) => name !== field.name)

    onSelect(newSelected)
  }

  return (
    <div>
      {fields.map(field => (
        <SelectableField
          key={field.name}
          field={field}
          selected={selectedValues.includes(field.name)}
          onChange={value => handleItemChange(field, value)}
        />
      ))}

      {allSelected && (
        <Stack spacing="xs" align="center" mt="md">
          <Text>No more fields to show here.</Text>

          <Text size="sm" color="dimmed">
            All the available fields are selected for export.
          </Text>
        </Stack>
      )}
    </div>
  )
}

export default SelectableFieldsGroup
