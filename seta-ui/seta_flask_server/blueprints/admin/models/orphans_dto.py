from flask_restx.reqparse import RequestParser

from seta_flask_server.blueprints.communities.models.models_dto import user_info_model
from seta_flask_server.blueprints.communities.models.community_dto import community_model

set_owner_parser = RequestParser(bundle_errors=True)
set_owner_parser.add_argument("owner",
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  case_sensitive=True,
                                  help=f"Owner identifier")