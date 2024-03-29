from flask_restx import fields

other = {}
other["*"] = fields.String(description="Other field")

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
document["other"] = None
document["reference"] = fields.String()
document["score"] = fields.Float
document["taxonomy"] = None
document["title"] = fields.String()
document["source"] = fields.String()
document["annotation"] = fields.String()

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

taxonomy_search = {}
taxonomy_search["path"] = fields.List(fields.String())

taxonomy = {}
taxonomy["code"] = fields.String
taxonomy["long_code"] = fields.String
taxonomy["label"] = fields.String
taxonomy["long_label"] = fields.String
taxonomy["type"] = fields.String
taxonomy["taxonomy_name"] = fields.String

taxonomy_agg = {}
taxonomy_agg["doc_count"] = fields.Integer
taxonomy_agg["code"] = fields.String
taxonomy_agg["long_code"] = fields.String
taxonomy_agg["label"] = fields.String
taxonomy_agg["long_label"] = fields.String
taxonomy_agg["type"] = fields.String
taxonomy_agg["taxonomy_name"] = fields.String
taxonomy_agg["subcategories"] = fields.List(fields.Raw())

post_get_response = {}
post_get_response["documents"] = None
post_get_response["aggregations"] = None

corpus_put_response = {}
corpus_put_response["document_id"] = fields.String()

corpus_doc_chunk_post_response = {}
corpus_doc_chunk_post_response["_id"] = fields.String()

corpus_put_params = {}
corpus_put_params["id"] = fields.String()
corpus_put_params["id_alias"] = fields.String()
corpus_put_params["source"] = fields.String()
corpus_put_params["title"] = fields.String()
corpus_put_params["abstract"] = fields.String()
corpus_put_params["text"] = fields.String()
corpus_put_params["collection"] = fields.String()
corpus_put_params["reference"] = fields.String()
corpus_put_params["author"] = fields.List(fields.String())
corpus_put_params["date"] = fields.Date()
corpus_put_params["link_origin"] = fields.String()
corpus_put_params["link_alias"] = fields.List(fields.String())
corpus_put_params["link_related"] = fields.List(fields.String())
corpus_put_params["link_reference"] = fields.List(fields.String())
corpus_put_params["mime_type"] = fields.String()
corpus_put_params["in_force"] = fields.String()
corpus_put_params["language"] = fields.String()
corpus_put_params["taxonomy"] = fields.List(fields.String(description= "taxonomy is defined as taxonomy_name:taxonomy_code"))
corpus_put_params["keywords"] = None
corpus_put_params["other"] = None

corpus_document_id_post_request_model = {}
corpus_document_id_post_request_model["document_id"] = fields.String(
    description="Return all the chunks of document with the specified document_id")
corpus_document_id_post_request_model["n_docs"] = fields.Integer(
    description="Number of chunks to be returned. Default 10.")
corpus_document_id_post_request_model["from_doc"] = fields.Integer(
    description="Defines the number of chunks to skip, defaulting to 0.")

corpus_document_id_delete_request_model = {}
corpus_document_id_delete_request_model["document_id"] = fields.String()

corpus_chunk_id_post_delete_params = {}
corpus_chunk_id_post_delete_params["_id"] = fields.String()

corpus_chunk_id_put_params = {}
corpus_chunk_id_put_params["_id"] = fields.String()
corpus_chunk_id_put_params["id"] = fields.String()
corpus_chunk_id_put_params["id_alias"] = fields.String()
corpus_chunk_id_put_params["title"] = fields.String()
corpus_chunk_id_put_params["abstract"] = fields.String()
corpus_chunk_id_put_params["collection"] = fields.String()
corpus_chunk_id_put_params["reference"] = fields.String()
corpus_chunk_id_put_params["author"] = fields.List(fields.String())
corpus_chunk_id_put_params["date"] = fields.Date()
corpus_chunk_id_put_params["link_origin"] = fields.String()
corpus_chunk_id_put_params["link_alias"] = fields.List(fields.String())
corpus_chunk_id_put_params["link_related"] = fields.List(fields.String())
corpus_chunk_id_put_params["link_reference"] = fields.List(fields.String())
corpus_chunk_id_put_params["mime_type"] = fields.String()
corpus_chunk_id_put_params["in_force"] = fields.String()
corpus_chunk_id_put_params["language"] = fields.String()
corpus_chunk_id_put_params["taxonomy"] = fields.List(fields.String())
corpus_chunk_id_put_params["keywords"] = None
corpus_chunk_id_put_params["other"] = None
corpus_chunk_id_put_params["chunk_text"] = fields.String()
corpus_chunk_id_put_params["sbert_embedding"] = fields.List(fields.Raw)

corpus_chunk_post_params = {}
corpus_chunk_post_params["id"] = fields.String()
corpus_chunk_post_params["document_id"] = fields.String()
corpus_chunk_post_params["source"] = fields.String()
corpus_chunk_post_params["id_alias"] = fields.String()
corpus_chunk_post_params["title"] = fields.String()
corpus_chunk_post_params["abstract"] = fields.String()
corpus_chunk_post_params["collection"] = fields.String()
corpus_chunk_post_params["reference"] = fields.String()
corpus_chunk_post_params["author"] = fields.List(fields.String())
corpus_chunk_post_params["date"] = fields.Date()
corpus_chunk_post_params["link_origin"] = fields.String()
corpus_chunk_post_params["link_alias"] = fields.List(fields.String())
corpus_chunk_post_params["link_related"] = fields.List(fields.String())
corpus_chunk_post_params["link_reference"] = fields.List(fields.String())
corpus_chunk_post_params["mime_type"] = fields.String()
corpus_chunk_post_params["in_force"] = fields.String()
corpus_chunk_post_params["language"] = fields.String()
corpus_chunk_post_params["taxonomy"] = fields.List(fields.String(description= "taxonomy is defined as taxonomy_name:taxonomy_code"))
corpus_chunk_post_params["keywords"] = None
corpus_chunk_post_params["other"] = None
corpus_chunk_post_params["chunk_text"] = fields.String()
corpus_chunk_post_params["chunk_number"] = fields.Integer()
corpus_chunk_post_params["sbert_embedding"] = fields.List(fields.Raw)

corpus_post_params = {}
corpus_post_params["term"] = fields.String(description="term to be searched", example="data")
corpus_post_params["n_docs"] = fields.Integer(description="Number of documents to be shown (default 10)", example=10)
corpus_post_params["from_doc"] = fields.Integer(description="Defines the number of hits to skip, defaulting to 0.",
                                                example=0)
corpus_post_params["search_type"] = fields.String(description="search type to be used, possible values are "
                                                              "DOCUMENT_SEARCH, CHUNK_SEARCH, ALL_CHUNKS_SEARCH, "
                                                              "default is CHUNK_SEARCH")
corpus_post_params["source"] = fields.List(fields.String(), description="Source of data")
corpus_post_params["reference"] = fields.List(fields.String(), description="eurlex metadata reference")
corpus_post_params["collection"] = fields.List(fields.String(), description="eurlex metadata collection")
corpus_post_params["taxonomy"] = fields.List(fields.String(), description="list of taxonomy, taxonomy is defined as taxonomy_name:taxonomy_code")
corpus_post_params["in_force"] = fields.String(description="eurlex metadata into_force")
corpus_post_params["sort"] = fields.List(fields.String(), description='Sort results accordingly to the specified field. Usage "field:order", where order can be "desc" or "asc"')
corpus_post_params["semantic_sort_id_list"] = fields.List(fields.String(),
                                                          description="List of chunk _id to be use for semantic search.")
corpus_post_params["sbert_embedding_list"] = fields.List(fields.List(fields.Raw,
                                                                     description="List of embeddings vector to be use for semantic search."))
corpus_post_params["author"] = fields.List(fields.String(description="List of author"))
corpus_post_params["date_range"] = fields.List(fields.String, description="Result will be filter using date range. Examples: gte:yyyy-mm-dd (greater then, equal), lte:yyyy-mm-dd (less then, equal),"
                                                                          "gt:yyyy-mm-dd (greater then), lt:yyyy-mm-dd (less then)")
corpus_post_params["aggs"] = fields.List(fields.String, description="List of aggregations, allowed entries are:"
                                                                    '"source", "date_year", "source_collection_reference", '
                                                                    '"taxonomies", "taxonomy_years-taxonomy" (taxonomy is defined as taxonomy_name:taxonomy_code)')
corpus_post_params["other"] = None
corpus_post_params["annotation"] = fields.List(fields.String(),
                                               description="Annotation list. Annotation are defined using this format 'group:label',"
                                                           " to select all labels belonging to the same group type 'group:'. "
                                                           "To search for a label in any group use ':label'")

corpus_delete_id_response = {}
corpus_delete_id_response["deleted_document_id"] = fields.String

corpus_update_id_response = {}
corpus_update_id_response["updated_document_id"] = fields.String

corpus_get_id_response = {}
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
corpus_get_id_response["other"] = None
corpus_get_id_response["reference"] = fields.String()
corpus_get_id_response["score"] = fields.Float
corpus_get_id_response["taxonomy"] = None
corpus_get_id_response["title"] = fields.String()
corpus_get_id_response["source"] = fields.String()
corpus_get_id_response["abstract"] = fields.String()
corpus_get_id_response["sbert_embedding"] = fields.List(fields.Float)

xsd_string = """<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="document" type="documentType"/>
  <xs:complexType name="subcategoriesType">
    <xs:choice minOccurs="0" maxOccurs="unbounded">
      <xs:element type="xs:string" name="classifier"/>
      <xs:element type="xs:string" name="code"/>
      <xs:element type="xs:string" name="label"/>
      <xs:element type="xs:string" name="longLabel"/>
      <xs:element type="xs:string" name="name_in_path"/>
      <xs:element type="subcategoriesType" name="subcategories" maxOccurs="unbounded" minOccurs="0"/>
      <xs:element type="xs:string" name="validated"/>
      <xs:element type="xs:string" name="version"/>
    </xs:choice>
  </xs:complexType>
  <xs:complexType name="documentType">
    <xs:choice minOccurs="0" maxOccurs="unbounded">
      <xs:element type="xs:string" name="id"/>
      <xs:element type="xs:string" name="id_alias"/>
      <xs:element type="xs:string" name="source" minOccurs="1"/>
      <xs:element type="xs:string" name="title"/>
      <xs:element type="xs:string" name="mime_type"/>
      <xs:element type="xs:string" name="language"/>
      <xs:element type="xs:string" name="abstract"/>
      <xs:element type="xs:string" name="text"/>
      <xs:element type="xs:string" name="date"/>
      <xs:element type="xs:string" name="collection"/>
      <xs:element type="xs:string" name="reference"/>
      <xs:element type="xs:string" name="in_force"/>
      <xs:element type="xs:string" name="annotation"/>
      <xs:element name="author">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="item" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="taxonomy">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="item" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element type="xs:string" name="link_origin"/>
      <xs:element name="link_related">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="item" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="link_reference">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="item" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="link_alias">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="item" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="other">
        <xs:complexType>
            <xs:sequence>
                <xs:any minOccurs="0" maxOccurs="unbounded" processContents="lax"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="keywords">
        <xs:complexType>
            <xs:sequence>
                <xs:any minOccurs="0" maxOccurs="unbounded" processContents="lax"/>
            </xs:sequence>
        </xs:complexType>
      </xs:element>
    </xs:choice>
  </xs:complexType>

</xs:schema>"""


class Variable:
    def __init__(self, namespace):
        self.namespace = namespace
        self.taxonomy_model = self.namespace.model("taxonomy", taxonomy)

        taxonomy_agg_model = self.namespace.model("taxonomy_agg", taxonomy_agg)
        taxonomy_agg["subcategories"] = fields.List(fields.Nested(taxonomy_agg_model))
        self.taxonomy_agg_model_tree = self.namespace.model("taxonomy_agg_tree", taxonomy_agg)

        self.keywords_model = self.namespace.model("keywords", keywords)
        self.other_model = self.namespace.model("other", other)

        document["keywords"] = fields.List(fields.Nested(self.keywords_model))
        document["taxonomy"] = fields.List(fields.Nested(self.taxonomy_model))
        document["other"] = fields.Nested(self.other_model)
        post_get_response["documents"] = fields.List(fields.Nested(self.namespace.model("document", document)))

        collection["references"] = fields.List(fields.Nested(self.namespace.model("reference", reference)))
        source["collections"] = fields.List(fields.Nested(self.namespace.model("collection", collection)))
        source_collection_reference_agg["sources"] = fields.List(fields.Nested(self.namespace.model("source", source)))

        aggregation = {"date_year": fields.List(fields.Nested(self.namespace.model("date_year_agg", date_year_agg))),
                       "source": fields.List(fields.Nested(self.namespace.model("source_agg", source_agg))),
                       "source_collection_reference": fields.List(
                           fields.Nested(
                               self.namespace.model("source_collection_reference_agg",
                                                    source_collection_reference_agg))),
                       "taxonomies": fields.List(fields.Nested(self.taxonomy_agg_model_tree)),
                       "taxonomy_years": fields.List(
                           fields.Nested(self.namespace.model("date_year_agg", date_year_agg)))
                       }
        post_get_response["aggregations"] = fields.List(fields.Nested(self.namespace.model("aggregation", aggregation)))
        self.post_get_response = post_get_response

    def get_corpus_get_id_response(self):
        corpus_get_id_response["keywords"] = fields.List(fields.Nested(self.keywords_model))
        corpus_get_id_response["taxonomy"] = fields.List(fields.Nested(self.taxonomy_model))
        corpus_get_id_response["other"] = fields.Nested(self.other_model)
        return self.namespace.model("corpus_get_id_response", corpus_get_id_response)

    def corpus_get_id_document_response(self):
        corpus_get_id_response["keywords"] = fields.List(fields.Nested(self.keywords_model))
        corpus_get_id_response["taxonomy"] = fields.List(fields.Nested(self.taxonomy_model))
        corpus_get_id_response["other"] = fields.Nested(self.other_model)
        corpus_get_id_response_model = self.namespace.model("corpus_get_id_response_model", corpus_get_id_response)
        corpus_get_id_document_response = {"chunk_list": fields.List(fields.Nested(corpus_get_id_response_model)),
                                           "num_chunks": fields.Integer()}
        return self.namespace.model("corpus_get_id_document_response", corpus_get_id_document_response)

    def get_delete_id_request_model(self):
        return self.namespace.model("corpus_delete_id_response", corpus_delete_id_response)

    def get_update_id_request_model(self):
        return self.namespace.model("corpus_update_id_response", corpus_update_id_response)

    def query_request_model(self):
        corpus_post_params["other"] = fields.Nested(self.other_model)
        return self.namespace.model("corpus_post_params", corpus_post_params)

    def get_corpus_post_response_model(self):
        return self.namespace.model('post_response_model', self.post_get_response)

    def get_get_response_model(self):
        return self.namespace.model('get_response_model', self.post_get_response)

    def get_put_response_model(self):
        return self.namespace.model("corpus_put_response", corpus_put_response)

    def get_put_doc_chunk_response_model(self):
        return self.namespace.model("corpus_doc_chunk_post_response", corpus_doc_chunk_post_response)

    def get_put_request_model(self):
        corpus_put_params["keywords"] = fields.List(fields.Nested(self.keywords_model))
        corpus_put_params["other"] = fields.Nested(self.other_model)
        return self.namespace.model("corpus_put_request", corpus_put_params)

    def corpus_chunk_id_put_request_model(self):
        corpus_chunk_id_put_params["keywords"] = fields.List(fields.Nested(self.keywords_model))
        corpus_chunk_id_put_params["other"] = fields.Nested(self.other_model)
        return self.namespace.model("corpus_chunk_id_put_params", corpus_chunk_id_put_params)

    def corpus_chunk_post_request_model(self):
        corpus_chunk_post_params["keywords"] = fields.List(fields.Nested(self.keywords_model))
        corpus_chunk_post_params["other"] = fields.Nested(self.other_model)
        return self.namespace.model("corpus_chunk_post_params", corpus_chunk_post_params)

    def corpus_chunk_id_delete_post_request_model(self):
        return self.namespace.model("corpus_chunk_id_post_delete_put_params", corpus_chunk_id_post_delete_params)

    def corpus_document_id_post_request_model(self):
        return self.namespace.model("corpus_document_id_post_request_model", corpus_document_id_post_request_model)

    def corpus_document_id_delete_request_model(self):
        return self.namespace.model("corpus_document_id_delete_request_model", corpus_document_id_delete_request_model)


