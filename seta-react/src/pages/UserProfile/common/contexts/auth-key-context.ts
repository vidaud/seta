import { createFormContext } from '@mantine/form'

export type AuthKeyValues = {
  publicKey: string
}

export const cacheKey = () => ['auth-key']

// You can give context variables any name
export const [AuthKeyFormProvider, useAuthKeyContext, useAuthKeys] =
  createFormContext<AuthKeyValues>()
