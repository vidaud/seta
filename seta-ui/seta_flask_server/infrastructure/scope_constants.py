class ResourceScopeConstants:
    Create = "/seta/resource/create"
    Edit = "/seta/resource/edit"
    DataAdd = "/seta/resource/data/add"
    DataDelete = "/seta/resource/data/delete"
    ApproveChangeRequest = "/seta/resource/change_request/approve"

    EditList=[Edit,DataAdd,DataDelete]

class CommunityScopeConstants:
    Manager = "/seta/community/manager"
    Create = "/seta/community/create"
    SendInvite = "/seta/community/invite"
    ApproveMembershipRequest = "/seta/community/membership/approve"
    ApproveChangeRequest = "/seta/community/change_request/approve" 

    EditList=[Manager, SendInvite, ApproveMembershipRequest, ResourceScopeConstants.Create]