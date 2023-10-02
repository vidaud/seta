import { useEffect, useState } from 'react'
import {
  useMantineTheme,
  Modal,
  Divider,
  Tooltip,
  UnstyledButton,
  createStyles,
  Group
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'

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

const UpdateCommunity = ({ community, community_scopes, onChange }) => {
  const { classes } = useStyles()
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  useEffect(() => {
    const findCommunity = community_scopes?.filter(
      scope => scope.community_id === community.community_id
    )

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
  }, [community_scopes, community])

  const isManager =
    scopes?.includes('/seta/community/owner') || scopes?.includes('/seta/community/manager')

  return (
    <>
      {isManager ? (
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
            <Divider my="xs" label="Update Community" labelPosition="center" />
            <UpdateForm community={community} close={close} onChange={onChange} />
          </Modal>
          <Group>
            <Tooltip label="Update Community">
              <UnstyledButton
                className={classes.button}
                onClick={e => {
                  e.stopPropagation()
                  onChange(false)
                  open()
                }}
              >
                <IconPencil size="1rem" stroke={1.5} />
                {'  '} Update Community
              </UnstyledButton>
            </Tooltip>
          </Group>
        </>
      ) : null}
    </>
  )
}

export default UpdateCommunity
