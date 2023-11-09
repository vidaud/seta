import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles, UnstyledButton } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'

import { useDeleteApplication } from '~/api/user/applications'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
}))

const DeleteApplication = ({ application }) => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)
  const setDeleteApplicationMutation = useDeleteApplication(application?.name)

  const deleteApplication = () => {
    setDeleteApplicationMutation.mutate(application?.name, {
      onSuccess: () => {
        notifications.show({
          message: `Application deleted successfully!`,
          color: 'blue',
          autoClose: 5000
        })

        setOpened(o => !o)
      },
      onError: () => {
        notifications.show({
          message: 'Delete application failed!',
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
        <UnstyledButton
          className={classes.button}
          onClick={e => {
            e.stopPropagation()
            setOpened(o => !o)
          }}
        >
          <IconTrash size="1rem" stroke={1.5} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text weight={500} className={cx(classes.form)}>
          Are you sure you want to delete {application?.name} application?
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
              deleteApplication()
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

export default DeleteApplication
