import { Box, Title, Text } from '@mantine/core'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useAllAccounts } from '~/api/admin/users'

import UsersTable from './components/UsersTable'

const AdminUsers = () => {
  const { data, isLoading, error, refetch } = useAllAccounts()

  if (error) {
    return <SuggestionsError onTryAgain={refetch} />
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="sm" mt="-2rem" color="blue.5">
        SeTA Accounts
      </Title>
      <Text mb="md" c="dimmed">
        Manage SeTA Accounts
      </Text>
      <UsersTable data={data} isLoading={isLoading} error={error} />
    </Box>
  )
}

export default AdminUsers
