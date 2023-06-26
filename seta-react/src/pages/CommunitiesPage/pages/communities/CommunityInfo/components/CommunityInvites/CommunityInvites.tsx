import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea, rem, Title, Group } from '@mantine/core'

import { useInviteID } from '../../../../../../../api/communities/invite'
import { ComponentEmpty, ComponentError, ComponentLoading } from '../../../../../components/common'
import UpdateInviteRequest from '../../../../../components/Sidebar/InvitesList/components/UpdateInviteRequest/UpdateInviteRequest'

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
  }
}))

const CommunityInvites = ({ id }) => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = useInviteID(id)
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

  const rows = items?.map(row => (
    <tr key={row.invite_id}>
      <td>{row.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}</td>
      <td>{row.invited_user_info.full_name}</td>
      <td>{row.message.charAt(0).toUpperCase() + row?.message.slice(1)}</td>
      <td>{row.status.toUpperCase()}</td>
      <td>{new Date(row.initiated_date).toLocaleDateString()}</td>
      <td>{row.initiated_by_info.full_name}</td>
      <td>
        <Group spacing={0}>
          <UpdateInviteRequest props={row} parent="InvitesList" />
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
              <th>Community</th>
              <th>Invited User</th>
              <th>Message</th>
              <th>Status</th>
              <th>Initiated Date</th>
              <th>Initiated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default CommunityInvites
