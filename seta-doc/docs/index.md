
**SeTA** (*Semantic Text Analyser*) is a web application that offers a set of functionalities:

## Communities

In SeTA the  *Communities*, are a shared place, where users can have the possibility to interact with others about specific areas of interest.  
The Communities allows the users to create different spaces according to their specific matter of interest, and share, and debate with other users with similar interests.        
In the communities, users can create different resources, upload documents related to these resources and create their own custom Taxonomies when uploading the documents.                   
Users can also have access to other users communities if they want.  They will be able to see the available communities and ask to join them if is necessary.                    
Communities can be private or public.  The private communities are available to users only after requesting or receiving an invitation. The public communities can be joined with no request required.      

## Search tool
The Search tool in SeTA, gives the possibility to navigate through the content created by the communities within the site. The Search tool can index a large set of document collections.                  
Upon providing a keyword, a set of keywords, or a piece of text, the search tool will indicate a list of documents, and locations therein, where the keyword(s) occur. The search is enhanced beyond merely finding the keywords literally, first by the use of a taxonomy (that structures pre-defined keywords) and second by semantic interpretation of the keywords (that uses the meaning of the words in addition to their literal form). The search results can, as next step, be easily screened and filtered by the user with the help of the tool.       
\     
SeTA helps to explore the information in a document collection by making sense of the textual content and finding links.
In order to make this kind of analysis possible, the document collection to be searched / explored needs to be pre-processed by advanced text mining techniques. This has been done for four large document collections published by EU bodies:  
\       
- **EUR-Lex**, the official online database of all EU legal documents;      
- **CORDIS**, which contains the results of the projects funded by the EU's framework programs for research and innovation;       
- **PUBSY**, the publications repository of the European Commission's Joint Research Centre;      
- and all publications of the **European Parliament**.      

These four collections are online available for immediate search. SeTA can also work on additional document collections created in the Communities, but they first have to be ingested and pre-processed by the user.        

## API's
The Communities and Search tool can also be access through API's. The SeTA REST APIs are created with support of Swagger UI[^2], this allows to have a visual representation of the API together with its documentation allowing users to try out the API calls directly from the browser.          
There are two SeTA APIs:          
- SeTA Communities API for the Communities space        
- SeTA API for the Search tool      

The APIs can be a good alternative for users that need to integrate the tools SeTA offers with their own applications or just need more flexibility in information-transfer processes.     

[^1]:https://www.elastic.co/what-is/elasticsearch
[^2]:https://swagger.io/docs/specification/about/


