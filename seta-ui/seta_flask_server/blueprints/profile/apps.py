from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_restx import Namespace, Resource, abort
from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models import SetaApplication
from seta_flask_server.repository.interfaces import IAppsBroker, IUsersBroker
from .models.apps_dto import (app_model, new_app_parser, update_app_parser)

applications_ns = Namespace('Applications', validate=True, description='SETA User Applications')
applications_ns.models[app_model.name] = app_model

@applications_ns.route('/apps', endpoint="application_list", methods=['GET', 'POST'])
class ApplicationListResource(Resource):
    '''Get a list of applications of the authorized user and expose POST for new application'''
    
    @inject
    def __init__(self, appsBroker: IAppsBroker, api=None, *args, **kwargs):
        self.appsBroker = appsBroker
        
        super().__init__(api, *args, **kwargs)
    
    @applications_ns.doc(description='Retrieve app list for this user.',        
        responses={int(HTTPStatus.OK): "'Retrieved app list."},
        security='CSRF')
    @applications_ns.marshal_list_with(app_model, mask="*")
    @jwt_required()    
    def get(self):
        '''Retrive user applications'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]        
        
        return self.appsBroker.get_all_by_parent_id(user_id)
    
    @applications_ns.doc(description='Create a new application.',        
        responses={int(HTTPStatus.CREATED): "Added new application.",                    
                   int(HTTPStatus.CONFLICT): "Applicaiton already exists."},
        security='CSRF')
    @applications_ns.expect(new_app_parser)
    @jwt_required()
    def post(self):
        '''Create an application'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        app_dict = new_app_parser.parse_args()
        
        if self.appsBroker.app_exists(parent_id=user_id, name=app_dict["name"]):
            abort(HTTPStatus.CONFLICT, "Application name already exists")
            
        app = SetaApplication(app_name=app_dict["name"], app_description=app_dict.get("description"), parent_user_id=user_id)
        self.appsBroker.create(app=app, copy_parent_rsa=bool(app_dict["copy_public_key"]), copy_parent_scopes=bool(app_dict["copy_resource_scopes"]))
            
        response = jsonify(status="success", message="New application created")
        response.status_code = HTTPStatus.CREATED
        
        return response
    
@applications_ns.route('/apps/<string:name>', endpoint="application", methods=['GET', 'PUT', 'DELETE'])
@applications_ns.param("name", "Application name")    
class ApplicationResource(Resource):
    """Handles HTTP requests to URL: /apps/{name}."""
    
    @inject
    def __init__(self, appsBroker: IAppsBroker, api=None, *args, **kwargs):
        self.appsBroker = appsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @applications_ns.doc(description='Retrieve an application that belongs to authorized user',        
        responses={int(HTTPStatus.OK): "Retrieved application.",
                   int(HTTPStatus.NOT_FOUND): "Application not found."
                  },
        security='CSRF')
    @applications_ns.marshal_with(app_model, mask="*")
    @jwt_required()
    def get(self, name):
        '''Retrieve application'''                
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        app = self.appsBroker.get_by_parent_id_and_name(parent_id=user_id, name=name)
        
        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")
        
        return app