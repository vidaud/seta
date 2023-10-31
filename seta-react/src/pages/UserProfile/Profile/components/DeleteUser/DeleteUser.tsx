import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { BiUserCircle } from 'react-icons/bi'

import { useDeleteUserAccount } from '~/api/user/user-account'
import { useCurrentUser } from '~/contexts/user-context'

const useStyles = createStyles(() => ({
  form: {
    marginTop: '20px'
  }
}))

const DeleteUser = () => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)
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
          message: `User deleted successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        handleLogout()
      },
      onError: () => {
        notifications.show({
          message: 'Delete user failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Popover
      width={300}
      // withinPortal={true}
      trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group>
          <Button
            onClick={e => {
              e.stopPropagation()
              setOpened(o => !o)
            }}
            leftIcon={<BiUserCircle size="1rem" />}
          >
            <span>Delete User</span>
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text weight={500} className={cx(classes.form)}>
          Are you sure you want to delete your user account?
        </Text>

        <Text className={cx(classes.form)}>
          Warning! After you delete your account it will be saved for a short time in case you want
          to recover it.
        </Text>
        <Text size="sm" className={cx(classes.form)}>
          Press Confirm to proceed with the deletion or press Cancel to abort
        </Text>
        <Group className={cx(classes.form)} position="right">
          <Button
            variant="outline"
            size="xs"
            color="blue"
            onClick={e => {
              setOpened(o => !o)
              e.stopPropagation()
            }}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            color="blue"
            onClick={e => {
              deleteUser()
              e.stopPropagation()
            }}
          >
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteUser
