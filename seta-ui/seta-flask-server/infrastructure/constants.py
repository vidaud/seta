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

class CommunityStatusConstants:
    Active = "active"
    Blocked = "blocked"
    
    List = [Active, Blocked]
    
class CommunityMembershipConstants:
    Opened = "opened"
    Closed = "closed"
    List = [Opened, Closed]
    
class CommunityDataTypeConstants:
    Evidence = "evidence"
    Representative = "representative"
    List = [Evidence, Representative]
    
class RequestStatusConstants:
    Pending = "pending"
    Approved = "approved"
    Rejected = "rejected"
    List=[Pending, Approved, Rejected]
    EditList=[Approved, Rejected]