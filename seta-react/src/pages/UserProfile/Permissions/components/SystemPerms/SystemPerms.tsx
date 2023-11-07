import { SimpleGrid, Card } from '@mantine/core'

import ApiLoader from '~/pages/Admin/common/components/Loader'
import { SuggestionsEmpty, SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import type { SystemScope } from '~/types/admin/scopes'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'

import SystemPermsTable from './components/SystemPermsTable'

type Props = {
  scopes?: SystemScope[]
}

const SystemPerms = ({ scopes }: Props) => {
  const { data, isLoading, error, refetch } = useCategoryCatalogueScopes(ScopeCategory.System)

  if (error) {
    return <SuggestionsError subject="scopes catalogue" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  if (!scopes || scopes.length === 0) {
    return <SuggestionsEmpty message="Scopes catalogue is empty!" />
  }

  const perms = scopes.map(scope => (
    <Card shadow="xs" key={scope.area} padding="md" radius="xs" withBorder>
      <SystemPermsTable scopes={scopes} catalogue={data} />
    </Card>
  ))

  return <SimpleGrid>{perms}</SimpleGrid>
}

export default SystemPerms
