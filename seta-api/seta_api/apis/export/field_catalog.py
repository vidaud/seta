catalog = [
    {
        "name": "_id",
        "description": "Document chunk internal id."
    },
    {
        "name": "id",
        "description": "User document id."
    },
    {
        "name": "document_id",
        "description": "Internal id which defines the document (set of chunks), each chunk of the same document has the same document_id."
    },
    {
        "name": "id_alias",
        "description": "User document id alias."
    },
    {
        "name": "title",
        "description": "The title of the document."
    },
    {
        "name": "abstract",
        "description": "The abstract of the document."
    },
    {
        "name": "chunk_text",
        "description": "The text of the chunk. Each document text is divided into chunks."
    },
    {
        "name": "chunk_number",
        "description": "The number of the chunk."
    },
    {
        "name": "link_origin",
        "description": "The origin document link."
    },
    {
        "name": "link_alias",
        "description": "The alias of the document link."
    },
    {
        "name": "link_reference",
        "description": "Links to document references."
    },
    {
        "name": "link_related",
        "description": "Links related to the document."
    },
    {
        "name": "mime_type",
        "description": "The mime type of the document."
    },
    {
        "name": "date",
        "description": "The date of the document publication."
    },
    {
        "name": "sbert_embedding",
        "description": "Embedding vector of the chunk."
    },
    {
        "name": "source",
        "description": "The Source of the document."
    },
    {
        "name": "language",
        "description": "The language of the document."
    },
    {
        "name": "in_force",
        "description": "Report if the document is in force or not."
    },
    {
        "name": "collection",
        "description": "The collection of the document."
    },
    {
        "name": "reference",
        "description": "The reference of the document."
    },
    {
        "name": "author",
        "description": "The author of the document."
    },
    {
        "name": "keywords",
        "description": "Document keywords."
    },
    {
        "name": "other",
        "description": "Other fields that describe the document, user can add its own fields."
    },
    {
        "name": "community_id",
        "description": "The id of the community"
    }
]


def get_catalog():
    return catalog


def get_catalog_fields_name():
    names = []
    for f in catalog:
        names.append(f["name"])
    return names
