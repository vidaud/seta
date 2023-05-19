from flask import current_app as app
from flask import jsonify, request
from flask_restx import Namespace, Resource, abort, fields

from seta_api.infrastructure.ApiLogicError import ApiLogicError, ForbiddenResourceError
from seta_api.infrastructure.auth_validator import auth_validator, validate_view_permissions, validate_add_permission, validate_delete_permission
from seta_api.infrastructure.helpers import is_field_in_doc

from .corpus_logic import corpus, delete_doc, doc_by_id, insert_doc
from .variables import corpus_parser
from .variables import Variable

from http import HTTPStatus

corpus_api = Namespace('seta-api-corpus', description='Corpus')
swagger_doc = Variable(corpus_api)


@corpus_api.route("corpus/<string:id>", methods=['GET', 'DELETE'])
class Corpus(Resource):
    @auth_validator()
    @corpus_api.doc(description='Given the elasticsearch unique _id, the relative document from EU corpus is shown.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS,JRC PUBSY, EU Open Data Portal, etc..',
            params={'id': 'Return the document with the specified _id'},
            security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_corpus_get_id_response())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def get(self, id):
        try:

            doc = doc_by_id(id, es=app.es, index=app.config['INDEX_PUBLIC'])
            validate_view_permissions(sources=[doc.get("source", None)])
            
            return doc
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus->get")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(description='Given the elasticsearch unique _id, the relative document is deleted.',
            params={'id': 'Delete the document with the specified _id'},
            security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_delete_id_request_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def delete(self, id):
        try:
            doc = doc_by_id(id, es=app.es, index=app.config['INDEX_PUBLIC'])
            resource_id = doc.get("source", None)
            
            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(resource_id=resource_id, message="User does not have delete permission for the resource")
            
            delete_doc(id, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"deleted document id": id})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus->delete")
            abort(500, "Internal server error")


@corpus_api.route("corpus", methods=['POST', 'GET', 'PUT'])
class CorpusQuery(Resource):
    @auth_validator()
    @corpus_api.doc(description='Retrieve documents related to a term from EU corpus.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc..',
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_post_response_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    @corpus_api.expect(swagger_doc.get_post_request_model())
    def post(self):
        args = request.get_json(force=True)
        app.logger.debug(str(args))
        
        #validate resource_permissions.view
        sources = is_field_in_doc(args, 'source')
        try:
            view_resources = validate_view_permissions(sources)
            
            #restrict query only to view_resources
            if sources is None:
                args["source"] = view_resources
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)

        try:
            documents = corpus(is_field_in_doc(args, 'term'), is_field_in_doc(args, 'n_docs'),
                               is_field_in_doc(args, 'from_doc'), is_field_in_doc(args, 'source'),
                               is_field_in_doc(args, 'collection'), is_field_in_doc(args, 'reference'),
                               is_field_in_doc(args, 'in_force'), is_field_in_doc(args, 'sort'),
                               is_field_in_doc(args, 'taxonomy_path'), is_field_in_doc(args, 'semantic_sort_id'),
                               is_field_in_doc(args, 'sbert_embedding'), is_field_in_doc(args, 'semantic_sort_id_list'),
                               is_field_in_doc(args, 'sbert_embedding_list'), is_field_in_doc(args, 'author'),
                               is_field_in_doc(args, 'date_range'), is_field_in_doc(args, 'aggs'),
                               is_field_in_doc(args, 'search_type'), is_field_in_doc(args, 'other'), current_app=app)
            return jsonify(documents)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("CorpusQuery->post")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(description='Put a document into corpus index.', security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_put_response_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.expect(swagger_doc.get_put_request_model())
    def put(self):
        args = request.get_json(force=True)
        
        source = is_field_in_doc(args, 'source')
        if not validate_add_permission(source):
            abort(HTTPStatus.FORBIDDEN, "User does not have add document permission for the resource")
        
        doc_id = insert_doc(args, es=app.es, index=app.config["INDEX_PUBLIC"])
        return jsonify({"document_id": doc_id})

    @corpus_api.expect(corpus_parser)
    @auth_validator()
    @corpus_api.doc(description='Retrieve documents related to a term from EU corpus.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc..',
            params={'term': 'Return documents related to the specified term',
                    'n_docs': 'Number of documents to be shown (default 10).',
                    'from_doc': 'Defines the number of hits to skip, defaulting to 0.',
                    'search_type': 'Defines the type of search to be used admitted values are "DOCUMENT_SEARCH",'
                                   ' "CHUNK_SEARCH", "ALL_CHUNKS_SEARCH", default is "CHUNK_SEARCH"',
                    'source': 'By default contains all the corpus: '
                              'eurlex,bookshop,cordis,pubsy,opendataportal.'
                              'It is possible to choose from which corpus retrieve documents.',
                    'collection': 'eurlex metadata collection',
                    'reference': 'eurlex metadata reference',
                    'in_force': 'eurlex metadata in_force',
                    'sort': 'sort results field:order',
                    'semantic_sort_id': 'sort results by semantic distance among documents',
                    'semantic_sort_id_list': 'sort results by semantic distance among documents',
                    'author': 'description',
                    'date_range': 'gte:yyyy-mm-dd,lte:yyyy-mm-dd,gt:yyyy-mm-dd,lt:yyyy-mm-dd',
                    'aggs': 'field to be aggregated, allowed fields are: "source", "date_year", '
                            '"source_collection_reference", "taxonomy:taxonomyname", "taxonomies"'},
            security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_get_response_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def get(self):
        args = corpus_parser.parse_args()        
        
        #validate resource_permissions.view
        sources = is_field_in_doc(args, 'source')
        try:
            view_resources = validate_view_permissions(sources)
            
            #restrict query only to view_resources
            if sources is None:
                args["source"] = view_resources
        except ForbiddenResourceError as fre:
            abort(403, fre.message)       
        
        try:
            documents = corpus(args['term'], args['n_docs'], args['from_doc'], args['source'], args['collection'],
                               args['reference'], args['in_force'], args['sort'], None, args['semantic_sort_id'], None,
                               args['semantic_sort_id_list'], None, args['author'], args['date_range'], args['aggs'],
                               args['search_type'], args['other'], current_app=app)

            return jsonify(documents)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except:
            app.logger.exception("CorpusQuery->get")
            abort(500, "Internal server error")

