import { useEffect, useState } from 'react'
import { Badge, Collapse, Tabs } from '@mantine/core'

import type { ResourceChangeRequests } from '~/api/types/change-request-types'
import type { ResourceResponse } from '~/api/types/resource-types'
import type { ClassNameProp } from '~/types/children-props'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '../../../../../contexts/scope-context'
import LimitsDetails from '../LimitsDetails/LimitsDetails'
import ResourcePanelContent from '../PanelContent/PanelContent'

type Props = ClassNameProp & {
  open: boolean
  resource: ResourceResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const ResourceDetails = ({ className, open, resource, resource_scopes }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('limits')
  const { resource_id } = resource
  const [data, setData] = useState<ResourceChangeRequests[] | undefined>()

  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [nrChangeRequests, setNrChangeRequests] = useState<number | undefined>(data?.length)

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === resource_id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])

    if (data) {
      setNrChangeRequests(data?.length)
    }
  }, [resource_scopes, resource_id, data])

  const handleData = (value: ResourceChangeRequests[]) => {
    setData(value)
  }

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
              Change Requests <Badge>{nrChangeRequests}</Badge>
            </Tabs.Tab>
            <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="limits">
            <LimitsDetails id={resource_id} scopes={scopes} />
          </Tabs.Panel>
          <Tabs.Panel value="change_requests">
            <ResourcePanelContent id={resource_id} panel={activeTab} onChange={handleData} />
          </Tabs.Panel>
          <Tabs.Panel value="permissions">
            <ResourcePanelContent id={resource_id} panel={activeTab} onChange={handleData} />
          </Tabs.Panel>
        </Tabs>
      ) : null}
    </Collapse>
  )
}

export default ResourceDetails
