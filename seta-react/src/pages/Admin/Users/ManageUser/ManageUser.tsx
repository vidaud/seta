import { Box, Card, Grid, Title, Container } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useSetaAccount, useChangeAccountStatus, useDeleteAccount } from '~/api/admin/user'
import { AccountStatus } from '~/types/admin/user-info'
import logger from '~/utils/logger'

import Actions from './components/Actions'
import Info from './components/Info'
import Permissions from './components/Permissions'

import ApiLoader from '../../common/components/Loader'
import AccountDetails from '../components/AccountDetails'
import ProviderDetail from '../components/ProvidersDetail'

const ManageUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const userId = id ?? ''

  const { data, isLoading, error, refetch } = useSetaAccount(userId)

  const changeAccountStatusMutation = useChangeAccountStatus(userId)
  const deleteAccountMutation = useDeleteAccount(userId)

  if (error) {
    return <SuggestionsError subject="user" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  const handleChangeAccountStatus = (status: AccountStatus) => {
    changeAccountStatusMutation.mutate(status, {
      onSuccess: () => {
        logger.log('handleChangeAccountStatus success')

        notifications.show({
          message: `The account was ${status}.`,
          color: 'blue',
          autoClose: 5000
        })
      },
      onError: () => {
        logger.log('handleChangeAccountStatus error')

        notifications.show({
          title: 'Update failed!',
          message: 'The account status update failed. Please try again!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(AccountStatus.Deleted, {
      onSuccess: () => {
        logger.log('handleDeleteAccount success')

        notifications.show({
          message: `The account was deleted.`,
          color: 'blue',
          autoClose: 5000
        })

        navigate('/admin/users', { replace: true })
      },
      onError: () => {
        logger.log('handleDeleteAccount error')

        notifications.show({
          title: 'Account deletion failed!',
          message: 'The account deletion failed. Please try again later!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Box w="100%" pl="md" pr="md">
      <Title order={3} mb="sm" mt="-2rem" color="blue.5">
        Manage SeTA Account
      </Title>
      <Container fluid>
        <Grid align="center">
          <Grid.Col span={10}>
            <Card shadow="xs" padding="lg" radius="sm" withBorder>
              <Info
                username={data?.username}
                email={data?.email}
                role={data?.role}
                status={data?.status}
                createdAt={data?.createdAt}
                lastModifiedAt={data?.lastModifiedAt}
              />
            </Card>
          </Grid.Col>
          <Grid.Col span={2}>
            <Actions
              status={data?.status}
              onChangeAccountStatus={handleChangeAccountStatus}
              onDeleteAccount={handleDeleteAccount}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Card shadow="xs" padding="lg" radius="sm" withBorder>
              <ProviderDetail externalProviders={data?.externalProviders} />
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="xs" padding="lg" radius="sm" withBorder>
              <AccountDetails details={data?.details} />
            </Card>
          </Grid.Col>
        </Grid>

        <Card shadow="xs" padding="lg" radius="sm" withBorder mt={15}>
          <Permissions userId={userId} role={data?.role} scopes={data?.scopes} />
        </Card>
      </Container>
    </Box>
  )
}

export default ManageUser
