import { useEffect, useState } from 'react'
import { Table, ScrollArea, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { Resource } from '~/models/communities/resources'

import ResourceButtons from './components/ResourceButtons/ResourceButtons'
import { useStyles } from './constants'

import { useMyResources } from '../../../../../../api/resources/manage/my-resources'
import { ComponentEmpty, ComponentError } from '../../../common'
import ComponentLoading from '../../../common/ComponentLoading'
import { Th, sortResourceData } from '../../../resource-utils'
import { useCurrentUserPermissions } from '../../scope-context'

const MyResourceList = () => {
  const { classes, cx } = useStyles()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof Resource | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data, isLoading, error, refetch } = useMyResources()
  const [sortedData, setSortedData] = useState(data)
  const { resource_scopes } = useCurrentUserPermissions()

  useEffect(() => {
    if (data) {
      const scopesId = new Set(resource_scopes?.map(({ resource_id }) => resource_id))
      const result = data
        ?.map(o => ({ ...o, matched: scopesId.has(o.resource_id) }))
        .filter(i => i.matched === true)

      setSortedData(result)
    }
  }, [data, resource_scopes])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data?.length === 0) {
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

  const rows = sortedData?.map(item => {
    return (
      <tr key={item.resource_id}>
        <td>{item.resource_id}</td>
        <td>{item.community_id}</td>
        <td>{item.title}</td>
        <td>{item.abstract}</td>
        <td>{new Date(item.created_at).toDateString()}</td>
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
        fontSize="xs"
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
              Created At
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
