import { Box, List, Paper, Title, Text } from '@mantine/core'

import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import { useOrphanedResources } from '~/api/admin/orphaned-resources'

const AdminOrphanedResources = () => {
  const { data, isLoading, error, refetch } = useOrphanedResources()

  const resources = data ?? []

  if (error) {
    return <SuggestionsError subject="orphans" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <SuggestionsLoading />
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="sm" mt="-2rem" color="blue.5">
        Orphaned Resources
      </Title>
      <Text mb="md" c="dimmed">
        The list of resource identifiers that exist in Elasticsearch, but not in SetA database.
      </Text>
      {resources.length === 0 ? (
        <Paper shadow="xs" p="md" w="50%" c="dimmed">
          No records
        </Paper>
      ) : (
        <List size="lg" withPadding>
          {resources.map(code => (
            <List.Item key={code}>{code}</List.Item>
          ))}
        </List>
      )}
    </Box>
  )
}

export default AdminOrphanedResources
