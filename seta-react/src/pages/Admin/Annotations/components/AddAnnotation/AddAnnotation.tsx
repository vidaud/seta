import { Group, Button, useMantineTheme, Modal, Divider, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import CreateForm from './components/CreateForm'
import * as S from './styles'

const useStyles = createStyles({
  button: {
    border: 'none',
    width: '10rem'
  },
  notification: {
    position: 'absolute',
    top: 10,
    right: 0
  }
})

const AddAnnotation = () => {
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
      >
        <Divider my="xs" label="Add New Annotation" labelPosition="center" />
        <CreateForm close={close} />
      </Modal>
      <Group id="new_annotation" position="right" css={S.root} variant="outline">
        <Button
          className={classes.button}
          size="sm"
          color="gray"
          onClick={open}
          variant="outline"
          h="40px"
          rightIcon={<IconPlus size="1rem" />}
        >
          New Annotation
        </Button>
      </Group>
    </>
  )
}

export default AddAnnotation
