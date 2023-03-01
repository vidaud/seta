defaultNoPublicKeyMessage = 'NO PUBLIC KEY SET'

INVITE_EXPIRE_DAYS: float = 3

class ExternalProviderConstants:
    ECAS = "ECAS"
    GITHUB = "GitHub"
    List = (ECAS, GITHUB)

class UserRoleConstants:
    Admin = "Administrator"
    User = "User"
    
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
    
class CommunityRoleConstants:        
    Owner = "CommunityOwner"
    Manager = "CommunityManager"
    ResourceCreator = "ResourceCreator"
    Member = "CommunityMember"
    
class CommunityDataTypeConstants:
    Evidence = "evidence"
    Representative = "representative"
    List = [Evidence, Representative]
    
class CommunityRequestFieldConstants:
    Membership = "membership"
    List = [Membership] 
    
class RequestStatusConstants:
    Pending = "pending"
    Approved = "approved"
    Rejected = "rejected"
    List=[Pending, Approved, Rejected]
    EditList=[Approved, Rejected]
    
class InviteStatusConstants:
    Pending = "pending"
    Accepted = "accepted"
    Rejected = "rejected"
    Expired = "expired"
    List=[Pending, Accepted, Rejected, Expired]
    EditList=[Accepted, Rejected]

class ResourceAccessContants:
    Public = "public"
    Community = "community"
    List = [Public, Community]

class ResourceRequestFieldConstants:
    Access = "access"
    Limits = "limits"
    List = [Access, Limits]

class ResourceStatusConstants:
    Active = "active"
    Blocked = "blocked"
    
    List = [Active, Blocked]    