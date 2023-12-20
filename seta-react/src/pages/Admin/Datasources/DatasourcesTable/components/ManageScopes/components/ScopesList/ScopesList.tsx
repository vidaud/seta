import { Table } from '@mantine/core'

import type { DatasourceScopes } from '~/api/types/datasource-types'

type Props = {
  scopes: DatasourceScopes[]
}

const ScopesList = ({ scopes }: Props) => {
  const rows = scopes?.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td>{item.user?.fullName}</td>
      <td>{item.scope}</td>
    </tr>
  ))

  return (
    <Table striped>
      <thead>
        <tr>
          <td>User</td>
          <td>Scope</td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export default ScopesList
