import { createFormContext } from '@mantine/form'

export type ApplicationValues = {
  new_name?: string
  name?: string
  description: string
  copy_public_key?: boolean
  copy_resource_scopes?: boolean
  status?: string
}

export const cacheKey = () => ['apps']

// You can give context variables any name
export const [ApplicationFormProvider, useApplicationContext, useApplication] =
  createFormContext<ApplicationValues>()
