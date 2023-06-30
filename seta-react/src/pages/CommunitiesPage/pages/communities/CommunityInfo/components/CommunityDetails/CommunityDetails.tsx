import { useEffect, useState } from 'react'
import { Badge, Collapse, Group, Tabs, Text } from '@mantine/core'

import type { CommunityResponse } from '~/api/types/community-types'
import type { ClassNameProp } from '~/types/children-props'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '../../../../contexts/scope-context'
import CreateResource from '../../../../resources/ResourceInfo/components/CreateResource/CreateResource'
import ChangeCommunityRequests from '../ChangeRequests/ChangeRequests'
import CommunityInvites from '../CommunityInvites/CommunityInvites'
import CommunityResources from '../CommunityResources/CommunityResources'
import CommunityUsersPermissions from '../CommunityUserPermissions/CommunityUserPermissions'
import MembershipRequests from '../MembershipRequests/MembershipRequests'

type Props = ClassNameProp & {
  open: boolean
  id: string
  community: CommunityResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const CommunityDetails = ({ className, open, id, community, community_scopes }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('resources')
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [nrInvites, setNrInvites] = useState<number>(0)
  const [nrChangeRequests, setNrChangeRequests] = useState<number>(0)
  const [nrMembershipRequests, setNrMembershipRequests] = useState<number>(0)
  const { community_id, created_at } = community

  useEffect(() => {
    const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
  }, [community_scopes, id])

  const handleNrInvitesChange = (value: number) => {
    setNrInvites(value)
  }

  const handleNrChangeRequestsChange = (value: number) => {
    setNrChangeRequests(value)
  }

  const handleNrMembershipRequestsChange = (value: number) => {
    setNrMembershipRequests(value)
  }

  const isManager =
    scopes?.includes('/seta/community/owner') || scopes?.includes('/seta/community/manager')
  const invite = scopes?.includes('/seta/community/invite')
  const approve = scopes?.includes('seta/community/membership/approve')

  return (
    <Collapse className={className} in={open}>
      <Group>
        <Text size="xs" sx={{ width: '50%' }}>
          ID: {community_id.charAt(0).toUpperCase() + community_id.slice(1)}
        </Text>
        <Text size="sm" sx={{ width: '45%', textAlign: 'right' }}>
          Created at: {new Date(created_at).toDateString()}
        </Text>
      </Group>
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
              <Badge>{nrInvites}</Badge>
            </Tabs.Tab>
          ) : null}
          {isManager || approve ? (
            <>
              <Tabs.Tab value="change_requests">
                My Change Requests <Badge>{nrChangeRequests}</Badge>
              </Tabs.Tab>
              <Tabs.Tab value="membership_requests">
                Pending Membership Requests <Badge>{nrMembershipRequests}</Badge>
              </Tabs.Tab>
              <Tabs.Tab value="permissions">Permission</Tabs.Tab>
            </>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="resources" sx={{ paddingLeft: '2%' }}>
          {/* {scopes?.includes('/seta/resource/create') ? ( */}
          {isManager ? (
            <Group position="right">
              <CreateResource id={id} />
            </Group>
          ) : null}
          <CommunityResources id={id} />
        </Tabs.Panel>
        {isManager || invite ? (
          <Tabs.Panel value="invites" sx={{ paddingLeft: '2%' }}>
            <CommunityInvites id={id} onChange={handleNrInvitesChange} />
          </Tabs.Panel>
        ) : null}
        {isManager || approve ? (
          <>
            <Tabs.Panel value="change_requests" sx={{ paddingLeft: '2%' }}>
              <ChangeCommunityRequests id={id} onChange={handleNrChangeRequestsChange} />
            </Tabs.Panel>
            <Tabs.Panel value="membership_requests" sx={{ paddingLeft: '2%' }}>
              <MembershipRequests id={id} onChange={handleNrMembershipRequestsChange} />
            </Tabs.Panel>
            <Tabs.Panel value="permissions" sx={{ paddingLeft: '2%' }}>
              <CommunityUsersPermissions id={id} />
            </Tabs.Panel>
          </>
        ) : null}
      </Tabs>
      {/* <Stats resourceNumber={10} /> */}
    </Collapse>
  )
}

export default CommunityDetails
