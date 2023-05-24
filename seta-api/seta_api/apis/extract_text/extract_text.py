from flask_restx import Namespace, Resource, reqparse, abort
import werkzeug
from subprocess import Popen, PIPE
from flask import current_app as app, jsonify, request

from seta_api.infrastructure.auth_validator import auth_validator

extract_api = Namespace('seta-api-extract-text', description='Extract Text')

parser_file = reqparse.RequestParser()
parser_file.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')


@extract_api.route("extract_text")
@extract_api.doc(
    description='Given a file, its text is provided. Tika is used to extract text from file.',
    params={'file': 'File from which text will be extract'},
    responses={200: 'Success'},
    security='apikey')
class ExtractText(Resource):
    @auth_validator()
    @extract_api.expect(parser_file)
    def post(self):
        if 'file' in request.files:
            fin = request.files['file']
#check if the file is compressed
            import magic
            mime = magic.Magic(mime=True)
            mime.from_file("testdata/test.pdf")
            if fin:
                fin.seek(0)
                p = Popen(['java', '-jar', 'tika/tika-app-2.4.1.jar', '--text'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
                parsed_file = p.communicate(input=fin.read())[0]
        return parsed_file