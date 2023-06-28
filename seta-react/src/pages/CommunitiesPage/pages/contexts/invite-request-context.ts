import { createFormContext } from '@mantine/form'

export type InviteRequestValues = {
  invite_id?: string
  status: string
}

export const cacheKey = () => ['invites']

// You can give context variables any name
export const [InviteRequestFormProvider, useInviteRequestContext, useInviteRequest] =
  createFormContext<InviteRequestValues>()
