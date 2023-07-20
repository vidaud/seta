import { useEffect, useState } from 'react'
import { createStyles, Table, ScrollArea, rem, useMantineTheme, Badge } from '@mantine/core'

import type { ResourceChangeRequests } from '~/api/types/change-request-types'

import UpdateResourceChangeRequest from './UpdateResourceChangeRequest/UpdateResourceChangeRequest'

import { usePendingChangeRequests } from '../../../../../api/communities/resource-change-requests'
import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '../../../../CommunitiesPage/components/common'
import { statusColors } from '../../../../CommunitiesPage/pages/types'

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

const PendingResourceRequests = () => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = usePendingChangeRequests()
  const theme = useMantineTheme()
  const [items, setItems] = useState<ResourceChangeRequests[]>([])

  useEffect(() => {
    let timeout: number | null = null

    if (data) {
      setItems(data)
      timeout = setTimeout(refetch, 1000)

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
  }, [data, refetch])

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
      <td>{row?.resource_id}</td>
      <td>{row?.field_name}</td>
      <td>{row?.old_value}</td>
      <td>{row?.new_value}</td>
      <td>{row?.requested_by_info.full_name}</td>
      <td>{new Date(row?.initiated_date).toDateString()}</td>
      <td>
        <Badge
          color={statusColors[row?.status.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row?.status.toUpperCase()}
        </Badge>
      </td>
      <td>
        <UpdateResourceChangeRequest props={row} refetch={refetch} />
      </td>
    </tr>
  ))

  return (
    <ScrollArea h={200} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={500}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Resource</th>
            <th>Field</th>
            <th>Old value</th>
            <th>New value</th>
            <th>Requested by</th>
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

export default PendingResourceRequests
