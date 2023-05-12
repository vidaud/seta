<!--  {{ customer.web }} -->

The European Union Bodies publish a vast amount of information which is made available via different channels.      
Making sense of the textual content and finding links between documents is difficult if not impossible just by having humans read it. 



The **Semantic Text Analyzer** or **SeTA** is a software tool that supports these tasks.     

SeTA uses advanced text mining techniques to help users screen and query these large document collections.   

Users can search EU documents based on keywords and then screen the results and apply filters, all very quickly and accurately.   

Furthermore, users can create or participate in communities to interact with others users about specific resources.  

## How can SeTA provide all of this to users?

First of all, data is harvested from the following sources:

<!-- ![Screenshot](./img/data_sources.png) -->

- **EUR-Lex** is the online database of all EU legal documents, providing the official and most comprehensive access to them.      
- **CORDIS** contains the results from the projects funded by the EU's framework programs for research and innovation.      
- **PUBSY** is the publications repository of the European Commission's Joint Research Centre.     
- **European Parliament** As a fourth main data source, SeTA contains the publications of the European Parliament.     


These data consist of text documents and the metadata that describe them.      

Document retrieval from numerous data sources comes from a variety of web addresses (URLs) via various endpoints such as SPARQL, SOAP, FTP, or HTTP protocol parsing.     

In order to have a consistent collection of information in terms of content as well as subject and concept distribution, the gathered data must be prepared, cleansed, and trained.              

The typical process to create the general corpus involves:      
- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text.        
- Conversion to Unicode, removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters.      
- De-hyphenation.            

Text documents can be automatically indexed or classified using search terms that match words inside the texts, but non-text digital assets frequently require some kind of descriptive tagging in order to be found in subject searches. To enable reliable, timely, and consistent indexing and retrieval of the content of digital assets, **Taxonomies** are used in the descriptive metadata fields. In the SeTA communities, if users need it, they can create custom taxonomies for their own documents.           

As part of the data preparation, is necessary for the Neural Network training that features must be designed, domains must be covered to produce results that are pertinent and simple to read. The weights and thresholds are constantly changed when training data with the same tags consistently produce comparable results.  For this purpose, SeTA relies on the support of chunk compositionality to create the word embedding used as input data.      
    
**"Chunking"** is the process of combining several pieces of information into more comprehensible or significant portions. As a result, reading a portion of a compressed variable does not necessitate uncompressing the entire variable.[^1]  *In SeTA we create chunks of 300 words and for every chunk a word embedding is created.* 

Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.  The words in this form are closer to one another in the vector space because they have stronger semantic links. The sentence-transformers model **all-distilroberta-v1** is utilised for the embedding process as it helps on the clustering and the semantic search because it maps sentences and paragraphs to a dimensional dense vector space.    

**sBERT**[^2] is a sentence-based model that gives additional training to the model, allowing semantic search for a huge number of sentences. **sBERT** employs a Siamese architecture, which consists of two virtually identical **BERT**[^3] architectures with the same weights, and **sBERT** analyses two words as pairs during training.   
When training the model, **SBERT** concatenates the two embeddings, which are then sent through a SoftMax classifier and trained with a SoftMax-loss function. When the model reaches inference — or begins predicting — the two embeddings are compared using a cosine similarity function, which generates a similarity score for the two sentences[^4].       

After this data preparation, the Neural Networks are trained using **textacy**[^5], a potent Python language modelling package built on the basis of **spaCy**[^6]. The pre-processing module of **textacy** has a good number of functions to normalise characters and to handle common patterns like URLs, email addresses, phone numbers, and so on.    

Once we have the processed data, then is ingested and stored in an **ElasticSearch**[^7].  ElasticSearch is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured and unstructured. Once indexed, it is possible to run complex queries against their data and use aggregations to retrieve complex summaries of their data.

SeTA also uses the **Word2Vec**[^8] algorithm together with **Gensim**[^9], to obtain the suggestions and similar terms when searching.  **Word2Vec** algorithm takes input words and groups them together based on the similarity of their meanings.   **Gensim**, is an open-source framework for unsupervised topic modelling and natural language processing. It extracts semantic concepts from documents and is capable of handling large text volumes.     

Once everything is set up, the data is ready to be interrogated either through the User Web Interface or the API.

In the friendly user web interface, the users can target their search either to the individual document collections or to search across all collections in a harmonised way. In this interface, they can refine the results with some additional filters, elaborate document maps and have a concepts net. 

The API interface can be a good alternative for users that need to integrate the data with their own applications or just more flexibility in information-transfer processes.

As mentioned before, along with the search, it is also possible to participate or create communities to interact with others users about specific resources. Communities are spaces for people with similar interests to discuss or share about extensive or narrow topics.






[^1]:https://www.mindtools.com/a8u1mqw/chunking
[^2]:https://www.SBERT.net
[^3]:https://arxiv.org/pdf/1810.04805.pdf
[^4]:https://towardsdatascience.com/an-intuitive-explanation-of-sentence-bert-1984d144a868
[^5]:https://pypi.org/project/textacy/
[^6]:https://spacy.io/usage/spacy-101
[^7]:https://www.elastic.co/what-is/elasticsearch
[^8]:https://code.google.com/archive/p/word2vec/
[^9]:https://radimrehurek.com/gensim/auto_examples/index.html#documentation

   