from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_restx import Namespace, Resource, abort
from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces.library_broker import ILibraryBroker

from .models.library_dto import (library_model, library_items, update_item_parser)
from .logic.library_logic import parse_args_new_library_items, get_library_tree, parse_args_update_library_item

library_ns = Namespace('Library', validate=False, description='SETA User Library')
library_ns.models[library_model.name] = library_model
library_ns.models[library_items.name] = library_items

@library_ns.route('/library', endpoint="library_tree", methods=['GET', 'POST'])
class LiraryItemsResource(Resource):
    '''Get a list of library items of the authorized user and expose POST for new application'''
    
    @inject
    def __init__(self, libraryBroker: ILibraryBroker, api=None, *args, **kwargs):
        self.libraryBroker = libraryBroker
        
        super().__init__(api, *args, **kwargs)
    
    @library_ns.doc(description='Retrieve library tree for this user.',        
        responses={int(HTTPStatus.OK): "Retrieved tree."},
        security='CSRF')
    #@library_ns.marshal_with(library_items, mask="*")
    @library_ns.response(int(HTTPStatus.OK), "Success", library_items)
    @jwt_required()    
    def get(self):
        '''Retrive user library tree'''
        
        identity = get_jwt_identity()

        try:
            library_items = get_library_tree(user_id=identity["user_id"], libraryBroker=self.libraryBroker)
        except:
            current_app.logger.exception("LiraryItemsResource->get")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)  

        return jsonify(library_items)
    
    @library_ns.doc(description='Create new items in library.',        
        responses={int(HTTPStatus.CREATED): "Items added."},
        security='CSRF')
    @library_ns.expect([library_model])
    @jwt_required()
    def post(self):
        '''Create library items'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]

        data = library_ns.payload        

        try:
            library_items = parse_args_new_library_items(user_id, data)

            self.libraryBroker.create(library_items)
        except:
            current_app.logger.exception("LiraryItemsResource->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
        
        response = jsonify(status="success", message="Items added in library")
        response.status_code = HTTPStatus.CREATED
        
        return response
    
@library_ns.route('/library/<string:id>', endpoint="library_item", methods=['PUT', 'DELETE'])
@library_ns.param("id", "Item identifier")    
class LiraryItemResource(Resource):
    """Handles HTTP requests to URL: /me/library/{id}."""
    
    @inject
    def __init__(self, libraryBroker: ILibraryBroker, api=None, *args, **kwargs):
        self.libraryBroker = libraryBroker
        
        super().__init__(api, *args, **kwargs)

    @library_ns.doc(description='Update an item in library',        
        responses={int(HTTPStatus.OK): "Item updated.",
                   int(HTTPStatus.NOT_FOUND): "Item not found."
                  },
        security='CSRF')
    @library_ns.expect(update_item_parser)
    @jwt_required()
    def put(self, id: str):
        '''Updates an item in library, available to library owner.'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        args = update_item_parser.parse_args()
        
        item =self.libraryBroker.get_by_id(user_id=user_id, id=id)
        if item is None:
            abort(HTTPStatus.NOT_FOUND, "Item identifier not found")
        
        try:
            parse_args_update_library_item(item, args)

            self.libraryBroker.update(item)
        except:
            current_app.logger.exception("LiraryItemResource->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        
        return jsonify(status="success", message="Library item updated")
    
    @library_ns.doc(description='Remove item from library',        
    responses={
                int(HTTPStatus.OK): "Item removed.",
                int(HTTPStatus.NOT_FOUND): "Membership not found."
                },
    security='CSRF')
    @jwt_required()
    def delete(self, id: str):
        '''
        Remove a library item, available to library owner.
        '''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]

        item =self.libraryBroker.get_by_id(user_id=user_id, id=id)
        if item is None:
            abort(HTTPStatus.NOT_FOUND, "Item identifier not found")

        try:                
            self.libraryBroker.delete(user_id=user_id, id=id)
        except:
            current_app.logger.exception("LiraryItemResource->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)  
        
        return jsonify(status="success", message="Item deleted")