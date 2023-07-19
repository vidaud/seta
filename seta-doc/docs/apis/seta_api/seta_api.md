# SeTA API

The SeTA API exposes the data and functionality in a consistent JSON format. It has various methods that can be performed on them over HTTP, like *GET, POST, PUT, and DELETE*. Where POST is used to create resources, and PUT to update resources.

The main categories are:    
- suggestions    
- corpus     
- similar      
- ontology       
- embeddings        
- file-to-text        
- term-enrichment

 
## seta-api-suggestions

The suggestions are the related terms list that is generated after setting a term.

### GET /suggestions
Retrieve terms by initial letters. By default, it returns 6 terms, with the parameter *n_suggestions* is possible to set the number of suggestions to be shown.      

##  seta-api-corpus
The corpus, is a collection of text organized into json files. The SeTA API provides with the following functions to manage the corpus.

### POST /corpus/chunk
Retrieve documents related to a term from EU corpus. The input is a JSON file with the options I want to retrieve.

### POST /corpus/document
Retrieve documents related to a term from EU corpus. The input is a JSON file with the options I want to retrieve.

### PUT /corpus/chunk/{id}
Retrieve documents related to a term from EU corpus. The input is a JSON file with the options I want to retrieve.

### GET /corpus
Retrieve documents related to a term from EU corpus.        

### DELETE /corpus/chunk/{id}
Given the elasticsearch unique _id, the relative document (chunk) is deleted.

### GET /corpus/chunk/{id}    
Given the elasticsearch unique _id, the relative document (chunk) is provided.

### DELETE /corpus/document/{id}
Given a document_id, the relative list of chunks is deleted.

### GET /corpus/document/{id}   
Given a document_id, the relative list of chunks is shown.

<figure markdown>
![Image title](/docs/img/seta_api_suggestions_corpus.png)
<figcaption>Suggestions and Corpus </figcaption>
</figure>

## seta-api-similar

### GET /similar      
Given a term, return the 20 most similar terms (semantic similarity). For each term similarity and cardinality (number of occurrences in documents) are reported.

## seta-api-ontology

### GET /ontology

Return a graph that describes the ontology of the specified term. A set of nodes and relative links are provided.  For each node depth, id, size and graph size are returned, depth indicates the depth of the node in the graph, id is the identifier of the term for the node, size indicates the number of occurrences of the term in the document corpus and graph size is useful to visualize the graph.  For each link source, target and value are returned, source indicates the node (its id) from which the link starts, target is the node (its id) linked to source and value is used to visualize the graph.

### GET /ontology-list

Return a list of lists of similar terms that describes the ontology of the specified term. Lists are ranked by the relation strength to a query term. The first node in each list is direct relation to query term. The following terms in each subList have relation to the first node in a subList.  The result should be interpreted as follows: the first item in each subList is first level connection to the query term. The following terms in subLists have second level relation to the main query term and direct connection to the head of subList.

## seta-api-embeddings

### POST /compute-embeddings
Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec. Tika is used to extract text from the provided file. If both file and text are provided, function will return text embeddings.

## seta-api-file-to-text

### POST /file_to_text
Given a file, its text is provided. Tika is used to extract text from file.

## seta-api-term-enrichment

### GET /term-enrichment
Given a list of terms, and the enrichment type a list of term is returned. The list of term is created using api given with enrichment type parameter.

<figure markdown>
![Image title](/docs/img/seta_api_similar_ontology_embeddings.png)
<figcaption>Similar, Ontology, Embeddings, File to Text and Term Enrichment</figcaption>
</figure>