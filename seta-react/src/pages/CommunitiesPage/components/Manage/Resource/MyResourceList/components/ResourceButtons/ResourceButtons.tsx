import { Group, ActionIcon, Menu, createStyles, Tooltip } from '@mantine/core'
import { IconDots, IconPencil, IconTrash, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { deleteResourceByID } from '../../../../../../../../api/resources/manage/my-resource'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const ResourceButtons = item => {
  const { classes } = useStyles()

  const deleteResource = () => {
    deleteResourceByID(item.item.resource_id)
  }

  return (
    <Group spacing={0}>
      <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
        <Menu.Target>
          <Tooltip label="Resource Actions">
            <ActionIcon>
              <IconDots size="1rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Link
            className={classes.link}
            to={`/my-resources/${item.item.resource_id}/update`}
            replace={true}
          >
            <Menu.Item icon={<IconPencil size="1rem" stroke={1.5} />}>Update</Menu.Item>
          </Link>

          <Link
            className={classes.link}
            to={`/my-resources/${item.item.resource_id}`}
            replace={true}
          >
            <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>View Details</Menu.Item>
          </Link>

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
