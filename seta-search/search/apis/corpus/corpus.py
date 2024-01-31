from http import HTTPStatus
import jsonschema

from flask import current_app as app
from flask import jsonify, request
from flask_restx import Namespace, Resource, abort

from search.infrastructure.ApiLogicError import ApiLogicError, ForbiddenResourceError
from search.infrastructure.auth_validator import (
    auth_validator,
    validate_view_permissions,
    validate_add_permission,
    validate_delete_permission,
)
from search.infrastructure.helpers import is_field_in_doc

from .corpus_logic import (
    corpus,
    delete_chunk,
    chunk_by_id,
    insert_doc,
    document_by_id,
    delete_document,
)
from .corpus_logic import (
    update_chunk,
    get_source_from_chunk_list,
    insert_chunk,
    get_id_and_source,
)
from .corpus_logic import translate_from_xml_to_json, translate_from_yaml_to_json
from .variables import Variable


from .validation_json_schema import (
    chunk_update_schema,
    document_post_schema,
    chunk_post_schema,
    query_post_schema,
)

corpus_api = Namespace("Corpus")
swagger_doc = Variable(corpus_api)


@corpus_api.route("corpus/chunk/id", methods=["POST", "DELETE", "PUT"])
class CorpusChunkId(Resource):
    @auth_validator()
    @corpus_api.doc(
        description="Given the elasticsearch unique _id, the relative document (chunk) is provided.",
        security="apikey",
    )
    @corpus_api.response(200, "Success", swagger_doc.get_corpus_get_id_response())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(404, "Not Found Error")
    @corpus_api.expect(swagger_doc.corpus_chunk_id_delete_post_request_model())
    def post(self):
        try:
            args = request.get_json(force=True)
            _id = is_field_in_doc(args, "_id")
            if _id is None:
                raise ApiLogicError("_id has to be provided.")
            chunk = chunk_by_id(_id, es=app.es, index=app.config["INDEX_PUBLIC"])
            resource_id = chunk.get("source", None)
            if not validate_view_permissions(sources=[resource_id]):
                raise ForbiddenResourceError(
                    resource_id=resource_id,
                    message="User does not have view permission for the resource",
                )
            return chunk
        except ApiLogicError as aex:
            if str(aex) == "ID not found.":
                return {}
            else:
                abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus chunk id ->get")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(
        description="Given the elasticsearch unique _id, the relative document (chunk) is deleted.",
        security="apikey",
    )
    @corpus_api.response(200, "Success", swagger_doc.get_delete_id_request_model())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(404, "Not Found Error")
    @corpus_api.expect(swagger_doc.corpus_chunk_id_delete_post_request_model())
    def delete(self):
        try:
            args = request.get_json(force=True)
            _id = is_field_in_doc(args, "_id")
            if _id is None:
                raise ApiLogicError("_id has to be provided.")
            chunk = chunk_by_id(_id, es=app.es, index=app.config["INDEX_PUBLIC"])
            resource_id = chunk.get("source", None)

            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(
                    resource_id=resource_id,
                    message="User does not have delete permission for the resource",
                )

            delete_chunk(_id, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"deleted_document_id": _id})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus chunk id ->delete")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(
        description="Given a json with field to be updated and the _id the relative document (chunk) is updated.",
        security="apikey",
    )
    @corpus_api.response(200, "Success", swagger_doc.get_update_id_request_model())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(404, "Not Found Error")
    @corpus_api.response(400, "Bad Request Error")
    @corpus_api.expect(swagger_doc.corpus_chunk_id_put_request_model())
    def put(self):
        try:
            args = request.get_json(force=True)
            jsonschema.validate(instance=args, schema=chunk_update_schema)
            _id = args["_id"]
            chunk = chunk_by_id(_id, es=app.es, index=app.config["INDEX_PUBLIC"])
            resource_id = chunk.get("source", None)

            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(
                    resource_id=resource_id,
                    message="User does not have update permission for the resource",
                )
            del args[
                "_id"
            ]  # Field [_id] is a metadata field and cannot be used in update.
            update_chunk(_id, es=app.es, fields=args, index=app.config["INDEX_PUBLIC"])
            return jsonify({"updated_document_id": _id})
        except jsonschema.ValidationError as err:
            abort(400, err.message)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus chunk id update -> put")
            abort(500, "Internal server error")


@corpus_api.route("corpus/chunk", methods=["POST"])
class CorpusChunk(Resource):
    @auth_validator()
    @corpus_api.doc(description="This endpoint enables users to submit and insert individual "
                                "document chunks into the SeTA index.",
                    security="apikey")
    @corpus_api.response(200, "Success", swagger_doc.get_put_doc_chunk_response_model())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(400, "Bad Request Error")
    @corpus_api.expect(swagger_doc.corpus_chunk_post_request_model())
    def post(self):
        try:
            args = request.get_json(force=True)

            source = is_field_in_doc(args, "source")
            if not validate_add_permission(source):
                raise ForbiddenResourceError(resource_id=source)
            jsonschema.validate(instance=args, schema=chunk_post_schema)
            doc_id = insert_chunk(
                args,
                es=app.es,
                index=app.config["INDEX_PUBLIC"],
                current_app=app,
                request=request,
            )
            return jsonify({"_id": doc_id})
        except jsonschema.ValidationError as err:
            abort(400, err.message)
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus chunk -> post")
            abort(500, "Internal server error")


@corpus_api.route("corpus/document/id", methods=["POST", "DELETE"])
class CorpusDocumentId(Resource):
    @auth_validator()
    @corpus_api.doc(
        description="Given a document_id, the relative list of chunks is shown.",
        security="apikey",
    )
    @corpus_api.response(200, "Success", swagger_doc.corpus_get_id_document_response())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(404, "Not Found Error")
    @corpus_api.expect(swagger_doc.corpus_document_id_post_request_model())
    def post(self):
        args = request.get_json(force=True)
        document_id = is_field_in_doc(args, "document_id")
        if document_id is None:
            raise ApiLogicError("document_id has to be provided.")
        try:
            document = document_by_id(
                document_id,
                is_field_in_doc(args, "n_docs"),
                is_field_in_doc(args, "from_doc"),
                current_app=app,
            )
            source = get_source_from_chunk_list(document["chunk_list"])
            if source:
                validate_view_permissions(sources=[source])
                return document
            return {"chunk_list": []}
        except ApiLogicError as aex:
            if str(aex) == "ID not found.":
                return {"chunk_list": []}
            else:
                abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus document id ->get")
            abort(500, "Internal server error")

    @auth_validator()
    @corpus_api.doc(
        description="Given a document_id, the relative list of chunks is deleted.",
        security="apikey",
    )
    @corpus_api.response(200, "Success", swagger_doc.get_delete_id_request_model())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(404, "Not Found Error")
    @corpus_api.expect(swagger_doc.corpus_document_id_delete_request_model())
    def delete(self):
        try:
            args = request.get_json(force=True)
            document_id, resource_id = get_id_and_source(args, app)
            if not validate_delete_permission(resource_id):
                raise ForbiddenResourceError(
                    resource_id=resource_id,
                    message="User does not have delete permission for the resource",
                )

            delete_document(document_id, es=app.es, index=app.config["INDEX_PUBLIC"])
            return jsonify({"deleted_document_id": document_id})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus document id ->delete")
            abort(500, "Internal server error")


@corpus_api.route("corpus/document", methods=["POST"])
class CorpusDocument(Resource):
    @auth_validator()
    @corpus_api.doc(description="This endpoint allows users to submit and insert documents into the SeTA index. "
                                "The system will automatically divide the document into chunks.", security="apikey")
    @corpus_api.response(200, "Success", swagger_doc.get_put_doc_chunk_response_model())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(400, "Bad Request Error")
    @corpus_api.expect(swagger_doc.get_put_request_model(), validate=False)
    def post(self):
        if not request.content_type == "application/json":
            abort(404, "Invalid content-type. Must be application/json")
        try:
            args = request.get_json(force=True)
        except Exception:
            abort(404, str("invalid json"))
        try:
            jsonschema.validate(instance=args, schema=document_post_schema)
            source = is_field_in_doc(args, "source")
            if not validate_add_permission(source):
                raise ForbiddenResourceError(resource_id=source)
            doc_id = insert_doc(
                args,
                es=app.es,
                index=app.config["INDEX_PUBLIC"],
                current_app=app,
                request=request,
            )
            return jsonify({"_id": doc_id})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except jsonschema.ValidationError as err:
            abort(400, err.message)
        except ForbiddenResourceError as fre:
            abort(HTTPStatus.FORBIDDEN, fre.message)
        except Exception:
            app.logger.exception("Corpus document -> post")
            abort(500, "Internal server error")


@corpus_api.route("corpus/translate_yaml", methods=["POST"])
class CorpusTranslateYaml(Resource):
    @auth_validator()
    @corpus_api.doc(
        description="Given corpus/document POST input in yaml file, json format is return.",
        security="apikey",
    )
    def post(self):
        try:
            if not request.content_type == "application/yaml":
                raise ApiLogicError("Invalid content-type. Must be application/yaml.")
            json_obj = translate_from_yaml_to_json(request.get_data().decode())
            return jsonify({"json_format": json_obj})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except Exception:
            app.logger.exception("corpus/translate_yaml -> post")
            abort(500, "Internal server error")


@corpus_api.route("corpus/translate_xml", methods=["POST"])
class CorpusTranslateXml(Resource):
    @auth_validator()
    @corpus_api.doc(
        description="Given corpus/document POST input in xml file, json format is return",
        security="apikey",
    )
    def post(self):
        try:
            if not request.content_type == "application/xml":
                raise ApiLogicError("Invalid content-type. Must be application/xml.")
            json_obj = translate_from_xml_to_json(request.get_data())
            return jsonify({"json_format": json_obj})
        except ApiLogicError as aex:
            abort(404, str(aex))
        except Exception:
            app.logger.exception("Corpus document -> post")
            abort(500, "Internal server error")


@corpus_api.route("corpus", methods=["POST"])
class CorpusQuery(Resource):
    @auth_validator()
    @corpus_api.doc(
        description="This endpoint allows users to retrieve a curated collection of documents "
                    "based on specified search criteria. This endpoint supports the retrieval of documents"
                    " related to a given term, with additional options for refining the search. ",
        security="apikey",
    )
    @corpus_api.response(200, "Success", swagger_doc.get_corpus_post_response_model())
    @corpus_api.response(401, "Forbidden access to the resource")
    @corpus_api.response(404, "Not Found Error")
    @corpus_api.response(400, "Bad Request Error")
    @corpus_api.expect(swagger_doc.query_request_model())
    def post(self):
        try:
            args = request.get_json(force=True)
            app.logger.debug(str(args))
            jsonschema.validate(instance=args, schema=query_post_schema)

            # validate resource_permissions.view
            sources = is_field_in_doc(args, "source")
            view_resources = validate_view_permissions(sources)

            # restrict query only to view_resources
            if sources is None:
                args["source"] = view_resources

            documents = corpus(
                is_field_in_doc(args, "term"),
                is_field_in_doc(args, "n_docs"),
                is_field_in_doc(args, "from_doc"),
                is_field_in_doc(args, "source"),
                is_field_in_doc(args, "collection"),
                is_field_in_doc(args, "reference"),
                is_field_in_doc(args, "in_force"),
                is_field_in_doc(args, "sort"),
                is_field_in_doc(args, "taxonomy"),
                is_field_in_doc(args, "semantic_sort_id_list"),
                is_field_in_doc(args, "sbert_embedding_list"),
                is_field_in_doc(args, "author"),
                is_field_in_doc(args, "date_range"),
                is_field_in_doc(args, "aggs"),
                is_field_in_doc(args, "search_type"),
                is_field_in_doc(args, "other"),
                is_field_in_doc(args, "annotation"),
                current_app=app,
            )
            return jsonify(documents)
        except ForbiddenResourceError:
            return {"total_docs": None, "documents": []}
        except jsonschema.ValidationError as err:
            abort(400, err.message)
        except ApiLogicError as aex:
            if str(aex) == "Sbert vector not retrieved":
                return {"total_docs": None, "documents": []}
            abort(404, str(aex))
        except Exception:
            app.logger.exception("CorpusQuery->post")
            abort(500, "Internal server error")
