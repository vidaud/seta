import { createFormContext } from '@mantine/form'

export type RSAKeyValues = {
  key: string
}

export const cacheKey = () => ['rsa-keys']

// You can give context variables any name
export const [RSAKeyFormProvider, useRSAKeyContext, useRSAKeys] = createFormContext<RSAKeyValues>()
