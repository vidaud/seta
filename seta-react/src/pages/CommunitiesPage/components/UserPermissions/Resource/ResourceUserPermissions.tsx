import { useEffect, useState } from 'react'
import { Table, Group, Text, ScrollArea } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useResourcePermissionsID } from '../../../../../api/communities/user-permissions'
import ComponentLoading from '../../common/ComponentLoading'

const ResourceUsersPermissions = () => {
  const { resourceId } = useParams()

  const { data, isLoading } = useResourcePermissionsID(resourceId)
  const [items, setItems] = useState(data)

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data, items])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(item => (
    <tr key={item.user_id}>
      <td>
        <Group spacing="sm">
          <Text fz="sm" fw={500}>
            {item.user_id}
          </Text>
        </Group>
      </td>
      <td>
        <Text fz="sm" c="dimmed">
          {item.scope}
        </Text>
      </td>
    </tr>
  ))

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Scope</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default ResourceUsersPermissions
