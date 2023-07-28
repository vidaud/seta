import { createFormContext } from '@mantine/form'

export type ChangeRequestValues = {
  community_id?: string
  resource_id?: string
  field_name?: string
  new_value?: string
  old_value?: string
}

export type NewValueValues = {
  limits?: {
    total_files_no: number
    total_storage_mb: number
    file_size_mb: number
  }
  membership?: string
}

export const cacheKey = () => ['change-requests']

// You can give context variables any name
export const [ChangeRequestFormProvider, useChangeRequestContext, useChangeRequest] =
  createFormContext<NewValueValues>()
