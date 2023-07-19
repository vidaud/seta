from flask import current_app as app
from flask import jsonify, request
from flask_restx import Namespace, Resource, abort

from seta_api.infrastructure.ApiLogicError import ApiLogicError, ForbiddenResourceError
from seta_api.infrastructure.auth_validator import auth_validator, validate_view_permissions, validate_add_permission, validate_delete_permission
from seta_api.infrastructure.helpers import is_field_in_doc

from .corpus_logic import corpus, delete_chunk, chunk_by_id, insert_doc, document_by_id, delete_document
from .corpus_logic import update_chunk, get_source_from_chunk_list, insert_chunk
from .variables import corpus_parser, corpus_get_document_id_parser
from .variables import Variable

import jsonschema
from jsonschema import validate
from .validation_json_schema import chunk_update_schema, document_post_schema, chunk_post_schema

from http import HTTPStatus

corpus_api = Namespace('seta-api-corpus', description='Corpus')
swagger_doc = Variable(corpus_api)


@corpus_api.route("corpus/chunk/<string:id>", methods=['GET', 'DELETE', 'PUT'])
class CorpusChunk(Resource):
    @auth_validator()
    @corpus_api.doc(description='Given the elasticsearch unique _id, the relative document (chunk) is provided.',
                    params={'id': 'Return the document (chunk) with the specified _id'},
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_corpus_get_id_response())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def get(self, id):
        try:

            chunk = chunk_by_id(id, es=app.es, index=app.config['INDEX_PUBLIC'])
            validate_view_permissions(sources=[chunk.get("source", None)])
            return chunk
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus chunk id ->get")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(description='Given the elasticsearch unique _id, the relative document (chunk) is deleted.',
                    params={'id': 'Delete the document (chunk) with the specified _id'},
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_delete_id_request_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def delete(self, id):
        try:
            chunk = chunk_by_id(id, es=app.es, index=app.config['INDEX_PUBLIC'])
            resource_id = chunk.get("source", None)

            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(resource_id=resource_id,
                                             message="User does not have delete permission for the resource")

            delete_chunk(id, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"deleted_document_id": id})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus chunk id ->delete")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(description='Given the elasticsearch unique _id, and json with field to be updated the relative document (chunk) is updated.',
                    params={'id': 'Update the document (chunk) with the specified _id'},
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_update_id_request_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    @corpus_api.expect(swagger_doc.corpus_chunk_put_request_model())
    def put(self, id):
        try:
            chunk = chunk_by_id(id, es=app.es, index=app.config['INDEX_PUBLIC'])
            resource_id = chunk.get("source", None)

            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(resource_id=resource_id,
                                             message="User does not have update permission for the resource")

            args = request.get_json(force=True)
            app.logger.debug(str(args))
            validate(instance=args, schema=chunk_update_schema)
            update_chunk(id, es=app.es, fields=args, index=app.config['INDEX_PUBLIC'])
            return jsonify({"updated_document_id": id})
        except jsonschema.ValidationError as err:
            abort(404, str(err))
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus chunk id update -> put")
            abort(500, "Internal server error")


@corpus_api.route("corpus/chunk", methods=['POST'])
class CorpusChunk(Resource):
    @auth_validator()
    @corpus_api.doc(description='Put a chunk into corpus index.', security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_put_doc_chunk_response_model())
    @corpus_api.response(401, 'Forbidden access to the resource')
    @corpus_api.expect(swagger_doc.corpus_chunk_post_request_model())
    def post(self):
        try:
            args = request.get_json(force=True)

            source = is_field_in_doc(args, 'source')
            if not validate_add_permission(source):
                abort(HTTPStatus.FORBIDDEN, "User does not have add document permission for the resource")

            validate(instance=args, schema=chunk_post_schema)

            doc_id = insert_chunk(args, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"_id": doc_id})
        except jsonschema.ValidationError as err:
            abort(404, str(err))
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus chunk -> post")
            abort(500, "Internal server error")


@corpus_api.route("corpus/document/<string:id>", methods=['GET', 'DELETE'])
class CorpusDocumentId(Resource):
    @auth_validator()
    @corpus_api.doc(description='Given a document_id, the relative list of chunks is shown.',
                    params={'id': 'Return all the chunks of document with the specified document_id',
                            'n_docs': 'Number of chunks to be returned. Default 10.',
                            'from_doc': 'Defines the number of hits to skip, defaulting to 0.'},
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.corpus_get_id_document_response())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def get(self, id):
        args = corpus_get_document_id_parser.parse_args()
        try:
            document = document_by_id(id, args["n_docs"], args["from_doc"], current_app=app)
            source = get_source_from_chunk_list(document["chunk_list"])
            if source:
                validate_view_permissions(sources=[source])
                return document
            return {"chunk_list": []}
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus document id ->get")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(description='Given a document_id, the relative list of chunks is deleted.',
                    params={'id': 'Delete the list of chunks with the specified document_id'},
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_delete_id_request_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.response(404, 'Not Found Error')
    def delete(self, id):
        try:
            doc = chunk_by_id(id, es=app.es, index=app.config['INDEX_PUBLIC'])
            resource_id = doc.get("source", None)

            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(resource_id=resource_id,
                                             message="User does not have delete permission for the resource")

            delete_document(id, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"deleted_document_id": id})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus document id ->delete")
            abort(500, "Internal server error")


@corpus_api.route("corpus/document", methods=['POST'])
class CorpusDocument(Resource):
    @auth_validator()
    @corpus_api.doc(description='Put a document into corpus index.', security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_put_doc_chunk_response_model())
    @corpus_api.response(401, 'Forbbiden access to the resource')
    @corpus_api.expect(swagger_doc.get_put_request_model())
    def post(self):
        try:
            args = request.get_json(force=True)

            source = is_field_in_doc(args, 'source')
            if not validate_add_permission(source):
                abort(HTTPStatus.FORBIDDEN, "User does not have add document permission for the resource")

            validate(instance=args, schema=document_post_schema)

            doc_id = insert_doc(args, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"_id": doc_id})
        except jsonschema.ValidationError as err:
            abort(404, str(err))
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except:
            app.logger.exception("Corpus document -> post")
            abort(500, "Internal server error")


@corpus_api.route("corpus", methods=['POST', 'GET'])
class CorpusQuery(Resource):
    @auth_validator()
    @corpus_api.doc(description='Retrieve documents related to a term from EU corpus.'
                        'EU corpus contains documents of the European Commission: '
                        'Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc..',
                    security='apikey')
    @corpus_api.response(200, 'Success', swagger_doc.get_corpus_post_response_model())
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

