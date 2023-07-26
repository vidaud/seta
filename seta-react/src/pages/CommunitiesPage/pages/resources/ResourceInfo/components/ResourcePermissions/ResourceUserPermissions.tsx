import { useEffect, useState } from 'react'
import { Table, Group, Text } from '@mantine/core'

import { useResourcePermissionsID } from '../../../../../../../api/communities/user-resource-permissions'
import { ComponentEmpty, ComponentError } from '../../../../common'
import ComponentLoading from '../../../../common/ComponentLoading'
import ManageResourcePermissions from '../ManageResourcePermissions/ManageResourcePermissions'

const ResourceUsersPermissions = ({ id, type }) => {
  const perPage = 1
  const { data, isLoading, error, refetch } = useResourcePermissionsID(id)
  const [items, setItems] = useState(type === 'container' ? data?.slice(0, perPage) : data)

  useEffect(() => {
    if (data) {
      type === 'container' ? setItems(data.slice(0, perPage)) : setItems(data)
    }
  }, [data, type])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(item => (
    <tr key={item.user_id}>
      <td>
        <Group spacing="sm">
          <Text fz="sm">{item.user_info.full_name}</Text>
        </Group>
      </td>
      <td>
        <ManageResourcePermissions props={item} id={id} />
      </td>
    </tr>
  ))

  return (
    <>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Scopes</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {data.length > perPage && type === 'container' ? (
        <Text color="gray.5" size="sm" sx={{ float: 'right' }}>
          Expand to see full list ...
        </Text>
      ) : null}
    </>
  )
}

export default ResourceUsersPermissions
