from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import current_app as app, jsonify

from seta_api.infrastructure.auth_validator import auth_validator

from .embeddings_logic import compute_embeddings

emb_api = Namespace('seta-api-embeddings', description='Embeddings')

parser_file = reqparse.RequestParser()
parser_file.add_argument('text')

embeddings = {"vector": fields.List(fields.Float), "chunk": fields.Integer, "version": fields.String,
              "text": fields.String}
embeddings_model = emb_api.model("embeddings", embeddings)
to_be_removed = {"version": fields.String,
                 "vector": fields.List(fields.Float),
                 "vectors": fields.List(fields.List(fields.Float))}
to_be_removed_model = emb_api.model("to_be_removed", to_be_removed)

emb = {"embeddings": fields.Nested(to_be_removed_model),
       "emb_with_chunk_text": fields.List(fields.Nested(embeddings_model))}

emb_response_model = emb_api.model("emb_response_model", emb)


@emb_api.route("compute_embeddings")
@emb_api.doc(
    description='Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec.',
    params={'text': 'Plain text from which building embeddings.'},
    responses={200: 'Success'},
    security='apikey')
@emb_api.response(200, 'Success', emb_response_model)
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
