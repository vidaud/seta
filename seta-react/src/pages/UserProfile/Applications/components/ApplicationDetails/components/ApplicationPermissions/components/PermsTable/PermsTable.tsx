import { Table, Text, clsx, Checkbox } from '@mantine/core'

import type { CategoryScopesResponse } from '~/types/catalogue/catalogue-scopes'

import * as S from './styles'

type Props = {
  catalogue?: CategoryScopesResponse[]
  selection: string[]
  toggleRow?(code: string): void
  toggleAll?(): void
}

const PermsTable = ({ catalogue, selection, toggleRow, toggleAll }: Props) => {
  const rows = catalogue?.map(item => {
    const selected = selection.includes(item.code)

    return (
      <tr
        key={item.code}
        className={clsx('scopeRow', { selected: selected, elevated: item?.elevated })}
        css={S.scopeRow}
      >
        <td>
          <Checkbox checked={selected} onChange={() => toggleRow?.(item.code)} />
        </td>
        <td>
          <Text>{item ? item.name : '-'}</Text>
          <Text fs="italic" c="dimmed">
            {item.code}
          </Text>
        </td>
        <td>
          <Text>{item ? item.description : '-'}</Text>
        </td>
      </tr>
    )
  })

  return (
    <Table verticalSpacing="xs">
      <thead>
        <tr>
          <th>
            <Checkbox
              onChange={toggleAll}
              checked={selection.length === catalogue?.length}
              // indeterminate={selection.length > 0 && selection.length !== catalogue?.length}
            />
          </th>
          <th>Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export default PermsTable
