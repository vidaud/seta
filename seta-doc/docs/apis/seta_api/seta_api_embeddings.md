# seta-api-embeddings

**POST /compute-embeddings**     
Given a file or a plain text, related embeddings are provided. Embeddings are built using Doc2vec. Tika is used to extract text from the provided file. If both file and text are provided, function will return text embeddings.


<figure markdown>
![Image title](/docs/img/post-compute-embeddings.png)
<figcaption>POST /embeddings</figcaption>
</figure>


<figure markdown>
![Image title](/docs/img/post-compute-embeddings-results.png)
<figcaption>POST /embeddings (result)</figcaption>
</figure>



<!-- ![Screenshot](/docs/img/post-compute-embeddings.png)  -->
<!-- ![Screenshot](/docs/img/post-compute-embeddings-results.png)  -->


<!-- ## Models

The models section describes the patterns that were used in the different executions of the API.

<!-- ![Screenshot](/docs/img/models.png)  -->

<!-- ## Swagger

In the following swagger implementation it is possible to start using the API, *^^do not forget to follow the instructions in the set up page^^*:

!!swagger seta_api_v1.json!!  -->