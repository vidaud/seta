import { Box, Title, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useOrphanedCommunities, useSetCommunityOwner } from '~/api/admin/orphaned-communities'

import OrphansTable from './components/OrphanesTable'

const AdminOrphanedCommunities = () => {
  const { data, isLoading, error, refetch } = useOrphanedCommunities()

  const setCommunityOwnerMutation = useSetCommunityOwner()

  if (error) {
    return <SuggestionsError subject="orphans" onTryAgain={refetch} />
  }

  const handleCommunityOwnerSubmit = (communityId: string, ownerId: string) => {
    setCommunityOwnerMutation.mutate(
      {
        communityId: communityId,
        userId: ownerId
      },
      {
        onSuccess: () => {
          notifications.show({
            message: `Community '${communityId}' has a new owner!`,
            color: 'blue',
            autoClose: 5000
          })
        },
        onError: () => {
          notifications.show({
            message: 'The community owner update failed!',
            color: 'red',
            autoClose: 5000
          })
        }
      }
    )
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="sm" mt="-2rem" color="blue.5">
        Orphaned Communities
      </Title>
      <Text mb="md" c="dimmed">
        The list of communities that have no owner assigned anymore.
      </Text>
      <OrphansTable
        data={data}
        isLoading={isLoading}
        error={error}
        onCommunityOwnerSubmit={handleCommunityOwnerSubmit}
      />
    </Box>
  )
}

export default AdminOrphanedCommunities
