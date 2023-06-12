# SeTA 

**SeTA** (“Semantic Text Analyser”) is a tool that offers a search functionality in large document collections. Upon providing a keyword, a set of keywords, or a piece of text, the tool will indicate a list of documents, and locations therein, where the keyword(s) occur. The search is enhanced beyond merely finding the keywords literally, first by the use of a taxonomy (that structures pre-defined keywords) and second by semantic interpretation of the keywords (that uses the meaning of the words in addition to their literal form). The search results can, as next step, be easily screened and filtered by the user with the help of the tool.       
\     
SeTA helps to explore the information in a document collection by making sense of the textual content and finding links.
In order to make this kind of analysis possible, the document collection to be searched / explored needs to be pre-processed by advanced text mining techniques. This has been done for four large document collections published by EU bodies:  
\       
- **EUR-Lex**, the official online database of all EU legal documents;      
- **CORDIS**, which contains the results of the projects funded by the EU's framework programs for research and innovation;       
- **PUBSY**, the publications repository of the European Commission's Joint Research Centre;      
- and all publications of the **European Parliament**.      

These four collections are online available for immediate search. SeTA can also work on additional document collections, but they first have to be ingested and pre-processed by the user.        
SeTA is accessed via a web user interface, and also allows the use of APIs for automated access.        
SeTA furthermore offers community spaces for groups of users to collaborate on joint tasks and document collections.      

## Processing 

In order to have a consistent collection of information in terms of content as well as subject and concept distribution, the gathered data must be prepared, cleaned, and used for training of the search function.              

To enable reliable, timely, and consistent indexing and retrieval of the content of digital assets, **Taxonomies** are used in the descriptive metadata fields.          

As part of the data preparation, SeTA relies on the support of chunk compositionality to create the word embedding used as input data.      
    
Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.   

Once we have the processed data, then is ingested and stored in an **Elasticsearch **[^1] database.  Thanks to the Elasticsearch analytics engine, it is possible to run complex queries against their data and use aggregations to retrieve complex summaries of their data.

Once everything is set up, the data is ready to be interrogated either through the User Web Interface or the API.


## Community space

SeTA communities offers a shared place, where users can have the possibility to interact with others users about specific areas of interest. The users can create different Communities according to their specific matter of interest, and share, and debate with other users with similar interests.        
In the communities, users can create different resources, upload documents related to these resources and create their own custom Taxonomies when uploading the documents.        

Users can also have access to other users communities if they want.  They will be able to see the available communities and ask to join them.   

Communities can be private or public.  The private communities are available to users only after receiving an invitation. The public communities are visible from the dashboard of the Community page.      

## APIs

SeTA APIs are REST APIs created with Swagger UI[^2]. This provides a visual representation of the API and its documentation and allows users to try out the API calls in the browser.          
There are two SeTA APIs:      
- SeTA API for the Search tool      
- SeTA Communities API for the Communities space        

The APIs can be a good alternative for users that need to integrate the data with their own applications or just need more flexibility in information-transfer processes.     



[^1]:https://www.elastic.co/what-is/elasticsearch
[^2]:https://swagger.io/docs/specification/about/


