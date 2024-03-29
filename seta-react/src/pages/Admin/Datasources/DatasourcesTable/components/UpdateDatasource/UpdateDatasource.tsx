import {
  useMantineTheme,
  Modal,
  Divider,
  Tooltip,
  UnstyledButton,
  createStyles
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit } from '@tabler/icons-react'

import UpdateForm from './components/UpdateForm'

const useStyles = createStyles({
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
})

const UpdateDatasource = ({ datasource }) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  return (
    <>
      <Modal
        size="50%"
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
        <Divider my="xs" label="Update Datasource" labelPosition="center" />
        <UpdateForm datasource={datasource} close={close} />
      </Modal>

      <Tooltip label="Update Datasource">
        <UnstyledButton
          className={classes.button}
          onClick={e => {
            e.stopPropagation()
            open()
          }}
        >
          <IconEdit size="1rem" stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </>
  )
}

export default UpdateDatasource
