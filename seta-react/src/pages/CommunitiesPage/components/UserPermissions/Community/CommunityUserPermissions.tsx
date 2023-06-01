import { useEffect, useState } from 'react'
import { Table, Group, Text, ScrollArea } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useCommunityPermissionsID } from '../../../../../api/communities/user-community-permissions'
import { ComponentEmpty, ComponentError } from '../../common'
import ComponentLoading from '../../common/ComponentLoading'

const CommunityUsersPermissions = () => {
  const { id } = useParams()

  const { data, isLoading, error, refetch } = useCommunityPermissionsID(id)
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
    <tr key={item.scope}>
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

export default CommunityUsersPermissions
