import { createFormContext } from '@mantine/form'

export type ResourceValues = {
  community_id: string
  resource_id: string
  title: string
  abstract: string
}

export const cacheKey = () => ['communities']

// You can give context variables any name
export const [ResourceFormProvider, useResourceContext, useResource] =
  createFormContext<ResourceValues>()
