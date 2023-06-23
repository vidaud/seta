import { useEffect, useState } from 'react'
import { Collapse, Flex, Tabs } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

import { useCurrentUserPermissions } from '../../../../../contexts/scope-context'
import ChangeCommunityRequests from '../ChangeRequests/ChangeRequests'
import CommunityUsersPermissions from '../CommunityUserPermissions/CommunityUserPermissions'
import MembershipRequests from '../MembershipRequests/MembershipRequests'

type Props = ClassNameProp & {
  open: boolean
  id: string
}

const CommunityDetails = ({ className, open, id }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('resources')
  const { community_scopes } = useCurrentUserPermissions()
  const [scopes, setScopes] = useState<string[] | undefined>([])

  useEffect(() => {
    const findCommunity = community_scopes?.filter(scope => scope.community_id === id)

    findCommunity ? setScopes(findCommunity[0]?.scopes) : setScopes([])
  }, [community_scopes, id])

  return (
    <Collapse className={className} in={open}>
      <Flex gap="md" />
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="resources">Resource List</Tabs.Tab>
          {scopes?.includes('/seta/community/manager') ||
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
          {/* <CommunityResources id={id} /> */}
        </Tabs.Panel>
        {scopes?.includes('/seta/community/manager') ||
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
