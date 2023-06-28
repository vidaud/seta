import { useState } from 'react'
import { Text, Popover, Button, Group, createStyles, Title, Tooltip } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { deleteCommunityByID } from '../../../../../../../api/communities/manage/my-community'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md }
}))

const DeleteCommunity = ({ props, totalResources }) => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)

  const deleteCommunity = () => {
    deleteCommunityByID(props?.community_id)
  }

  return (
    <Popover
      width={300}
      withinPortal={true}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Tooltip label="Delete Community" color="red">
          <Button
            className="deleteCommunity"
            variant="outline"
            color="red"
            size="xs"
            leftIcon={<IconTrash size="1rem" stroke={1.5} />}
            onClick={() => setOpened(o => !o)}
          >
            Delete Community
          </Button>
        </Tooltip>
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
            <Button variant="outline" size="xs" color="blue" onClick={() => setOpened(o => !o)}>
              Cancel
            </Button>
            <Button size="xs" color="blue" onClick={() => deleteCommunity()}>
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
            <Button variant="outline" size="xs" color="blue" onClick={() => setOpened(o => !o)}>
              Close
            </Button>
          </Group>
        </Popover.Dropdown>
      )}
    </Popover>
  )
}

export default DeleteCommunity
