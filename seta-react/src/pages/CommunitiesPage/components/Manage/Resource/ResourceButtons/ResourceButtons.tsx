import { Group, ActionIcon, Menu, createStyles } from '@mantine/core'
import { IconDots, IconPencil, IconTrash, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { deleteResourceByID } from '../../../../../../api/resources/manage/my-resource'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const ResourceButtons = item => {
  const { classes } = useStyles()

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
          <Menu.Item icon={<IconPencil size="1rem" stroke={1.5} />}>
            <Link
              className={classes.link}
              to={`/my-resources/${item.item.resource_id}/update`}
              replace={true}
            >
              Update
            </Link>
          </Menu.Item>
          <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>
            <Link
              className={classes.link}
              to={`/my-resources/${item.item.resource_id}`}
              replace={true}
            >
              View Details
            </Link>
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
