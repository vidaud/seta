from flask_restplus import Namespace, Resource, reqparse, abort
from flask import current_app as app, jsonify
from infrastructure.auth_validator import auth_validator
from infrastructure.ApiLogicError import ApiLogicError
from .distance_logic import semantic_distance

distance_api = Namespace('seta-api', description='Distance')

distance_parser = reqparse.RequestParser()
distance_parser.add_argument('term1', required=True)
distance_parser.add_argument('term2', required=True)


@distance_api.route(app.api_root + "/distance")
@distance_api.doc(description='Return the semantic distance (cosine distance of vectors) between two terms.',
        params={'term1': 'First term', 'term2': 'Second term'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class Distance(Resource):
    @auth_validator()
    @distance_api.expect(distance_parser)
    def get(self):
        args = distance_parser.parse_args()
        
        try:
            dist = semantic_distance(args['term1'], args['term2'], current_app=app)
            return jsonify(dist)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("Distance->get")
            abort(500, "Internal server error")