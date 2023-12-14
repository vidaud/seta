import { Group, Button, useMantineTheme, Modal, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import { useAnnotationCategories } from '~/api/admin/annotation_categories'

import CreateForm from './components/CreateForm'
import * as S from './styles'

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
      <Group id="new_annotation" css={S.root} variant="outline" sx={{ justifyContent: 'center' }}>
        <Button
          size="xs"
          color="gray"
          fw="bold"
          onClick={open}
          variant="outline"
          rightIcon={<IconPlus size="1rem" />}
        >
          New Annotation
        </Button>
      </Group>
    </>
  )
}

export default AddAnnotation
