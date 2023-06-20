import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { deleteResourceByID } from '../../../../../../api/resources/manage/my-resource'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md }
}))

const DeleteResource = ({ props }) => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)

  const deleteResource = () => {
    deleteResourceByID(props.item.resource_id)
  }

  return (
    <Popover
      width={300}
      withinPortal={true}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="left">
          <Button
            className="deleteResource"
            variant="outline"
            color="red"
            leftIcon={<IconTrash size="1rem" stroke={1.5} />}
            onClick={() => setOpened(o => !o)}
          >
            Delete Resource
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text weight={500} className={cx(classes.form)}>
          Are you sure you want to delete {props.item.resource_id} resource?
        </Text>
        <Text size="sm" className={cx(classes.form)}>
          Press Confirm to proceed with the deletion or press Cancel to abort
        </Text>
        <Group className={cx(classes.form)} position="right">
          <Button variant="outline" size="xs" color="blue" onClick={() => setOpened(o => !o)}>
            Cancel
          </Button>
          <Button size="xs" color="blue" onClick={() => deleteResource()}>
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteResource
