<!--  {{ customer.web }} -->

The European Union Bodies publish a vast amount of information which is made available via different channels.      
Making sense of the textual content and finding links between documents is difficult if not impossible just by having humans read it. 



The **Semantic Text Analyzer** or **SeTA** is a software tool that supports these tasks.     

SeTA uses advanced text mining techniques to help users screen and query these large document collections.   

Users can search EU documents based on keywords and then screen the results and apply filters, all very quickly and accurately.   

{to update}
*In order to do that the user needs to first register, create a community, create a resource and load all the documents related(together with the taxonomy)*


## How can SeTA provide all of this information to users?

First of all, data is harvested from the following sources:

![Screenshot](./img/data_sources.png)

- EUR-Lex is the online database of all EU legal documents, providing the official and most comprehensive access to them.      
- CORDIS contains the results from the projects funded by the EU's framework programs for research and innovation.      
- Pubsy is the publications repository of the European Commission's Joint Research Centre.     
- As a fourth main data source, SeTA covers the publications of the European Parliament.     

These data consist of text documents and the metadata that describe them.      


Furthermore, it is possible for users to create its own sources, and therefore the corpus. 

## Corpus preparation

### Taxonomy

To facilitate uniform, precise, and rapid indexing and retrieval of the content of digital assets, Taxonomies are utilised in the descriptive metadata fields. Non-text digital files typically require some type of descriptive tagging in order to be retrieved in subject searches, whereas text documents can be automatically indexed or auto-classified based on search queries matching words within the texts. Consistent, precise, and quick indexing and retrieval of content are made possible by Taxonomies. Vocabulary design must be connected with the metadata approach because Taxonomies offer a variety of metadata fields.

In SeTA, we have defined some Taxonomies that can be used, but it is also possible for users to define new Taxonomies if is necessary.    

To create a new Taxonomy, users can set it together with the document they upload: 

- In the API interface, through the function *PUT /corpus* it is possible to upload it.   

- In the Communities Web interface, it is also possible to create the taxonomies. This is when uploading a new document, we can find the option to create them. 

It is possible to create as many Taxonomies as you need.    

### Document cleaning pipeline
Documents are retrieved from a number of web addresses (URLs) via various endpoints such as SPARQL, SOAP, FTP, or HTTP protocol parsing. Per metadata record, there is frequently more than one document. 

The papers must be downloaded and processed after the metadata has been gathered and read. 

The typical process to create a general corpus involves:

- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text.
- Conversion to Unicode, removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters.

- De-hyphenation.

- Sentence separation based on dependency parsing (allowing the reconstruction even of sentences split over several lines).

### Neural networks training

Neural networks may learn any function, and the only limitation is the availability of data. As a result, data preparation, feature engineering, and domain coverage become critical components for producing relevant and understandable results from neural network training.     
Weights and thresholds are continuously changed throughout training until training data with the same tags consistently produce results that are similar. 
For SeTA we use chunk compositionality and word embedding for training.    

 
### Chunk compositionality

**"Chunking"** is the process of combining several pieces of information into more comprehensible or significant portions.[^1]

Chunking provides efficient per-chunk compression and efficiently extending multidimensional data along multiple axes. As a result, reading a portion of a compressed variable does not necessitate uncompressing the entire variable.[^2] 

In SeTA we create chunks of 300 words. With this we try to ensure our search results accurately and capture the essence of the user’s query.  For every chunk we create an embedding. 

### Embedding
Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.  The words in this form are closer to one another in the vector space because they have stronger semantic links. Embeddings can be utilised with other models and, in general, improve the productivity and usability of ML models.

The sentence-transformers model **all-distilroberta-v1** is utilised for the embedding process as it helps on the clustering and the semantic search because it maps sentences and paragraphs to a dimensional dense vector space.

### Semantic search

<!-- to ask  in which part is used sBERT-->
**sBert** is a modification of the standard pretrained **BERT** network.

Bidirectional Encoder Representations from Transformers, sometimes known as **BERT**, is an open source machine learning framework for natural language processing (NLP). **BERT** uses the text around it to generate context, which enables computers to understand the meaning of ambiguous words in text. 

**sBERT** is a sentence-based model that gives additional training to the model, allowing semantic search for a huge number of sentences. **sBERT** employs a Siamese architecture, which consists of two virtually identical **BERT** architectures with the same weights, and **sBERT** analyses two words as pairs during training.   

When training the model, **SBERT** concatenates the two embeddings, which are then sent through a SoftMax classifier and trained with a SoftMax-loss function. When the model reaches inference — or begins predicting — the two embeddings are compared using a cosine similarity function, which generates a similarity score for the two sentences.
[^3] 

### Word2Vec
In SeTA, the **Word2Vec** algorithm is used to get the suggestions and similar terms when searching in the user interface search bar.     

**Word2Vec** processes phrases. This algorithm takes input words and groups them together based on the similarity of their meanings. This similarity is calculated using complex mathematical formulas based on the context of the words. 

**Word2Vec** has been used in alongside **Gensim**. ("Generate Similar") is an open-source framework for unsupervised topic modelling and natural language processing. It is a tool for extracting semantic concepts from documents that is capable of handling large text volumes.

### Pre-processing data

**spaCy** is a Python library for advanced Natural Language Processing (NLP) that is open-source and free.[^4] It helps create applications that process and "understand" massive volumes of text and is specifically created for usage in production. 
We train neural networks using **textacy**, a potent Python language modelling package built on the basis of **spaCy**[^5]. The pre-processing module of **textacy** has a good number of functions to normalise characters and to handle common patterns like URLs, email addresses, phone numbers, and so on.    

The processed data, is ingested and stored in **ElasticSearch**.     


### ElasticSearch
ElasticSearch is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured and unstructured. ElasticSearch is built on Apache Lucene and was first released in 2010 by ElasticSearch N.V. (now known as Elastic).  Raw data flows into ElasticSearch from a variety of sources, including logs, system metrics, and web applications. Data ingestion is the process by which this raw data is parsed, normalized, and enriched before it is indexed in ElasticSearch. Once indexed in ElasticSearch, users can run complex queries against their data and use aggregations to retrieve complex summaries of their data.[^6] *(NB: clicking on a footnote takes you there and back again)*


!!! info "Ontology"
    Ontology shows properties and relations between a set of concepts and categories within a  subject area or domain. It is a branch of linguistics called semantics, the study of meaning. With ontology, a machine can accurately interpret the meaning of the word “diamond” in relation to a baseball player, jeweler, or card suit. It can also help interpret the word “chicken” as either food or an animal or differentiate between “bank” as a place of business or land alongside a river or lake.[^7]

At this point the full text of all documents can be searched through a simple interface, and users are able to target their search either to the individual document collections or to search across all collections in a harmonised way.


[^1]:https://www.mindtools.com/a8u1mqw/chunking
[^2]: https://www.unidata.ucar.edu/blogs/developer/en/entry/chunking_data_why_it_matters
[^3]: https://towardsdatascience.com/an-intuitive-explanation-of-sentence-bert-1984d144a868
[^4]: https://spacy.io/usage/spacy-101 
[^5]: https://pypi.org/project/textacy/
[^6]:https://www.elastic.co/what-is/elasticsearch
[^7]:https://www.expert.ai/blog/how_ontology_works_and_adds_value_to_nlu/
   