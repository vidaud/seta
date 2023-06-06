from flask_restx import Namespace, Resource, reqparse, abort, fields
from flask import current_app as app, jsonify

from seta_api.infrastructure.auth_validator import auth_validator
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from .term_enrichment_logic import perform_enrichment

term_enrichment_api = Namespace('seta-api-term-enrichment', description='Term Enrichment')

term_enrichment_parser = reqparse.RequestParser()
term_enrichment_parser.add_argument('terms', required=True, action="split")
term_enrichment_parser.add_argument('enrichment_type', type=str)

term_enrichment_resp = {"words": fields.List(fields.String)}
term_enrichment_response_model = term_enrichment_api.model("term_enrichment_response_model", term_enrichment_resp)

@term_enrichment_api.doc(
    description='Given a list of terms, and the enrichment type a list of term is returned. '
                'The list of term is created using api given with enrichment type parameter.',
    params={'terms': 'List of terms.',
            'enrichment_type': 'enrichment type can be "similar" or "ontology", default "similar"'},
    responses={200: 'Success', 404: 'Not Found Error'},
    security='apikey')
@term_enrichment_api.route("term_enrichment")
@term_enrichment_api.response(200, 'Success', term_enrichment_response_model)
class TermEnrichment(Resource):
    @auth_validator()
    @term_enrichment_api.expect(term_enrichment_parser)
    def get(self):
        args = term_enrichment_parser.parse_args()
        try:
            words = perform_enrichment(args['terms'], args['enrichment_type'], current_app=app)
            return jsonify(words)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("TermEnrichment->get")
            abort(500, "Internal server error")
