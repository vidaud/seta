import { useEffect, useState } from 'react'
import { Group, TextInput, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { useCommunityListContext } from '~/pages/CommunitiesPage/contexts/community-list.context'
import { sortCommunityData } from '~/pages/CommunitiesPage/utils/community-utils'

import { useAllCommunities } from '~/api/communities/discover/discover-communities'
import type { CommunityResponse } from '~/api/types/community-types'

import CommunityListContent from './CommunityListContent'

import Filters from '../CommunityInfo/components/Filters'

const useStyles = createStyles({
  search: {
    [`@media (max-width: 89em) and (min-width: 48em)`]: {
      width: '58%'
    },
    [`@media (min-width: 90em)`]: {
      width: '62%'
    }
  }
})

const CommunityList = () => {
  const [search, setSearch] = useState('')
  const { classes } = useStyles()
  const [sortedData, setSortedData] = useState<CommunityResponse[]>([])

  const { data, isLoading, error, refetch } = useAllCommunities()
  const { membership, status, community_scopes, system_scopes, resource_scopes } =
    useCommunityListContext()

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

      // refetch()
    }
  }, [data, membership, status])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)

    if (data) {
      setSortedData(sortCommunityData(data, { search: value }))
    }
  }

  return (
    <>
      <Group sx={{ width: '100%' }}>
        <Filters />
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

      <CommunityListContent
        queryTerms={search}
        isLoading={isLoading}
        data={sortedData}
        error={error}
        onTryAgain={refetch}
        community_scopes={community_scopes}
        resource_scopes={resource_scopes}
        system_scopes={system_scopes}
      />
    </>
  )
}

export default CommunityList
