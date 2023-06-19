export type ChangeRequestResponse = {
  community_change_requests: CommunityChangeRequests[]
  resource_change_requests: ResourceChangeRequests[]
}
export type CommunityChangeRequests = {
  community_id: string
  request_id: string
  field_name: string
  new_value: string
  old_value: string
  requested_by: string
  requested_by_info: {
    user_id: string
    full_name: string
    email: string
  }
  status: string
  initiated_date: Date
  reviewed_by: string
  reviewed_by_info: {
    user_id: string
    full_name: string
    email: string
  }
  review_date: Date
}

export type ResourceChangeRequests = {
  resource_id: string
  request_id: string
  field_name: string
  new_value: string
  old_value: string
  requested_by: string
  requested_by_info: {
    user_id: string
    full_name: string
    email: string
  }
  status: string
  initiated_date: Date
  reviewed_by: string
  reviewed_by_info: {
    user_id: string
    full_name: string
    email: string
  }
  review_date: Date
}
