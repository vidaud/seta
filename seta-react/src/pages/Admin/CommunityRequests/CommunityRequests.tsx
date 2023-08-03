import { Box, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import {
  useCommunityPendingRequests,
  useUpdateCommunityRequest
} from '~/api/admin/community-requests'
import { RequestStatus } from '~/types/admin/change-requests'

import RequestsTable from './components/RequestsTable'

const AdminCommunityRequests = () => {
  const { data, isLoading, error, refetch } = useCommunityPendingRequests()

  const updateRequestMutation = useUpdateCommunityRequest()

  const handleApproveRequest = (communityId: string, requestId: string) => {
    updateRequestMutation.mutate({
      communityId: communityId,
      requestId: requestId,
      status: RequestStatus.Approved
    })

    if (updateRequestMutation.isError) {
      notifications.show({
        message: 'The request update failed!',
        color: 'red',
        autoClose: 5000
      })
    } else {
      notifications.show({
        message: 'The request was approved!',
        color: 'blue',
        autoClose: 5000
      })
    }
  }

  const handleRejectRequest = (communityId: string, requestId: string) => {
    updateRequestMutation.mutate({
      communityId: communityId,
      requestId: requestId,
      status: RequestStatus.Rejected
    })

    if (updateRequestMutation.error) {
      notifications.show({
        title: 'Update failed!',
        message: 'The request update failed. Please try again!',
        color: 'red',
        autoClose: 5000
      })
    } else {
      notifications.show({
        message: 'The request was rejected!',
        color: 'yellow',
        autoClose: 5000
      })
    }
  }

  if (error) {
    return <SuggestionsError onTryAgain={refetch} />
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="md" mt="-2rem" color="blue.5">
        Community Pending Requests
      </Title>
      <RequestsTable
        data={data}
        isLoading={isLoading}
        error={error}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
      />
    </Box>
  )
}

export default AdminCommunityRequests
