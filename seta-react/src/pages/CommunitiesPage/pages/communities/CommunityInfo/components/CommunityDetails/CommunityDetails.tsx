import { useEffect, useState } from 'react'
import { Collapse, Group, Tabs, Text } from '@mantine/core'

import type { CommunityResponse } from '~/api/types/community-types'
import type { ClassNameProp } from '~/types/children-props'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '../../../../contexts/scope-context'
import CreateResource from '../../../../resources/ResourceInfo/components/CreateResource/CreateResource'
import ChangePrivacy from '../ChangePrivacy/ChangePrivacy'
import ChangeCommunityRequests from '../ChangeRequests/ChangeRequests'
import CommunityInvites from '../CommunityInvites/CommunityInvites'
import CommunityResources from '../CommunityResources/CommunityResources'
import CommunityUsersPermissions from '../CommunityUserPermissions/CommunityUserPermissions'
import DeleteCommunity from '../DeleteCommunity/DeleteCommunity'
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
  const [totalResources, setTotalResources] = useState<number | undefined>()
  const { community_id, created_at } = community

  useEffect(() => {
    const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
  }, [community_scopes, id])

  const onChangeNrResources = (total: number) => {
    setTotalResources(total)
  }

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
      <Group position="right">
        {scopes?.includes('/seta/community/owner') ? (
          <>
            <ChangePrivacy props={community} />
            <DeleteCommunity props={community} totalResources={totalResources} />
          </>
        ) : null}
      </Group>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal">
        <Tabs.List
          sx={theme => ({
            marginBottom: theme.spacing.xs
          })}
        >
          <Tabs.Tab value="resources">Resource List</Tabs.Tab>
          {scopes?.includes('/seta/community/manager') ||
          scopes?.includes('/seta/community/manager') ||
          scopes?.includes('/seta/community/invite') ? (
            <Tabs.Tab value="invites">My Pending Invites</Tabs.Tab>
          ) : null}
          {scopes?.includes('/seta/community/owner') ||
          scopes?.includes('/seta/community/manager') ||
          scopes?.includes('seta/community/membership/approve') ? (
            <>
              <Tabs.Tab value="change_requests">Change Requests</Tabs.Tab>
              <Tabs.Tab value="membership_requests">Membership Requests</Tabs.Tab>
              <Tabs.Tab value="permissions">Permission</Tabs.Tab>
            </>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="resources" sx={{ paddingLeft: '2%' }}>
          {scopes?.includes('/seta/resource/create') ? (
            <Group position="right">
              <CreateResource id={id} />
            </Group>
          ) : null}
          <CommunityResources id={id} nrResources={onChangeNrResources} />
        </Tabs.Panel>
        {scopes?.includes('/seta/community/manager') ||
        scopes?.includes('/seta/community/manager') ||
        scopes?.includes('/seta/community/invite') ? (
          <Tabs.Panel value="invites" sx={{ paddingLeft: '2%' }}>
            <CommunityInvites id={id} />
          </Tabs.Panel>
        ) : null}
        {scopes?.includes('/seta/community/owner') ||
        scopes?.includes('/seta/community/manager') ||
        scopes?.includes('seta/community/membership/approve') ? (
          <>
            <Tabs.Panel value="change_requests" sx={{ paddingLeft: '2%' }}>
              <ChangeCommunityRequests id={id} />
            </Tabs.Panel>
            <Tabs.Panel value="membership_requests" sx={{ paddingLeft: '2%' }}>
              <MembershipRequests id={id} />
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
