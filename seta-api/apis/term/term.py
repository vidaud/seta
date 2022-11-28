from flask_restx import Namespace, Resource, reqparse
from flask import current_app as app
from infrastructure.auth_validator import auth_validator
from infrastructure.helpers import word_exists

term_api = Namespace('seta-api-term', description='Term exists')

term_parser = reqparse.RequestParser()
term_parser.add_argument('term', required=True)

@term_api.route("/term-exists")
@term_api.doc(description='Return True if the word exists in the trained model else False',
        params={'term': 'The term'},
        security='apikey')
class Term(Resource):
    @auth_validator()
    @term_api.expect(term_parser)
    def get(self):
        args = term_parser.parse_args()
        return word_exists(app.terms_model, args['term'])
