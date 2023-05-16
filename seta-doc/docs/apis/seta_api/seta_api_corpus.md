##  seta api corpus


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

