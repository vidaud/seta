import { useEffect, useState } from 'react'
import { Badge, Collapse, Tabs } from '@mantine/core'

import type { ResourceResponse } from '~/api/types/resource-types'
import type { ClassNameProp } from '~/types/children-props'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '../../../../contexts/scope-context'
import ChangeResourceRequests from '../ChangeResourceRequests/ChangeResourceRequests'
import LimitsDetails from '../LimitsDetails/LimitsDetails'
import ResourceUsersPermissions from '../ResourcePermissions/ResourceUserPermissions'

type Props = ClassNameProp & {
  open: boolean
  resource: ResourceResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const ResourceDetails = ({ className, open, resource, resource_scopes }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('limits')
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [nrChangeRequests, setNrChangeRequests] = useState<number>(0)
  const { resource_id } = resource

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === resource_id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
  }, [resource_scopes, resource_id])

  const handleNrChangeRequestsChange = (value: number) => {
    setNrChangeRequests(value)
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

          <Tabs.Panel value="limits" sx={{ paddingLeft: '2%' }}>
            <LimitsDetails id={resource_id} scopes={scopes} />
          </Tabs.Panel>
          <Tabs.Panel value="change_requests" sx={{ paddingLeft: '2%' }}>
            <ChangeResourceRequests id={resource_id} onChange={handleNrChangeRequestsChange} />
          </Tabs.Panel>
          <Tabs.Panel value="permissions" sx={{ paddingLeft: '2%' }}>
            <ResourceUsersPermissions id={resource_id} />
          </Tabs.Panel>
        </Tabs>
      ) : null}
    </Collapse>
  )
}

export default ResourceDetails
