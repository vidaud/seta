chunk_update_schema = {"type": "object",
    "properties": {
        "id": {"type": "string"},
        "id_alias": {"type": "string"},
        "source": {"type": "string"}, #TODO check source auth
        "title": {"type": "string"},
        "abstract": {"type": "string"},
        "collection": {"type": "string"},
        "reference": {"type": "string"},
        "author": {"type": "array", "items": {"type": "string"}},
        "date": {"type": "string"},
        "link_origin": {"type": "array", "items": {"type": "string"}},
        "link_alias": {"type": "array", "items": {"type": "string"}},
        "link_related": {"type": "array", "items": {"type": "string"}},
        "link_reference": {"type": "array", "items": {"type": "string"}},
        "mime_type": {"type": "string"},
        "in_force": {"type": "string"},
        "taxonomy": {"type": "array", "items": {"type": "object"}},
        "other": {"type": "array", "items": {"type": "object"}},
        "keywords": {"type": "array", "items": {"type": "object"}},
        "chunk_text": {"type": "string"},
        "document_id": {"type": "string"}, #TODO ask if needed
        "chunk_number": {"type": "string"},
        "sbert_embedding": {"type": "array", "items": {"type": "number"}}
    }
}
