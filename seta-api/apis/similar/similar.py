from flask_restplus import Namespace, Resource, reqparse, abort
from flask import current_app as app, jsonify
from infrastructure.auth_validator import auth_validator
from infrastructure.ApiLogicError import ApiLogicError
from .similar_logic import get_similar_words, most_similar

similar_api = Namespace('seta-api', description='Similar')

similar_parser = reqparse.RequestParser()
similar_parser.add_argument('term', required=True)
similar_parser.add_argument('n_term', type=int)

@similar_api.doc(description='Given a term, return the 20 most similar terms (semantic similarity). '
                    'For each term similarity and cardinality '
                    '(number of occurrences in documents) are reported.',
        params={'term': 'The original term.',
                'n_term': 'Number of similar terms to be extracted (default 20).'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
@similar_api.route(app.api_root + "/similar")
class SimilarWords(Resource):
    @auth_validator()
    @similar_api.expect(similar_parser)
    def get(self):
        args = similar_parser.parse_args()
        words = get_similar_words(args['term'], args['n_term'], current_app=app)
        return jsonify(words)

most_similar_parser = reqparse.RequestParser()
most_similar_parser.add_argument('term', required=True)
most_similar_parser.add_argument('term_list', required=True, action='split')
most_similar_parser.add_argument('top_n', type=int)


@similar_api.route(app.api_root + "/most-similar")
@similar_api.doc(description='Given a term and a list of terms (comma separated list), '
                    'return the 3 terms in the list that are more similar with the initial term.'
                    'Similarities are computed using semantic distance.',
        params={'term': 'The initial term.',
                'term_list': 'The list of terms from whom extract the most similar ones to the initial '
                             '(comma separated list).',
                'top_n': 'The number of terms that are returned, default 3, maximum the length of the list.'},
        responses={200: 'Success', 404: 'Not Found Error'},
        security='apikey')
class MostSimilar(Resource):
    @auth_validator()
    @similar_api.expect(most_similar_parser)
    def get(self):
        args = most_similar_parser.parse_args()
        
        try:
            out = most_similar(args['term'], args['term_list'], args['top_n'], current_app=app)
            return jsonify(out)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("MostSimilar->get")
            abort(500, "Internal server error")