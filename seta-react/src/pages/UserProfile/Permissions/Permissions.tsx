import { ScrollArea, Tabs, Card } from '@mantine/core'

import { useUserPermissions } from '~/api/communities/user-scopes'

import ResourcePerms from './components/ResourcePerms'
import SystemPerms from './components/SystemPerms'

const Permissions = () => {
  const { data } = useUserPermissions()

  return (
    <Card shadow="xs" padding="lg" radius="sm" mt={15}>
      <Tabs variant="outline" defaultValue="system-scopes">
        <Tabs.List>
          <Tabs.Tab value="system-scopes">System Permissions</Tabs.Tab>
          <Tabs.Tab value="resource-scopes">Resource Permissions</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="system-scopes" pt="xs">
          <SystemPerms scopes={data?.system_scopes} />
        </Tabs.Panel>

        <Tabs.Panel value="resource-scopes" pt="xs">
          <ScrollArea h={500} type="auto" offsetScrollbars>
            <ResourcePerms scopes={data?.resource_scopes} />
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
    </Card>
  )
}

export default Permissions
