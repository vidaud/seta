import { Group, ActionIcon, Menu, createStyles, Tooltip } from '@mantine/core'
import { IconDots, IconPencil, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import DeleteResource from '../../../DeleteResourceButton/DeleteResourceButton'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const ResourceButtons = item => {
  const { classes } = useStyles()

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
          <DeleteResource props={item} />
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default ResourceButtons
