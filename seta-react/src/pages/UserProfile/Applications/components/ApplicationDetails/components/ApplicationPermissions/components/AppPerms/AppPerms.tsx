import { SimpleGrid } from '@mantine/core'

import ApiLoader from '~/pages/Admin/common/components/Loader'
import { SuggestionsEmpty, SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useCategoryCatalogueScopes } from '~/api/catalogues/scopes'
import type { ApplicationPermissions } from '~/api/user/applications-permissions'
import { ScopeCategory } from '~/types/catalogue/catalogue-scopes'

import PermCard from '../PermCard'

type Props = {
  scopes?: ApplicationPermissions[]
  appName: string
}

const AppPerms = ({ scopes, appName }: Props) => {
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
    <PermCard
      key={scope.title}
      resourceScope={scope}
      catalogue={data}
      appName={appName}
      allPerms={scopes}
    />
  ))

  return <SimpleGrid>{perms}</SimpleGrid>
}

export default AppPerms
