import { useEffect, useState } from 'react'
import { Table, Checkbox, ScrollArea, rem, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { Resource } from '~/models/communities/resources'

import { useStyles } from './constants'

import { useMyResources } from '../../../../../../api/resources/manage/my-resources'
import { CommunitiesEmpty, CommunitiesError } from '../../../common'
import CommunitiesLoading from '../../../common/SuggestionsLoading'
import { Th, sortResourceData } from '../../../resource-utils'
import ResourceButtons from '../ResourceButtons/ResourceButtons'

const MyResourceList = () => {
  const { classes, cx } = useStyles()
  const [selection, setSelection] = useState(['1'])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Resource | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = useMyResources()
  const [sortedData, setSortedData] = useState(data)

  useEffect(() => {
    if (data) {
      setSortedData(data)
    }
  }, [data])

  if (error) {
    return <CommunitiesError onTryAgain={refetch} />
  }

  if (data) {
    if (data.length === 0) {
      return <CommunitiesEmpty />
    }
  }

  if (isLoading || !data) {
    return <CommunitiesLoading />
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

  const toggleRow = (resource_id: string) =>
    setSelection(current =>
      current.includes(resource_id)
        ? current.filter(item => item !== resource_id)
        : [...current, resource_id]
    )
  const toggleAll = () =>
    setSelection(current =>
      current.length === data.length ? [] : data.map(item => item.resource_id)
    )
  const rows = sortedData?.map(item => {
    const selected = selection.includes(item.resource_id)

    return (
      <tr key={item.resource_id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.resource_id)}
            onChange={() => toggleRow(item.resource_id)}
            transitionDuration={0}
          />
        </td>
        <td>{item.resource_id}</td>
        <td>{item.community_id}</td>
        <td>{item.title}</td>
        <td>{item.abstract}</td>
        <td>{item.created_at.toString()}</td>
        <td>{item.creator_id}</td>
        <td>{item.status}</td>
        <td>
          <ResourceButtons item={item} />
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
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default MyResourceList
