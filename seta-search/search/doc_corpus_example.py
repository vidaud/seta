"""
Example code usage of seta-search corpus api.

"""

import requests

SEARCH_API_URL = "https://hostname/seta-search/api/v1/"
NLP_API_URL = "https://hostname/seta-nlp/"

# put token in Authorization header, to retrieve token look at the Authorization paragraph
token = "put your token here"
headers = {"Authorization": f"Bearer {token}"}

####################################################################
# CORPUS API - Term search
####################################################################

# search for the keyword "data",
# "n_docs" and "from_doc" can be used for pagination

payload = {"term": "data", "n_docs": 10, "from_doc": 0}
response = requests.post(f"{SEARCH_API_URL}/corpus", json=payload, headers=headers, timeout=30)
# in response there's the list of retrieved documents


####################################################################
# CORPUS API - Aggregations
####################################################################

# search for the keyword "data", plus aggregates results.
# Available aggregations are: "source", "date_year", "source_collection_reference",
# "taxonomies", "taxonomy_years-taxonomy" (taxonomy is defined as taxonomy_name:taxonomy_code)

payload = {"term": "data", "n_docs": 10, "from_doc": 0, "aggs": ["taxonomies"]}
# perform your request(in this case corpus api)
response = requests.post(f"{SEARCH_API_URL}/corpus", json=payload, headers=headers, timeout=30)
# in response there's the list of retrieved documents

# More aggregations can be requested in the same api call
# if documents are not required "n_docs" can be set at 0,
# api will return aggregations and an empty list for documents.

payload = {"term": "data", "n_docs": 0, "from_doc": 0, "aggs": ["taxonomies", "source", "taxonomy_years-eurovocTree:100163"]}
# perform your request(in this case corpus api)
response = requests.post(f"{SEARCH_API_URL}/corpus", json=payload, headers=headers, timeout=30)
# in response there's the list of retrieved documents


####################################################################
# CORPUS API - Semantic search
####################################################################
# Semantic search can be performed using documents already indexed or with external documents.

# EXISTING DOCUMENTS: the "semantic_sort_id_list" parameter has to be set. You can add 1 or more document id.
# Result will be sorter accordingly to the semantic distance
# (calculated between returned documents and documents linked in semantic_sort_id_list by ids)

payload = {"semantic_sort_id_list": ["my_document_id1"]}
# perform your request(in this case corpus api)
response = requests.post(f"{SEARCH_API_URL}/corpus", json=payload, headers=headers, timeout=30)
# in response there's the list of retrieved documents

# in addition to semantic sort id you can filter your result using all the available paramenters,
# in this case the term "data"
# Result will be ranked using semantic distance
payload = {"term": "data", "n_docs": 0, "from_doc": 0, "semantic_sort_id_list": ["my_document_id1", "my_document_id1"]}
# perform your request(in this case corpus api)
response = requests.post(f"{SEARCH_API_URL}/corpus", json=payload, headers=headers, timeout=30)
# in response there's the list of retrieved documents

# EXTERNAL DOCUMENTS: to perform semantic search using external document "sbert_embedding_list" has to be set.
# "sbert_embedding_list" parameter has to be filled with a list of embedding vectors

payload = {"term": "data", "n_docs": 0, "from_doc": 0, "sbert_embedding_list": [["my embeddings1"], ["my embeddings2"]]}

# to retrieve embeddings for a text a dedicated endpoint is available in NLP-API: compute_embedding

payload = {"text": "your text"}

response = requests.post(f"{NLP_API_URL}/compute_embedding", json=payload, headers=headers, timeout=30)
# response will contain a vector of embeddings

# yuo can also extract text form a file using nlp/file_to_text api

