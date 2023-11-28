import { Button } from '@mantine/core'
import { BiUserCircle } from 'react-icons/bi'

import { useDeleteUserAccount } from '~/api/user/user-account'
import { useCurrentUser } from '~/contexts/user-context'
import { notifications } from '~/utils/notifications'

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
        notifications.showSuccess(`Account deleted successfully!`, { autoClose: true })

        handleLogout()
      },
      onError: () => {
        notifications.showError('Delete user account failed!', { autoClose: true })
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
