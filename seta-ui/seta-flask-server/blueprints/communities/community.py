from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from flask_restx import Namespace, Resource, abort, fields

from injector import inject

from repository.interfaces import ICommunitiesBroker

communities_ns = Namespace('communities', description='SETA Communities')

@communities_ns.route('/')
class CommunityList(Resource):
    def get(self):
        return {'hello': 'world'}

@communities_ns.route('/<string:id>')
class Community(Resource):
    def get(self):
        return {'hello': 'world'}

@communities_ns.route('/<string:id>/resources',)
class CommunityResources(Resource):
    def get(self):
        return {'hello': 'world'}
