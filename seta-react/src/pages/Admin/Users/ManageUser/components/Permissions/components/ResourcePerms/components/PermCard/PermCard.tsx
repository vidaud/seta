import { Card, Text, Title } from '@mantine/core'

import type { ResourceScope } from '~/types/admin/scopes'
import type { CategoryScopesResponse } from '~/types/catalogue/catalogue-scopes'

import PermsTable from '../../../PermsTable'

type Props = {
  resourceScope: ResourceScope
  catalogue?: CategoryScopesResponse[]
}

const PermCard = ({ resourceScope, catalogue }: Props) => {
  return (
    <Card shadow="xs" padding="md" radius="xs" withBorder>
      <Title order={5}>
        <Text span c="dimmed" size="sm" mr={5}>
          Resource
        </Text>
        {resourceScope.resource_id}
      </Title>

      <PermsTable scopes={resourceScope.scopes} catalogue={catalogue} />
    </Card>
  )
}

export default PermCard
