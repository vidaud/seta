import { useEffect, useState } from 'react'
import { Group, Button, useMantineTheme, Modal, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import CreateForm from './components/CreateForm'
import * as S from './styles'

const CreateCommunity = ({ system_scopes }) => {
  const [scopes, setScopes] = useState<string | undefined>('')
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  useEffect(() => {
    setScopes(system_scopes ? system_scopes[0].scope : '')
  }, [system_scopes])

  return (
    <>
      {scopes === '/seta/community/create' ? (
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
            <Divider my="xs" label="Add New Community" labelPosition="center" />
            <CreateForm close={close} />
          </Modal>
          <Group
            position="right"
            css={S.root}
            sx={{ width: '100%', border: '1px solid #d0d4d7', borderRadius: '0.25rem' }}
          >
            <Button
              size="sm"
              color="green"
              onClick={open}
              h="40px"
              rightIcon={<IconPlus size="1rem" color="white" />}
            >
              New Community
            </Button>
          </Group>
        </>
      ) : null}
    </>
  )
}

export default CreateCommunity
