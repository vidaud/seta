class SystemScopeConstants:
    CreateCommunity = "/seta/community/create"
    ApproveResourceChangeRequest = "/seta/resource/change_request/approve"
    ApproveCommunityChangeRequest = "/seta/community/change_request/approve" 

class ResourceScopeConstants:    
    Edit = "/seta/resource/edit"
    DataAdd = "/seta/resource/data/add"
    DataDelete = "/seta/resource/data/delete"
    

    EditList=[Edit,DataAdd,DataDelete]

class CommunityScopeConstants:
    Ownership = "/seta/community/owner"
    Manager = "/seta/community/manager"
    CreateResource = "/seta/resource/create"
    SendInvite = "/seta/community/invite"
    ApproveMembershipRequest = "/seta/community/membership/approve"
    

    EditList=[Ownership, Manager, SendInvite, ApproveMembershipRequest, CreateResource]