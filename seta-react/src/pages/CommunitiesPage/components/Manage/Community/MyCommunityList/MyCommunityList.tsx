import { useEffect, useState } from 'react'
import { Table, ScrollArea, TextInput, Badge } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { Community } from '~/models/communities/communities'

import CommunityButtons from './components/CommunityButtons/CommunityButtons'
import { useStyles } from './constants'

import { useCommunities } from '../../../../../../api/communities/manage/my-communities'
import { ComponentEmpty, ComponentError } from '../../../common'
import ComponentLoading from '../../../common/ComponentLoading'
import { Th, sortCommunityData } from '../../../community-utils'

const MyCommunityList = () => {
  const { classes, cx } = useStyles()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Community | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = useCommunities()

  const [sortedData, setSortedData] = useState(data)

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

  const rows = sortedData?.map(item => {
    return (
      <tr key={item.community_id}>
        <td>{item.community_id.charAt(0).toUpperCase() + item.community_id.slice(1)}</td>
        <td>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</td>
        <td>{item.description.charAt(0).toUpperCase() + item.description.slice(1)}</td>
        <td>
          {item.membership === 'closed' ? (
            <Badge className={classes.badge} variant="outline" color="orange" fullWidth>
              Restricted
            </Badge>
          ) : (
            <Badge color="green" fullWidth>
              {item.membership}
            </Badge>
          )}
        </td>
        <td>
          {item.status === 'active' ? (
            <Badge className={classes.badge} variant="outline" color="green" fullWidth>
              {item.status}
            </Badge>
          ) : (
            <Badge className={classes.badge} variant="outline" color="gray">
              {item.status}
            </Badge>
          )}
        </td>
        <td>
          <CommunityButtons item={item} />
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
            {/* <Th
              sorted={sortBy === 'data_type'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('data_type')}
            >
              Data Type
            </Th> */}
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
