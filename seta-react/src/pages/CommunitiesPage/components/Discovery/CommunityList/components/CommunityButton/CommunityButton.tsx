import { useEffect, useState } from 'react'
import { ActionIcon, Button, Group, createStyles, Tooltip, Notification } from '@mantine/core'
import { IconEye, IconX } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { leaveCommunity } from '../../../../../../../api/communities/my-membership'
import MembershipRequest from '../../../../Manage/Members/InviteMemberModal/InviteMemberModal'
import OpenCommunityMember from '../../../../Manage/Members/OpenCommunityMember/OpenCommunityMember'
import UpdateInviteRequest from '../../../../Sidebar/InvitesList/components/UpdateInviteRequest'
import ViewClosedCommunity from '../ViewClosedCommunity'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButton = ({ props, onReload }) => {
  const { classes } = useStyles()
  const [data, setData] = useState(props)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (props) {
      setData(props)
    }
  }, [props, data])

  const deleteMembership = () => {
    leaveCommunity(data.community_id)
      .then(() =>
        setTimeout(() => {
          onReload()
        }, 100)
      )
      .catch(error => {
        if (error.response.status === 409) {
          setMessage(error.response.data.message)
        }
      })
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
          <ViewClosedCommunity community={data.community_id} onReload={onReload} />
        )}
        {data.status === 'membership' ? (
          <>
            {' '}
            <Button variant="filled" size="xs" onClick={() => deleteMembership()}>
              LEAVE
            </Button>
            {message !== '' ? (
              <Notification
                title="We notify you that"
                icon={<IconX size="1.1rem" />}
                color="red"
                onClose={() => setMessage('')}
              >
                {message}
              </Notification>
            ) : null}
          </>
        ) : data.status === 'pending' ? (
          <Button color="gray" variant="outline" size="xs">
            PENDING
          </Button>
        ) : data.status === 'invited' ? (
          // <Button variant="outline" size="xs" color="orange">
          //   INVITED
          // </Button>
          <UpdateInviteRequest props={data} parent="CommunityList" />
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
