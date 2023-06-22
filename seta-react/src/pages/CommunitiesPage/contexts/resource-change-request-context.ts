import { createFormContext } from '@mantine/form'

export type ResourceChangeRequestValues = {
  status: string
}

export const cacheKey = () => ['change-requests']

// You can give context variables any name
export const [
  ResourceChangeRequestFormProvider,
  useResourceChangeRequestContext,
  useResourceChangeRequest
] = createFormContext<ResourceChangeRequestValues>()
