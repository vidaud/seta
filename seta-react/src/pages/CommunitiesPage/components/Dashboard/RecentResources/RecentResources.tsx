import { useState } from 'react'
import { createStyles, Table, ScrollArea, rem, Badge } from '@mantine/core'

import type { TableResourceProps } from '../../types'

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

const RecentResources = ({ data }: TableResourceProps) => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)

  const rows = data.map(row => (
    <tr key={row.title}>
      <td>{row.title}</td>
      <td>{row.description}</td>
      <td>{row.membership}</td>
      <td>
        {Math.random() > 0.5 ? (
          <Badge fullWidth>Active</Badge>
        ) : (
          <Badge color="gray" fullWidth>
            Blocked
          </Badge>
        )}
      </td>
      <td>{row.createdAt}</td>
      <td>{row.createdBy}</td>
    </tr>
  ))

  return (
    <ScrollArea h={280} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={500}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Membership</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default RecentResources
