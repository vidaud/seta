from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import RequestStatusConstants

from seta_flask_server.blueprints.communities.models.models_dto import user_info_model
from seta_flask_server.blueprints.communities.models.community_dto import (
    change_request_model as community_change_request_model,
)
from seta_flask_server.blueprints.communities.models.resource_request_dto import (
    change_request_model as resource_change_request_model,
)

update_change_request_parser = RequestParser(bundle_errors=True)
update_change_request_parser.add_argument(
    "status",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=RequestStatusConstants.EditList,
    help="Change request status",
)


change_requests_ns_models = {
    user_info_model.name: user_info_model,
    community_change_request_model.name: community_change_request_model,
    resource_change_request_model.name: resource_change_request_model,
}
