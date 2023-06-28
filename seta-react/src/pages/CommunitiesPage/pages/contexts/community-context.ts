import { createFormContext } from '@mantine/form'

export type CommunityValues = {
  community_id?: string
  title: string
  description: string
  status?: string
}

export const cacheKey = () => ['communities']

// You can give context variables any name
export const [CommunityFormProvider, useCommunityContext, useCommunity] =
  createFormContext<CommunityValues>()
