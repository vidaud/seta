from http import HTTPStatus
from injector import inject


from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort


from seta_flask_server.repository.models import SetaApplication
from seta_flask_server.repository import interfaces

from seta_flask_server.blueprints.profile.models import apps_dto as dto

from .ns import applications_ns


@applications_ns.route(
    "/<string:name>", endpoint="application", methods=["GET", "PUT", "DELETE"]
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
        description="Update an application",
        responses={
            int(HTTPStatus.OK): "Application updated.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.expect(dto.update_app_model)
    @jwt_required(fresh=True)
    def put(self, name: str):
        """Updates an application"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        args = applications_ns.payload

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        new_app = SetaApplication(
            app_name=args.get("new_name", None),
            app_description=args["description"],
            parent_user_id=user_id,
        )
        new_app.status = args.get("status", None)

        self.apps_broker.update(old=app, new=new_app)

        return jsonify(status="success", message="Application updated.")

    @applications_ns.doc(
        description="Deletes an application",
        responses={
            int(HTTPStatus.OK): "Application deleted.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @jwt_required(fresh=True)
    def delete(self, name: str):
        """Deletes the application"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        self.apps_broker.delete(parent_id=user_id, name=name)

        return jsonify(status="success", message="Application deleted!")
