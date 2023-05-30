import { createFormContext } from '@mantine/form'

export type MembershipValues = {
  community_id: string
  message: string
}

export const cacheKey = () => ['communities']

// You can give context variables any name
export const [MembershipFormProvider, useMembershipContext, useMembership] =
  createFormContext<MembershipValues>()
