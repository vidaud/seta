import { createFormContext } from '@mantine/form'

export type MembershipValues = {
  community_id: string
  message: string
}

export const cacheKey = () => ['memberships']

// You can give context variables any name
export const [MembershipFormProvider, useMembershipContext, useMembership] =
  createFormContext<MembershipValues>()
