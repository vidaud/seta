import { useState } from 'react'
import { createStyles, Table, ScrollArea, Text, TextInput, rem, Button } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { RowData, TableSortProps } from '../../types'
import { Th, sortData } from '../../utils'

const CommunityList = ({ data }: TableSortProps) => {
  const [search, setSearch] = useState('')
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
  const { classes, cx } = useStyles()
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

  const rows = sortedData.map(row => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.title}</td>
      <td>{row.description}</td>
      <td>{row.data_type}</td>
      <td>{row.membership}</td>
      <td>{row.status}</td>
      <td>
        {row.membership === 'Private' ? (
          <Button variant="outline" size="xs">
            + JOIN
          </Button>
        ) : (
          <Button variant="filled" size="xs">
            + JOINED
          </Button>
        )}
      </td>
    </tr>
  ))

  return (
    <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: 'fixed' }}
        className={cx(classes.header, { [classes.scrolled]: scrolled })}
      >
        <thead>
          <tr>
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
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  )
}

export default CommunityList
