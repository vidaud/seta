import { useEffect, useState } from 'react'
import { Button, Group, Notification } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import MembershipRequest from '../../../../../components/Manage/Members/InviteMemberModal/InviteMemberModal'
import OpenCommunityMember from '../../../../../components/Manage/Members/OpenCommunityMember/OpenCommunityMember'
import UpdateInviteRequest from '../../../../../components/Sidebar/InvitesList/components/UpdateInviteRequest'
import InviteMember from '../InviteMemberModal/InviteMemberModal'
import LeaveCommunity from '../LeaveCommunity/LeaveCommunity'

const CommunityButton = ({ props, community_scopes }) => {
  const [data, setData] = useState(props)
  const [message, setMessage] = useState('')
  const [scopes, setScopes] = useState<string[] | undefined>([])

  useEffect(() => {
    if (props) {
      setData(props)
      const findCommunity = community_scopes?.filter(
        scope => scope.community_id === props.community_id
      )

      findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
    }
  }, [props, data, community_scopes])

  return (
    <>
      <Group style={{ width: 'max-content' }} position="right">
        <Group spacing={0} position="right">
          {scopes?.includes('/seta/community/invite') ? (
            <InviteMember id={props.community_id} />
          ) : null}
        </Group>
        {data.status === 'membership' ? (
          <>
            {' '}
            <LeaveCommunity props={data} onChangeMessage={setMessage} />
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
          <MembershipRequest community_id={data.community_id} />
        ) : data.status === 'unknown' && data.membership === 'opened' ? (
          <OpenCommunityMember community_id={data.community_id} />
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
