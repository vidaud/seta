import { Group, Button, useMantineTheme, Modal, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import { useDatasourceIndexes } from '~/api/admin/datasource_indexes'

import CreateForm from './components/CreateForm'
import * as S from './styles'

const AddDatasource = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()
  const { data } = useDatasourceIndexes()
  const rows = data?.map(item => item.name)

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
      >
        <Divider my="xs" label="Add New Datasource" labelPosition="center" />
        <CreateForm close={close} categories={rows} />
      </Modal>
      <Group id="new_datasource" css={S.root} variant="outline" sx={{ justifyContent: 'center' }}>
        <Button onClick={open} rightIcon={<IconPlus size="1rem" />} mt="xs">
          New Datasource
        </Button>
      </Group>
    </>
  )
}

export default AddDatasource
