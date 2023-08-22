import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles, Title, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { deleteCommunityByID } from '~/api/communities/manage/my-community'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
}))

const DeleteCommunity = ({ props, totalResources, refetch }) => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)

  const deleteCommunity = () => {
    deleteCommunityByID(props?.community_id).then(() => {
      refetch()
      setOpened(o => !o)
    })
  }

  return (
    <Popover
      width={300}
      // withinPortal={true}
      trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group>
          <UnstyledButton
            className={classes.button}
            onClick={e => {
              e.stopPropagation()
              setOpened(o => !o)
            }}
          >
            <IconTrash size="1rem" stroke={1.5} />
            {'  '} Delete Community
          </UnstyledButton>
        </Group>
      </Popover.Target>
      {totalResources === 0 ? (
        <Popover.Dropdown
          sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
          })}
        >
          <Text weight={500} className={cx(classes.form)}>
            Are you sure you want to delete {props?.community_id} community?
          </Text>
          <Text size="sm" className={cx(classes.form)}>
            Press Confirm to proceed with the deletion or press Cancel to abort
          </Text>
          <Group className={cx(classes.form)} position="right">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                setOpened(o => !o)
                e.stopPropagation()
              }}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              color="blue"
              onClick={e => {
                deleteCommunity()
                e.stopPropagation()
              }}
            >
              Confirm
            </Button>
          </Group>
        </Popover.Dropdown>
      ) : (
        <Popover.Dropdown
          sx={theme => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
          })}
        >
          <Title color="orange" order={4}>
            Warning!
          </Title>
          <Text size="sm" className={cx(classes.form)}>
            {props?.community_id} community has {totalResources} remaining resources which should be
            deleted first to allow the community to be deleted.
          </Text>

          <Group className={cx(classes.form)} position="right">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                setOpened(o => !o)
                e.stopPropagation()
              }}
            >
              Close
            </Button>
          </Group>
        </Popover.Dropdown>
      )}
    </Popover>
  )
}

export default DeleteCommunity
