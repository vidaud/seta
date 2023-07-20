import { Group, Button, useMantineTheme, Modal, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import CreateForm from './components/CreateForm/CreateForm'
import * as S from './styles'

const CreateResource = ({ id }) => {
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
        <Divider my="xs" label="Add New Resource" labelPosition="center" />
        <CreateForm id={id} close={close} />
      </Modal>
      <Group
        position="right"
        css={S.root}
        sx={{ width: '100%', border: '1px solid #d0d4d7', borderRadius: '0.25rem' }}
      >
        <Button
          size="xs"
          color="blue"
          variant="outline"
          onClick={open}
          h="35px"
          rightIcon={<IconPlus size="1rem" />}
        >
          New Resource
        </Button>
      </Group>
    </>
  )
}

export default CreateResource
