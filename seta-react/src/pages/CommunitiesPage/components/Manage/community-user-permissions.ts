import { createFormContext } from '@mantine/form'

export type CommunityPermissions = {
  scope: string[]
}

export const cacheKey = () => ['permissions']

// You can give context variables any name
export const [
  CommunityPermissionsFormProvider,
  useCommunityPermissionsContext,
  useCommunityPermissions
] = createFormContext<CommunityPermissions>()
