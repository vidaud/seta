import { Group, Button, useMantineTheme, Modal, Divider, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import * as S from './styles'

import CreateContribution from '../../../../contributors/NewContribution/NewContribution'

const useStyles = createStyles({
  button: {
    border: 'none'
  }
})

const CreateContributionButton = () => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()

  return (
    <>
      <Modal
        opened={opened}
        size={1000}
        onClose={close}
        withCloseButton={true}
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3
        }}
      >
        <Divider my="xs" label="Add New Contribution" labelPosition="center" />
        <CreateContribution />
      </Modal>
      <Group
        position="left"
        css={S.root}
        sx={{ width: '100%', border: '1px solid #d0d4d7', borderRadius: '0.25rem' }}
      >
        <Button
          className={classes.button}
          size="xs"
          color="gray"
          variant="outline"
          onClick={open}
          h="35px"
          rightIcon={<IconPlus size="1rem" />}
        >
          New Contribution
        </Button>
      </Group>
    </>
  )
}

export default CreateContributionButton
