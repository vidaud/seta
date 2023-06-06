import { useEffect, useState } from 'react'
import { Table, Checkbox, ScrollArea, rem, TextInput, Group } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { Community } from '~/models/communities/communities'

import CommunityButtons from './components/CommunityButtons/CommunityButtons'
import { useStyles } from './constants'

import { useCommunities } from '../../../../../../api/communities/manage/my-communities'
import { ComponentEmpty, ComponentError } from '../../../common'
import ComponentLoading from '../../../common/ComponentLoading'
import { Th, sortCommunityData } from '../../../community-utils'
import DeleteCommunity from '../DeleteCommunityButton/DeleteCommunityButton'

const MyCommunityList = () => {
  const { classes, cx } = useStyles()
  const [selection, setSelection] = useState(['1'])
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

  const toggleRow = (community_id: string) =>
    setSelection(current =>
      current.includes(community_id)
        ? current.filter(item => item !== community_id)
        : [...current, community_id]
    )
  const toggleAll = () =>
    setSelection(current =>
      current.length === data.length ? [] : data.map(item => item.community_id)
    )
  const rows = sortedData?.map(item => {
    const selected = selection.includes(item.community_id)

    return (
      <tr key={item.community_id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.community_id)}
            onChange={() => toggleRow(item.community_id)}
            transitionDuration={0}
          />
        </td>
        <td>{item.community_id}</td>
        <td>{item.title}</td>
        <td>{item.description}</td>
        {/* <td>{item.data_type}</td> */}
        <td>{item.membership}</td>
        <td>{item.status}</td>
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
      <Group display={selection.length > 1 ? 'block' : 'none'}>
        <DeleteCommunity />
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
            <th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
                transitionDuration={0}
              />
            </th>
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
