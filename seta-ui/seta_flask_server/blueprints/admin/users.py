from http import HTTPStatus
from injector import inject

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource, abort

from seta_flask_server.infrastructure.constants import UserRoleConstants
from seta_flask_server.repository import interfaces

from .models import users_dto as dto
from .logic import user_logic

users_ns = Namespace("Seta Users", description="Seta User Accounts")
users_ns.models.update(dto.ns_models)


@users_ns.route("/infos", endpoint="admin_user_infos", methods=["GET"])
class UserInfos(Resource):
    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        users_query_broker: interfaces.IUsersQueryBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.users_broker = users_broker
        self.users_query_broker = users_query_broker

        super().__init__(api, *args, **kwargs)

    @users_ns.doc(
        description="Retrieve users info.",
        responses={
            int(HTTPStatus.OK): "Retrieved users.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @users_ns.expect(dto.status_parser)
    @users_ns.marshal_list_with(dto.user_info_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """
        Returns users details

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request_dict = dto.status_parser.parse_args()
        status = request_dict.get("status", None)

        seta_users = (
            self.users_query_broker.get_all()
            if status is None
            else self.users_query_broker.get_all_by_status(status)
        )

        return [
            {
                "username": user.user_id,
                "fullName": user.full_name,
                "email": user.email,
                "role": user.role,
                "status": user.status,
            }
            for user in seta_users
        ]

    @users_ns.route("/", endpoint="admin_users", methods=["GET"])
    class SetaAccounts(Resource):
        @inject
        def __init__(
            self,
            users_broker: interfaces.IUsersBroker,
            users_query_broker: interfaces.IUsersQueryBroker,
            sessions_broker: interfaces.ISessionsBroker,
            *args,
            api=None,
            **kwargs
        ):
            self.users_broker = users_broker
            self.users_query_broker = users_query_broker
            self.sessions_broker = sessions_broker

            super().__init__(api, *args, **kwargs)

        @users_ns.doc(
            description="Retrieve user accounts.",
            responses={
                int(HTTPStatus.OK): "'Retrieved accounts.",
                int(
                    HTTPStatus.FORBIDDEN
                ): "Insufficient rights, role 'Administrator' required",
            },
            security="CSRF",
        )
        @users_ns.marshal_list_with(dto.account_model, mask="*")
        @jwt_required()
        def get(self):
            """
            Retrieve user accounts

            Permissions: "Administrator" role
            """

            identity = get_jwt_identity()
            auth_id = identity["user_id"]

            user = self.users_broker.get_user_by_id(auth_id)
            if user is None or user.is_not_active():
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

            if user.role.lower() != UserRoleConstants.Admin.lower():
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

            seta_users = self.users_query_broker.get_all()
            account_details = self.users_query_broker.get_account_details()

            accounts = []

            for user in seta_users:
                detail = next(
                    (ad for ad in account_details if ad.user_id == user.user_id), None
                )

                account_info = user_logic.build_account_info(user, detail)
                accounts.append(account_info)

            return accounts
