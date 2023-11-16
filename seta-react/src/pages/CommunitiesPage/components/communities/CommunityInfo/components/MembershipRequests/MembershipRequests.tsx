import { useEffect, useState } from 'react'
import { Table, Badge, useMantineTheme, Group, Text } from '@mantine/core'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import RowActions from '~/pages/Admin/common/components/RequestRowActions/RowActions'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { usePanelNotifications } from '~/pages/CommunitiesPage/contexts/panel-context'
import { statusColors } from '~/pages/CommunitiesPage/types'

import {
  useMembershipRequestsByID,
  useUpdateMembershipRequest
} from '~/api/communities/memberships/membership-requests'
import type { MembershipRequest } from '~/api/types/membership-types'
import { MembershipRequestStatus } from '~/types/community/membership-requests'
import { notifications } from '~/utils/notifications'

import { useStyles } from './style'

import ExtendedMessage from '../ExtendedMessage/ExtendedMessage'

const MembershipRequests = ({ id, type }) => {
  const { classes, cx } = useStyles()
  const { data, isLoading, error, refetch } = useMembershipRequestsByID(id)

  const [items, setItems] = useState<MembershipRequest[] | undefined[]>([])
  const theme = useMantineTheme()
  const perPage = 5
  const updateRequestMutation = useUpdateMembershipRequest()
  const { handleNrMembershipRequests } = usePanelNotifications()

  useEffect(() => {
    if (data) {
      type === 'container' ? setItems(data.slice(0, perPage)) : setItems(data)

      type === 'container'
        ? handleNrMembershipRequests(data.slice(0, perPage).length)
        : handleNrMembershipRequests(data.length)
    }
  }, [data, type, handleNrMembershipRequests])

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

  const handleApproveRequest = (community_id: string, user_id: string) => {
    updateRequestMutation.mutate({
      community_id: community_id,
      user_id: user_id,
      status: MembershipRequestStatus.Approved
    })

    if (updateRequestMutation.isError) {
      notifications.showError('The membership request update failed!', { autoClose: true })
    } else {
      notifications.showSuccess('The membership request was approved!', { autoClose: true })
    }
  }

  const handleRejectRequest = (community_id: string, user_id: string) => {
    updateRequestMutation.mutate({
      community_id: community_id,
      user_id: user_id,
      status: MembershipRequestStatus.Rejected
    })

    if (updateRequestMutation.error) {
      notifications.showError('Update failed!', {
        description: 'The membership request update failed. Please try again!',
        autoClose: true
      })
    } else {
      notifications.showInfo('The membership request was rejected!', { autoClose: true })
    }
  }

  const rows = items?.map(row => (
    <tr key={row.community_id}>
      <td>
        <UserInfo
          username={row.requested_by_info?.user_id}
          fullName={row.requested_by_info?.full_name}
          email={row.requested_by_info?.email}
        />
      </td>
      <td className={classes.td}>
        <ExtendedMessage
          id={row.community_id}
          message={row.message.charAt(0).toUpperCase() + row.message.slice(1)}
          title="Expand Membership Message"
          type="message"
        />
      </td>
      <td>
        <DateTimeCell dateTime={row?.initiated_date} />
      </td>
      <td>
        <Badge
          color={statusColors[row.status.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row.status.toUpperCase()}
        </Badge>
      </td>
      <td>
        <Group spacing={0}>
          <RowActions
            onApprove={() => {
              handleApproveRequest?.(row.community_id, row.requested_by)
            }}
            onReject={() => {
              handleRejectRequest?.(row.community_id, row.requested_by)
            }}
          />
        </Group>
      </td>
    </tr>
  ))

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table className={cx(classes.table)}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Requested By</th>
            <th>Message</th>
            <th>Initiated Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {data.length > perPage && type === 'container' ? (
        <Text color="gray.5" size="sm" sx={{ float: 'right' }}>
          Expand to see full list ...
        </Text>
      ) : null}
    </div>
  )
}

export default MembershipRequests
