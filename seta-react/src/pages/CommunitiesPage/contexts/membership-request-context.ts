import { createFormContext } from '@mantine/form'

export type MembershipRequestValues = {
  community_id?: string
  user_id?: string
  status: string
}

export const cacheKey = () => ['requests']

// You can give context variables any name
export const [MembershipRequestFormProvider, useMembershipRequestContext, useMembershipRequest] =
  createFormContext<MembershipRequestValues>()