from flask_restx import Namespace, Resource, reqparse, abort
from flask import current_app as app, jsonify

from seta_api.infrastructure.auth_validator import auth_validator

from .embeddings_logic import compute_embeddings

emb_api = Namespace('seta-api-embeddings', description='Embeddings')

parser_file = reqparse.RequestParser()
parser_file.add_argument('text')


@emb_api.route("compute_embeddings")
@emb_api.doc(
    description='Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec.',
    params={'text': 'Plain text from which building embeddings.'},
    responses={200: 'Success'},
    security='apikey')
class ComputeEmb(Resource):
    @auth_validator()
    @emb_api.expect(parser_file)
    def post(self):
        args = parser_file.parse_args()
        if args['text']:
            try:
                emb = compute_embeddings(args['text'], current_app=app)
                return jsonify(emb)
            except Exception as ex:
                abort(404, str(ex))

        response = jsonify('No text provided.')
        response.status_code = 400
        return response