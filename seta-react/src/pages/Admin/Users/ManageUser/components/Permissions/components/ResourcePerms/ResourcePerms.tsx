import { SimpleGrid } from '@mantine/core'

import ApiLoader from '~/pages/Admin/common/components/Loader'
import { SuggestionsEmpty, SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import type { ResourceScope } from '~/types/admin/scopes'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'

import PermCard from './components/PermCard'

type Props = {
  scopes?: ResourceScope[]
}

const ResourcePerms = ({ scopes }: Props) => {
  const { data, isLoading, error, refetch } = useCategoryCatalogueScopes(ScopeCategory.Resource)

  if (error) {
    return <SuggestionsError subject="scopes catalogue" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  if (!scopes || scopes.length === 0) {
    return <SuggestionsEmpty message="No scope for resources!" />
  }

  const perms = scopes.map(scope => (
    <PermCard key={scope.resource_id} resourceScope={scope} catalogue={data} />
  ))

  return <SimpleGrid>{perms}</SimpleGrid>
}

export default ResourcePerms
