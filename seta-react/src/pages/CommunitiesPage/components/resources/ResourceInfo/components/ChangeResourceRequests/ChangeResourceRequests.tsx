import { useEffect, useState } from 'react'
import { createStyles, Table, rem, useMantineTheme, Badge, Select, Text } from '@mantine/core'

import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell/DateTimeCell'
import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'
import LimitsPropertyCell from '~/pages/Admin/ResourceRequests/components/LimitsPropertyCell/LimitsPropertyCell'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'
import { statusColors } from '~/pages/CommunitiesPage/types'

import { useResourcesChangeRequests } from '~/api/communities/resources/resource-change-requests'
import type { ResourceChangeRequests } from '~/api/types/change-request-types'

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

const ChangeResourceRequests = ({ id }) => {
  const { classes, cx } = useStyles()
  const { data, isLoading, error, refetch } = useResourcesChangeRequests(id)
  const theme = useMantineTheme()
  const [items, setItems] = useState<ResourceChangeRequests[]>()
  const [selected, setSelected] = useState<string | null>('pending')

  useEffect(() => {
    if (data) {
      selected === 'all' ? setItems(data) : setItems(data?.filter(item => item.status === selected))
    }
  }, [data, selected])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data?.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(row => (
    <tr key={row?.request_id}>
      <td>
        <Text color="dark" fw={600} size="md">
          {row?.resource_id.charAt(0).toUpperCase() + row?.resource_id.slice(1)}
        </Text>
      </td>
      <td>
        <LimitsPropertyCell
          fieldName={row?.field_name}
          currentValue={row.old_value}
          newValue={row.new_value}
        />
      </td>
      <td>
        <UserInfo
          username={row.requested_by_info?.user_id}
          fullName={row.requested_by_info?.full_name}
          email={row.requested_by_info?.email}
        />
      </td>
      <td>
        <DateTimeCell dateTime={row?.initiated_date} />
      </td>
      <td>
        <Badge
          size="md"
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
        name="requestStatus"
        sx={{ width: 'fit-content', float: 'right', paddingBottom: '1%' }}
        data={requestStatus}
        value={selected}
        onChange={setSelected}
      />
      <Table miw={500}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Resource</th>
            <th>Changed Property</th>
            <th>Requested by</th>
            <th>Initiated Date</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  )
}

export default ChangeResourceRequests
