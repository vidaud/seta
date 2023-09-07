import type { InviteResponse } from './invite-types'
import type { MembershipResponse } from './membership-types'
import type { ResourceResponse } from './resource-types'

export type CommunitiesResponse = {
  total_com: number
  communities: CommunityResponse[]
}

export type CommunityResponse = {
  community_id: string
  title: string
  description: string
  membership: string
  status: string
  created_at: Date
  creator: {
    user_id: string
    full_name: string
    email: string
  }
}

export type MyCommunity = {
  communities: CommunityResponse
  resources: ResourceResponse[]
  invites?: InviteResponse[]
  members?: MembershipResponse[]
}

export type Community = {
  communities: CommunityResponse
  resources: ResourceResponse[]
}

export type CreateCommunityAPI = {
  community_id?: string
  title: string
  description?: string
  status?: string
}

export type UpdateCommunityAPI = {
  community_id: string
  title: string
  description?: string
  status?: string
}
