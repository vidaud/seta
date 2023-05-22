import { Group, ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconPencil, IconTrash, IconEye } from '@tabler/icons-react'

import { deleteResourceByID } from '../../../../../../api/resources/manage/my-resource'
import { environment } from '../../../../../../environments/environment'

const ResourceButtons = item => {
  const deleteResource = () => {
    deleteResourceByID(item.item.resource_id, item.item.community_id)
  }

  return (
    <Group spacing={0}>
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
            href={`${environment.COMMUNITIES_API_PATH}/update/${item.item.community_id}/${item.item.resource_id}`}
          >
            Update
          </Menu.Item>
          <Menu.Item
            icon={<IconEye size="1rem" stroke={1.5} />}
            component="a"
            href={`${environment.COMMUNITIES_API_PATH}/details/${item.item.community_id}/${item.item.resource_id}`}
          >
            View Details
          </Menu.Item>
          <Menu.Item
            icon={<IconTrash size="1rem" stroke={1.5} />}
            color="red"
            onClick={deleteResource}
          >
            Delete Resource
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default ResourceButtons
