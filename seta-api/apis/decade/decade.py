from flask_restx import Namespace, Resource, reqparse
from flask import current_app as app, jsonify
from infrastructure.auth_validator import auth_validator

from .decade_logic import build_decade_graph

decade_api = Namespace('seta-api', description='Decade')

term_parser = reqparse.RequestParser()
term_parser.add_argument('term', required=True)

@decade_api.route(app.api_root + "/decade")
@decade_api.doc(description='Return data that describes how documents are placed among decades.',
        params={'term': 'The term'},
        security='apikey')
class DecadeGraph(Resource):
    @auth_validator()
    @decade_api.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()
        decade = build_decade_graph(args['term'], current_app=app)
        
        return jsonify(decade)