import { useEffect, useState } from 'react'
import { Group, ActionIcon, Menu, createStyles, Tooltip } from '@mantine/core'
import { IconDots, IconPencil, IconEye, IconSettings } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { useMyCommunityID } from '../../../../../../../../api/communities/manage/my-community'
import DeleteCommunity from '../../../DeleteCommunityButton/DeleteCommunityButton'
import InviteMember from '../../../InviteMemberModal/InviteMemberModal'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButtons = ({ item }) => {
  const { classes } = useStyles()
  const { data } = useMyCommunityID(item.community_id)
  const [row, setRow] = useState(data)

  useEffect(() => {
    if (data) {
      setRow(data)
    }
  }, [data, row])

  return (
    <Group spacing={0} position="right">
      <InviteMember id={item.community_id} />

      <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
        <Menu.Target>
          <Tooltip label="Community Actions">
            <ActionIcon>
              <IconDots size="1rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Link
            className={classes.link}
            to={`/my-communities/${item.community_id}/update`}
            replace={true}
          >
            <Menu.Item icon={<IconPencil size="1rem" stroke={1.5} />}>Update</Menu.Item>
          </Link>
          <Link
            className={classes.link}
            to={`/my-communities/${item.community_id}/manage`}
            replace={true}
          >
            <Menu.Item icon={<IconSettings size="1rem" stroke={1.5} />}>Manage</Menu.Item>
          </Link>
          <Link className={classes.link} to={`/my-communities/${item.community_id}`} replace={true}>
            <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>View Details</Menu.Item>
          </Link>
          <DeleteCommunity props={row} />
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default CommunityButtons
