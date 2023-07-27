import { useState } from 'react'
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Title,
  Badge,
  Group,
  useMantineTheme
} from '@mantine/core'

import { useMembershipRequests } from '~/api/communities/membership-requests'

import { ComponentEmpty, ComponentLoading } from '../../common'
import UpdateMemberRequest from '../../communities/CommunityInfo/components/UpdateMemberRequest'
import { statusColors } from '../../types'

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

const MembersList = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { data, refetch } = useMembershipRequests()
  const theme = useMantineTheme()

  if (data) {
    if (data.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (!data) {
    return <ComponentLoading />
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
            <td>{row.message.charAt(0).toUpperCase() + row?.message.slice(1)}</td>
            <td>{new Date(row.initiated_date).toDateString()}</td>
            <td>{row.requested_by_info?.full_name}</td>
            <td>{row.review_date ? new Date(row.review_date).toDateString() : null}</td>
            <td>{row.reviewed_by_info?.full_name}</td>
            <td>
              <Group spacing={0}>
                <UpdateMemberRequest props={row} refetch={refetch} />
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
      <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={500}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
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
      </ScrollArea>
    </>
  )
}

export default MembersList
