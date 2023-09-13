import { useEffect, useState } from 'react'
import { Badge, Collapse, Tabs } from '@mantine/core'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '~/pages/CommunitiesPage/contexts/community-list.context'

import type { ResourceChangeRequests } from '~/api/types/change-request-types'
import type { ResourceResponse } from '~/api/types/resource-types'
import type { ClassNameProp } from '~/types/children-props'

import LimitsDetails from '../LimitsDetails'
import ResourcePanelContent from '../PanelContent'

type Props = ClassNameProp & {
  open: boolean
  resource: ResourceResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const items = [{ value: 'change_requests' }, { value: 'permissions' }]

const ResourceDetails = ({ className, open, resource, resource_scopes }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('limits')
  const [selected] = useState<string | null>('pending')
  const { resource_id } = resource
  const [data, setData] = useState<ResourceChangeRequests[] | undefined>()

  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [nrChangeRequests, setNrChangeRequests] = useState<number | undefined>(
    data?.filter(item => item.status === selected).length
  )

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === resource_id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])

    if (data) {
      setNrChangeRequests(data?.filter(item => item.status === selected).length)
    }
  }, [resource_scopes, resource_id, data, selected])

  const handleData = (value: ResourceChangeRequests[]) => {
    setData(value)
  }

  const tabs = items?.map(item => (
    <Tabs.Panel value={item.value} key={item.value}>
      <ResourcePanelContent id={resource_id} panel={activeTab} onChange={handleData} />
    </Tabs.Panel>
  ))

  return (
    <Collapse className={className} in={open}>
      {scopes?.includes('/seta/resource/edit') ? (
        <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal">
          <Tabs.List
            sx={theme => ({
              marginBottom: theme.spacing.xs
            })}
          >
            <Tabs.Tab value="limits">Resource Limits</Tabs.Tab>
            <Tabs.Tab value="change_requests">
              Change Requests
              {nrChangeRequests && nrChangeRequests > 0 ? <Badge>{nrChangeRequests}</Badge> : null}
            </Tabs.Tab>
            <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="limits">
            <LimitsDetails id={resource_id} scopes={scopes} />
          </Tabs.Panel>
          {tabs}
        </Tabs>
      ) : null}
    </Collapse>
  )
}

export default ResourceDetails
