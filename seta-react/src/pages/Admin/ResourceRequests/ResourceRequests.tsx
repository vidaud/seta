import { Box, Title } from '@mantine/core'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useResourcePendingRequests, useUpdateResourceRequest } from '~/api/admin/resource-requests'
import { RequestStatus } from '~/types/admin/change-requests'
import { notifications } from '~/utils/notifications'

import RequestsTable from './components/RequestsTable'

const AdminResourceRequests = () => {
  const { data, isLoading, error, refetch } = useResourcePendingRequests()

  const updateRequestMutation = useUpdateResourceRequest()

  const handleApproveRequest = (resourceId: string, requestId: string) => {
    updateRequestMutation.mutate({
      resourceId: resourceId,
      requestId: requestId,
      status: RequestStatus.Approved
    })

    if (updateRequestMutation.isError) {
      notifications.showError('The request update failed!', { autoClose: true })
    } else {
      notifications.showSuccess('The request was approved!', { autoClose: true })
    }
  }

  const handleRejectRequest = (resourceId: string, requestId: string) => {
    updateRequestMutation.mutate({
      resourceId: resourceId,
      requestId: requestId,
      status: RequestStatus.Rejected
    })

    if (updateRequestMutation.error) {
      notifications.showError('Update failed!', {
        description: 'The request update failed. Please try again!',
        autoClose: true
      })
    } else {
      notifications.showInfo('The request was rejected!', { autoClose: true })
    }
  }

  if (error) {
    return <SuggestionsError subject="change requests" onTryAgain={refetch} />
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="md" mt="-2rem" color="blue.5">
        Pending Requests for Resources
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

export default AdminResourceRequests
