import { Box, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useResourcePendingRequests, useUpdateResourceRequest } from '~/api/admin/resource-requests'
import { RequestStatus } from '~/types/admin/change-requests'

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

  const handleRejectRequest = (resourceId: string, requestId: string) => {
    updateRequestMutation.mutate({
      resourceId: resourceId,
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
