import { useEffect, useState } from 'react'
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Title,
  Badge,
  useMantineTheme,
  Group
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import RowActions from '~/pages/Admin/common/components/RequestRowActions/RowActions'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useUpdateInvitationRequest } from '~/api/communities/invites/invitation-requests'
import { useAllPendingInvites } from '~/api/communities/invites/invite'
import { InviteRequestStatus } from '~/types/community/invite-requests'

import { ComponentEmpty, ComponentError, ComponentLoading } from '../../common'
import ExtendedMessage from '../../communities/CommunityInfo/components/ExtendedMessage/ExtendedMessage'

const useStyles = createStyles(theme => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`
    }
  },
  scrolled: {
    boxShadow: theme.shadows.sm
  },
  title: {
    paddingBottom: theme.spacing.xl
  },
  td: {
    whiteSpace: 'nowrap',
    maxWidth: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      cursor: 'pointer'
    }
  }
}))

const InvitesList = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = useAllPendingInvites()
  const [items, setItems] = useState(data)
  const theme = useMantineTheme()
  const updateRequestMutation = useUpdateInvitationRequest()

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data])

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

  const handleApproveRequest = (invite_id: string) => {
    updateRequestMutation.mutate({
      invite_id: invite_id,
      status: InviteRequestStatus.Accepted
    })

    if (updateRequestMutation.isError) {
      notifications.show({
        message: 'The invitation request update failed!',
        color: 'red',
        autoClose: 5000
      })
    } else {
      notifications.show({
        message: 'The invitation request was approved!',
        color: 'teal',
        autoClose: 5000
      })
    }
  }

  const handleRejectRequest = (invite_id: string) => {
    updateRequestMutation.mutate({
      invite_id: invite_id,
      status: InviteRequestStatus.Rejected
    })

    if (updateRequestMutation.error) {
      notifications.show({
        title: 'Update failed!',
        message: 'The invitation request update failed. Please try again!',
        color: 'red',
        autoClose: 5000
      })
    } else {
      notifications.show({
        message: 'The invitation request was rejected!',
        color: 'yellow',
        autoClose: 5000
      })
    }
  }

  const rows = items?.map(row => (
    <tr key={row.invite_id}>
      <td>{row.invite_id}</td>
      <td>{row.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}</td>
      <td>
        <UserInfo
          username={row.invited_user_info?.user_id}
          fullName={row.invited_user_info?.full_name}
          email={row.invited_user_info?.email}
        />
      </td>
      <td className={classes.td}>
        <ExtendedMessage
          id={row.community_id}
          message={row.message.charAt(0).toUpperCase() + row.message.slice(1)}
          title="Expand Invites Message"
          type="message"
        />
      </td>
      <td>
        <Badge
          color={statusColors[row.status.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row.status}
        </Badge>
      </td>
      <td>
        <DateTimeCell dateTime={row?.initiated_date} />
      </td>
      <td>
        <UserInfo
          username={row.initiated_by_info?.user_id}
          fullName={row.initiated_by_info?.full_name}
          email={row.initiated_by_info?.email}
        />
      </td>
      <td>
        <DateTimeCell dateTime={row?.expire_date} />
      </td>
      <td>
        <Group spacing={0}>
          <RowActions
            onApprove={() => {
              handleApproveRequest?.(row.invite_id)
              refetch()
            }}
            onReject={() => {
              handleRejectRequest?.(row.invite_id)
              refetch()
            }}
          />
        </Group>
      </td>
    </tr>
  ))

  return (
    <>
      <Title className={cx(classes.title)} order={3}>
        List of Invites
      </Title>
      <ScrollArea h={220} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={500}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Invite</th>
              <th>Community</th>
              <th>Invited User</th>
              <th>Message</th>
              <th>Status</th>
              <th>Initiated Date</th>
              <th>Initiated By</th>
              <th>Expire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default InvitesList
