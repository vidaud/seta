import { SimpleGrid } from '@mantine/core'

import ApiLoader from '~/pages/Admin/common/components/Loader'
import { SuggestionsEmpty, SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import type { CommunityScope } from '~/types/admin/scopes'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'

import PermCard from './components/PermCard'

type Props = {
  scopes?: CommunityScope[]
}

const CommunityPerms = ({ scopes }: Props) => {
  const { data, isLoading, error, refetch } = useCategoryCatalogueScopes(ScopeCategory.Community)

  if (error) {
    return <SuggestionsError subject="scopes catalogue" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  if (!scopes || scopes.length === 0) {
    return <SuggestionsEmpty message="No scope for communities!" />
  }

  const perms = scopes.map(scope => (
    <PermCard key={scope.community_id} communityScope={scope} catalogue={data} />
  ))

  return <SimpleGrid>{perms}</SimpleGrid>
}

export default CommunityPerms
