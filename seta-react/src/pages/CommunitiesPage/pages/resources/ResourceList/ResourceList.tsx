import { useEffect, useState } from 'react'
import { Group, TextInput, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { ResourceResponse } from '~/api/types/resource-types'

import ResourceListContent from './ResourceListContent'

import { useAllResources } from '../../../../../api/resources/discover/discover-resources'
import usePaginator from '../../../../../hooks/use-paginator'
import { useCommunityListContext } from '../../contexts/community-list.context'
import { useCurrentUserPermissions } from '../../contexts/scope-context'
import { sortResourceData } from '../ResourceInfo/utils/resource-utils'

const PER_PAGE = 10

const useStyles = createStyles({
  search: {
    width: '100%'
  }
})

const ResourceList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { classes } = useStyles()
  const [sortedData, setSortedData] = useState<ResourceResponse[]>([])

  const { data, isLoading, error, refetch } = useAllResources()
  const { membership, status } = useCommunityListContext()
  const { community_scopes, system_scopes, resource_scopes } = useCurrentUserPermissions()
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE

  useEffect(() => {
    if (data) {
      setSortedData(data.slice(from, to))

      // refetch()
    }
  }, [data, membership, status, from, to])

  const total_docs = data?.length
  const communities = data?.slice(from, to)

  const { scrollTargetRef, paginator, info } = usePaginator({
    total: total_docs ?? 0,
    perPage: PER_PAGE,
    page,
    info: {
      singular: 'result',
      currentPageItems: communities?.length ?? 0
    },
    scrollDependencies: [data],
    onPageChange: setPage
  })

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)

    if (data) {
      setSortedData(sortResourceData(data, { search: value }))
    }
  }

  return (
    <>
      <Group sx={{ width: '100%' }}>
        <TextInput
          className={classes.search}
          label="Search Field"
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
      </Group>
      <ResourceListContent
        ref={scrollTargetRef}
        queryTerms={search}
        isLoading={isLoading}
        data={sortedData}
        error={error}
        onTryAgain={refetch}
        paginator={paginator}
        info={info}
        community_scopes={community_scopes}
        resource_scopes={resource_scopes}
        system_scopes={system_scopes}
      />
    </>
  )
}

export default ResourceList
