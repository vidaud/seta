from enum import IntEnum

defaultNoPublicKeyMessage = 'NO PUBLIC KEY SET'

INVITE_EXPIRE_DAYS: float = 3

class ExternalProviderConstants:
    ECAS = "ECAS"
    GITHUB = "GitHub"
    SETA = "SETA"
    List = (ECAS, GITHUB, SETA)

class UserRoleConstants:
    Admin = "Administrator"
    User = "User"
    
    List = [Admin, User]
    
class UserStatusConstants:
    Active = "active"
    Disabled = "disabled"
    Blocked = "blocked"
    Deleted = "deleted"
    
    List = [Active, Disabled, Blocked]    
    
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

class DiscoverCommunityStatus:
    Unknown = "unknown"
    Member = "membership"
    Pending = "pending"
    Invited = "invited"
    Rejected = "rejected"

    List = [Unknown, Member, Pending, Invited, Rejected]
    
    
class CommunityRoleConstants:        
    Owner = "CommunityOwner"
    Manager = "CommunityManager"
    ResourceCreator = "ResourceCreator"
    Member = "CommunityMember"
    
    List = [Owner, Manager, ResourceCreator, Member]
    
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

class ResourceRequestFieldConstants:    
    Limits = "limits"
    List = [Limits]

class ResourceStatusConstants:
    Active = "active"
    Blocked = "blocked"
    
    List = [Active, Blocked]

class NotificationTypeConstants:
    PendingInvite = "pending-invite"
    MembershipRequest = "membership-request"
    CommunityChangeRequest = "change-request"

    List=[PendingInvite, MembershipRequest, CommunityChangeRequest]

class NotificationPriorityEnum(IntEnum):
    Critical = 0
    High = 1
    Normal = 2
    Low = 3

class StatsTypeConstants:
    CommunityChangeRequest = "community-change-request"
    ResourceChangeRequest = "resource-change-request"
    OrphanedCommunities ="orphaned-communities"
    OrphanedResources ="orphaned-resources"    

    LightList=[CommunityChangeRequest, ResourceChangeRequest, OrphanedCommunities, OrphanedResources]