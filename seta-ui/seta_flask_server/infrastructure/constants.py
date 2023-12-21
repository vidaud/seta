from enum import IntEnum, Enum


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

        if role.lower() == UserRoleConstants.User.lower():
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


class DataSourceStatusConstants(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class NotificationPriorityEnum(IntEnum):
    CRITICAL = 0
    HIGH = 1
    NORMAL = 2
    LOW = 3


class AuthorizedArea:
    DataSources = "data-sources"
    List = [DataSources]


class UserType:
    User = "user"
    Application = "application"
