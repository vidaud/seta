import { Box, Checkbox, Table, Text, clsx } from '@mantine/core'

import { SuggestionsEmpty } from '~/pages/SearchPageNew/components/common'

import type { CategoryScopesResponse } from '~/types/catalogue/catalogue-scopes'

import * as S from './styles'

type Props = {
  selection: string[]
  catalogue?: CategoryScopesResponse[]
  toggleRow?(code: string): void
  toggleAll?(): void
}

const SystemPermsTable = ({ selection, catalogue, toggleRow, toggleAll }: Props) => {
  if (!catalogue || catalogue.length === 0) {
    return <SuggestionsEmpty message="Scopes catalogue is empty!" />
  }

  const rows = catalogue.map(item => {
    const selected = selection.includes(item.code)

    return (
      <tr
        css={S.scopeRow}
        key={item.code}
        className={clsx('scopeRow', { selected: selected, elevated: item.elevated })}
      >
        <td>
          <Checkbox checked={selected} onChange={() => toggleRow?.(item.code)} />
        </td>
        <td>
          <Text>{item.name}</Text>
          <Text fs="italic" c="dimmed">
            {item.code}
          </Text>
        </td>
        <td>
          <Text>{item.description}</Text>
        </td>
      </tr>
    )
  })

  return (
    <Box>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === catalogue.length}
                indeterminate={selection.length > 0 && selection.length !== catalogue.length}
              />
            </th>
            <th>Scope</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  )
}

export default SystemPermsTable
