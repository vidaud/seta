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

import UpdateForm from './components/UpdateForm/UpdateForm'

const useStyles = createStyles({
  button: {
    padding: '0.3rem 0.5rem',
    width: '100%',
    color: '#868e96',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
})

const UpdateCommunity = ({ community, community_scopes }) => {
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
            withCloseButton={true}
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
              opacity: 0.55,
              blur: 3
            }}
            onClick={e => e.stopPropagation()}
          >
            <Divider my="xs" label="Update Community" labelPosition="center" />
            <UpdateForm community={community} close={close} />
          </Modal>
          <Group sx={{ marginRight: '-1rem' }}>
            <Tooltip label="Update Community" color="gray">
              <UnstyledButton
                className={classes.button}
                onClick={e => {
                  e.stopPropagation()
                  open()
                }}
              >
                <IconPencil size="1rem" stroke={1.5} />
              </UnstyledButton>
            </Tooltip>
          </Group>
        </>
      ) : null}
    </>
  )
}

export default UpdateCommunity
