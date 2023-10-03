from seta_flask_server.repository.models import SetaUser, AccountInfo
from seta_flask_server.blueprints.profile.logic.scopes_logic import build_user_scopes

def build_account_info(user: SetaUser, detail: AccountInfo, build_scopes: bool = False) -> dict:
    account_info = {
        "username": user.user_id,
        "email": user.email,
        "role": user.role.lower(),
        "status": user.status.lower(),
        "createdAt": user.created_at,
        "lastModifiedAt": user.modified_at,
        "externalProviders": [],
        "scopes": None           
    }
    
    for provider in user.external_providers:
        ep = {
            "providerUid": provider.provider_uid,
            "provider": provider.provider,
            "firstName": provider.first_name,
            "lastName": provider.last_name
        }
        
        account_info["externalProviders"].append(ep)

    if detail is not None:
        account_info["details"] = {
            "hasRsaKey": detail.has_rsa_key,
            "appsCount": detail.applications_count,
            "lastActive": detail.last_active
        }

    if build_scopes:
        account_info["scopes"] = build_user_scopes(user)

    return account_info