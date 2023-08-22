import { useEffect, useState } from 'react'
import { ActionIcon, Button, Group, Menu, Notification } from '@mantine/core'
import { IconDotsVertical, IconX } from '@tabler/icons-react'

import type { CommunityScopes } from '~/pages/CommunitiesPage/contexts/community-list.context'

import { useAllCommunities } from '~/api/communities/discover/discover-communities'
import type { CommunityResponse } from '~/api/types/community-types'
import type { ResourceResponse } from '~/api/types/resource-types'

import ChangePrivacy from '../ChangePrivacy'
import DeleteCommunity from '../DeleteCommunity'
import InviteMember from '../InviteMemberModal'
import LeaveCommunity from '../LeaveCommunity'
import MembershipRequest from '../MembershipRequestModal'
import OpenCommunityMember from '../OpenCommunityMember'
import UpdateCommunity from '../UpdateCommunity'

type Props = {
  props: CommunityResponse
  community_scopes?: CommunityScopes[]
  resources?: ResourceResponse[]
}

const CommunityButton = ({ props, community_scopes, resources }: Props) => {
  const { refetch } = useAllCommunities()
  const [data, setData] = useState<CommunityResponse>(props)
  const [message, setMessage] = useState('')
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [outsideClick, setOutsideClick] = useState(true)

  useEffect(() => {
    if (props) {
      setData(props)
      const findCommunity = community_scopes?.filter(
        scope => scope.community_id === props.community_id
      )

      findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
    }
  }, [props, data, community_scopes])

  const isManager =
    scopes?.includes('/seta/community/owner') || scopes?.includes('/seta/community/manager')

  const handleOutsideClick = value => {
    setOutsideClick(value)
  }

  return (
    <>
      <Group style={{ width: 'max-content' }} position="right">
        {isManager ? (
          <>
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="left"
              closeOnClickOutside={outsideClick}
            >
              <Menu.Target>
                <ActionIcon onClick={e => e.stopPropagation()}>
                  <IconDotsVertical size="1rem" stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <UpdateCommunity
                  community={props}
                  community_scopes={community_scopes}
                  onChange={handleOutsideClick}
                  refetch={refetch}
                />
                {scopes?.includes('/seta/community/invite') ? (
                  <InviteMember communityId={props.community_id} />
                ) : null}

                {scopes?.includes('/seta/community/owner') ? (
                  <>
                    <DeleteCommunity
                      props={props}
                      totalResources={resources ? resources?.length : 0}
                      refetch={refetch}
                    />
                    <ChangePrivacy community={props} />
                  </>
                ) : null}
              </Menu.Dropdown>
            </Menu>
          </>
        ) : null}

        {data.status === 'membership' ? (
          <>
            {' '}
            <LeaveCommunity props={data} onChangeMessage={setMessage} refetch={refetch} />
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
          <Button color="gray" variant="outline" size="xs">
            INVITED
          </Button>
        ) : data.status === 'unknown' && data.membership === 'closed' ? (
          <MembershipRequest community_id={data.community_id} refetch={refetch} />
        ) : data.status === 'unknown' && data.membership === 'opened' ? (
          <OpenCommunityMember community_id={data.community_id} refetch={refetch} />
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
