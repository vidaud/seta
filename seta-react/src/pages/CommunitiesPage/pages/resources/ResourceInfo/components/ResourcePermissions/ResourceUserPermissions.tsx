import { useEffect, useState } from 'react'
import { Table, Group, Text, ScrollArea } from '@mantine/core'

import { useResourcePermissionsID } from '../../../../../../../api/communities/user-resource-permissions'
import { ComponentEmpty, ComponentError } from '../../../../../components/common'
import ComponentLoading from '../../../../../components/common/ComponentLoading'
import ManageResourcePermissions from '../ManageResourcePermissions/ManageResourcePermissions'

const ResourceUsersPermissions = ({ id }) => {
  const { data, isLoading, error, refetch } = useResourcePermissionsID(id)
  const [items, setItems] = useState(data)

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data, items])

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
    <ScrollArea h={150}>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Scopes</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default ResourceUsersPermissions
