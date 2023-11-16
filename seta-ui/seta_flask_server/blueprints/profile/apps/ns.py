from flask_restx import Namespace
from seta_flask_server.blueprints.profile.models import apps_dto as dto
from seta_flask_server.blueprints.profile.models.rsa_dto import (
    rsa_public,
    rsa_pair_model,
)


applications_ns = Namespace(
    "Applications", validate=True, description="SETA User Applications", ordered=True
)
applications_ns.models.update(dto.ns_models)
applications_ns.models[rsa_public.name] = rsa_public
applications_ns.models[rsa_pair_model.name] = rsa_pair_model
