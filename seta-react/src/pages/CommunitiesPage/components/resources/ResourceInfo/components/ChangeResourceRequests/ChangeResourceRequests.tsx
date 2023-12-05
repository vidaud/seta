import { useEffect, useState } from 'react'
import { Table, useMantineTheme, Badge, Select, Text } from '@mantine/core'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { usePanelNotifications } from '~/pages/CommunitiesPage/contexts/panel-context'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useResourcesChangeRequests } from '~/api/communities/resources/resource-change-requests'
import type { ResourceChangeRequests } from '~/api/types/change-request-types'

import { useStyles } from './style'

const requestStatus = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Pending', value: 'pending' }
]

const ChangeResourceRequests = ({ id }) => {
  const { classes, cx } = useStyles()
  const { data, isLoading, error, refetch } = useResourcesChangeRequests(id)
  const theme = useMantineTheme()
  const [items, setItems] = useState<ResourceChangeRequests[]>()
  const [selected, setSelected] = useState<string | null>('pending')
  const { handleNrResourcesChangeRequests } = usePanelNotifications()

  useEffect(() => {
    if (data) {
      selected === 'all' ? setItems(data) : setItems(data?.filter(item => item.status === selected))
      selected === 'all'
        ? handleNrResourcesChangeRequests(data.length)
        : handleNrResourcesChangeRequests(data?.filter(item => item.status === selected).length)
    }
  }, [data, selected, handleNrResourcesChangeRequests])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data?.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(row => (
    <tr key={row?.request_id}>
      <td>
        <Text color="dark" fw={600} size="md">
          {row?.resource_id.charAt(0).toUpperCase() + row?.resource_id.slice(1)}
        </Text>
      </td>
      <td>
        <Text>
          {row?.field_name} - {row.old_value} - {row.new_value}
        </Text>
      </td>
      <td>
        <UserInfo
          username={row.requested_by_info?.user_id}
          fullName={row.requested_by_info?.full_name}
          email={row.requested_by_info?.email}
        />
      </td>
      <td>
        <DateTimeCell dateTime={row?.initiated_date} />
      </td>
      <td>
        <Badge
          size="md"
          color={statusColors[row?.status.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row?.status.toUpperCase()}
        </Badge>
      </td>
    </tr>
  ))

  return (
    <div style={{ overflowX: 'auto', marginTop: '4% ' }}>
      <Select
        name="requestStatus"
        sx={{ width: 'fit-content', top: 0, position: 'absolute' }}
        data={requestStatus}
        value={selected}
        className={cx(classes.input)}
        onChange={setSelected}
      />
      <Table className={cx(classes.table)}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Resource</th>
            <th>Changed Property</th>
            <th>Requested by</th>
            <th>Initiated Date</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  )
}

export default ChangeResourceRequests
