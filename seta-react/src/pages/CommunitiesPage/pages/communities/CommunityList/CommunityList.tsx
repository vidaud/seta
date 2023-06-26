import { useEffect, useState } from 'react'
import { Group, TextInput, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import type { CommunityResponse } from '~/api/types/community-types'

import CommunityListContent from './CommunityListContent'

import { useAllCommunities } from '../../../../../api/communities/discover/discover-communities'
import usePaginator from '../../../../../hooks/use-paginator'
import { useCommunityListContext } from '../../contexts/community-list.context'
import { useCurrentUserPermissions } from '../../contexts/scope-context'
import Filters from '../CommunityInfo/components/Filters/Filters'
import { sortCommunityData } from '../CommunityInfo/utils/community-utils'

const PER_PAGE = 10

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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { classes } = useStyles()
  const [sortedData, setSortedData] = useState<CommunityResponse[]>([])

  const { data, isLoading, error, refetch } = useAllCommunities()
  const { membership, status } = useCommunityListContext()
  const { community_scopes, system_scopes, resource_scopes } = useCurrentUserPermissions()

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

  const total_docs = data?.length
  const communities = data

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
      setSortedData(sortCommunityData(data, { search: value }))
    }
  }

  return (
    <>
      <Group>
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

export default CommunityList
