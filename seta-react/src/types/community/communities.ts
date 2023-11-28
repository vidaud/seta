import type { ChangeRequestResponse } from '~/api/types/change-request-types'
import type { InviteResponse } from '~/api/types/invite-types'
import type { MembershipRequest } from '~/api/types/membership-types'
import type { UserPermissionsResponse } from '~/api/types/user-permissions-types'

export type Community = {
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

export type DataResponse = {
  memberships: MembershipRequest[]
  invites: InviteResponse[]
  userPermissions: UserPermissionsResponse[]
  changeRequests: ChangeRequestResponse
}
