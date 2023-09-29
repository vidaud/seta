import { ScrollArea, Tabs } from '@mantine/core'
import { IconEdit, IconEye } from '@tabler/icons-react'

import type { UserScopeList } from '~/types/admin/scopes'
import type { UserRole } from '~/types/user'

import CommunityPerms from './components/CommunityPerms'
import ResourcePerms from './components/ResourcePerms'
import SystemPerms from './components/SystemPerms'

type Props = {
  userId: string
  role?: UserRole
  scopes?: UserScopeList
}

const Permissions = ({ userId, role, scopes }: Props) => {
  return (
    <Tabs variant="outline" defaultValue="system-scopes">
      <Tabs.List>
        <Tabs.Tab value="system-scopes" icon={<IconEdit size="0.95rem" />}>
          System Permissions
        </Tabs.Tab>
        <Tabs.Tab value="community-scopes" icon={<IconEye size="0.95rem" />}>
          Community Permissions
        </Tabs.Tab>
        <Tabs.Tab value="resource-scopes" icon={<IconEye size="0.95rem" />}>
          Resource Permissions
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="system-scopes" pt="xs">
        <SystemPerms userId={userId} role={role} scopes={scopes?.system_scopes} />
      </Tabs.Panel>

      <Tabs.Panel value="community-scopes" pt="xs">
        <ScrollArea h={500} type="auto" offsetScrollbars>
          <CommunityPerms scopes={scopes?.community_scopes} />
        </ScrollArea>
      </Tabs.Panel>

      <Tabs.Panel value="resource-scopes" pt="xs">
        <ScrollArea h={500} type="auto" offsetScrollbars>
          <ResourcePerms scopes={scopes?.resource_scopes} />
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  )
}

export default Permissions
