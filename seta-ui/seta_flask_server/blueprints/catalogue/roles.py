from crypt import methods
import enum
from injector import inject
from http import HTTPStatus

from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource, abort

from .models.roles_dto import role_model, roles_model

from seta_flask_server.repository.interfaces import ICatalogueBroker
from seta_flask_server.repository.models import RoleCategory

role_catalogue_ns = Namespace('Roles Catalogue', description='SETA Roles Catagloue')
role_catalogue_ns.models[role_model.name] = role_model
role_catalogue_ns.models[roles_model.name] = roles_model

@role_catalogue_ns.route('/roles', endpoint="roles_catalogue", methods=['GET'])
class RoleCatalogue(Resource):

    @inject
    def __init__(self, catalogueBroker: ICatalogueBroker, api=None, *args, **kwargs):        
        self.catalogueBroker = catalogueBroker
        
        super().__init__(api, *args, **kwargs)
    
    @role_catalogue_ns.doc(description='Retrieve roles catalogue.',        
        responses={int(HTTPStatus.OK): "'Retrieved roles."},
        security='CSRF')
    @role_catalogue_ns.marshal_with(roles_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """
        Get catalogue of roles
        """
        
        return self.catalogueBroker.get_roles()

CATEGORIES = [str(s) for s in RoleCategory]

@role_catalogue_ns.route('/roles/<string:category>', endpoint="roles_category_catalogue", methods=['GET'])
@role_catalogue_ns.param("category", f"Roles category", enum=CATEGORIES)
class RoleCatalogueByCategory(Resource):

    @inject
    def __init__(self, catalogueBroker: ICatalogueBroker, api=None, *args, **kwargs):        
        self.catalogueBroker = catalogueBroker
        
        super().__init__(api, *args, **kwargs)
    
    @role_catalogue_ns.doc(description='Retrieve roles catalogue.',        
        responses={int(HTTPStatus.OK): "'Retrieved roles.",
                   int(HTTPStatus.BAD_REQUEST): "Invalid category; if set, then must be one of 'application', 'community'."},
        security='CSRF')
    @role_catalogue_ns.marshal_list_with(role_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self, category: str):
        """
        Get catalogue of roles

        :param category:
            Optional, filter scope list by category, one of: 'application', 'community'
            None means no filter, return all entries
        """
        
        if category.lower() in CATEGORIES:
            role_category = RoleCategory(category.lower())
        else:
            abort(HTTPStatus.BAD_REQUEST, f"Invalid category; must be one of {str(CATEGORIES)}.")
        
        result = self.catalogueBroker.get_roles(role_category)

        match role_category:
            case RoleCategory.Application:
                return result.application
            case RoleCategory.Community:
                return result.community