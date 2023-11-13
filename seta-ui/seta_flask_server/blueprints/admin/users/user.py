from http import HTTPStatus
from injector import inject

from flask import current_app, session, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies
from flask_restx import Resource, abort

from seta_flask_server.infrastructure.helpers import unset_token_info_cookies
from seta_flask_server.infrastructure.constants import (
    UserRoleConstants,
    UserStatusConstants,
)
from seta_flask_server.repository.models import SystemScope
from seta_flask_server.repository import interfaces

from seta_flask_server.blueprints.admin.models import users_dto as dto
from seta_flask_server.blueprints.admin.logic import user_logic

from .ns import users_ns


@users_ns.route(
    "/<string:user_id>", endpoint="admin_user", methods=["GET", "POST", "PUT", "DELETE"]
)
class UserAccount(Resource):
    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        users_query_broker: interfaces.IUsersQueryBroker,
        sessions_broker: interfaces.ISessionsBroker,
        permissions_broker: interfaces.IUserPermissionsBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.users_broker = users_broker
        self.users_query_broker = users_query_broker
        self.sessions_broker = sessions_broker
        self.permissions_broker = permissions_broker

        super().__init__(api, *args, **kwargs)

    @users_ns.doc(
        description="Retrieve user account.",
        responses={
            int(HTTPStatus.OK): "'Retrieved account.",
            int(HTTPStatus.NOT_FOUND): "Account not found",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @users_ns.marshal_with(dto.account_model, mask="*")
    @jwt_required()
    def get(self, user_id: str):
        """
        Retrieve user account

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        auth_user = self.users_broker.get_user_by_id(auth_id)
        if auth_user is None or auth_user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if auth_user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.status == UserStatusConstants.Deleted:
            abort(HTTPStatus.NOT_FOUND, "User not found")

        detail = self.users_query_broker.get_account_detail(user_id=user_id)

        info = user_logic.build_account_info(user, detail, build_scopes=True)
        return info

    @users_ns.doc(
        description="Update system permissions.",
        responses={
            int(HTTPStatus.OK): "Permissions updated.",
            int(HTTPStatus.NOT_FOUND): "Account not found",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
            int(HTTPStatus.BAD_REQUEST): "Errors in the request payload",
        },
        security="CSRF",
    )
    @users_ns.expect(dto.permissions_model)
    @jwt_required()
    def post(self, user_id: str):
        """
        Update role and system scopes

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        auth_user = self.users_broker.get_user_by_id(auth_id)
        if auth_user is None or auth_user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if auth_user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.status == UserStatusConstants.Deleted:
            abort(HTTPStatus.NOT_FOUND, "User not found")

        request_dict = dict(users_ns.payload)
        role = request_dict.get("role", None)
        scopes = request_dict.get("scopes", None)

        if role is not None and role.lower() != user.role.lower():
            current_app.logger.debug(role)
            r = UserRoleConstants.parse_role(role)
            current_app.logger.debug(r)
            if r is not None:
                self.users_broker.update_role(user_id=user_id, role=r)

        system_scopes = []

        if scopes is not None:
            for scope in scopes:
                # TODO: area value?
                system_scopes.append(
                    SystemScope(user_id=user_id, system_scope=scope, area="community")
                )

        self.permissions_broker.replace_all_user_system_scopes(
            user_id=user_id, scopes=system_scopes
        )

        return jsonify(status="success", message="User permissions updated")

    @users_ns.doc(
        description="Update account status.",
        responses={
            int(HTTPStatus.OK): "Account status updated.",
            int(HTTPStatus.NOT_FOUND): "Account not found",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
            int(HTTPStatus.BAD_REQUEST): "Errors in the request payload",
        },
        security="CSRF",
    )
    @users_ns.expect(dto.update_status_parser)
    @jwt_required()
    def put(self, user_id: str):
        """
        Update account status

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        auth_user = self.users_broker.get_user_by_id(auth_id)
        if auth_user is None or auth_user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if auth_user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.status == UserStatusConstants.Deleted:
            abort(HTTPStatus.NOT_FOUND, "User not found")

        request_dict = dto.update_status_parser.parse_args()
        status = request_dict["status"]

        self.users_broker.update_status(user_id=user_id, status=status)

        response = jsonify(status="success", message="Account status updated")

        # if authenticated admin disables himself, then logout
        if user_id == auth_id and (
            status in [UserStatusConstants.Disabled, UserStatusConstants.Blocked]
        ):
            self._logout_user(response)

        return response

    @users_ns.doc(
        description="Delete account.",
        responses={
            int(HTTPStatus.OK): "Account deleted.",
            int(HTTPStatus.NOT_FOUND): "Account not found",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @jwt_required()
    def delete(self, user_id: str):
        """
        Mark account as deleted

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        auth_user = self.users_broker.get_user_by_id(auth_id)
        if auth_user is None or auth_user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if auth_user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.status == UserStatusConstants.Deleted:
            abort(HTTPStatus.NOT_FOUND, "User not found")

        self.users_broker.update_status(
            user_id=user_id, status=UserStatusConstants.Deleted
        )

        response = jsonify(status="success", message="User set as deleted")

        # if authenticated admin deletes himself, then logout
        if user_id == auth_id:
            self._logout_user(response)

        return response

    def _logout_user(self, response):
        # destroy session token and cookies
        session_id = session.get("session_id")

        if session_id:
            self.sessions_broker.session_logout(session_id)

        session.clear()

        # clear cookies in response
        unset_jwt_cookies(response)
        unset_token_info_cookies(response=response)
