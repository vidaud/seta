import { Box, Title, Text } from '@mantine/core'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useDatasources } from '~/api/admin/datasources'

import DatasourcesTable from './DatasourcesTable/DatasourcesTable'

import ApiLoader from '../common/components/Loader/ApiLoader'

const Datasources = () => {
  const { data, isLoading, error, refetch } = useDatasources()

  if (error) {
    return <SuggestionsError subject="annotation" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  return (
    <Box w="100%" pl="md" pr="md" display="grid">
      <Title order={3} mb="sm" mt="-2rem" color="blue.5">
        SeTA Data Sources
      </Title>
      <Text mb="md" c="dimmed">
        Manage SeTA Data Sources
      </Text>
      <DatasourcesTable data={data} isLoading={isLoading} error={error} />
    </Box>
  )
}

export default Datasources
