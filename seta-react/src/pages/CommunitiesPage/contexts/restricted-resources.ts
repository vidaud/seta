import { createFormContext } from '@mantine/form'

export type RestrictedResources = {
  resource: string
}

export const cacheKey = () => ['me/resources']

// You can give context variables any name
export const [
  RestrictedResourcesFormProvider,
  useRestrictedResourcesContext,
  useRestrictedResources
] = createFormContext<RestrictedResources>()
