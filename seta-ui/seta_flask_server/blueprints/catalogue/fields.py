from http import HTTPStatus
from injector import inject

from flask_jwt_extended import jwt_required
from flask_restx import Namespace, fields, Resource

from seta_flask_server.repository.interfaces import ICatalogueBroker


field_catalogue_ns = Namespace("Fields Catalogue", description="SETA Fields Catalogue")
field_model = field_catalogue_ns.model(
    "Fields",
    {
        "name": fields.String(description="Field name"),
        "description": fields.String(description="Description of the field"),
    },
)


@field_catalogue_ns.route("/fields", endpoint="fields_catalogue", methods=["GET"])
class RoleCatalogue(Resource):
    @inject
    def __init__(self, catalogue_broker: ICatalogueBroker, *args, api=None, **kwargs):
        self.catalogue_broker = catalogue_broker

        super().__init__(api, *args, **kwargs)

    @field_catalogue_ns.doc(
        description="Retrieve fields catalogue.",
        responses={int(HTTPStatus.OK): "'Retrieved fields."},
        security="CSRF",
    )
    @field_catalogue_ns.marshal_list_with(field_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """
        Get catalogue of fields
        """

        return self.catalogue_broker.get_fields()
