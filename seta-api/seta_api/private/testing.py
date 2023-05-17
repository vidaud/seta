from flask_restx import Namespace, Resource, abort, fields
from flask import current_app as app, jsonify, request

from http import HTTPStatus

from seta_api.apis.corpus.corpus_logic import insert_doc
from seta_api.apis.corpus.variables import keywords, other, taxonomy

test_ns = Namespace('Private test api', description='Test ES')


@test_ns.route('cleanup', methods=['POST'])
class TestingCleanup(Resource):

    @test_ns.doc(description='Delete all data from ES',
                            responses={int(HTTPStatus.OK): "All data deleted."})
    def post(self):
        """Cleanup ElasticSearch data for Testing"""
        if not app.testing:
            abort(403, "Function available for TESTING only")
        body = {"query": {"match_all": {}}}
        try:
            app.es.delete_by_query(index=app.config['INDEX_PUBLIC'], body=body)
        except Exception as ex:
            message = str(ex)
            app.logger.exception(message)
            abort(401, message)

        message = "ElasticSearch data was removed."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
    
    
corpus_put_data = test_ns.model(
    "corpus_put_params",
    {
        'id': fields.String(),
        'id_alias': fields.String(),
        'source': fields.String(),
        'title': fields.String(),
        "abstract": fields.String(),
        "text": fields.String(),
        "collection": fields.String(),
        "reference": fields.String(),
        "author": fields.List(fields.String()),
        "date": fields.Date(),
        "link_origin": fields.List(fields.String()),
        "link_alias": fields.List(fields.String()),
        "link_related": fields.List(fields.String()),
        "link_reference": fields.List(fields.String()),
        "mime_type": fields.String(),
        "in_force": fields.String(),
        "language": fields.String(),
        "taxonomy": fields.List(fields.Nested(test_ns.model("taxonomy_sub", taxonomy))),
        "keywords": fields.List(fields.Nested(test_ns.model('keywords', keywords))),
        "other": fields.List(other)
    })

@test_ns.route('corpus', methods=['PUT'])
class TestingCorpus(Resource):
    @test_ns.doc(description='Put a document into corpus index.',
            responses={int(HTTPStatus.OK): 'Success'})
    @test_ns.expect(corpus_put_data)
    def put(self):        
        args = request.get_json(force=True)
        
        try:
            doc_id = insert_doc(args, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"document_id": doc_id})
        except:
            msg = "Document insert failed"
            app.logger.exception(msg)
            abort(HTTPStatus.INTERNAL_SERVER_ERROR, msg)