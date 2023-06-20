import { useEffect, useState } from 'react'
import { Group, ActionIcon, Menu, createStyles, Tooltip } from '@mantine/core'
import { IconDots, IconPencil, IconEye, IconSettings } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { useMyCommunityID } from '../../../../../../../../api/communities/manage/my-community'
import { useCurrentUserPermissions } from '../../../../../../contexts/scope-context'
import DeleteCommunity from '../../../DeleteCommunity/DeleteCommunity'
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
  const { community_scopes } = useCurrentUserPermissions()
  const [scopes, setScopes] = useState<string[] | undefined>([])

  useEffect(() => {
    if (data) {
      setRow(data)
      const findCommunity = community_scopes?.filter(
        scope => scope.community_id === item.community_id
      )

      findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
    }
  }, [data, row, community_scopes, item])

  return (
    <Group spacing={0} position="right">
      {scopes?.includes('/seta/community/invite') ? <InviteMember id={item.community_id} /> : null}

      <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
        <Menu.Target>
          <Tooltip label="Community Actions">
            <ActionIcon>
              <IconDots size="1rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          {scopes?.includes('/seta/community/manager') ? (
            <Link
              className={classes.link}
              to={`/my-communities/${item.community_id}/update`}
              replace={true}
            >
              <Menu.Item icon={<IconPencil size="1rem" stroke={1.5} />}>Update</Menu.Item>
            </Link>
          ) : null}
          {scopes?.includes('/seta/community/manager') ? (
            <Link
              className={classes.link}
              to={`/my-communities/${item.community_id}/manage`}
              replace={true}
            >
              <Menu.Item icon={<IconSettings size="1rem" stroke={1.5} />}>Manage</Menu.Item>
            </Link>
          ) : null}
          <Link className={classes.link} to={`/my-communities/${item.community_id}`} replace={true}>
            <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>View Details</Menu.Item>
          </Link>
          {scopes?.includes('/seta/community/owner') ? <DeleteCommunity props={row} /> : null}
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default CommunityButtons
