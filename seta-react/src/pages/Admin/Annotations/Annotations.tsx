import { Box, Title, Text } from '@mantine/core'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useAnnotations } from '~/api/admin/annotations'

import AnnotationsTable from './AnnotationsTable/AnnotationsTable'

import ApiLoader from '../common/components/Loader/ApiLoader'

const Annotations = () => {
  const { data, isLoading, error, refetch } = useAnnotations()

  if (error) {
    return <SuggestionsError subject="annotation" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  return (
    <Box w="100%" pl="md" pr="md" display="grid">
      <Title order={3} mb="sm" mt="-2rem" color="blue.5">
        SeTA Annotations
      </Title>
      <Text mb="md" c="dimmed">
        Manage SeTA Annotations
      </Text>
      <AnnotationsTable data={data} isLoading={isLoading} error={error} />
    </Box>
  )
}

export default Annotations
