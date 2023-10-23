from flask_restx import Model, fields
from seta_flask_server.infrastructure.constants import (
    ExternalProviderConstants,
    UserRoleConstants,
)

status_model = Model(
    "ResponseStatus",
    {
        "status": fields.String(
            required=True, description="Response status", enum=["success", "fail"]
        ),
        "message": fields.String(description="Response message"),
    },
)


login_info_model = Model(
    "LoginInfo",
    {
        "access_token_exp": fields.DateTime(description="Access token expiration date"),
        "refresh_token_exp": fields.DateTime(
            description="Refresh token expiration date"
        ),
        "user_id": fields.String(description="Seta User Identifier"),
        "auth_provider": fields.String(
            description="Third-party authentication provider",
            enum=ExternalProviderConstants.List,
        ),
        "logout_url": fields.String(
            description="Logout url to be used by the web client"
        ),
    },
)

user_info_model = Model(
    "UserInfo",
    {
        "username": fields.String(description="Internal SETA user identifier"),
        "firstName": fields.String(description="User first name"),
        "lastName": fields.String(description="User last name"),
        "domain": fields.String(description="Domain on the external provider"),
        "email": fields.String(description="User email address"),
        "role": fields.String(description="User role", enum=UserRoleConstants.List),
    },
)

authenticators_model = Model(
    "Authenticators",
    {
        "name": fields.String(
            description="Third-party authenticator",
            enum=[
                ExternalProviderConstants.ECAS.lower(),
                ExternalProviderConstants.GITHUB.lower(),
            ],
        ),
        "login_url": fields.String(description="Local url for authenticator login"),
        "logout_url": fields.String(description="Local url for authenticator logout"),
    },
)

auth_models = {}
auth_models[status_model.name] = status_model
auth_models[user_info_model.name] = user_info_model
auth_models[authenticators_model.name] = authenticators_model
