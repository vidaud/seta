import { useState } from 'react'
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  rem,
  TextInput,
  Group,
  ActionIcon,
  Menu
} from '@mantine/core'
import {
  IconDots,
  IconPencil,
  IconSearch,
  IconTrash,
  IconEye,
  IconSettings
} from '@tabler/icons-react'

import type { RowData, TableSortProps } from '../../types'
import { Th, sortData } from '../../utils'
import DeleteCommunity from '../DeleteCommunityButton/DeleteCommunityButton'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles(theme => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0]
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    marginTop: '30px',

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

const MyCommunityList = ({ data }: TableSortProps) => {
  const { classes, cx } = useStyles()
  const [selection, setSelection] = useState(['1'])
  const [search, setSearch] = useState('')
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false

    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }))
  }

  const toggleRow = (id: string) =>
    setSelection(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    )
  const toggleAll = () =>
    setSelection(current => (current.length === data.length ? [] : data.map(item => item.id)))

  const rows = sortedData.map(item => {
    const selected = selection.includes(item.id)

    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        <td>{item.id}</td>
        <td>{item.title}</td>
        <td>{item.description}</td>
        <td>{item.data_type}</td>
        <td>{item.membership}</td>
        <td>{item.status}</td>
        <td>
          <Group spacing={0} position="right">
            <InviteMember />
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="bottom-end"
              withinPortal
            >
              <Menu.Target>
                <ActionIcon>
                  <IconDots size="1rem" stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconPencil size="1rem" stroke={1.5} />}
                  component="a"
                  href="http://localhost/communities/communityname"
                >
                  Update
                </Menu.Item>
                <Menu.Item
                  icon={<IconSettings size="1rem" stroke={1.5} />}
                  component="a"
                  href="http://localhost/communities/communitymanage"
                >
                  Manage
                </Menu.Item>
                <Menu.Item
                  icon={<IconEye size="1rem" stroke={1.5} />}
                  component="a"
                  href="http://localhost/communities/communitydetails"
                >
                  View Details
                </Menu.Item>
                <Menu.Item icon={<IconTrash size="1rem" stroke={1.5} />} color="red">
                  Delete Community
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </td>
      </tr>
    )
  })

  return (
    <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Group display={selection.length > 1 ? 'block' : 'none'}>
        <DeleteCommunity />
      </Group>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: 'fixed' }}
        className={cx(classes.header, { [classes.scrolled]: scrolled })}
      >
        <thead>
          <tr>
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
                transitionDuration={0}
              />
            </th>
            <Th
              sorted={sortBy === 'id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('id')}
            >
              ID
            </Th>
            <Th
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('title')}
            >
              Title
            </Th>
            <Th
              sorted={sortBy === 'description'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('description')}
            >
              Description
            </Th>
            <Th
              sorted={sortBy === 'data_type'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('data_type')}
            >
              Data Type
            </Th>
            <Th
              sorted={sortBy === 'membership'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('membership')}
            >
              Membership
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
              Status
            </Th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default MyCommunityList
