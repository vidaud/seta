import { useEffect, useState } from 'react'
import { createStyles, Table, rem, useMantineTheme, Badge, Select } from '@mantine/core'

import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useCommunityChangeRequests } from '~/api/communities/community-change-requests'
import type { CommunityChangeRequests } from '~/api/types/change-request-types'

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

const requestStatus = [
  { label: 'All', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Pending', value: 'pending' }
]

type Props = {
  id: string
}

const ChangeCommunityRequests = ({ id }: Props) => {
  const { classes, cx } = useStyles()
  const { data, isLoading, error, refetch } = useCommunityChangeRequests(id)
  const theme = useMantineTheme()
  const [items, setItems] = useState<CommunityChangeRequests[]>()
  const [selected, setSelected] = useState<string | null>('pending')

  useEffect(() => {
    let timeout: number | null = null

    if (data) {
      selected === 'all'
        ? setItems(data.community_change_requests)
        : setItems(data.community_change_requests?.filter(item => item?.status === selected))

      // setItems(data.community_change_requests)
      timeout = setTimeout(refetch, 1000)

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
  }, [data, selected, refetch])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data.community_change_requests?.length === 0) {
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
      <td className={classes.td}>
        <ExtendedMessage
          id={row.community_id}
          message={row.old_value.charAt(0).toUpperCase() + row.old_value.slice(1)}
          title="Expand Old Value"
          type="value"
        />
      </td>
      <td className={classes.td}>
        <ExtendedMessage
          id={row.community_id}
          message={row.new_value.charAt(0).toUpperCase() + row.new_value.slice(1)}
          title="Expand New Value"
          type="value"
        />
      </td>
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
    </tr>
  ))

  return (
    <>
      <Select
        // label="Select Status"
        name="requestStatus"
        sx={{ width: 'fit-content', float: 'right', paddingBottom: '1%' }}
        data={requestStatus}
        value={selected}
        onChange={setSelected}
      />
      <Table miw={500}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Community</th>
            <th>Field</th>
            <th>Old value</th>
            <th>New value</th>
            <th>Requested by</th>
            <th>Initiated Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  )
}

export default ChangeCommunityRequests
