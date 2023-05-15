## seta-api-corpus
The corpus, is a collection of text organized into json files. The SeTA API provides with the following functions to manage the corpus.

### PUT /corpus
Put a document into corpus index. The format is a JSON file.
<!-- ![Screenshot](/docs/img/put-corpus.png)  -->
<!-- ![Screenshot](/docs/img/put-corpus-result.png)  -->

### GET /corpus
Retrieve documents related to a term from EU corpus.
<!-- ![Screenshot](/docs/img/get-corpus.png)  -->
<!-- ![Screenshot](/docs/img/get-corpus-result.png)  -->


### POST /corpus
Retrieve documents related to a term from EU corpus. The input is a JSON file with the options I want to retrieve. 
<!-- ![Screenshot](/docs/img/post-corpus.png)  -->
<!-- ![Screenshot](/docs/img/post-corpus-result.png)  -->

### GET /corpus/{id}
Given the Elasticsearch  unique _id, the relative document from EU corpus is shown.
<!-- ![Screenshot](/docs/img/get-corpus-id.png)  -->
<!-- ![Screenshot](/docs/img/get-corpus-id-result.png)  -->

### DELETE /corpus/{id}

Given the Elasticsearch  unique _id, the relative document is deleted.
<!-- ![Screenshot](/docs/img/delete-corpus-id.png)  -->
<!-- ![Screenshot](/docs/img/delete-corpus-id-result.png)  -->

## seta-api-similar

### GET /similar     
Given a term, return the 20 most similar terms (semantic similarity). For each term similarity and cardinality (number of occurrences in documents) are reported.

<!-- ![Screenshot](/docs/img/get-similar.png)  -->
<!-- ![Screenshot](/docs/img/get-similar-results.png)  -->