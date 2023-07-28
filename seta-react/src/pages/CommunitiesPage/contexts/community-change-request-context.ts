import { createFormContext } from '@mantine/form'

export type CommunityChangeRequestValues = {
  status: string
}

export const cacheKey = () => ['change-requests']

// You can give context variables any name
export const [
  CommunityChangeRequestFormProvider,
  useCommunityChangeRequestContext,
  useCommunityChangeRequest
] = createFormContext<CommunityChangeRequestValues>()
