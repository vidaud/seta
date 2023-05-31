import { useEffect, useState } from 'react'
import { ActionIcon, Button, Menu, Group, createStyles } from '@mantine/core'
import { IconDots, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { useMembershipID } from '../../../../../../api/communities/discover/community'
import MembershipRequest from '../../../Manage/Members/InviteMemberModal/InviteMemberModal'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButton = props => {
  const { classes, cx } = useStyles()
  const { data } = useMembershipID(props.community.community_id)
  const [row, setRow] = useState(data)

  useEffect(() => {
    if (data) {
      setRow(data)
    }
  }, [data, row])

  return (
    <>
      <Group>
        {data && data?.members?.length > 0 ? (
          <Group>
            <Button variant="filled" size="xs">
              + JOINED
            </Button>
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="bottom-end"
              withinPortal
            >
              <Menu.Target>
                <ActionIcon>
                  <IconDots size="1rem" stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Link
                  className={classes.link}
                  to={`/communities/${props.community.community_id}`}
                  replace={true}
                >
                  <Menu.Item icon={<IconEye size="1rem" stroke={1.5} />}>View Details</Menu.Item>
                </Link>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : (
          <MembershipRequest community_id={props.community.community_id} />
        )}
      </Group>
    </>
  )
}

export default CommunityButton
