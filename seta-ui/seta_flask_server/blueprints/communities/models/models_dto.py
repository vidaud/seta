from seta_flask_server.infrastructure.constants import (CommunityStatusConstants, RequestStatusConstants)
from flask_restx import Model, fields

user_info_model = Model("User Info", 
                {
                    "user_id": fields.String(description="Internal SETA user identifier"),
                    "full_name": fields.String(description="User full name"),
                    "email": fields.String(description="User email address")
                })