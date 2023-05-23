from flask_restx import Namespace, Resource, reqparse, abort
from flask import current_app as app, jsonify

from seta_api.infrastructure.auth_validator import auth_validator
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from .similar_logic import get_similar_words

similar_api = Namespace('seta-api-similar', description='Similar')

similar_parser = reqparse.RequestParser()
similar_parser.add_argument('terms', required=True, action="split")
similar_parser.add_argument('n_term', type=int)


@similar_api.doc(description='Given a term or a list of terms, return the 20 most similar terms (semantic similarity). '
                             'For each term similarity and cardinality (number of occurrences in documents) are reported.'
                             'When a list of terms is provided the in the returned list similarity values are set to zero',
                 params={'terms': 'List of terms.',
                         'n_term': 'Number of similar terms to be extracted (default 20).'},
                 responses={200: 'Success', 404: 'Not Found Error'},
                 security='apikey')
@similar_api.route("similar")
class SimilarWords(Resource):
    @auth_validator()
    @similar_api.expect(similar_parser)
    def get(self):
        args = similar_parser.parse_args()
        try:
            words = get_similar_words(args['terms'], args['n_term'], current_app=app)
            return jsonify(words)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("SimilarWords->get")
            abort(500, "Internal server error")
