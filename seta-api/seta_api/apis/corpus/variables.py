from flask_restx import reqparse, fields

corpus_parser = reqparse.RequestParser()
corpus_parser.add_argument("term")
corpus_parser.add_argument("n_docs", type=int)
corpus_parser.add_argument("from_doc", type=int)
corpus_parser.add_argument("search_type")
corpus_parser.add_argument("source", action="split")
corpus_parser.add_argument("collection", action="split")
corpus_parser.add_argument("subject", action="split")
corpus_parser.add_argument("reference", action="split")
corpus_parser.add_argument("in_force")
corpus_parser.add_argument("sort", action="split")
corpus_parser.add_argument("semantic_sort_id")
corpus_parser.add_argument("semantic_sort_id_list", action="split")
corpus_parser.add_argument("author", action="split")
corpus_parser.add_argument("date_range", action="split")
corpus_parser.add_argument("aggs", action="split")
corpus_parser.add_argument("other", action="split")  

other = fields.Wildcard(fields.String())

metadata = {}
metadata["name"] = fields.String()
metadata["code"] = fields.String()
metadata["label"] = fields.String()
metadata["longLabel"] = fields.String()
metadata["validated"] = fields.String()
metadata["classifier"] = fields.String()
metadata["version"] = fields.String()
metadata["name_in_path"] = fields.String()


keywords = {}
keywords["keyword"] = fields.String()
keywords["score"] = fields.Float()

document = {}
document["_id"] = fields.String()
document["abstract"] = fields.String()
document["author"] = fields.List(fields.String())
document["chunk_number"] = fields.Integer()
document["chunk_text"] = fields.String()
document["collection"] = fields.String()
document["concordance"] = fields.List(fields.List(fields.String()))
document["date"] = fields.String()
document["document_id"] = fields.String()
document["id"] = fields.String()
document["id_alias"] = fields.String()
document["in_force"] = fields.String()
document["keywords"] = None
document["language"] = fields.String()
document["link_origin"] = fields.String()
document["other"] = fields.List(other)
document["reference"] = fields.String()
document["score"] = fields.Float
document["taxonomy"] = None
document["title"] = fields.String()
document["source"] = fields.String()

date_year_agg = {}
date_year_agg["doc_count"] = fields.Integer
date_year_agg["year"] = fields.String

source_agg = {}
source_agg["doc_count"] = fields.Integer
source_agg["key"] = fields.String

reference = {}
reference["doc_count"] = fields.Integer
reference["key"] = fields.String

collection = {}
collection["doc_count"] = fields.Integer
collection["key"] = fields.String
collection["references"] = None

source = {}
source["doc_count"] = fields.Integer
source["key"] = fields.String
source["collections"] = None

source_collection_reference_agg = {"sources": None}

subcategory = {}
subcategory["classifier"] = fields.String
subcategory["code"] = fields.String
subcategory["doc_count"] = fields.Integer
subcategory["label"] = fields.String
subcategory["longLabel"] = fields.String
subcategory["name_in_path"] = fields.String
subcategory["subcategories"] = None

taxonomy = {}
taxonomy["doc_count"] = fields.Integer
taxonomy["name"] = fields.String
taxonomy["name_in_path"] = fields.String
taxonomy["subcategories"] = None


post_get_response = {}
post_get_response["documents"] = None
post_get_response["aggregations"] = None

corpus_put_response ={}
corpus_put_response["document_id"] = fields.String

corpus_put_params = {}
corpus_put_params["id"] = fields.String
corpus_put_params["id_alias"] = fields.String()
corpus_put_params["source"] = fields.String()
corpus_put_params["title"] = fields.String()
corpus_put_params["abstract"] = fields.String()
corpus_put_params["text"] = fields.String()
corpus_put_params["collection"] = fields.String()
corpus_put_params["reference"] = fields.String()
corpus_put_params["author"] = fields.List(fields.String())
corpus_put_params["date"] = fields.Date()
corpus_put_params["link_origin"] = fields.List(fields.String())
corpus_put_params["link_alias"] = fields.List(fields.String())
corpus_put_params["link_related"] = fields.List(fields.String())
corpus_put_params["link_reference"] = fields.List(fields.String())
corpus_put_params["mime_type"] = fields.String()
corpus_put_params["in_force"] = fields.String()
corpus_put_params["language"] = fields.String()
corpus_put_params["taxonomy"] = None#fields.List(fields.Nested(corpus_api.model("metadata", metadata)))
corpus_put_params["taxonomy_path"] = fields.List(fields.String())
corpus_put_params["keywords"] = None#fields.List(fields.Nested(corpus_api.model("keywords", keywords)))
corpus_put_params["other"] = fields.List(other)

corpus_post_params = {}
corpus_post_params["term"] = fields.String(description="term to be searched", example="data")
corpus_post_params["n_docs"] = fields.Integer(description="Number of documents to be shown (default 10)", example=10)
corpus_post_params["from_doc"] = fields.Integer(description="Defines the number of hits to skip, defaulting to 0.",
                                                example=0)
corpus_post_params["search_type"] = fields.String(description="search type to be used, possible values are "
                                                              "DOCUMENT_SEARCH, CHUNK_SEARCH, ALL_CHUNKS_SEARCH, "
                                                              "default is CHUNK_SEARCH")
corpus_post_params["source"] = fields.List(fields.String(), description="By default contains all the corpus: "
                                                                        "eurlex,cordis,pubsy. It is possible to choose "
                                                                        "from which corpus retrieve documents.")
corpus_post_params["reference"] = fields.List(fields.String(), description="eurlex metadata reference")
corpus_post_params["collection"] = fields.List(fields.String(), description="eurlex metadata collection")
corpus_post_params["taxonomy"] = None#fields.List(fields.Nested(corpus_api.model("metadata", metadata)), description="taxonomy generic field")
corpus_post_params["in_force"] = fields.String(description="eurlex metadata into_force")
corpus_post_params["sort"] = fields.List(fields.String(), description="sort results field:order")
corpus_post_params["semantic_sort_id"] = fields.String(description="sort results by semantic distance among documents")
corpus_post_params["sbert_embedding"] = fields.List(fields.Float, description="embeddings vector")
corpus_post_params["semantic_sort_id_list"] = fields.List(fields.String(), description="sort results by semantic distance among documents")
corpus_post_params["sbert_embedding_list"] = fields.List(fields.List(fields.Float,
                                                                     description="list of embeddings vector"))
corpus_post_params["author"] = fields.String(description="author")
corpus_post_params["date_range"] = fields.List(fields.String, description="examples: gte:yyyy-mm-dd,lte:yyyy-mm-dd,"
                                                                          "gt:yyyy-mm-dd,lt:yyyy-mm-dd")
corpus_post_params["aggs"] = fields.List(fields.String, description="field to be aggregated, allowed fields are:"
                                                                    '"source", "date_year", "source_collection_reference", '
                                                                    '"taxonomy:taxonomyname"')
corpus_post_params["other"] = fields.List(other, descritpion='"other":[{"other.crc":"de1cbd1eecdd19cb0d527f3a3433c6958e4b8b1b02ce69c960e02a611f27b036"}]')

corpus_delete_id_response = {}
corpus_delete_id_response["deleted_document_id"] = fields.String

corpus_get_id_response = {}
corpus_get_id_response["_id"] = fields.String()
corpus_get_id_response["abstract"] = fields.String()
corpus_get_id_response["author"] = fields.List(fields.String())
corpus_get_id_response["chunk_number"] = fields.Integer()
corpus_get_id_response["chunk_text"] = fields.String()
corpus_get_id_response["collection"] = fields.String()
corpus_get_id_response["concordance"] = fields.List(fields.List(fields.String()))
corpus_get_id_response["date"] = fields.String()
corpus_get_id_response["document_id"] = fields.String()
corpus_get_id_response["id"] = fields.String()
corpus_get_id_response["id_alias"] = fields.String()
corpus_get_id_response["in_force"] = fields.String()
corpus_get_id_response["keywords"] = None
corpus_get_id_response["language"] = fields.String()
corpus_get_id_response["link_origin"] = fields.String()
corpus_get_id_response["link_alias"] = fields.String()
corpus_get_id_response["link_related"] = fields.String()
corpus_get_id_response["link_reference"] = fields.String()
corpus_get_id_response["mime_type"] = fields.String()
corpus_get_id_response["other"] = fields.List(other)
corpus_get_id_response["reference"] = fields.String()
corpus_get_id_response["score"] = fields.Float
corpus_get_id_response["taxonomy"] = None
corpus_get_id_response["taxonomy_path"] = fields.String()
corpus_get_id_response["title"] = fields.String()
corpus_get_id_response["source"] = fields.String()
corpus_get_id_response["abstract"] = fields.String()
corpus_get_id_response["sbert_embedding"] = fields.List(fields.Float)
