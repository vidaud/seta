import { useState } from 'react'
import { createStyles, Table, ScrollArea, rem, Group, ActionIcon } from '@mantine/core'
import { IconTrashX, IconCheck } from '@tabler/icons-react'

import type { TableScrollProps } from '../../types'

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

const LastJoinRequests = ({ data }: TableScrollProps) => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)

  const rows = data.map(row => (
    <tr key={row.user}>
      <td>{row.user}</td>
      <td>{row.date}</td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconCheck size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red">
            <IconTrashX size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ))

  return (
    <ScrollArea h={220} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={500}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>User</th>
            <th>Request Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default LastJoinRequests
