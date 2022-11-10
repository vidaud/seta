from flask_restx import Namespace, Resource, reqparse
from flask import current_app as app, jsonify

from infrastructure.auth_validator import auth_validator
from .suggestions_logic import get_word_suggestions

suggestions_api = Namespace('seta-api', description='Suggestions')

suggestions_parser = reqparse.RequestParser()
suggestions_parser.add_argument('chars', required=True)
suggestions_parser.add_argument('n_suggestions', type=int)


@suggestions_api.route(app.api_root + "/suggestions")
@suggestions_api.doc(description="Retrieve terms by initial letters. By default it returns 6 terms,"
                    " with the parameter n_suggestions is possible to set the number of suggestions to be shown.",
        params={'chars': 'Initial letters.', 'n_suggestions': 'Number of terms to be returned (default 6).'},
        security='apikey')
@suggestions_api.expect(suggestions_parser)
class Suggestions(Resource):
    @auth_validator()
    def get(self):
        args = suggestions_parser.parse_args()
        
        n_suggestions = args['n_suggestions']
        if n_suggestions is None:
            n_suggestions = app.config["DEFAULT_SUGGESTION"]
        
        suggestions = get_word_suggestions(app, args['chars'], args['n_suggestions'])        
        return jsonify({"words": suggestions})