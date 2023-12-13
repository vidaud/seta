from enum import IntEnum, Enum

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

    @staticmethod
    def parse_role(role: str) -> str:
        """Parsed role"""

        if role.lower() == UserRoleConstants.Admin.lower():
            return UserRoleConstants.Admin
        elif role.lower() == UserRoleConstants.User.lower():
            return UserRoleConstants.User

        return None


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
    List = [Pending, Approved, Rejected]
    EditList = [Approved, Rejected]


class InviteStatusConstants:
    Pending = "pending"
    Accepted = "accepted"
    Rejected = "rejected"
    Expired = "expired"
    List = [Pending, Accepted, Rejected, Expired]
    EditList = [Accepted, Rejected]


class ResourceRequestFieldConstants:
    Limits = "limits"
    List = [Limits]


class ResourceStatusConstants:
    Active = "active"
    Blocked = "blocked"

    List = [Active, Blocked]


class ResourceTypeConstants:
    Discoverable = "discoverable"
    Representative = "representative"

    List = [Discoverable, Representative]


class DataSourceStatusConstants(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class NotificationTypeConstants:
    PendingInvite = "pending-invite"
    MembershipRequest = "membership-request"
    CommunityChangeRequest = "change-request"

    List = [PendingInvite, MembershipRequest, CommunityChangeRequest]


class NotificationPriorityEnum(IntEnum):
    Critical = 0
    High = 1
    Normal = 2
    Low = 3


class StatsTypeConstants:
    CommunityChangeRequest = "community-change-request"
    ResourceChangeRequest = "resource-change-request"
    OrphanedCommunities = "orphaned-communities"
    OrphanedResources = "orphaned-resources"

    LightList = [
        CommunityChangeRequest,
        ResourceChangeRequest,
        OrphanedCommunities,
        OrphanedResources,
    ]


class AuthorizedArea:
    DataSources = "data-sources"
    List = [DataSources]


class UserType:
    User = "user"
    Application = "application"
