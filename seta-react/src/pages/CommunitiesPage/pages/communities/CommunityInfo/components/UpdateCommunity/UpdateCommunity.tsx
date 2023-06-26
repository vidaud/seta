import { useEffect, useState } from 'react'
import { useMantineTheme, Modal, Divider, ActionIcon, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'

import UpdateForm from './components/UpdateForm/UpdateForm'

const UpdateCommunity = ({ id, community_scopes }) => {
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  useEffect(() => {
    const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
  }, [community_scopes, id])

  return (
    <>
      {scopes?.includes('/seta/community/manager') || scopes?.includes('/seta/community/owner') ? (
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
            <Divider my="xs" label="Update Community" labelPosition="center" />
            <UpdateForm id={id} />
          </Modal>
          <Tooltip label="Update Community">
            <ActionIcon>
              <IconPencil size="1rem" stroke={1.5} onClick={open} />
            </ActionIcon>
          </Tooltip>
        </>
      ) : null}
    </>
  )
}

export default UpdateCommunity
