import { useEffect, useState } from 'react'
import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  TextInput,
  rem,
  Group,
  Menu,
  ActionIcon
} from '@mantine/core'
import { IconDots, IconEye, IconSearch } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import type { ResourcesResponse } from '~/api/resources/manage/my-resources'
import type { Resource } from '~/models/communities/resources'

import { useAllResources } from '../../../../../api/resources/discover/discover-resources'
import { ComponentEmpty, ComponentError } from '../../common'
import ComponentLoading from '../../common/ComponentLoading'
import { Th } from '../../community-utils'
import { sortResourceData } from '../../resource-utils'

const ResourceList = () => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Resource | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { data, isLoading, error, refetch } = useAllResources()
  const [sortedData, setSortedData] = useState<ResourcesResponse[]>([])

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
    link: {
      color: 'black'
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

  const setSorting = (field: keyof Resource) => {
    const reversed = field === sortBy ? !reverseSortDirection : false

    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortResourceData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)
    setSortedData(sortResourceData(data, { sortBy, reversed: reverseSortDirection, search: value }))
  }

  const rows =
    sortedData && sortedData.length > 0
      ? sortedData?.map(row => (
          <tr key={row.resource_id}>
            <td>{row.resource_id}</td>
            <td>{row.community_id}</td>
            <td>{row.title}</td>
            <td>{row.abstract}</td>
            <td>{row.created_at.toString()}</td>
            <td>{row.creator_id}</td>
            <td>{row.status}</td>
            <td>
              <Group>
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
                    <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>
                      <Link
                        className={classes.link}
                        to={`/resources/${row.resource_id}`}
                        replace={true}
                      >
                        View Details
                      </Link>
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
              sorted={sortBy === 'resource_id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('resource_id')}
            >
              Resource
            </Th>
            <Th
              sorted={sortBy === 'community_id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('community_id')}
            >
              Community
            </Th>
            <Th
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('title')}
            >
              Title
            </Th>
            <Th
              sorted={sortBy === 'abstract'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('abstract')}
            >
              Description
            </Th>
            <Th
              sorted={sortBy === 'created_at'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('created_at')}
            >
              Data Type
            </Th>
            <Th
              sorted={sortBy === 'creator_id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('creator_id')}
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

export default ResourceList
