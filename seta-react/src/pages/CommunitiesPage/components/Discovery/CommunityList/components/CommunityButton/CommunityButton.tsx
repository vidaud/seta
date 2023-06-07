import { useEffect, useState } from 'react'
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
  const [data, setData] = useState(props)

  useEffect(() => {
    if (props) {
      setData(props)
    }
  }, [props, data])

  return (
    <>
      <Group>
        {data.community.status === 'membership' || data.community.status === 'invited' ? (
          <Tooltip label="View Details">
            <Link
              className={classes.link}
              to={`/communities/${data.community.community_id}`}
              replace={true}
            >
              <ActionIcon>
                <IconEye size="1rem" stroke={1.5} />
              </ActionIcon>
            </Link>
          </Tooltip>
        ) : (
          <ViewClosedCommunity community={data.community} />
        )}
        {data.community.status === 'membership' ? (
          <Button variant="filled" size="xs">
            LEAVE
          </Button>
        ) : data.community.status === 'pending' ? (
          <Button variant="outline" size="xs">
            PENDING
          </Button>
        ) : data.community.status === 'invited' ? (
          <Button variant="outline" size="xs" color="orange">
            INVITED
          </Button>
        ) : data.community.status === 'unknown' && data.community.membership === 'closed' ? (
          <MembershipRequest community_id={data.community.community_id} />
        ) : data.community.status === 'unknown' && data.community.membership === 'open' ? (
          <OpenCommunityMember community_id={data.community.community_id} />
        ) : data.community.status === 'rejected' ? (
          <Button variant="filled" size="xs" color="red">
            REJECTED
          </Button>
        ) : null}
      </Group>
    </>
  )
}

export default CommunityButton
