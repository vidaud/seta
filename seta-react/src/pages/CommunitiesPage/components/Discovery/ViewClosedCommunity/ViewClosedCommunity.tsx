import { Table, Text, Group, createStyles, Tooltip, ActionIcon, Modal, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEye } from '@tabler/icons-react'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm,
    color: '#000000'
  },
  table: {
    width: '100%',
    paddingTop: theme.spacing.md
  },
  td: {
    width: '50%'
  }
}))

const ViewClosedCommunity = ({ community }) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal opened={opened} onClose={close} title="Community Details" centered>
        <Title order={5} className={classes.title}>
          {community.title}
        </Title>
        <Text size="xs" className={classes.text}>
          {community.description}
        </Text>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td className={classes.td}>
                <Text className={classes.text}>Status: {community.status}</Text>
              </td>
            </tr>
            <tr>
              <td className={classes.td}>
                <Text className={classes.text}>Created by: {community.creator.user_id}</Text>
              </td>
              <td className={classes.td}>
                <Text className={classes.text}>
                  Created at: {new Date(community.created_at).toDateString()}
                </Text>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal>

      <Group position="center">
        <Tooltip label="View Details">
          <ActionIcon>
            <IconEye size="1rem" stroke={1.5} onClick={open} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  )
}

export default ViewClosedCommunity
