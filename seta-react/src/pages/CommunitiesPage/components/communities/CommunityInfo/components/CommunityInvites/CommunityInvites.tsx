import { useEffect, useState } from 'react'
import { createStyles, Table, rem, Text, Badge, useMantineTheme } from '@mantine/core'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useInviteID } from '~/api/communities/invite'

import ExtendedMessage from '../ExtendedMessage/ExtendedMessage'

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

const CommunityInvites = ({ id, type }) => {
  const { classes, cx } = useStyles()
  const perPage = 5
  const theme = useMantineTheme()
  const { data, isLoading, error, refetch } = useInviteID(id)
  const [items, setItems] = useState(type === 'container' ? data?.slice(0, perPage) : data)

  useEffect(() => {
    let timeout: number | null = null

    if (data) {
      type === 'container' ? setItems(data.slice(0, perPage)) : setItems(data)
    }

    timeout = setTimeout(refetch, 1000)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [data, refetch, type])

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
    <>
      <Table miw={500}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Community</th>
            <th>Invited User</th>
            <th>Message</th>
            <th>Status</th>
            <th>Initiated Date</th>
            <th>Initiated By</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {data.length > perPage && type === 'container' ? (
        <Text color="gray.5" size="sm" sx={{ float: 'right' }}>
          Expand to see full list ...
        </Text>
      ) : null}
    </>
  )
}

export default CommunityInvites
