import { useMantineTheme, Modal, Divider, UnstyledButton, createStyles, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'

import type { ResourceResponse } from '~/api/types/resource-types'
import type { ResourceScopes } from '~/types/user/user-scopes'

import UpdateForm from './components/UpdateForm'

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
  resource_scopes?: ResourceScopes[] | undefined
  onChange: (value: boolean) => void
}

const UpdateResource = ({ resource, onChange }: Props) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  // const { resource_id } = resource
  const theme = useMantineTheme()

  return (
    <>
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
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Divider my="xs" label="Update Resource" labelPosition="center" />
          <UpdateForm resource={resource} close={close} onChange={onChange} />
        </Modal>

        <Group>
          <UnstyledButton
            className={classes.button}
            onClick={e => {
              e.stopPropagation()
              onChange(false)
              open()
            }}
          >
            <IconPencil size="1rem" stroke={1.5} />
            {'  '} Update Resource
          </UnstyledButton>
        </Group>
      </>
    </>
  )
}

export default UpdateResource
