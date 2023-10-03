import { useEffect, useState } from 'react'
import { Table, Text, Badge, useMantineTheme } from '@mantine/core'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { usePanelNotifications } from '~/pages/CommunitiesPage/contexts/panel-context'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useInviteID } from '~/api/communities/invites/invite'

import { useStyles } from './style'

import ExtendedMessage from '../ExtendedMessage/ExtendedMessage'

const CommunityInvites = ({ id, type }) => {
  const { classes, cx } = useStyles()
  const perPage = 5
  const theme = useMantineTheme()
  const { data, isLoading, error, refetch } = useInviteID(id)
  const [items, setItems] = useState(type === 'container' ? data?.slice(0, perPage) : data)
  const { handleNrInvites } = usePanelNotifications()

  useEffect(() => {
    if (data) {
      type === 'container' ? setItems(data.slice(0, perPage)) : setItems(data)
      type === 'container'
        ? handleNrInvites(data.slice(0, perPage).length)
        : handleNrInvites(data.length)
    }
  }, [data, type, handleNrInvites])

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

  const rows = items?.map(row => (
    <tr key={row.invite_id}>
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
          title="Expand Invite Message"
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
    </tr>
  ))

  return (
    <div style={{ overflowX: 'auto', marginTop: '4%' }}>
      <Table className={cx(classes.table)}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Community</th>
            <th>Invited User</th>
            <th>Message</th>
            <th>Status</th>
            <th>Initiated Date</th>
            <th>Initiated By</th>
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

export default CommunityInvites
