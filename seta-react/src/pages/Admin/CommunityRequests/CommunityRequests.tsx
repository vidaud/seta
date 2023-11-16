import { Box, Title } from '@mantine/core'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import {
  useCommunityPendingRequests,
  useUpdateCommunityRequest
} from '~/api/admin/community-requests'
import { RequestStatus } from '~/types/admin/change-requests'
import logger from '~/utils/logger'
import { notifications } from '~/utils/notifications'

import RequestsTable from './components/RequestsTable'

const AdminCommunityRequests = () => {
  const { data, isLoading, error, refetch } = useCommunityPendingRequests()

  const updateRequestMutation = useUpdateCommunityRequest()

  const handleApproveRequest = (communityId: string, requestId: string) => {
    updateRequestMutation.mutate(
      {
        communityId: communityId,
        requestId: requestId,
        status: RequestStatus.Approved
      },
      {
        onSuccess: () => {
          logger.log('handleApproveRequest success')

          notifications.showSuccess(`The request was approved!`, { autoClose: true })
        },
        onError: () => {
          logger.log('handleApproveRequest error')

          notifications.showError('The request update failed!', { autoClose: true })
        }
      }
    )
  }

  const handleRejectRequest = (communityId: string, requestId: string) => {
    updateRequestMutation.mutate(
      {
        communityId: communityId,
        requestId: requestId,
        status: RequestStatus.Rejected
      },
      {
        onSuccess: () => {
          logger.log('handleRejectRequest success')

          notifications.showInfo('The request was rejected!', { autoClose: true })
        },
        onError: () => {
          logger.log('handleRejectRequest error')

          notifications.showError('Update failed!', {
            description: 'The request update failed. Please try again!',

            autoClose: true
          })
        }
      }
    )
  }

  if (error) {
    return <SuggestionsError subject="change requests" onTryAgain={refetch} />
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="md" mt="-2rem" color="blue.5">
        Pending Requests for Communities
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
