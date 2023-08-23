import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles, ActionIcon } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'

import { deleteMembershipByID } from '~/api/communities/membership'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md }
}))

const DeleteMembership = ({ props }) => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)

  const deleteMembership = () => {
    deleteMembershipByID(props.community_id, props.user_id)
      .then(() => {
        notifications.show({
          title: 'Membership Removed',
          message: 'You are no longer member of this community.',
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.teal[6],
              borderColor: theme.colors.teal[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.teal[7] }
            }
          })
        })
      })
      .catch(error => {
        notifications.show({
          title: error.response.statusText,
          message: error.response.data.message,
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] }
            }
          })
        })
      })
  }

  return (
    <Popover
      width={300}
      withinPortal={true}
      trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="left">
          <ActionIcon color="red">
            <IconTrash size="1rem" stroke={1.5} onClick={() => setOpened(o => !o)} />
          </ActionIcon>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text weight={500} className={cx(classes.form)}>
          Are you sure you want to delete this member?
        </Text>
        <Text size="sm" className={cx(classes.form)}>
          Press Confirm to proceed with the deletion or press Cancel to abort
        </Text>
        <Group className={cx(classes.form)} position="right">
          <Button variant="outline" size="xs" color="blue" onClick={() => setOpened(o => !o)}>
            Cancel
          </Button>
          <Button size="xs" color="blue" onClick={() => deleteMembership()}>
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteMembership
