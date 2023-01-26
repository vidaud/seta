defaultNoPublicKeyMessage = 'NO PUBLIC KEY SET'

class ExternalProviderConstants:
    ECAS = "ECAS"
    GITHUB = "GitHub"

class UserRoleConstants:
    Admin = "Administrator"
    User = "User"
    CommunityManager = "CommunityManager"
    
class ClaimTypeConstants:
    RoleClaimType = "roles"
    
class CommunityScopeConstants:
    Create = "/seta/community/create"
    Edit = "/seta/community/edit"
    SendInvite = "/seta/community/invite"
    ApproveRequest = "/seta/community/approve"

class CommunityStatusConstants:
    Active = "active"
    Blocked = "blocked"
    
    List = [Active, Blocked]
    
class CommunityMembershipConstants:
    Opened = "opened"
    Closed = "closed"
    
class CommunityDataTypeConstants:
    Evidence = "evidence"
    Representative = "representative"
    List = [Evidence, Representative]
    
class RequestStatusConstants:
    Pending = "pending"
    Approved = "approved"
    Rejected = "rejected"