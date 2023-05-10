import { createFormContext } from '@mantine/form'

interface CommunityValues {
  communityId: string
  title: string
  description: string
  dataType: string
  membership: string
}

// You can give context variables any name
export const [CommunityFormProvider, useCommunityContext, useCommunity] =
  createFormContext<CommunityValues>()
