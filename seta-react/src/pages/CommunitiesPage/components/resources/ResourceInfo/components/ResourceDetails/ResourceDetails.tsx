import { useEffect, useState } from 'react'
import { Badge, Collapse, Tabs } from '@mantine/core'

import { usePanelNotifications } from '~/pages/CommunitiesPage/contexts/panel-context'

import type { ResourceResponse } from '~/api/types/resource-types'
import type { ClassNameProp } from '~/types/children-props'
import type { ResourceScopes, SystemScopes } from '~/types/user/user-scopes'

import LimitsDetails from '../LimitsDetails'
import ResourcePanelContent from '../PanelContent'

type Props = ClassNameProp & {
  open: boolean
  resource: ResourceResponse
  community_scopes?: string[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const items = [{ value: 'change_requests' }, { value: 'permissions' }]

const ResourceDetails = ({
  className,
  open,
  resource,
  resource_scopes,
  community_scopes
}: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('limits')
  const [selected] = useState<string | null>('pending')
  const { resource_id } = resource
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const { nrResourcesChangeRequests } = usePanelNotifications()

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === resource_id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
  }, [resource_scopes, resource_id, selected, open])

  const tabs = items?.map(item => (
    <Tabs.Panel value={item.value} key={item.value}>
      <ResourcePanelContent id={resource_id} panel={activeTab} scopes={scopes} />
    </Tabs.Panel>
  ))

  return (
    <Collapse className={className} in={open}>
      {community_scopes?.includes('/seta/community/owner') ||
      community_scopes?.includes('/seta/community/manager') ? (
        <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal">
          <Tabs.List
            sx={theme => ({
              marginBottom: theme.spacing.xs
            })}
          >
            <Tabs.Tab value="limits">Resource Limits</Tabs.Tab>
            <Tabs.Tab value="change_requests">
              Change Requests
              {nrResourcesChangeRequests && nrResourcesChangeRequests > 0 ? (
                <Badge>{nrResourcesChangeRequests}</Badge>
              ) : null}
            </Tabs.Tab>
            <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="limits">
            {open ? <LimitsDetails id={resource_id} scopes={scopes} /> : null}
          </Tabs.Panel>
          {tabs}
        </Tabs>
      ) : null}
    </Collapse>
  )
}

export default ResourceDetails
