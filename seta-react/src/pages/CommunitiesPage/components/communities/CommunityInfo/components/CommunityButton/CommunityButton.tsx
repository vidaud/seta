import { useEffect, useState, lazy } from 'react'
import { ActionIcon, Button, Group, Menu } from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons-react'

import type { CommunityScopes } from '~/pages/CommunitiesPage/contexts/community-list.context'

import type { CommunityResponse } from '~/api/types/community-types'

import ChangePrivacyRequestActions from '../ChangePrivacy/ChangePrivacyRequestActions'
import DeleteCommunity from '../DeleteCommunity'
import InviteMember from '../InviteMemberModal'
import MembershipRequest from '../MembershipRequestModal'
import OpenCommunityMember from '../OpenCommunityMember'
import UpdateCommunity from '../UpdateCommunity'

const LeaveCommunity = lazy(() => import('../LeaveCommunity'))

type Props = {
  props: CommunityResponse
  community_scopes?: CommunityScopes[]
}

const CommunityButton = ({ props, community_scopes }: Props) => {
  const [data, setData] = useState<CommunityResponse>(props)
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [outsideClick, setOutsideClick] = useState(true)
  const isManager =
    scopes?.includes('/seta/community/owner') || scopes?.includes('/seta/community/manager')

  useEffect(() => {
    if (props) {
      setData(props)
      const findCommunity = community_scopes?.filter(
        scope => scope.community_id === props.community_id
      )

      findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
    }
  }, [props, data, community_scopes, scopes])

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
              position="bottom"
              shadow="xs"
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
                />
                {scopes?.includes('/seta/community/invite') ? (
                  <InviteMember communityId={props.community_id} />
                ) : null}

                {scopes?.includes('/seta/community/owner') ? (
                  <>
                    <DeleteCommunity props={props} />
                    {/* <Divider sx={{ marginTop: '0.25rem' }} />
                    <Text sx={{ paddingLeft: '0.75rem' }} color="#868e96" size="sm">
                      Membership
                    </Text> */}
                    <ChangePrivacyRequestActions props={props} />
                  </>
                ) : null}
              </Menu.Dropdown>
            </Menu>
          </>
        ) : null}

        {data.status === 'membership' ? (
          <>
            <LeaveCommunity props={data} />
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
