from http import HTTPStatus
from injector import inject


from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort

from seta_flask_server.repository.models import SetaApplication
from seta_flask_server.repository import interfaces

from seta_flask_server.blueprints.profile.models import apps_dto as dto

from .ns import applications_ns


@applications_ns.route("", endpoint="application_list", methods=["GET", "POST"])
class ApplicationListResource(Resource):
    """Get a list of applications of the authorized user and expose POST for new application"""

    @inject
    def __init__(
        self,
        apps_broker: interfaces.IAppsBroker,
        users_broker: interfaces.IUsersBroker,
        *args,
        api=None,
        **kwargs
    ):
        super().__init__(api, *args, **kwargs)

        self.apps_broker = apps_broker
        self.users_broker = users_broker

    @applications_ns.doc(
        description="Retrieve app list for this user.",
        responses={int(HTTPStatus.OK): "'Retrieved app list."},
        security="CSRF",
    )
    @applications_ns.marshal_list_with(dto.app_model, mask="*")
    @jwt_required()
    def get(self):
        """Retrieve user applications"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.apps_broker.get_all_by_parent_id(user_id)

    @applications_ns.doc(
        description="Create a new application.",
        responses={
            int(HTTPStatus.CREATED): "Added new application.",
            int(HTTPStatus.CONFLICT): "Application already exists.",
        },
        security="CSRF",
    )
    @applications_ns.expect(dto.new_app_model)
    @jwt_required(fresh=True)
    def post(self):
        """Creates an application"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        app_dict = applications_ns.payload

        if self.apps_broker.app_exists(name=app_dict["name"]):
            abort(HTTPStatus.CONFLICT, "Application name already exists")

        app = SetaApplication(
            app_name=app_dict["name"],
            app_description=app_dict["description"],
            parent_user_id=user_id,
        )
        self.apps_broker.create(
            app=app,
            copy_parent_rsa=bool(app_dict.get("copyPublicKey", False)),
            copy_parent_scopes=bool(app_dict.get("copyResourceScopes", False)),
        )

        response = jsonify(status="success", message="New application created")
        response.status_code = HTTPStatus.CREATED

        return response
