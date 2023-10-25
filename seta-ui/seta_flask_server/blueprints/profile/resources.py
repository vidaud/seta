from http import HTTPStatus
from datetime import datetime
import pytz
from injector import inject

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

from seta_flask_server.repository.models.resource import ResourceModel
from seta_flask_server.repository.models import UserProfileResources
from seta_flask_server.repository.interfaces import IUserProfile, IResourcesBroker

from .models.resources_dto import resource_model, resources_parser

resources_ns = Namespace(
    "Restricted resources", validate=True, description="Manage unsearchable resources"
)
resources_ns.models[resource_model.name] = resource_model


@resources_ns.route(
    "/resources", endpoint="me_restricted_resources", methods=["GET", "POST"]
)
class Unsearchables(Resource):
    """User un-searchables"""

    @inject
    def __init__(
        self,
        profile_broker: IUserProfile,
        resources_broker: IResourcesBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.profile_broker = profile_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @resources_ns.doc(
        description="Retrieve restricted resources for this user.",
        responses={int(HTTPStatus.OK): "'Retrieved resources."},
        security="CSRF",
    )
    @resources_ns.marshal_list_with(resource_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Retrieve restricted resources for the authenticated user"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        ids = self.profile_broker.get_unsearchables(user_id)

        if not ids:
            return None

        resources = []

        for resource_id in ids:
            resource = self.resources_broker.get_by_id(resource_id)

            if resource is None:
                resource = ResourceModel(
                    resource_id=resource_id,
                    community_id="unknown",
                    title="Unknown resource",
                    abstract="None",
                    status="unknown",
                )

            resources.append(resource)

        return resources

    @resources_ns.doc(
        description="Manage restricted resources for the authenticated user.",
        responses={int(HTTPStatus.OK): "Restricted resources updated."},
        security="CSRF",
    )
    @resources_ns.expect(resources_parser)
    @jwt_required()
    def post(self):
        """
        Manage restricted resources for the authenticated user.
        Send empty array for deletion.
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        request_dict = resources_parser.parse_args()
        ids = request_dict["resource"]

        if not ids:
            self.profile_broker.delete_unsearchables(user_id)
            message = "Restricted list deleted"
        else:
            self.profile_broker.upsert_unsearchables(
                UserProfileResources(
                    user_id=user_id, resources=ids, timestamp=datetime.now(tz=pytz.utc)
                )
            )

            message = "Restricted list updated"

        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
