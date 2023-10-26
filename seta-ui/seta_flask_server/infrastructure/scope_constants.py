class SystemScopeConstants:
    CreateCommunity = "/seta/community/create"
    ApproveResourceChangeRequest = "/seta/resource/change_request/approve"
    ApproveCommunityChangeRequest = "/seta/community/change_request/approve"

    List = [
        CreateCommunity,
        ApproveCommunityChangeRequest,
        ApproveResourceChangeRequest,
    ]


class ResourceScopeConstants:
    Edit = "/seta/resource/edit"
    DataAdd = "/seta/resource/data/add"
    DataDelete = "/seta/resource/data/delete"

    List = [Edit, DataAdd, DataDelete]
    EditList = [Edit, DataAdd, DataDelete]


class CommunityScopeConstants:
    Owner = "/seta/community/owner"
    Manager = "/seta/community/manager"
    CreateResource = "/seta/resource/create"
    SendInvite = "/seta/community/invite"
    ApproveMembershipRequest = "/seta/community/membership/approve"

    List = [Owner, Manager, SendInvite, ApproveMembershipRequest, CreateResource]
    EditList = [Owner, Manager, SendInvite, ApproveMembershipRequest, CreateResource]
