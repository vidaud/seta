import { useEffect, useState } from 'react'
import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  TextInput,
  rem,
  Button,
  Group,
  Menu,
  ActionIcon
} from '@mantine/core'
import { IconDots, IconEye, IconSearch } from '@tabler/icons-react'

import type { Community } from '~/models/communities/communities'

import { useAllCommunities } from '../../../../../api/communities/discover/discover-communities'
import type { CommunitiesResponse } from '../../../../../api/communities/manage/my-communities'
import { environment } from '../../../../../environments/environment'
import { ComponentEmpty, ComponentError } from '../../common'
import ComponentLoading from '../../common/ComponentLoading'
import { Th, sortCommunityData } from '../../community-utils'

const CommunityList = () => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Community | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { data, isLoading, error, refetch } = useAllCommunities()
  const [sortedData, setSortedData] = useState<CommunitiesResponse[]>([])

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

  useEffect(() => {
    if (data) {
      setSortedData(data)
    }
  }, [data])

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

  const setSorting = (field: keyof Community) => {
    const reversed = field === sortBy ? !reverseSortDirection : false

    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortCommunityData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)
    setSortedData(
      sortCommunityData(data, { sortBy, reversed: reverseSortDirection, search: value })
    )
  }

  const rows =
    sortedData && sortedData.length > 0
      ? sortedData?.map(row => (
          <tr key={row.community_id}>
            <td>{row.community_id}</td>
            <td>{row.title}</td>
            <td>{row.description}</td>
            <td>{row.data_type}</td>
            <td>{row.membership}</td>
            <td>{row.status}</td>
            <td>
              <Group>
                {row.membership === 'Private' ? (
                  <Button variant="outline" size="xs">
                    + JOIN
                  </Button>
                ) : (
                  <Button variant="filled" size="xs">
                    + JOINED
                  </Button>
                )}
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
                      icon={<IconEye size="1rem" stroke={1.5} />}
                      component="a"
                      href={`${environment.COMMUNITIES_API_PATH}/view/${row.community_id}`}
                    >
                      View Details
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </td>
          </tr>
        ))
      : []

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
              sorted={sortBy === 'community_id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('community_id')}
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
