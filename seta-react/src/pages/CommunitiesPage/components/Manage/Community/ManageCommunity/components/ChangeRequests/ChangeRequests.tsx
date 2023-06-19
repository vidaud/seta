import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea, rem, useMantineTheme, Badge } from '@mantine/core'
import { useParams } from 'react-router-dom'

import type { CommunityChangeRequests } from '~/api/types/change-request-types'

import { useCommunityChangeRequests } from '../../../../../../../../api/communities/community-change-requests'
import { ComponentEmpty, ComponentError, ComponentLoading } from '../../../../../common'
import { statusColors } from '../../../../../types'

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

const ChangeCommunityRequests = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { id } = useParams()
  const { data, isLoading, error, refetch } = useCommunityChangeRequests(id)
  const theme = useMantineTheme()
  const [items, setItems] = useState<CommunityChangeRequests[]>()

  useEffect(() => {
    if (data) {
      setItems(data.community_change_requests)
      console.log(data.community_change_requests)
    }
  }, [data, items])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (items?.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(row => (
    <tr key={row?.request_id}>
      <td>{row?.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}</td>
      <td>{row?.field_name.charAt(0).toUpperCase() + row?.field_name.slice(1)}</td>
      <td>{row?.old_value.charAt(0).toUpperCase() + row?.old_value.slice(1)}</td>
      <td>{row?.new_value.charAt(0).toUpperCase() + row?.new_value.slice(1)}</td>
      <td>{row?.requested_by_info?.full_name}</td>
      <td>{new Date(row?.initiated_date).toDateString()}</td>
      <td>
        <Badge
          color={statusColors[row?.status.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row?.status.toUpperCase()}
        </Badge>
      </td>
      {/* <td>
        <Group spacing={0}>
          <ActionIcon color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td> */}
    </tr>
  ))

  return (
    <ScrollArea h={200} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={500}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Community</th>
            <th>Field</th>
            <th>Old value</th>
            <th>New value</th>
            <th>Requested by</th>
            <th>Initiated Date</th>
            <th>Status</th>
            {/* <th>Reviewed Date</th> */}
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default ChangeCommunityRequests
