from http import HTTPStatus
from injector import inject

from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.interfaces import ICatalogueBroker
from seta_flask_server.repository.models import ScopeCategory

from .models.scopes_dto import scope_model, scopes_model

scope_catalogue_ns = Namespace("Scopes Catalogue", description="SETA Scopes Catalogue")
scope_catalogue_ns.models[scope_model.name] = scope_model
scope_catalogue_ns.models[scopes_model.name] = scopes_model


@scope_catalogue_ns.route("", endpoint="scope_catalogue", methods=["GET"])
class ScopeCatalogue(Resource):
    @inject
    def __init__(self, catalogue_broker: ICatalogueBroker, *args, api=None, **kwargs):
        self.catalogue_broker = catalogue_broker

        super().__init__(api, *args, **kwargs)

    @scope_catalogue_ns.doc(
        description="Retrieve scopes catalogue.",
        responses={int(HTTPStatus.OK): "'Retrieved scopes."},
        security="CSRF",
    )
    @scope_catalogue_ns.marshal_with(scopes_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """
        Get catalogue of scopes
        """

        return self.catalogue_broker.get_scopes()


CATEGORIES = [str(s) for s in ScopeCategory]


@scope_catalogue_ns.route(
    "/<string:category>", endpoint="scope_category_catalogue", methods=["GET"]
)
@scope_catalogue_ns.param("category", "Scopes category", enum=CATEGORIES)
class ScopeCatalogueByCategory(Resource):
    @inject
    def __init__(self, catalogue_broker: ICatalogueBroker, *args, api=None, **kwargs):
        self.catalogue_broker = catalogue_broker

        super().__init__(api, *args, **kwargs)

    @scope_catalogue_ns.doc(
        description="Retrieve scopes catalogue by category.",
        responses={
            int(HTTPStatus.OK): "'Retrieved scopes.",
            int(HTTPStatus.BAD_REQUEST): "Invalid category.",
        },
        security="CSRF",
    )
    @scope_catalogue_ns.marshal_list_with(scope_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self, category: str):
        """
        Get catalogue of scopes by category

        :param category:
            Optional, filter scope list by category, one of: 'system', 'data-source'
            None means no filter, return all entries
        """

        if category.lower() == "resource":
            category = str(ScopeCategory.DataSource)

        if category.lower() in CATEGORIES:
            scope_category = ScopeCategory(category.lower())
        else:
            abort(
                HTTPStatus.BAD_REQUEST,
                f"Invalid category; must be one of {str(CATEGORIES)}.",
            )

        result = self.catalogue_broker.get_scopes(scope_category)

        match scope_category:
            case ScopeCategory.System:
                return result.system
            case ScopeCategory.DataSource:
                return result.resource
