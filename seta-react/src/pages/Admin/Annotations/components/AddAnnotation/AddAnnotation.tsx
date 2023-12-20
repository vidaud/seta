import { useMantineTheme, Modal, Divider, Button, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import { useAnnotationCategories } from '~/api/admin/annotation_categories'

import CreateForm from './components/CreateForm'

const AddAnnotation = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()
  const { data } = useAnnotationCategories()
  const rows = data?.map(item => item.category)

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
      >
        <Divider my="xs" label="Add New Annotation" labelPosition="center" />
        <CreateForm close={close} categories={rows} />
      </Modal>

      <Group id="new_annotation" variant="outline" sx={{ justifyContent: 'center' }}>
        <Button onClick={open} rightIcon={<IconPlus size="1rem" />} mt="xs">
          New Annotation
        </Button>
      </Group>
    </>
  )
}

export default AddAnnotation
