import { Group, Table, Badge, Text } from '@mantine/core'

type Props = {
  fieldName?: string
  newValue?: string
  currentValue?: string
}

type Limits = {
  total_files_no?: number
  total_storage_mb?: number
  file_size_mb?: number
}

const LimitsPropertyCell = ({ fieldName, newValue, currentValue }: Props) => {
  let currentObj: Limits | undefined = undefined
  let newObj: Limits | undefined = undefined

  if (currentValue) {
    currentObj = JSON.parse(currentValue)
  }

  if (newValue) {
    newObj = JSON.parse(newValue)
  }

  const textNewValue = (cVal?: number, newVal?: number) => {
    const fw = cVal === newVal ? 500 : 700
    const color = cVal === newVal ? 'daark' : 'yellow'

    return (
      <Text fw={fw} c={color}>
        {newVal}
      </Text>
    )
  }

  return (
    <Group align="flex-start">
      <Table>
        <thead>
          <tr>
            <th>
              <Badge color="dark.3" radius="sm" size="lg">
                {fieldName}
              </Badge>
            </th>
            <th>Current</th>
            <th>New</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total documents in source</td>
            <td>{currentObj?.total_files_no}</td>
            <td>{textNewValue(currentObj?.total_files_no, newObj?.total_files_no)}</td>
          </tr>
          <tr>
            <td>Total storage for source (MB)</td>
            <td>{currentObj?.total_storage_mb}</td>
            <td>{textNewValue(currentObj?.total_storage_mb, newObj?.total_storage_mb)}</td>
          </tr>
          <tr>
            <td>Max size per file (MB)</td>
            <td>{currentObj?.file_size_mb}</td>
            <td>{textNewValue(currentObj?.file_size_mb, newObj?.file_size_mb)}</td>
          </tr>
        </tbody>
      </Table>
    </Group>
  )
}

export default LimitsPropertyCell
