import { createFormContext } from '@mantine/form'

import type { DatasourceScope } from '~/api/types/datasource-scopes-types'

export const cacheKey = (id: string) => ['data-sources', id, 'scopes']

// You can give context variables any name
export const [DatasourceScopesFormProvider, useDatasourceScopesContext, useDatasourceScopes] =
  createFormContext<DatasourceScope>()
