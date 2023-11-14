import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { BiUserCircle } from 'react-icons/bi'

import { useDeleteUserAccount } from '~/api/user/user-account'
import { useCurrentUser } from '~/contexts/user-context'

const DeleteUser = () => {
  const { logout } = useCurrentUser()
  const setDeleteUserAccountMutation = useDeleteUserAccount()

  const handleLogout = () => {
    logout().finally(() => {
      window.location.href = '/login'
    })
  }

  const deleteUser = () => {
    setDeleteUserAccountMutation.mutate(undefined, {
      onSuccess: () => {
        notifications.show({
          message: `Account deleted successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        handleLogout()
      },
      onError: () => {
        notifications.show({
          message: 'Delete user account failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Button onClick={deleteUser} leftIcon={<BiUserCircle size="1rem" />}>
      <span>Close Account</span>
    </Button>
  )
}

export default DeleteUser
