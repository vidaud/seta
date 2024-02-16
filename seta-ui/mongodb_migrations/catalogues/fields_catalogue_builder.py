class FieldsCatalogueBuilder:
    @staticmethod
    def build_fields(catalogue_name: str):
        """Fields catalogue"""
        return [
            {
                "catalogue": catalogue_name,
                "name": "_id",
                "description": "Document chunk internal id.",
            },
            {
                "catalogue": catalogue_name,
                "name": "id",
                "description": "User document id.",
            },
            {
                "catalogue": catalogue_name,
                "name": "document_id",
                "description": (
                    "Internal id which defines the document (set of chunks), "
                    "each chunk of the same document has the same document_id."
                ),
            },
            {
                "catalogue": catalogue_name,
                "name": "id_alias",
                "description": "User document id alias.",
            },
            {
                "catalogue": catalogue_name,
                "name": "title",
                "description": "The title of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "abstract",
                "description": "The abstract of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "chunk_text",
                "description": "The text of the chunk. Each document text is divided into chunks.",
            },
            {
                "catalogue": catalogue_name,
                "name": "chunk_number",
                "description": "The number of the chunk.",
            },
            {
                "catalogue": catalogue_name,
                "name": "link_origin",
                "description": "The origin document link.",
            },
            {
                "catalogue": catalogue_name,
                "name": "link_alias",
                "description": "The alias of the document link.",
            },
            {
                "catalogue": catalogue_name,
                "name": "link_reference",
                "description": "Links to document references.",
            },
            {
                "catalogue": catalogue_name,
                "name": "link_related",
                "description": "Links related to the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "mime_type",
                "description": "The mime type of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "date",
                "description": "The date of the document publication.",
            },
            {
                "catalogue": catalogue_name,
                "name": "sbert_embedding",
                "description": "Embedding vector of the chunk.",
            },
            {
                "catalogue": catalogue_name,
                "name": "source",
                "description": "The Source of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "language",
                "description": "The language of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "in_force",
                "description": "Report if the document is in force or not.",
            },
            {
                "catalogue": catalogue_name,
                "name": "collection",
                "description": "The collection of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "reference",
                "description": "The reference of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "author",
                "description": "The author of the document.",
            },
            {
                "catalogue": catalogue_name,
                "name": "keywords",
                "description": "Document keywords.",
            },
            {
                "catalogue": catalogue_name,
                "name": "other",
                "description": "Other fields that describe the document, user can add its own fields.",
            },
            {
                "catalogue": catalogue_name,
                "name": "community_id",
                "description": "The id of the community",
            },
        ]
