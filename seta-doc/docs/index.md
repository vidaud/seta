<!--  {{ customer.web }} -->

The European Union Bodies publish a vast amount of information which is made available via different channels.      
Making sense of the textual content and finding links between documents is difficult if not impossible just by having humans read it. 



The **Semantic Text Analyzer** or **SeTA** is a software tool that supports these tasks.     

SeTA uses advanced text mining techniques to help users screen and query these large document collections.   

Users can search EU documents based on keywords and then screen the results and apply filters, all very quickly and accurately.   

Furthermore, users can participate or create communities to interact with others users about specific resources. 

## How can SeTA provide all of this to users?

First of all, data is harvested from the following sources:

<!-- ![Screenshot](./img/data_sources.png) -->

- **EUR-Lex** is the online database of all EU legal documents, providing the official and most comprehensive access to them.      
- **CORDIS** contains the results from the projects funded by the EU's framework programs for research and innovation.      
- **Pubsy** is the publications repository of the European Commission's Joint Research Centre.     
- **European Parliament** As a fourth main data source, SeTA contains the publications of the European Parliament.     


These data consist of text documents and the metadata that describe them.      

Document retrieval from numerous data sources comes from a variety of web addresses (URLs) via various endpoints such as SPARQL, SOAP, FTP, or HTTP protocol parsing.     

The acquired data must be prepared, cleaned, and trained in order to have a consistent collection of information in terms of content as well as subject and idea distribution.              

The typical process to create a general corpus involves:      
- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text.        
- Conversion to Unicode, removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters.      
- De-hyphenation.      
- Sentence separation based on dependency parsing (allowing the reconstruction even of sentences split over several lines).      

**Taxonomies** are used in the descriptive metadata fields to enable consistent, accurate, and quick indexing and retrieval of the content of digital assets. Text documents can be automatically indexed or categorised based on search queries matching words inside the texts, however non-text digital files often need some form of descriptive tagging in order to be retrieved in subject searches.        

In order to get results from Neural Network training that are pertinent and easy to interpret, the data in SeTA must first be prepared, features must be engineered, and domains must be covered.     
When training data with the same tags regularly yield comparable results, weights and thresholds are adjusted continuously.  For this we use chunk compositionality and word embedding.
    

**"Chunking"** is the process of combining several pieces of information into more comprehensible or significant portions. As a result, reading a portion of a compressed variable does not necessitate uncompressing the entire variable.  *In SeTA we create chunks of 300 words and for every chunk a word embedding is created.* [^1]

Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.  The words in this form are closer to one another in the vector space because they have stronger semantic links. The sentence-transformers model **all-distilroberta-v1** is utilised for the embedding process as it helps on the clustering and the semantic search because it maps sentences and paragraphs to a dimensional dense vector space.

**sBERT** is a sentence-based model that gives additional training to the model, allowing semantic search for a huge number of sentences. **sBERT** employs a Siamese architecture, which consists of two virtually identical **BERT** architectures with the same weights, and **sBERT** analyses two words as pairs during training.   
When training the model, **SBERT** concatenates the two embeddings, which are then sent through a SoftMax classifier and trained with a SoftMax-loss function. When the model reaches inference — or begins predicting — the two embeddings are compared using a cosine similarity function, which generates a similarity score for the two sentences[^2].

The **Word2Vec** algorithm together with Gensim, are used to get the suggestions and similar terms.  Word2Vec algorithm takes input words and groups them together based on the similarity of their meanings. This similarity is calculated using complex mathematical formulas based on the context of the words.  **Gensim**, is an open-source framework for unsupervised topic modelling and natural language processing. It extracts semantic concepts from documents and is capable of handling large text volumes.

The neural networks are trained using **textacy**[^3], a potent Python language modelling package built on the basis of **spaCy**. The pre-processing module of **textacy** has a good number of functions to normalise characters and to handle common patterns like URLs, email addresses, phone numbers, and so on[^4].    

Once we have the processed data, this is ingested and stored in an **ElasticSearch** .     

ElasticSearch is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured and unstructured. Through the Data ingestion process the raw data is parsed, normalized, and enriched before it is indexed in ElasticSearch. Once indexed, it is possible to run complex queries against their data and use aggregations to retrieve complex summaries of their data[^5].

At this point the full text of all documents can be searched either through a Web Interface or the API. 
Users are able to target their search either to the individual document collections or to search across all collections in a harmonised way.

Along with the search, it is also possible to participate or create communities to interact with others users about specific resources. Communities are spaces for people with similar interests to discuss or share about extensive or narrow topics.





[^1]:https://www.mindtools.com/a8u1mqw/chunking
[^2]:https://towardsdatascience.com/an-intuitive-explanation-of-sentence-bert-1984d144a868
[^3]:https://pypi.org/project/textacy/
[^4]:https://spacy.io/usage/spacy-101
[^5]:https://www.elastic.co/what-is/elasticsearch 

   