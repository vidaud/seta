from http import HTTPStatus
from injector import inject

from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository import interfaces

from .models.notification_dto import notification_model

notifications_ns = Namespace(
    "Notifications", validate=True, description="SETA User Notifications"
)
notifications_ns.models[notification_model.name] = notification_model


@notifications_ns.route("/", endpoint="user_notifications", methods=["GET"])
class Notifications(Resource):

    """Handles HTTP requests to URL: /notifications."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker

        super().__init__(api, *args, **kwargs)

    @notifications_ns.doc(
        description="Retrieve all user notifications",
        responses={
            int(HTTPStatus.OK): "'Retrieved notifications.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights, user not active",
        },
        security="CSRF",
    )
    @notifications_ns.marshal_list_with(notification_model)
    @jwt_required()
    def get(self):
        """
        Retrieve all user notifications, available to any user
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return []
