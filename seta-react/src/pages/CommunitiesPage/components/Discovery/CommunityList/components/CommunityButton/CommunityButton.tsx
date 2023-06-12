import { useEffect, useState } from 'react'
import { ActionIcon, Button, Group, createStyles, Tooltip } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { leaveCommunity } from '../../../../../../../api/communities/my-membership'
import MembershipRequest from '../../../../Manage/Members/InviteMemberModal/InviteMemberModal'
import OpenCommunityMember from '../../../../Manage/Members/OpenCommunityMember/OpenCommunityMember'
import ViewClosedCommunity from '../ViewClosedCommunity'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButton = ({ props, onReload }) => {
  const { classes } = useStyles()
  const [data, setData] = useState(props)

  useEffect(() => {
    if (props) {
      setData(props)
    }
  }, [props, data])

  const deleteMembership = () => {
    leaveCommunity(data.community_id).then(() =>
      setTimeout(() => {
        onReload()
      }, 100)
    )
  }

  return (
    <>
      <Group>
        {data.status === 'membership' || data.status === 'invited' ? (
          <Tooltip label="View Details">
            <Link className={classes.link} to={`/communities/${data.community_id}`} replace={true}>
              <ActionIcon>
                <IconEye size="1rem" stroke={1.5} />
              </ActionIcon>
            </Link>
          </Tooltip>
        ) : (
          <ViewClosedCommunity community={data} />
        )}
        {data.status === 'membership' ? (
          <Button variant="filled" size="xs" onClick={() => deleteMembership()}>
            LEAVE
          </Button>
        ) : data.status === 'pending' ? (
          <Button variant="outline" size="xs">
            PENDING
          </Button>
        ) : data.status === 'invited' ? (
          <Button variant="outline" size="xs" color="orange">
            INVITED
          </Button>
        ) : data.status === 'unknown' && data.membership === 'closed' ? (
          <MembershipRequest community_id={data.community_id} onReload={onReload} />
        ) : data.status === 'unknown' && data.membership === 'opened' ? (
          <OpenCommunityMember community_id={data.community_id} onReload={onReload} />
        ) : data.status === 'rejected' ? (
          <Button variant="filled" size="xs" color="red">
            REJECTED
          </Button>
        ) : null}
      </Group>
    </>
  )
}

export default CommunityButton
