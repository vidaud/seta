import { createStyles, Table, rem, Title, Badge, Group, useMantineTheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import RowActions from '~/pages/Admin/common/components/RequestRowActions/RowActions'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import { statusColors } from '~/pages/CommunitiesPage/types'

import {
  useMembershipRequests,
  useUpdateMembershipRequest
} from '~/api/communities/memberships/membership-requests'
import { MembershipRequestStatus } from '~/types/community/membership-requests'

import { ComponentEmpty, ComponentLoading } from '../../common'
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

const MembersList = () => {
  const { classes, cx } = useStyles()
  const { data } = useMembershipRequests()
  const theme = useMantineTheme()
  const updateRequestMutation = useUpdateMembershipRequest()

  if (data) {
    if (data.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (!data) {
    return <ComponentLoading />
  }

  const handleApproveRequest = (community_id: string, user_id: string) => {
    updateRequestMutation.mutate({
      community_id: community_id,
      user_id: user_id,
      status: MembershipRequestStatus.Approved
    })

    if (updateRequestMutation.isError) {
      notifications.show({
        message: 'The membership request update failed!',
        color: 'red',
        autoClose: 5000
      })
    } else {
      notifications.show({
        message: 'The membership request was approved!',
        color: 'teal',
        autoClose: 5000
      })
    }
  }

  const handleRejectRequest = (community_id: string, user_id: string) => {
    updateRequestMutation.mutate({
      community_id: community_id,
      user_id: user_id,
      status: MembershipRequestStatus.Rejected
    })

    if (updateRequestMutation.error) {
      notifications.show({
        title: 'Update failed!',
        message: 'The membership request update failed. Please try again!',
        color: 'red',
        autoClose: 5000
      })
    } else {
      notifications.show({
        message: 'The membership request was rejected!',
        color: 'yellow',
        autoClose: 5000
      })
    }
  }

  const rows =
    data && data?.length > 0
      ? data?.map(row => (
          <tr key={row.community_id}>
            <td>{row.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}</td>
            <td>
              <Badge
                color={statusColors[row.status.toLowerCase()]}
                variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
              >
                {row.status.toUpperCase()}
              </Badge>
            </td>
            <td className={classes.td}>
              <ExtendedMessage
                id={row.community_id}
                message={row.message.charAt(0).toUpperCase() + row.message.slice(1)}
                title="Expand Members Message"
                type="message"
              />
            </td>
            <td>
              <DateTimeCell dateTime={row?.initiated_date} />
            </td>

            <td>
              <UserInfo
                username={row.requested_by_info?.user_id}
                fullName={row.requested_by_info?.full_name}
                email={row.requested_by_info?.email}
              />
            </td>
            <td>{row.review_date ? new Date(row.review_date).toDateString() : null}</td>
            <td>{row.reviewed_by_info?.full_name}</td>
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
      : []

  return (
    <>
      <Title className={cx(classes.title)} order={3}>
        List of Members
      </Title>
      <Table miw={500}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Community</th>
            <th>Status</th>
            <th>Message</th>
            <th>Initiated Date</th>
            <th>Requested By</th>
            <th>Review Date</th>
            <th>Reviewed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  )
}

export default MembersList
