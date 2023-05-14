The **Semantic Text Analyzer** or **SeTA** is a software application that offers two tools:

a Search tool.     
a Community space.

With the Search tool, SeTA uses advanced text mining techniques to help users screen and query large document collections that come from the European Union Bodies. These bodies publish a vast amount of information which is made available via different channels. The Search tool supports exploring this information by making sense of the textual content and finding links. Users can search EU documents based on keywords and then screen the results and apply filters, all very quickly and accurately.   

In SeTA communities, users can create or participate in communities, shared spaces where members engage with each other to connect and learn about similar interests and opinions of different types of publications. 
  

For the Search tool, the data is harvested from the following sources:

<!-- ![Screenshot](./img/data_sources.png) -->

- **EUR-Lex** is the online database of all EU legal documents, providing the official and most comprehensive access to them.      
- **CORDIS** contains the results from the projects funded by the EU's framework programs for research and innovation.      
- **PUBSY** is the publications repository of the European Commission's Joint Research Centre.     
- **European Parliament** As a fourth main data source, SeTA contains the publications of the European Parliament.     

In order to have a consistent collection of information in terms of content as well as subject and concept distribution, the gathered data must be prepared, cleaned, and used for training of the search function.              

To enable reliable, timely, and consistent indexing and retrieval of the content of digital assets, **Taxonomies** are used in the descriptive metadata fields. The Taxonomies are part of the document elaboration in the SeTA communities, and, if users need it, they can create custom taxonomies for their own documents.           

As part of the data preparation, SeTA relies on the support of chunk compositionality to create the word embedding used as input data.      
    
Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.   

Once we have the processed data, then is ingested and stored in an **Elasticsearch **[^1] database.  Thanks to the Elasticsearch analytics engine, it is possible to run complex queries against their data and use aggregations to retrieve complex summaries of their data.

Once everything is set up, the data is ready to be interrogated either through the User Web Interface or the API.

The API interface can be a good alternative for users that need to integrate the data with their own applications or just need more flexibility in information-transfer processes.

The communities are a place to interact with others users about specific resources. Communities are spaces for people with similar interests to discuss or share about extensive or narrow topics.


[^1]:https://www.elastic.co/what-is/elasticsearch