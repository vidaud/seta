import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { useDeleteAnnotation } from '~/api/admin/annotations'
import { notifications } from '~/utils/notifications'

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

const DeleteAnnotation = ({ annotation }) => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)
  const setDeleteAnnotationMutation = useDeleteAnnotation(annotation?.label)

  const deleteAnnotation = () => {
    setDeleteAnnotationMutation.mutate(annotation?.label, {
      onSuccess: () => {
        notifications.showSuccess(`Annotation deleted successfully!`, { autoClose: true })

        setOpened(o => !o)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        notifications.showError('Delete annotation failed!', {
          description: error?.response?.data?.msg,

          autoClose: true
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
          Are you sure you want to delete {annotation?.name} annotation?
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
              deleteAnnotation()
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

export default DeleteAnnotation
