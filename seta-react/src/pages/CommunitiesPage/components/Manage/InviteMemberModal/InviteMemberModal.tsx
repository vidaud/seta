import { Modal, useMantineTheme, Group, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const InviteMember = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Create Community"
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}
      >
        {/* Modal content */}
      </Modal>

      <Group position="right">
        <Button onClick={open} variant="outline" size="xs" color="orange">
          + Invite
        </Button>
      </Group>
    </>
  )
}

export default InviteMember
