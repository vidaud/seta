import { createFormContext } from '@mantine/form'

export type ResourceValues = {
  community_id: string
  resource_id: string
  title: string
  abstract: string
  status?: string
  limits?: {
    total_files_no?: number
    total_storage_mb?: number
    file_size_mb?: number
  }
}

export const cacheKey = () => ['my-resources']

// You can give context variables any name
export const [ResourceFormProvider, useResourceContext, useResource] =
  createFormContext<ResourceValues>()
