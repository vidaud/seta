import { Group, Table, Badge } from '@mantine/core'

type Props = {
  fieldName?: string
  value?: string
}

type Limits = {
  total_files_no?: number
  total_storage_mb?: number
  file_size_mb?: number
}

const LimitsOriginalCell = ({ fieldName, value }: Props) => {
  let currentObj: Limits | undefined = undefined

  if (value) {
    currentObj = JSON.parse(value)
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
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total documents in source</td>
            <td>{currentObj?.total_files_no}</td>
          </tr>
          <tr>
            <td>Total storage for source (MB)</td>
            <td>{currentObj?.total_storage_mb}</td>
          </tr>
          <tr>
            <td>Max size per file (MB)</td>
            <td>{currentObj?.file_size_mb}</td>
          </tr>
        </tbody>
      </Table>
    </Group>
  )
}

export default LimitsOriginalCell
