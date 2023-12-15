import { useMantineTheme, Modal, Divider, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

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
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <Divider my="xs" label="Add New Annotation" labelPosition="center" />
        <CreateForm close={close} categories={rows} />
      </Modal>
      <UnstyledButton
        onClick={e => {
          e.stopPropagation()
          open()
        }}
        variant="none"
        fz="0.9rem"
      >
        New Annotation
      </UnstyledButton>
    </>
  )
}

export default AddAnnotation
