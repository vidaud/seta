import { useState } from 'react'
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Badge,
  useMantineTheme,
  Group,
  ActionIcon
} from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'

import type { TableScrollAreaProps } from '../../types'
import { jobColors } from '../../types'

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

const ChangeRequests = ({ data }: TableScrollAreaProps) => {
  const { classes, cx } = useStyles()
  const [scrolled, setScrolled] = useState(false)
  const theme = useMantineTheme()

  const rows = data.map(row => (
    <tr key={row.user}>
      <td>{row.user}</td>
      <td>{row.date}</td>
      <td>
        <Badge
          color={jobColors[row.role.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {row.role}
        </Badge>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red">
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ))

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={500}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>User</th>
            <th>Request Date</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default ChangeRequests
