import { Text, Popover, Button, Group, createStyles } from '@mantine/core'

import { useRestrictedResourcesListContext } from '~/pages/UserProfile/common/contexts/restricted-resources-list'

const useStyles = createStyles(() => ({
  form: {
    marginTop: '20px'
  }
}))

const ManageResources = () => {
  const { classes, cx } = useStyles()
  const { opened, handleOpened } = useRestrictedResourcesListContext()

  return (
    <Popover
      width={300}
      trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={handleOpened}
    >
      <Popover.Target>
        <Group>
          <Button
            mt="sm"
            onClick={e => {
              e.stopPropagation()
              handleOpened(o => !o)
            }}
          >
            Update Resources
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text weight={500} className={cx(classes.form)}>
          You are about to update the restricted resource list.
        </Text>

        <Text className={cx(classes.form)}>
          Make sure to Uncheck the resources you want to remove from the list. If you uncheck them
          all, the restricted resources list will be empty!
        </Text>
        <Text size="sm" className={cx(classes.form)}>
          Press Confirm to proceed with the list update or press Cancel to abort
        </Text>
        <Group className={cx(classes.form)} position="right">
          <Button
            variant="outline"
            size="xs"
            color="blue"
            onClick={e => {
              handleOpened(o => !o)
              e.stopPropagation()
            }}
          >
            Cancel
          </Button>
          <Button size="xs" color="blue" type="submit">
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ManageResources
