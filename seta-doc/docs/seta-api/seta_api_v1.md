# SETA-API

## seta-api-suggestions

### GET /suggestions

??? quote "Retrieve terms by initial letters. By default it returns 6 terms, with the parameter *n_suggestions* is possible to set the number of suggestions to be shown."
    
    ![Screenshot](../img/get-suggestions.png)
    ![Screenshot](../img/get-suggestions-result.png)



## seta-api-corpus

### PUT /corpus
??? quote "Put a document into corpus index."
    ![Screenshot](../img/put-corpus.png)
    ![Screenshot](../img/put-corpus-result.png)

### GET /corpus
??? quote "Retrieve documents related to a term from EU corpus.EU corpus contains documents of the European Commission: Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc.."
    ![Screenshot](../img/get-corpus.png)
    ![Screenshot](../img/get-corpus-result.png)


### POST /corpus
??? quote "Retrieve documents related to a term from EU corpus.EU corpus contains documents of the European Commission: Eur-Lex, CORDIS, JRC PUBSY, EU Open Data Portal, etc.."

### GET /corpus/{id}
??? quote "Given the elasticsearch unique _id, the relative document from EU corpus is shown.EU corpus contains documents of the European Commission: Eur-Lex, CORDIS,JRC PUBSY, EU Open Data Portal, etc.."
    ![Screenshot](../img/get-corpus-id.png)
    ![Screenshot](../img/get-corpus-id-result.png)

### DELETE /corpus/{id}

??? quote "Given the elasticsearch unique _id, the relative document is deleted."
    ![Screenshot](../img/delete-corpus-id.png)
    ![Screenshot](../img/delete-corpus-id-result.png)

## seta-api-similar

### GET /similar

## seta-api-ontology

### GET /ontology

### GET /ontology-list

## seta-api-embeddings

### POST /compute-embeddings


## Models


In the following swagger implementation it is possible to start using the API, *^^do not forget to follow the instructions in the set up page^^*:

!!swagger seta_api_v1.json!!