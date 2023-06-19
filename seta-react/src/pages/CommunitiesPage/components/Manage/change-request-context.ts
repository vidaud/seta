import { createFormContext } from '@mantine/form'

export type ChangeRequestValues = {
  community_id: string
  field_name: string
  new_value: string
  old_value: string
}

export const cacheKey = () => ['change-requests']

// You can give context variables any name
export const [ChangeRequestFormProvider, useChangeRequestContext, useChangeRequest] =
  createFormContext<ChangeRequestValues>()
