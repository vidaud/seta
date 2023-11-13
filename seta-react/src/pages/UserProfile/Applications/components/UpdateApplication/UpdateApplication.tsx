import {
  useMantineTheme,
  Modal,
  Divider,
  Tooltip,
  UnstyledButton,
  createStyles
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil } from '@tabler/icons-react'

import UpdateForm from './components/UpdateForm'

const useStyles = createStyles({
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
})

const UpdateApplication = ({ application }) => {
  const { classes } = useStyles()
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
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <Divider my="xs" label="Update Application" labelPosition="center" />
        <UpdateForm application={application} close={close} />
      </Modal>

      <Tooltip label="Update Application">
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
    </>
  )
}

export default UpdateApplication
