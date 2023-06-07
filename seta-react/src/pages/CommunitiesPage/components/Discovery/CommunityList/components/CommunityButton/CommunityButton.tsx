import { useEffect } from 'react'
import { ActionIcon, Button, Group, createStyles, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import MembershipRequest from '../../../../Manage/Members/InviteMemberModal/InviteMemberModal'
import OpenCommunityMember from '../../../../Manage/Members/OpenCommunityMember/OpenCommunityMember'
import ViewClosedCommunity from '../ViewClosedCommunity'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButton = props => {
  const { classes } = useStyles()

  useEffect(() => {
    if (props) {
      console.log(props)
    }
  }, [props])

  return (
    <>
      <Group>
        {props.community.status === 'membership' || props.community.status === 'invited' ? (
          <Tooltip label="View Details">
            <Link
              className={classes.link}
              to={`/communities/${props.community.community_id}`}
              replace={true}
            >
              <ActionIcon>
                <IconEye size="1rem" stroke={1.5} />
              </ActionIcon>
            </Link>
          </Tooltip>
        ) : (
          <ViewClosedCommunity community={props.community} />
        )}
        {props.community.status === 'membership' ? (
          <Button variant="filled" size="xs">
            LEAVE
          </Button>
        ) : props.community.status === 'pending' ? (
          <Button variant="outline" size="xs">
            PENDING
          </Button>
        ) : props.community.status === 'invited' ? (
          <Button variant="outline" size="xs" color="orange">
            INVITED
          </Button>
        ) : props.community.status === 'unknown' && props.community.membership === 'closed' ? (
          <MembershipRequest community_id={props.community.community_id} />
        ) : props.community.status === 'unknown' && props.community.membership === 'open' ? (
          <OpenCommunityMember community_id={props.community.community_id} />
        ) : props.community.status === 'rejected' ? (
          <Button variant="filled" size="xs" color="red">
            REJECTED
          </Button>
        ) : null}
      </Group>
    </>
  )
}

export default CommunityButton
