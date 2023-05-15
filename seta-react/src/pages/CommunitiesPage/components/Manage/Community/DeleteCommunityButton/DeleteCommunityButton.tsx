import { Text, Popover, Button, Group, createStyles } from '@mantine/core'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const DeleteCommunity = () => {
  const { classes, cx } = useStyles()

  return (
    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Group position="left">
          <Button className="deleteCommunity" color="red">
            Delete
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text>Are you sure you want to delete this community?</Text>

        <Group className={cx(classes.form)} position="right">
          <Button variant="outline" size="xs" color="blue">
            Cancel
          </Button>
          <Button size="xs" color="red">
            Delete
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DeleteCommunity
