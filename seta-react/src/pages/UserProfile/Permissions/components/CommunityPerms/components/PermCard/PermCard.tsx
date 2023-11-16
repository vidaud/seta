import { Card, Text, Title } from '@mantine/core'

import PermsTable from '~/pages/UserProfile/Permissions/components/PermsTable'

import type { CommunityScope } from '~/types/admin/scopes'
import type { CategoryScopesResponse } from '~/types/catalogue/catalogue-scopes'

type Props = {
  communityScope: CommunityScope
  catalogue?: CategoryScopesResponse[]
}

const PermCard = ({ communityScope, catalogue }: Props) => {
  return (
    <Card shadow="xs" padding="md" radius="xs" withBorder>
      <Title order={5}>
        <Text span c="dimmed" mr={5} size="sm">
          Community
        </Text>
        {communityScope.community_id}
      </Title>

      <PermsTable scopes={communityScope.scopes} catalogue={catalogue} />
    </Card>
  )
}

export default PermCard
