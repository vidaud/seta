from flask_restx import Namespace
from seta_flask_server.blueprints.admin.models import users_dto as dto

users_ns = Namespace("Seta Users", description="Seta User Accounts", ordered=True)
users_ns.models.update(dto.ns_models)
