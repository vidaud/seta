import { createFormContext } from '@mantine/form'

export type InvitationValues = {
  email: string[]
  message: string
}

export const cacheKey = () => ['my-communities']

// You can give context variables any name
export const [InvitationFormProvider, useInvitationContext, useInvitation] =
  createFormContext<InvitationValues>()
