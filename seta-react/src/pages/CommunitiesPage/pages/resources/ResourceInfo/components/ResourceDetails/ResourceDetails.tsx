import { useEffect, useState } from 'react'
import { Collapse, Group, Tabs, Text } from '@mantine/core'

import type { ResourceResponse } from '~/api/types/resource-types'
import type { ClassNameProp } from '~/types/children-props'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '../../../../../contexts/scope-context'
import ChangeResourceRequests from '../ChangeResourceRequests/ChangeResourceRequests'
import LimitsDetails from '../LimitsDetails/LimitsDetails'
import ResourceUsersPermissions from '../ResourcePermissions/ResourceUserPermissions'

type Props = ClassNameProp & {
  open: boolean
  id: string
  resource: ResourceResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const ResourceDetails = ({ className, open, id, resource, resource_scopes }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('limits')
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const { resource_id, created_at, community_title } = resource

  useEffect(() => {
    const findResource = resource_scopes?.filter(scope => scope.resource_id === id)

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])
  }, [resource_scopes, id])

  return (
    <Collapse className={className} in={open}>
      <Group>
        <Text size="xs" sx={{ width: '50%' }}>
          ID: {resource_id.charAt(0).toUpperCase() + resource_id.slice(1)}
        </Text>
        <Text size="sm" sx={{ width: '45%', textAlign: 'right' }}>
          Created at: {new Date(created_at).toDateString()}
        </Text>
      </Group>
      <Text size="xs" sx={{ width: '50%' }}>
        Community: {community_title.charAt(0).toUpperCase() + community_title.slice(1)}
      </Text>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal">
        <Tabs.List
          sx={theme => ({
            marginBottom: theme.spacing.xs
          })}
        >
          <Tabs.Tab value="limits">Resource Limits</Tabs.Tab>
          {scopes?.includes('/seta/resource/edit') ? (
            <>
              <Tabs.Tab value="change_requests">Change Requests</Tabs.Tab>
              <Tabs.Tab value="permissions">Permission</Tabs.Tab>
            </>
          ) : null}
        </Tabs.List>

        <Tabs.Panel value="limits" sx={{ paddingLeft: '2%' }}>
          <LimitsDetails id={resource_id} scopes={scopes} />
        </Tabs.Panel>
        {scopes?.includes('/seta/resource/edit') ? (
          <>
            <Tabs.Panel value="change_requests" sx={{ paddingLeft: '2%' }}>
              <ChangeResourceRequests id={resource_id} />
            </Tabs.Panel>
            <Tabs.Panel value="permissions" sx={{ paddingLeft: '2%' }}>
              <ResourceUsersPermissions id={resource_id} />
            </Tabs.Panel>
          </>
        ) : null}
      </Tabs>
    </Collapse>
  )
}

export default ResourceDetails
