import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea, rem, Title } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useInviteID } from '../../../../../../api/communities/invite'
import ComponentLoading from '../../../common/ComponentLoading'

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

const CommunityInvites = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { id } = useParams()
  const { data, isLoading } = useInviteID(id)
  const [items, setItems] = useState(data)

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data, items])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(row => (
    <tr key={row.invite_id}>
      <td>{row.community_id}</td>
      <td>{row.invited_user}</td>
      <td>{row.message}</td>
      <td>{row.status}</td>
      <td>{row.initiated_date.toString()}</td>
      <td>{row.initiated_by}</td>
    </tr>
  ))

  return (
    <div className="page">
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
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export default CommunityInvites
