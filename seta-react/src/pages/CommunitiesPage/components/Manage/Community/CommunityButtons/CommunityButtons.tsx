import { Group, ActionIcon, Menu, createStyles } from '@mantine/core'
import { IconDots, IconPencil, IconTrash, IconEye, IconSettings } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { deleteCommunityByID } from '../../../../../../api/communities/manage/my-community'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButtons = item => {
  const { classes } = useStyles()

  const deleteCommunity = () => {
    deleteCommunityByID(item.item.community_id)
  }

  return (
    <Group spacing={0} position="right">
      <InviteMember id={item.item.community_id} />
      <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon>
            <IconDots size="1rem" stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Link
            className={classes.link}
            to={`/my-communities/${item.item.community_id}/update`}
            replace={true}
          >
            <Menu.Item icon={<IconPencil size="1rem" stroke={1.5} />}>Update</Menu.Item>
          </Link>
          <Link
            className={classes.link}
            to={`/my-communities/${item.item.community_id}/manage`}
            replace={true}
          >
            <Menu.Item icon={<IconSettings size="1rem" stroke={1.5} />}>Manage</Menu.Item>
          </Link>
          <Link
            className={classes.link}
            to={`/my-communities/${item.item.community_id}`}
            replace={true}
          >
            <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>View Details</Menu.Item>
          </Link>
          <Menu.Item
            icon={<IconTrash size="1rem" stroke={1.5} />}
            color="red"
            onClick={deleteCommunity}
          >
            Delete Community
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default CommunityButtons
