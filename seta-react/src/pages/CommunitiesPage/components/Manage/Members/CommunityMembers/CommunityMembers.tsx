import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea, rem, Title, Badge, useMantineTheme } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useMembershipID } from '../../../../../../api/communities/membership'
import ComponentLoading from '../../../common/ComponentLoading'
import { jobColors } from '../../../types'

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

const CommunityMembers = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { id } = useParams()
  const { data, isLoading } = useMembershipID(id)
  const [items, setItems] = useState(data)
  const theme = useMantineTheme()

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data, items])

  if (isLoading || !data || !items) {
    return <ComponentLoading />
  }

  const rows =
    items && items.length > 0
      ? items?.map(row => (
          <tr key={row.user_id}>
            <td>{row.user_id}</td>
            <td>
              <Badge
                color={jobColors[row.role.toLowerCase()]}
                variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
              >
                {row.role}
              </Badge>
            </td>
            <td>{row.community_id}</td>
            <td>{row.join_date.toString()}</td>
            <td>{row.status}</td>
          </tr>
        ))
      : []

  return (
    <>
      <Title className={cx(classes.title)} order={3}>
        List of Members
      </Title>
      <ScrollArea h={220} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={500}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Community</th>
              <th>Join Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default CommunityMembers
