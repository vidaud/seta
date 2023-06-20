import { createFormContext } from '@mantine/form'

export type InvitationValues = {
  email: string[]
  message: string
}

export const cacheKey = () => ['invites']

// You can give context variables any name
export const [InvitationFormProvider, useInvitationContext, useInvitation] =
  createFormContext<InvitationValues>()
