from flask import request, jsonify, current_app
from flask_restx import Namespace, Resource, reqparse, abort

from seta_api.infrastructure.auth_validator import auth_validator
from .file_to_text_logic import extract_text
from http import HTTPStatus
from werkzeug.datastructures import FileStorage

file_to_text_api = Namespace('seta-api-file-to-text', description='File to text')

parser_file = reqparse.RequestParser()
parser_file.add_argument('file', type=FileStorage, location='files')


@file_to_text_api.route("file_to_text")
@file_to_text_api.doc(
    description='Given a file, its text is provided. Tika is used to extract text from file.',
    params={'file': 'File from which text will be extract'},
    responses={200: 'Success'},
    security='apikey')
class FileToText(Resource):
    @auth_validator()
    @file_to_text_api.expect(parser_file)
    def post(self):
        if 'file' not in request.files:
            abort(HTTPStatus.NOT_FOUND, "No file part")
        file = request.files['file']
        text = extract_text(file, current_app.config["TIKA_PATH"])
        return jsonify(text)
