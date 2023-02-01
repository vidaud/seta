defaultNoPublicKeyMessage = 'NO PUBLIC KEY SET'

INVITE_EXPIRE_DAYS: float = 3

class ExternalProviderConstants:
    ECAS = "ECAS"
    GITHUB = "GitHub"

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