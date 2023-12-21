import requests
from flask_restx import Namespace, Resource, abort, fields
from flask import current_app as app, request, jsonify, Response
from jsonschema import validate

from search.infrastructure.auth_validator import auth_validator
from search.infrastructure.ApiLogicError import ApiLogicError

from .export_logic import export

export_api = Namespace('seta-api-export', description='Export')

export_post_schema = {"type": "object",
                      "properties": {
                          "ids": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"},
                                                                                              "path": {"type": "string"}
                                                                                              }
                                                             }
                                  },
                          "fields": {"type": "array", "items": {"type": "string"}}
                      },
                      "required": ["ids", "fields"],
                      "additionalProperties": False}

id_obj = {"id": fields.String, "path": fields.String}
id_model = export_api.model("id_model", id_obj)
export_req = {"ids": fields.List(fields.Nested(id_model)), "fields": fields.List(fields.String())}
export_request_model = export_api.model("export_req_model", export_req)


@export_api.route("export")
class Export(Resource):
    @export_api.doc(description='Given a list of ids and a list of fields to be exported, '
                                'export of related documents is returned',
                    responses={200: 'Success', 404: 'Not Found Error'},
                    security='apikey')
    @export_api.expect(export_request_model, validate=False)
    @export_api.produces(["application/json", "text/csv"])
    @auth_validator()
    def post(self):
        try:
            args = request.get_json(force=True)
            validate(instance=args, schema=export_post_schema)
            export_format = str(request.accept_mimetypes)
            export_formats = ["application/json", "text/csv"]
            if export_format not in export_formats:
                raise ApiLogicError("Invalid Accept_mimetypes, it must be application/json or text/csv")
            resp = export(args["ids"], args["fields"], app, export_format, request)
            if export_format == "text/csv":
                return Response(resp, mimetype="text/csv")
            if export_format == "application/json":
                return resp
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("Export->post")
            abort(500, "Internal server error")


catalog_item = {"name": fields.String, "description": fields.String}
catalogue_item_model = export_api.model("catalog_item_model", catalog_item)
exp_cat_resp = {"fields_catalog": fields.List(fields.Nested(catalogue_item_model))}
export_cata_response_model = export_api.model("exp_cat_resp_model", exp_cat_resp)


@export_api.route("export/catalog", methods=['GET'])
class Export(Resource):
    @export_api.doc(description='Available document fields and descriptions are returned.',
                    responses={200: 'Success', 404: 'Not Found Error'},
                    security='apikey')
    @export_api.response(200, 'Success', export_cata_response_model)
    @auth_validator()
    def get(self):
        try:
            url = app.config.get("CATALOGUE_API_ROOT_URL") + "fields"

            # get catalogue from
            result = requests.get(url=url, headers=request.headers, cookies=request.cookies)
            catalogue = result.json()

            return jsonify({"fields_catalog": catalogue})
        except:
            app.logger.exception("ExportCatalog->get")
            abort(500, "Internal server error")
