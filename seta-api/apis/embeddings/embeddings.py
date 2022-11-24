from flask_restx import Namespace, Resource, reqparse, abort
from flask import current_app as app, jsonify, request
from infrastructure.auth_validator import auth_validator
from infrastructure.ApiLogicError import ApiLogicError
from subprocess import Popen, PIPE
import werkzeug

from .embeddings_logic import compute_embeddings

emb_api = Namespace('seta-api', description='Embeddings')

parser_file = reqparse.RequestParser()
parser_file.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
parser_file.add_argument('text')

@emb_api.route(app.api_root + "/compute_embeddings")
@emb_api.doc(
    description='Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec. '
                'Tika is used to extract text from the provided file. '
                'If both file and text are provided, function will return text embeddings.',
    params={'file': 'File to be uploaded from which building embeddings.',
            'text': 'Plain text from which building embeddings.'},
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
            
        if 'file' in request.files:
            fin = request.files['file']
            if fin:
                fin.seek(0)
                p = Popen(['java', '-jar', 'tika/tika-app-2.4.1.jar', '--text'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
                parsed_file = p.communicate(input=fin.read())[0]
                
                try:
                    emb = compute_embeddings(parsed_file.decode('utf-8'), current_app=app)
                    return jsonify(emb)
                except ApiLogicError as aex:
                    abort(404, str(aex))
                except:
                    app.logger.exception("ComputeEmb->post")
                    abort(500, "Internal server error")
                
        response = jsonify('No text provided.')
        response.status_code = 400
        return response