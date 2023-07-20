import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea, rem, Badge, useMantineTheme, Group } from '@mantine/core'

import type { MembershipRequest } from '~/api/types/membership-types'

import { useMembershipRequestsID } from '../../../../../../../api/communities/membership-requests'
import { ComponentEmpty, ComponentError, ComponentLoading } from '../../../../../components/common'
import { statusColors } from '../../../../types'
import UpdateMemberRequest from '../UpdateMemberRequest/UpdateMemberRequest'

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
  }
}))

const MembershipRequests = ({ id, onChange }) => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = useMembershipRequestsID(id)
  const [items, setItems] = useState<MembershipRequest[] | undefined[]>([])
  const theme = useMantineTheme()

  useEffect(() => {
    let timeout: number | null = null

    if (data) {
      setItems(data)
      onChange(data.length)
      timeout = setTimeout(refetch, 1000)

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
  }, [data, onChange, refetch])

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
    <tr key={row.community_id}>
      <td>{row.requested_by_info.full_name}</td>
      <td>{row.message.charAt(0).toUpperCase() + row.message.slice(1)}</td>
      <td>{new Date(row?.initiated_date).toDateString()}</td>
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
          <UpdateMemberRequest props={row} refetch={refetch} />
          {/* <ActionIcon color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon> */}
        </Group>
      </td>
    </tr>
  ))

  return (
    <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={500}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
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
    </ScrollArea>
  )
}

export default MembershipRequests
