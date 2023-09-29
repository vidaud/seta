import { useEffect, useState } from 'react'
import { Table, useMantineTheme, Badge, Select, Text } from '@mantine/core'

import ChangedPropertyCell from '~/pages/Admin/common/components/ChangedPropertyCell/ChangedPropertyCell'
import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { usePanelNotifications } from '~/pages/CommunitiesPage/contexts/panel-context'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useCommunityChangeRequests } from '~/api/communities/communities/community-change-requests'
import type { CommunityChangeRequests } from '~/api/types/change-request-types'

import { useStyles } from './style'

const requestStatus = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Pending', value: 'pending' }
]

type Props = {
  id: string
}

const ChangeCommunityRequests = ({ id }: Props) => {
  const { classes, cx } = useStyles()
  const { data, isLoading, error, refetch } = useCommunityChangeRequests(id)
  const theme = useMantineTheme()
  const [items, setItems] = useState<CommunityChangeRequests[]>()
  const [selected, setSelected] = useState<string | null>('pending')
  const { handleNrChangeRequests } = usePanelNotifications()

  useEffect(() => {
    if (data) {
      selected === 'all'
        ? setItems(data.community_change_requests)
        : setItems(data.community_change_requests?.filter(item => item?.status === selected))

      selected === 'all'
        ? handleNrChangeRequests(data.community_change_requests.length)
        : handleNrChangeRequests(
            data.community_change_requests?.filter(item => item?.status === selected).length
          )
    }
  }, [data, selected, handleNrChangeRequests])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data.community_change_requests?.length === 0) {
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
          {row?.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}
        </Text>
      </td>
      <td>
        <ChangedPropertyCell
          fieldName={row?.field_name}
          currentValue={row.old_value}
          newValue={row.new_value}
        />
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
        // label="Select Status"
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
            <th>Community</th>
            <th>Changed Property</th>
            <th>Requested by</th>
            <th>Initiated Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  )
}

export default ChangeCommunityRequests
