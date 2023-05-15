# SeTA

**SeTA** is a web application software that offers:      
- A Search Tool     
- A Community space   
- APIs for the Search tool and Community Space    

## Search tool   

In the Search tool, SeTA uses advanced text mining techniques to help users screen and query large document collections that come from the European Union Bodies. These bodies publish a vast amount of information which is made available via different channels. The Search tool supports exploring this information by making sense of the textual content and finding links. Users can search EU documents based on keywords, text or documents and then screen the results and apply filters, all very quickly and accurately.   

The Search tool harvest the data from the following sources:

<!-- ![Screenshot](./img/data_sources.png) -->

- **EUR-Lex** is the online database of all EU legal documents, providing the official and most comprehensive access to them.      
- **CORDIS** contains the results from the projects funded by the EU's framework programs for research and innovation.      
- **PUBSY** is the publications repository of the European Commission's Joint Research Centre.     
- **European Parliament** As a fourth main data source, SeTA contains the publications of the European Parliament.     

In order to have a consistent collection of information in terms of content as well as subject and concept distribution, the gathered data must be prepared, cleaned, and used for training of the search function.              

To enable reliable, timely, and consistent indexing and retrieval of the content of digital assets, **Taxonomies** are used in the descriptive metadata fields.          

As part of the data preparation, SeTA relies on the support of chunk compositionality to create the word embedding used as input data.      
    
Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.   

Once we have the processed data, then is ingested and stored in an **Elasticsearch **[^1] database.  Thanks to the Elasticsearch analytics engine, it is possible to run complex queries against their data and use aggregations to retrieve complex summaries of their data.

Once everything is set up, the data is ready to be interrogated either through the User Web Interface or the API.

## Community space

SeTA communities offers a shared place, where users can have the possibility of to interact with others users about specific areas of interest. The users can create different Communities according to their specific matter of interest and share, debate with other users with similar interests.    
In the communities, users can create different resources, upload documents related to these resources and create their own custom Taxonomies when uploading the documents.      

Users can also access to other users communities if they want.  They will be able to see the available communities and ask to join them.   

Communities can be private or public.  The private communities are available to users only after receiving an invitation. The public communities are visible from the dashboard of the Community page.

## API

SeTA APIs are REST APIs created with Swagger UI[^2]. This provides a visual representation of the API and its documentation and allows users to try out the API calls in the browser.      
There are two SeTA APIs:     
- SeTA API for the Search tool      
- SeTA Communities API for the Communities space

The APIs can be a good alternative for users that need to integrate the data with their own applications or just need more flexibility in information-transfer processes.



[^1]:https://www.elastic.co/what-is/elasticsearch
[^2]:https://swagger.io/docs/specification/about/

