from http import HTTPStatus
from injector import inject


from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort


from seta_flask_server.repository.models import SetaApplication
from seta_flask_server.repository import interfaces

from .models.apps_dto import app_model, new_app_parser, update_app_parser

applications_ns = Namespace(
    "Applications", validate=True, description="SETA User Applications"
)
applications_ns.models[app_model.name] = app_model


@applications_ns.route("/apps", endpoint="application_list", methods=["GET", "POST"])
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
    @applications_ns.marshal_list_with(app_model, mask="*")
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
    @applications_ns.expect(new_app_parser)
    @jwt_required()
    def post(self):
        """Create an application"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        app_dict = new_app_parser.parse_args()

        if self.apps_broker.app_exists(name=app_dict["name"]):
            abort(HTTPStatus.CONFLICT, "Application name already exists")

        app = SetaApplication(
            app_name=app_dict["name"],
            app_description=app_dict.get("description"),
            parent_user_id=user_id,
        )
        self.apps_broker.create(
            app=app,
            copy_parent_rsa=bool(app_dict["copy_public_key"]),
            copy_parent_scopes=bool(app_dict["copy_resource_scopes"]),
        )

        response = jsonify(status="success", message="New application created")
        response.status_code = HTTPStatus.CREATED

        return response


@applications_ns.route(
    "/apps/<string:name>", endpoint="application", methods=["GET", "PUT", "DELETE"]
)
@applications_ns.param("name", "Application name")
class ApplicationResource(Resource):
    """Handles HTTP requests to URL: /apps/{name}."""

    @inject
    def __init__(
        self,
        apps_broker: interfaces.IAppsBroker,
        users_broker: interfaces.IUsersBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.apps_broker = apps_broker
        self.users_broker = users_broker

        super().__init__(api, *args, **kwargs)

    @applications_ns.doc(
        description="Retrieve an application that belongs to authorized user",
        responses={
            int(HTTPStatus.OK): "Retrieved application.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.marshal_with(app_model, mask="*")
    @jwt_required()
    def get(self, name):
        """Retrieve application"""

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        app = self.apps_broker.get_by_name(name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        return app

    @applications_ns.doc(
        description="Update an application",
        responses={
            int(HTTPStatus.OK): "Application updated.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.expect(update_app_parser)
    @jwt_required()
    def put(self, name):
        """Updates an application"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        args = update_app_parser.parse_args()

        app = self.apps_broker.get_by_name(name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        new_app = SetaApplication(
            app_name=args.get("new_name"),
            app_description=args.get("description"),
            parent_user_id=user_id,
        )

        self.apps_broker.update(old=app, new=new_app)

        response = jsonify(status="success", message="Application updated")
        response.status_code = HTTPStatus.OK

        return response
