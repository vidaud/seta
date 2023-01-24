from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from flask_restx import Namespace, Resource, abort, fields

from injector import inject

from repository.interfaces import IResourcesBroker

resources_ns = Namespace('resources', description='SETA Resources')

@resources_ns.route('/')
class UserResourceList(Resource):
    def get(self):
        return {'hello': 'world'}

@resources_ns.route('/<string:id>')
class UserResource(Resource):
    def get(self):
        return {'hello': 'world'}