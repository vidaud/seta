import { Group, ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconPencil, IconTrash, IconEye, IconSettings } from '@tabler/icons-react'

import { deleteCommunityByID } from '../../../../../api/communities/community'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const COMMUNITIES_API_PATH = 'http://localhost/communities'

const CommunityButtons = item => {
  const deleteCommunity = () => {
    deleteCommunityByID(item.item.community_id)
  }

  return (
    <Group spacing={0} position="right">
      <InviteMember />
      <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon>
            <IconDots size="1rem" stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconPencil size="1rem" stroke={1.5} />}
            component="a"
            href={`${COMMUNITIES_API_PATH}/update/${item.item.community_id}`}
          >
            Update
          </Menu.Item>
          <Menu.Item
            icon={<IconSettings size="1rem" stroke={1.5} />}
            component="a"
            href={`${COMMUNITIES_API_PATH}/manage/${item.item.community_id}`}
          >
            Manage
          </Menu.Item>
          <Menu.Item
            icon={<IconEye size="1rem" stroke={1.5} />}
            component="a"
            href={`${COMMUNITIES_API_PATH}/details/${item.item.community_id}`}
          >
            View Details
          </Menu.Item>
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
