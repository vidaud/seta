import { useEffect, useState } from 'react'
import { useMantineTheme, Modal, Divider, UnstyledButton, createStyles, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'

import type { ResourceResponse } from '~/api/types/resource-types'

import UpdateForm from './components/UpdateForm/UpdateForm'

import type { ResourceScopes } from '../../../../contexts/scope-context'

const useStyles = createStyles({
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
})

type Props = {
  resource: ResourceResponse
  resource_scopes: ResourceScopes[] | undefined
}

const UpdateResource = ({ resource, resource_scopes }: Props) => {
  const { classes } = useStyles()
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  useEffect(() => {
    const findResource = resource_scopes?.filter(
      scope => scope.resource_id === resource.resource_id
    )

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
  }, [resource_scopes, resource])

  return (
    <>
      {scopes?.includes('/seta/resource/edit') ? (
        <>
          <Modal
            opened={opened}
            onClose={close}
            withCloseButton={true}
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
              opacity: 0.55,
              blur: 3
            }}
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <Divider my="xs" label="Update Resource" labelPosition="center" />
            <UpdateForm resource={resource} close={close} />
          </Modal>

          <Group>
            <UnstyledButton
              className={classes.button}
              onClick={e => {
                e.stopPropagation()
                open()
              }}
            >
              <IconPencil size="1rem" stroke={1.5} />
              {'  '} Update Resource
            </UnstyledButton>
          </Group>
        </>
      ) : null}
    </>
  )
}

export default UpdateResource
