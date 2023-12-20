import { createFormContext } from '@mantine/form'

import type { CreateDatasource } from '~/api/types/datasource-types'

export const cacheKey = () => ['data-sources']

// You can give context variables any name
export const [CreateDatasourceFormProvider, useCreateDatasourceContext, useCreateDatasources] =
  createFormContext<CreateDatasource>()
