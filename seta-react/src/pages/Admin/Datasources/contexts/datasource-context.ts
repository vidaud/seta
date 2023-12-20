import { createFormContext } from '@mantine/form'

import type { DatasourceResponse } from '~/api/types/datasource-types'

export const cacheKey = () => ['data-sources']

// You can give context variables any name
export const [DatasourceFormProvider, useDatasourceContext, useDatasource] =
  createFormContext<DatasourceResponse>()
