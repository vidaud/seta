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

### GET /suggestions

Retrieve terms by initial letters. By default, it returns 6 terms, with the parameter *n_suggestions* is possible to set the number of suggestions to be shown.      


   
<figure markdown>
![Image title](/docs/img/get-suggestions.png){ width="900" }
<figcaption>GET /suggestions</figcaption>
</figure>

<figure markdown>
![Image title](/docs/img/get-suggestions-result.png){ width="900" }
<figcaption>GET /suggestions(result)</figcaption>
</figure>

<!-- ![Screenshot](/docs/img/get-suggestions.png)  -->
<!-- ![Screenshot](/docs/img/get-suggestions-result.png)  -->
