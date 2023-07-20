from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import jsonify

from seta_api.infrastructure.auth_validator import auth_validator

from .embeddings_logic import compute_embeddings

import jsonschema
from jsonschema import validate

emb_api = Namespace('seta-api-embeddings', description='Embeddings')

parser_file = reqparse.RequestParser()
parser_file.add_argument('text')

embeddings = {"vector": fields.List(fields.Float), "chunk": fields.Integer, "version": fields.String,
              "text": fields.String}
embeddings_model = emb_api.model("embeddings", embeddings)
emb = {"emb_with_chunk_text": fields.List(fields.Nested(embeddings_model))}

emb_response_model = emb_api.model("emb_response_model", emb)

emb_json_schema = {"type": "object",
                   "properties": {
                       "text": {"type": "string"}
                   },
                   "additionalProperties": False,
                   "required": ["text"]}


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
        try:
            args = parser_file.parse_args()
            validate(instance=args, schema=emb_json_schema)
            emb = compute_embeddings(args['text'])
            return jsonify(emb)
        except Exception as ex:
            abort(404, str(ex))
        except jsonschema.ValidationError as err:
            abort(404, str(err))
