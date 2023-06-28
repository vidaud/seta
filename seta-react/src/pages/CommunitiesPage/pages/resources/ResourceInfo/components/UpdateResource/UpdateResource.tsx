import { useEffect, useState } from 'react'
import { useMantineTheme, Modal, Divider, ActionIcon, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'

import UpdateForm from './components/UpdateForm/UpdateForm'

const UpdateResource = ({ id, resource_scopes }) => {
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
  }, [resource_scopes, id])

  return (
    <>
      {scopes?.includes('/seta/resource/edit') ? (
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
            <Divider my="xs" label="Update Resource" labelPosition="center" />
            <UpdateForm id={id} />
          </Modal>
          <Tooltip label="Update Resource" color="gray">
            <ActionIcon>
              <IconPencil size="1rem" stroke={1.5} onClick={open} />
            </ActionIcon>
          </Tooltip>
        </>
      ) : null}
    </>
  )
}

export default UpdateResource
