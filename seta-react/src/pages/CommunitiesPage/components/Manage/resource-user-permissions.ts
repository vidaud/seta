import { createFormContext } from '@mantine/form'

export type ResourcePermissions = {
  scope: string[]
}

export const cacheKey = () => ['permissions']

// You can give context variables any name
export const [
  ResourcePermissionsFormProvider,
  useResourcePermissionsContext,
  useResourcePermissions
] = createFormContext<ResourcePermissions>()
