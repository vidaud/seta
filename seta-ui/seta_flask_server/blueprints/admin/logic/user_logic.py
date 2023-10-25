from seta_flask_server.infrastructure.scope_constants import SystemScopeConstants
from seta_flask_server.infrastructure.constants import UserRoleConstants
from seta_flask_server.repository.models import SetaUser, AccountInfo
from seta_flask_server.blueprints.profile.logic.scopes_logic import build_user_scopes


def build_account_info(
    user: SetaUser, detail: AccountInfo, build_scopes: bool = False
) -> dict:
    """Build json structure for the account info response."""

    account_info = {
        "username": user.user_id,
        "email": user.email,
        "role": user.role.lower(),
        "status": user.status.lower(),
        "createdAt": user.created_at,
        "lastModifiedAt": user.modified_at,
        "externalProviders": [],
        "scopes": None,
    }

    for provider in user.external_providers:
        ep = {
            "providerUid": provider.provider_uid,
            "provider": provider.provider,
            "firstName": provider.first_name,
            "lastName": provider.last_name,
        }

        account_info["externalProviders"].append(ep)

    if detail is not None:
        account_info["details"] = {
            "hasRsaKey": detail.has_rsa_key,
            "appsCount": detail.applications_count,
            "lastActive": detail.last_active,
        }

    if build_scopes:
        account_info["scopes"] = build_user_scopes(user)

    return account_info


def can_approve_resource_cr(user: SetaUser) -> bool:
    """Check if user can approve change requests for resources."""

    return (
        user.role.lower() == UserRoleConstants.Admin.lower()
        or user.has_system_scope(SystemScopeConstants.ApproveResourceChangeRequest)
    )
