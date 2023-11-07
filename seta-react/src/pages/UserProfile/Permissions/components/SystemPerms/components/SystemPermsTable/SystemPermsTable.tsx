import { Table, Text, clsx } from '@mantine/core'

import type { SystemScope } from '~/types/admin/scopes'
import type { CategoryScopesResponse } from '~/types/catalogue/catalogue-scopes'

import * as S from './styles'

type Props = {
  scopes?: SystemScope[]
  catalogue?: CategoryScopesResponse[]
}

const SystemPermsTable = ({ scopes, catalogue }: Props) => {
  const rows = scopes?.map(scope => {
    const catalogueItem = catalogue?.find(c => c.code === scope.scope)

    return (
      <tr
        key={scope.area}
        className={clsx('scopeRow', { elevated: catalogueItem?.elevated })}
        css={S.scopeRow}
      >
        <td>
          <Text>{catalogueItem ? catalogueItem.name : '-'}</Text>
          <Text fs="italic" c="dimmed">
            {scope.scope}
          </Text>
        </td>
        <td>
          <Text>{catalogueItem ? catalogueItem.description : '-'}</Text>
        </td>
      </tr>
    )
  })

  return (
    <Table verticalSpacing="xs">
      <thead>
        <tr>
          <th>Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export default SystemPermsTable
