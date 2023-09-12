import { useEffect, useState } from 'react'
import { Badge, Collapse, Group, Tabs } from '@mantine/core'

import CreateResource from '~/pages/CommunitiesPage/components/resources/ResourceInfo/components/CreateResource'
import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '~/pages/CommunitiesPage/contexts/community-list.context'

import type { ChangeRequestResponse } from '~/api/types/change-request-types'
import type { CommunityResponse } from '~/api/types/community-types'
import type { InviteResponse } from '~/api/types/invite-types'
import type { MembershipRequest } from '~/api/types/membership-types'
import type { UserPermissionsResponse } from '~/api/types/user-permissions-types'
import type { ClassNameProp } from '~/types/children-props'

import CommunityResources from '../CommunityResources'
import PanelContent from '../PanelContent'

type Props = ClassNameProp & {
  open: boolean
  community: CommunityResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

export type DataResponse = {
  memberships: MembershipRequest[]
  invites: InviteResponse[]
  userPermissions: UserPermissionsResponse[]
  changeRequests: ChangeRequestResponse
}

const items = [
  { value: 'invites' },
  { value: 'change_requests' },
  { value: 'membership_requests' },
  { value: 'permissions' }
]

const CommunityDetails = ({ className, open, community, community_scopes }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('resources')
  const [selected] = useState<string | null>('pending')
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const { community_id } = community
  const [data, setData] = useState<DataResponse | undefined>()
  const [nrInvites, setNrInvites] = useState<number | undefined>(data?.invites.length)
  const [nrChangeRequests, setNrChangeRequests] = useState<number | undefined>(
    data?.changeRequests.community_change_requests.length
  )
  const [nrMembershipRequests, setNrMembershipRequests] = useState<number | undefined>(
    data?.memberships.length
  )

  useEffect(() => {
    const findCommunity = community_scopes?.filter(scope => scope.community_id === community_id)

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])

    if (data) {
      setNrInvites(data?.invites.length)
      setNrChangeRequests(
        data?.changeRequests.community_change_requests.filter(item => item.status === selected)
          .length
      )

      setNrMembershipRequests(data?.memberships.length)
    }
  }, [community_scopes, community_id, data, selected])

  const isManager =
    scopes?.includes('/seta/community/owner') || scopes?.includes('/seta/community/manager')
  const invite = scopes?.includes('/seta/community/invite')
  const approve = scopes?.includes('seta/community/membership/approve')

  const handleData = (value: DataResponse) => {
    setData(value)
  }

  const tabs = items?.map(item => (
    <Tabs.Panel value={item.value} key={item.value}>
      <PanelContent id={community_id} panel={activeTab} onChange={handleData} />
    </Tabs.Panel>
  ))

  return (
    <Collapse className={className} in={open}>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal">
        <Tabs.List
          sx={theme => ({
            marginBottom: theme.spacing.xs
          })}
        >
          <Tabs.Tab value="resources">Resource List</Tabs.Tab>
          {isManager || invite ? (
            <Tabs.Tab value="invites">
              Sent Invites
              {nrInvites && nrInvites > 0 ? <Badge>{nrInvites}</Badge> : null}
            </Tabs.Tab>
          ) : null}
          {isManager || approve ? (
            <>
              <Tabs.Tab value="change_requests">
                My Change Requests
                {nrChangeRequests && nrChangeRequests > 0 ? (
                  <Badge>{nrChangeRequests}</Badge>
                ) : null}
              </Tabs.Tab>
              <Tabs.Tab value="membership_requests">
                Pending Membership Requests
                {nrMembershipRequests && nrMembershipRequests > 0 ? (
                  <Badge>{nrMembershipRequests}</Badge>
                ) : null}
              </Tabs.Tab>
              <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
            </>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="resources">
          {/* {scopes?.includes('/seta/resource/create') ? ( */}
          <CommunityResources id={community_id} />

          {isManager ? (
            <>
              <Group position="right" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <CreateResource id={community_id} />
              </Group>
            </>
          ) : null}
        </Tabs.Panel>
        {isManager ? tabs : null}
      </Tabs>
    </Collapse>
  )
}

export default CommunityDetails
