import { useEffect, useState } from 'react'
import { Table, Group, Text, ScrollArea } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useResourcePermissionsID } from '../../../../../api/communities/user-resource-permissions'
import { ComponentEmpty, ComponentError } from '../../common'
import ComponentLoading from '../../common/ComponentLoading'
import ManageResourcePermissions from '../../Manage/Resource/ViewMyResource/components/ManageResourcePermissions/ManageResourcePermissions'

const ResourceUsersPermissions = () => {
  const { resourceId } = useParams()

  const { data, isLoading, error, refetch } = useResourcePermissionsID(resourceId)
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
        {item.scopes
          .filter((element, index) => {
            return item.scopes.indexOf(element) === index
          })
          .map(scope => (
            <Text key={scope} fz="sm" c="dimmed">
              {scope}
            </Text>
          ))}
      </td>
      <td>
        <td>
          <ManageResourcePermissions props={item} />
        </td>
      </td>
    </tr>
  ))

  return (
    <ScrollArea>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Scopes</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default ResourceUsersPermissions
