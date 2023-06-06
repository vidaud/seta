import type { InviteResponse } from './invite-types'
import type { MembershipResponse } from './membership-types'
import type { ResourceResponse } from './resource-types'

export type CommunityResponse = {
  community_id: string
  title: string
  description: string
  membership: string
  data_type: string
  status: string
  creator: {
    user_id: string
    full_name: string
    email: string
  }
  created_at: Date
}

export type Community = {
  communities: CommunityResponse
  resources: ResourceResponse[]
  invites: InviteResponse[]
  members: MembershipResponse[]
}

export type CreateCommunityAPI = {
  community_id: string
  title: string
  description?: string
  data_type: string
}

export type UpdateCommunityAPI = {
  community_id: string
  title: string
  description: string
  data_type: string
  status: string
}

export type ManageCommunityAPI = {
  community_id: string
  title: string
  description: string
  membership: string
  data_type: string
  status: string
  creator: {
    user_id: string
    full_name: string
    email: string
  }
  created_at: Date
}
