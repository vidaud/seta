import { useEffect, useState } from 'react'
import { Table, ScrollArea, Text, TextInput, Group, Badge } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { Community } from '~/models/communities/communities'

import CommunityButton from './components/CommunityButton/CommunityButton'
import Filters from './components/Filters/Filters'
import { useStyles } from './components/style'

import { useAllCommunities } from '../../../../../api/communities/discover/discover-communities'
import { useCommunityListContext } from '../../../pages/Discovery/CommunityList/CommunityList.context'
import { ComponentEmpty, ComponentError } from '../../common'
import ComponentLoading from '../../common/ComponentLoading'
import { Th, sortCommunityData } from '../../community-utils'

const CommunityList = () => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Community | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { membership, status } = useCommunityListContext()

  const { data, isLoading, error, refetch } = useAllCommunities()
  const [sortedData, setSortedData] = useState<Community[]>([])

  const { classes, cx } = useStyles()

  useEffect(() => {
    if (data) {
      membership === 'all' && status === 'all'
        ? setSortedData(data)
        : membership === 'all' && status !== 'all'
        ? setSortedData(data.filter(item => item.status === status))
        : membership !== 'all' && status === 'all'
        ? setSortedData(data.filter(item => item.membership === membership))
        : setSortedData(
            data.filter(item => item.membership === membership && item.status === status)
          )

      refetch()
    }
  }, [data, membership, status])

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
            <td>{row.community_id.charAt(0).toUpperCase() + row.community_id.slice(1)}</td>
            <td>{row.title.charAt(0).toUpperCase() + row.title.slice(1)}</td>
            <td>{row.description.charAt(0).toUpperCase() + row.description.slice(1)}</td>
            {/* <td>{row.data_type}</td> */}
            <td>
              {row.membership === 'closed' ? (
                <Badge className={classes.badge} variant="outline" color="orange">
                  Restricted
                </Badge>
              ) : (
                <Badge className={classes.badge} variant="outline" color="green">
                  {row.membership}
                </Badge>
              )}
            </td>
            <td>
              {row.status === 'membership' ? (
                <Badge className={classes.badge} variant="outline" color="green">
                  Member
                </Badge>
              ) : row.status === 'invited' ? (
                <Badge className={classes.badge} variant="outline" color="gray">
                  {row.status}
                </Badge>
              ) : row.status === 'rejected' ? (
                <Badge className={classes.badge} variant="outline" color="red">
                  {row.status}
                </Badge>
              ) : row.status === 'pending' ? (
                <Badge className={classes.badge} variant="outline" color="gray">
                  {row.status}
                </Badge>
              ) : row.status === 'unknown' ? (
                <Badge className={classes.badge} variant="outline" color="orange">
                  Not Member
                </Badge>
              ) : null}
            </td>
            <td>
              <CommunityButton props={row} onReload={refetch} />
            </td>
          </tr>
        ))
      : []

  return (
    <>
      <Group>
        <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
          <Group>
            <Filters />
            <TextInput
              style={{ width: '68%' }}
              label="Search Field"
              placeholder="Search by any field"
              mb="md"
              icon={<IconSearch size="0.9rem" stroke={1.5} />}
              value={search}
              onChange={handleSearchChange}
            />
          </Group>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            fontSize="xs"
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
              {rows?.length > 0 ? (
                rows
              ) : (
                <tr>
                  <td colSpan={data[0] ? Object.keys(data[0]).length : 1}>
                    <Text weight={500} align="center">
                      Nothing found
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Group>
    </>
  )
}

export default CommunityList
