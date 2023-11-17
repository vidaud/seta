import { useEffect, useState } from 'react'
import { Group, TextInput, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { useCommunityListContext } from '~/pages/CommunitiesPage/contexts/community-list.context'
import { ResourceListProvider } from '~/pages/CommunitiesPage/contexts/resource-list.context'
import { sortResourceData } from '~/pages/CommunitiesPage/utils/resource-utils'

import { useAllResources } from '~/api/communities/resources/discover-resources'
import type { ResourceResponse } from '~/api/types/resource-types'

import ResourceListContent from './ResourceListContent'

const useStyles = createStyles({
  search: {
    width: '100%'
  }
})

const ResourceList = () => {
  const [search, setSearch] = useState('')
  const { classes } = useStyles()
  const [sortedData, setSortedData] = useState<ResourceResponse[]>([])

  const { data, isLoading, error, refetch } = useAllResources()
  const { community_scopes, system_scopes, resource_scopes } = useCommunityListContext()

  useEffect(() => {
    if (data) {
      setSortedData(data)
    }
  }, [data])

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
      <ResourceListProvider>
        <ResourceListContent
          queryTerms={search}
          isLoading={isLoading}
          data={sortedData}
          error={error}
          onTryAgain={refetch}
          community_scopes={community_scopes}
          resource_scopes={resource_scopes}
          system_scopes={system_scopes}
        />
      </ResourceListProvider>
    </>
  )
}

export default ResourceList
