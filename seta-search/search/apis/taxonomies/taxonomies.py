from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import current_app as app, request, jsonify

from search.infrastructure.auth_validator import auth_validator
from search.infrastructure.ApiLogicError import ApiLogicError


from .taxonomy import Taxonomy
import json
import jsonschema

taxonomy_api = Namespace("Taxonomy")

# Define the parser for the file upload
upload_parser = reqparse.RequestParser()
upload_parser.add_argument('file', type='file', location='files', required=True, help='JSON file to be uploaded')

# Define the model using api.model
model = taxonomy_api.model('Taxonomy', {
    'field1': fields.String(required=True, description='Description for field1'),
    'field2': fields.Integer(required=True, description='Description for field2')
})


@taxonomy_api.route("taxonomy")
@taxonomy_api.doc(
    description="Add new Taxonomy tree",
    security="apikey",
)
class CreateTaxonomy(Resource):
    @taxonomy_api.doc(params={'file': "JSON file to be uploaded. JSON schema is described in documentation (ADD LINK)."})
    @taxonomy_api.expect(upload_parser)
    @auth_validator()
    def post(self):
        try:
            print("request.files", request.files)
            if 'file' in request.files:
                file = request.files['file']
            else:
                args = upload_parser.parse_args()
                file = args['file']
            if not file:
                raise ApiLogicError('No file part', 400)
            if file.filename == '':
                raise ApiLogicError('No selected file', 400)
            if file and is_valid_json(file):
                json_data = json.load(file)
            else:
                raise ApiLogicError('Invalid file type, must be json', 400)
            jsonschema.validate(instance=json_data, schema=json_schema)
            tax = Taxonomy(app.config["INDEX_TAXONOMY"], app.es)
            tax.from_eurovoc_tree_to_index_format(json_data)
            return {"ok": "Success"}, 201
        except json.JSONDecodeError as e:
            abort(400, 'Invalid JSON file format')
        except ApiLogicError as aex:
            abort(400, str(aex))
        except Exception:
            app.logger.exception("corpus/taxonomy -> post")
            abort(500, "Internal server error")


def is_valid_json(file):
    #TODO replace with nlp-api call which will use libmagic to identify mimetype
    if 'json' in file.mimetype.lower():
        return True
    return False


def convert_file_to_json(file):
    file_content = file.stream.read().decode('utf-8')
    lines = file_content.split('\n')
    parsed_data = {}
    for line in lines:
        if ':' in line:
            key, value = line.strip().split(':', 1)
            parsed_data[key.strip()] = value.strip()
    json_data = json.dumps(parsed_data, indent=2)
    return json_data

json_schema = {
    "type": "object",
    "patternProperties": {
        "^[a-zA-Z0-9_]+$": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/node"
                    }
                }
            },
            "required": ["data"]
        }
    },
    "definitions": {
        "node": {
            "type": "object",
            "properties": {
                "label": {"type": "string"},
                "data": {"type": "string"},
                "notation": {"type": "string"},
                "type": {"type": "string"},
                "children": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/node"}
                },
                "uuid": {"type": "string"}
            },
            "required": ["label", "notation"]
        }
    }
}
