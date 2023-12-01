import { useEffect, useState } from 'react'
import { Box, Group, TextInput, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { useDatasourceListContext } from '~/pages/DatasourcesPage/contexts/datasource-list.context'

import { useAllDatasources } from '~/api/datasources/discover-datasources'
import type { DatasourceResponse } from '~/api/types/datasource-types'

import DatasourcesListContent from './DatasourcesListContent'
import * as S from './styles'

import { sortDatasourceData } from '../../utils/datasource-utils'
import Filters from '../Filters'

const useStyles = createStyles({
  search: {
    width: '85%'
  }
})

const DatasourcesList = () => {
  const [search, setSearch] = useState('')
  const { classes } = useStyles()
  const [sortedData, setSortedData] = useState<DatasourceResponse[]>([])

  const { data, isLoading, error, refetch } = useAllDatasources()
  const { selected } = useDatasourceListContext()

  useEffect(() => {
    if (data) {
      selected === 'all'
        ? setSortedData(data)
        : selected === 'searchable'
        ? setSortedData(data.filter(item => item.searchable === true))
        : setSortedData(data.filter(item => item.searchable === false))
    }
  }, [data, selected])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)

    if (data) {
      setSortedData(sortDatasourceData(data, { search: value }))
    }
  }

  return (
    <Box w="100%" pl="3rem" pr="3rem">
      <Group id="apply_filters" css={S.group}>
        <Filters />
        <TextInput
          className={classes.search}
          // label="Search Field"
          placeholder="Search by any field"
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
      </Group>
      <DatasourcesListContent
        queryTerms={search}
        isLoading={isLoading}
        data={sortedData}
        error={error}
        onTryAgain={refetch}
      />
    </Box>
  )
}

export default DatasourcesList
