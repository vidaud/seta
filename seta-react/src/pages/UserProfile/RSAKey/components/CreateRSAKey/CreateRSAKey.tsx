import { Group, Button, useMantineTheme, Modal, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import CreateForm from './components/CreateForm/CreateForm'
import * as S from './styles'

const CreateRSAKey = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}
      >
        <Divider my="xs" label="Add New Key" labelPosition="center" />
        <CreateForm close={close} />
      </Modal>
      <Group
        id="new_key"
        position="left"
        css={S.root}
        sx={{ width: '100%', border: '1px solid #d0d4d7', borderRadius: '0.25rem' }}
      >
        <Button variant="outline" onClick={open}>
          Add new key
        </Button>
      </Group>
    </>
  )
}

export default CreateRSAKey
