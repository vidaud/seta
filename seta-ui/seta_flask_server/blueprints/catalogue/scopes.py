from crypt import methods
from random import choices
from unicodedata import category
from injector import inject
from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource, abort, reqparse

from .models.scopes_dto import scope_model, scopes_model

from seta_flask_server.repository.interfaces import ICatalogueBroker
from seta_flask_server.repository.models import ScopeCategory

scope_catalogue_ns = Namespace('Scopes Catalogue', description='SETA Scopes Catagloue')
scope_catalogue_ns.models[scope_model.name] = scope_model
scope_catalogue_ns.models[scopes_model.name] = scopes_model

@scope_catalogue_ns.route('/scopes', endpoint="scope_catalogue", methods=['GET'])
class ScopeCatalogue(Resource):

    @inject
    def __init__(self, catalogueBroker: ICatalogueBroker, api=None, *args, **kwargs):        
        self.catalogueBroker = catalogueBroker
        
        super().__init__(api, *args, **kwargs)
    
    @scope_catalogue_ns.doc(description='Retrieve scopes catalogue.',        
        responses={int(HTTPStatus.OK): "'Retrieved scopes." },
        security='CSRF')
    @scope_catalogue_ns.marshal_with(scopes_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """
        Get catalogue of scopes
        """

        return self.catalogueBroker.get_scopes()
    
CATEGORIES = [str(s) for s in ScopeCategory]

@scope_catalogue_ns.route('/scopes/<string:category>', endpoint="scope_category_catalogue", methods=['GET'])
@scope_catalogue_ns.param("category", f"Category, one of {str(CATEGORIES)}")
class ScopeCatalogueByCategory(Resource):

    @inject
    def __init__(self, catalogueBroker: ICatalogueBroker, api=None, *args, **kwargs):        
        self.catalogueBroker = catalogueBroker
        
        super().__init__(api, *args, **kwargs)
    
    @scope_catalogue_ns.doc(description='Retrieve scopes catalogue by category.',        
        responses={int(HTTPStatus.OK): "'Retrieved scopes.",
                   int(HTTPStatus.BAD_REQUEST): "Invalid category; if set, then must be one of 'system', 'community', 'scope'."},
        security='CSRF')
    @scope_catalogue_ns.marshal_list_with(scope_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self, category: str):
        """
        Get catalogue of scopes by category

        :param category:
            Optional, filter scope list by category, one of: 'system', 'community', 'resource'
            None means no filter, return all entries
        """

        if category.lower() in CATEGORIES:
            scope_category = ScopeCategory(category.lower())
        else:
            abort(HTTPStatus.BAD_REQUEST, f"Invalid category; must be one of {str(CATEGORIES)}.")

        result = self.catalogueBroker.get_scopes(scope_category)

        match scope_category:
            case ScopeCategory.System:
                return result.system
            case ScopeCategory.Community:
                return result.community
            case ScopeCategory.Resource:
                return result.resource