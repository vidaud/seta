import {
  useMantineTheme,
  Modal,
  Divider,
  Tooltip,
  UnstyledButton,
  createStyles
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { RiUserSettingsLine } from 'react-icons/ri'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'

import AssignScopes from './components/AssignScopes/AssignScopes'

const useStyles = createStyles({
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
})

const ManageScopes = ({ datasource_id }) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const { data } = useCategoryCatalogueScopes(ScopeCategory.Datasource)
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
        <Divider my="xs" label="Manage Scopes" labelPosition="center" />
        <AssignScopes scopes={data} datasource_id={datasource_id} close={close} />
        {/* <UpdateForm datasource={datasource} close={close} /> */}
      </Modal>

      <Tooltip label="Manage Scopes">
        <UnstyledButton
          className={classes.button}
          onClick={e => {
            e.stopPropagation()
            open()
          }}
        >
          <RiUserSettingsLine size="1rem" stroke="1.5" />
        </UnstyledButton>
      </Tooltip>
    </>
  )
}

export default ManageScopes
