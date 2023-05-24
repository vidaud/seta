import { Group, ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconPencil, IconTrash, IconEye, IconSettings } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import { deleteCommunityByID } from '../../../../../../api/communities/manage/my-community'
import InviteMember from '../InviteMemberModal/InviteMemberModal'

const CommunityButtons = item => {
  const navigate = useNavigate()

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
          <Menu.Item
            icon={<IconPencil size="1rem" stroke={1.5} />}
            component="a"
            onClick={() => {
              navigate(`/manage/my-communities/update/${item.item.community_id}`)
            }}
          >
            Update
          </Menu.Item>
          <Menu.Item
            icon={<IconSettings size="1rem" stroke={1.5} />}
            component="a"
            onClick={() => {
              navigate(`/manage/my-communities/manage/${item.item.community_id}`)
            }}
          >
            Manage
          </Menu.Item>
          <Menu.Item
            icon={<IconEye size="1rem" stroke={1.5} />}
            component="a"
            onClick={() => {
              navigate(`/manage/my-communities/details/${item.item.community_id}`)
            }}
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
