import { Popover, Button, TextInput, Group, Textarea, createStyles } from '@mantine/core'

const useStyles = createStyles({
  form: {
    marginTop: '20px'
  }
})

const InviteMember = () => {
  const { classes, cx } = useStyles()

  return (
    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Group position="right">
          <Button variant="outline" size="xs" color="orange">
            + Invite
          </Button>
        </Group>
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <TextInput label="Emails" placeholder="john@doe.com" size="xs" mt="xs" />
        <Textarea label="Message" placeholder="Message" size="xs" />

        <Group className={cx(classes.form)}>
          <Button variant="outline" size="xs" color="blue">
            Cancel
          </Button>
          <Button size="xs">Send</Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default InviteMember
