
**SeTA** (*Semantic Text Analyser*) is a web application that offers a set of functionalities:

## Data Sources

In SeTA the  *Data Sources*, are a are repositories of information, where users can have the possibility to explore about specific areas of interest.                          
Data sources can be searchable or unsearchable.  The searchable data sources will be included in the search query in the search tab. The unsearchable will have no impact on the query. It can be easily changed in any moment. 

## Search Tool
The Search tool in SeTA, gives the possibility to navigate through the content created by the data sources within the site. The Search tool can index a large set of document collections.                  
Upon providing a keyword, a set of keywords, or a piece of text, the search tool will indicate a list of documents, and locations therein, where the keyword(s) occur. The search is enhanced beyond merely finding the keywords literally, first by the use of a taxonomy (that structures pre-defined keywords) and second by semantic interpretation of the keywords (that uses the meaning of the words in addition to their literal form). The search results can, as next step, be easily screened and filtered by the user with the help of the tool.       
\     
SeTA helps to explore the information in a document collection by making sense of the textual content and finding links.
In order to make this kind of analysis possible, the document collection to be searched / explored needs to be pre-processed by advanced text mining techniques. This has been done for four large document collections published by EU bodies:  
\       
- **EUR-Lex**, the official online database of all EU legal documents;      
- **CORDIS**, which contains the results of the projects funded by the EU's framework programs for research and innovation;       
- **PUBSY**, the publications repository of the European Commission's Joint Research Centre;      
- and all publications of the **European Parliament**.      

These four collections are online available for immediate search. SeTA can also work on additional document collections created in the data sources, but they first have to be ingested and pre-processed by the user.        

## APIs
The data sources and search tool can also be access through API's. The SeTA REST APIs are created with support of Swagger UI[^2], this allows to have a visual representation of the API together with its documentation allowing users to try out the API calls directly from the browser.          
There are two SeTA APIs:          
- SeTA Data Sources API for the data sources space        
- SeTA API for the Search tool      

The APIs can be a good alternative for users that need to integrate the tools SeTA offers with their own applications or just need more flexibility in information-transfer processes.     

[^1]:https://www.elastic.co/what-is/elasticsearch
[^2]:https://swagger.io/docs/specification/about/


