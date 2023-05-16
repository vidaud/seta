# SETA-API

The SeTA API exposes the data and functionality in a consistent JSON format. It has various methods that can be performed on them over HTTP, like GET, POST, PUT, and DELETE. Where POST is used to create resources, and PUT to update resources.

The main categories are:    
- suggestions    
- corpus     
- similar      
- ontology       
- embeddings        

 
## seta-api-suggestions

The suggestions are the related terms list that is generated after setting a term.

**GET /suggestions**     

Retrieve terms by initial letters. By default, it returns 6 terms, with the parameter *n_suggestions* is possible to set the number of suggestions to be shown.      

<!--
   
<figure markdown>
![Image title](/docs/img/get-suggestions.png){ width="900" }
<figcaption>GET /suggestions</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/get-suggestions-result.png){ width="900" }
<figcaption>GET /suggestions(result)</figcaption>
</figure>

  -->

##  seta-api-corpus


The corpus, is a collection of text organized into json files. The SeTA API provides with the following functions to manage the corpus.

**PUT /corpus**       
Put a document into corpus index. The format is a JSON file.

<!--
<figure markdown>
![Image title](/docs/img/put-corpus.png){ width="900" }
<figcaption>PUT /corpus</figcaption>
</figure>
<figure markdown>
![Image title](/docs/img/put-corpus-result.png){ width="900" }
<figcaption>PUT /corpus (result)</figcaption>
</figure>
 -->

**GET /corpus**       
Retrieve documents related to a term from EU corpus.
<!--
<figure markdown>
![Image title](/docs/img/get-corpus.png){ width="900" }
<figcaption>GET /corpus</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/get-corpus-result.png){ width="900" }
<figcaption>GET /corpus (result)</figcaption>
</figure>
 -->


**POST /corpus**     
Retrieve documents related to a term from EU corpus. The input is a JSON file with the options I want to retrieve.
<!--
<figure markdown>
![Image title](/docs/img/post-corpus.png){ width="900" }
<figcaption>POST /corpus</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/post-corpus-result.png){ width="900" }
<figcaption>POST /corpus (result)</figcaption>
</figure>
   -->

**GET /corpus/{id}**      
Given the Elasticsearch  unique _id, the relative document from EU corpus is shown.
<!--
<figure markdown>
![Image title](/docs/img/get-corpus-id.png){ width="900" }
<figcaption>GET /corpus{id}</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/get-corpus-id-result.png){ width="900" }
<figcaption>GET /corpus{id} (result)</figcaption>
</figure>
   -->

**DELETE /corpus/{id}**     

Given the Elasticsearch  unique _id, the relative document is deleted.
<!--
<figure markdown>
![Image title](/docs/img/delete-corpus-id.png){ width="900" }
<figcaption>DELETE /corpus{id}</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/delete-corpus-id-result.png){ width="900" }
<figcaption>DELETE /corpus{id} (result)</figcaption>
</figure>
-->
<figure markdown>
![Image title](/docs/img/seta_api_suggestions_corpus.png){ width="900" }
<figcaption>Suggestions and Corpus </figcaption>
</figure>

## seta-api-similar

**GET /similar**      
Given a term, return the 20 most similar terms (semantic similarity). For each term similarity and cardinality (number of occurrences in documents) are reported.
<!--
<figure markdown>
![Image title](/docs/img/get-similar.png){ width="900" }
<figcaption>GET /similar</figcaption>
</figure>


<figure markdown>
![Image title](/docs/img/get-similar-results.png){ width="900" }
<figcaption>GET /similar (result)</figcaption>
</figure>

-->

## seta-api-ontology

**GET /ontology**    

Return a graph that describes the ontology of the specified term. A set of nodes and relative links are provided.  For each node depth, id, size and graph size are returned, depth indicates the depth of the node in the graph, id is the identifier of the term for the node, size indicates the number of occurrences of the term in the document corpus and graph size is useful to visualize the graph.  For each link source, target and value are returned, source indicates the node (its id) from which the link starts, target is the node (its id) linked to source and value is used to visualize the graph.
<!--
<figure markdown>
![Image title](/docs/img/get-ontology.png){ width="900" }
<figcaption>GET /ontology</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/get-ontology-results.png){ width="900" }
<figcaption>GET /ontology (results)</figcaption>
</figure>
-->

**GET /ontology-list**    

Return a list of lists of similar terms that describes the ontology of the specified term. Lists are ranked by the relation strength to a query term. The first node in each list is direct relation to query term. The following terms in each subList have relation to the first node in a subList.  The result should be interpreted as follows: the first item in each subList is first level connection to the query term. The following terms in subLists have second level relation to the main query term and direct connection to the head of subList.

<!--
<figure markdown>
![Image title](/docs/img/get-ontology-list.png){ width="900" }
<figcaption>GET /ontology-list</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/get-ontology-list-results.png){ width="900" }
<figcaption>GET /ontology-list (results)</figcaption>
</figure>
  -->

# seta-api-embeddings

**POST /compute-embeddings**     
Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec. Tika is used to extract text from the provided file. If both file and text are provided, function will return text embeddings.

<!--
<figure markdown>
![Image title](/docs/img/post-compute-embeddings.png)
<figcaption>POST /embeddings</figcaption>
</figure>


<figure markdown>
![Image title](/docs/img/post-compute-embeddings-results.png)
<figcaption>POST /embeddings (result)</figcaption>
</figure> 
-->

<figure markdown>
![Image title](/docs/img/seta_api_similar_ontology_embeddings.png)
<figcaption>Similar, Ontology and Embeddings</figcaption>
</figure>