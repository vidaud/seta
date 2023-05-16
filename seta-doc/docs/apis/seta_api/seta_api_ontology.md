# seta-api-ontology

**GET /ontology**    

Return a graph that describes the ontology of the specified term. A set of nodes and relative links are provided.  For each node depth, id, size and graph size are returned, depth indicates the depth of the node in the graph, id is the identifier of the term for the node, size indicates the number of occurrences of the term in the document corpus and graph size is useful to visualize the graph.  For each link source, target and value are returned, source indicates the node (its id) from which the link starts, target is the node (its id) linked to source and value is used to visualize the graph.

<!-- ![Screenshot](/docs/img/get-ontology.png)  -->
<!-- ![Screenshot](/docs/img/get-ontology-results.png)  -->



**GET /ontology-list**    

Return a list of lists of similar terms that describes the ontology of the specified term. Lists are ranked by the relation strength to a query term. The first node in each list is direct relation to query term. The following terms in each subList have relation to the first node in a subList.  The result should be interpreted as follows: the first item in each subList is first level connection to the query term. The following terms in subLists have second level relation to the main query term and direct connection to the head of subList.

<!-- ![Screenshot](/docs/img/get-ontology-list.png)  -->
<!-- ![Screenshot](/docs/img/get-ontology-list-results.png)  -->