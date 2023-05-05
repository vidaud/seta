<!--  {{ customer.web }} -->

The European Union Bodies publish a vast amount of information which is made available via different channels.      
Making sense of the textual content and finding links between documents is difficult if not impossible just by having humans read it. 



The **Semantic Text Analyzer** or **SeTA** is a software tool that supports these tasks.     

SeTA uses advanced text mining techniques to help users screen and query these large document collections.   

Users can search EU documents based on keywords and then screen the results and apply filters, all very quickly and accurately.    


## How can SeTA provide all of this information to users?

First of all, data is harvested from the following sources:

![Screenshot](./img/data_sources.png)

- EUR-Lex is the online database of all EU legal documents, providing the official and most comprehensive access to them.      
- CORDIS contains the results from the projects funded by the EU's framework programs for research and innovation.      
- Pubsy is the publications repository of the European Commission's Joint Research Centre.     
- As a fourth main data source, SeTA covers the publications of the European Parliament.     

These data consist of text documents and the metadata that describe them.      

SeTA ingests and, after some cleaning of the text content, stores the documents and metadata in **ElasticSearch**, a special database.     


### ElasticSearch
ElasticSearch is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured and unstructured. ElasticSearch is built on Apache Lucene and was first released in 2010 by ElasticSearch N.V. (now known as Elastic).  Raw data flows into ElasticSearch from a variety of sources, including logs, system metrics, and web applications. Data ingestion is the process by which this raw data is parsed, normalized, and enriched before it is indexed in ElasticSearch. Once indexed in ElasticSearch, users can run complex queries against their data and use aggregations to retrieve complex summaries of their data.[^1] *(NB: clicking on a footnote takes you there and back again)*

### AI Models

An Artificial Intelligence model is a program or an algorithm that utilizes datasets to find patterns within that data. This allows the model to reach certain conclusions and make predictions when provided with the necessary information.[^2] 

The first step is to create an AI model, which uses a complex algorithm or layers of algorithms that interpret data and make decisions based on that data.[^3] 

The next step is to train the AI model by using full text documents and their phrases from ElasticSearch. This training enables the models to learn relations between the meanings of the words in the text provided. 


### Word2Vec

The algorithm **Word2Vec** processes phrases. This algorithm takes input words and groups them together based on the similarity of their meanings. This similarity is calculated using complex mathematical formulas based on the context of the words. 

Word2vec is a two-layer neural net that processes text by “vectorizing” words. Its input is a text corpus and its output is a set of vectors: feature vectors that represent words in that corpus. Word2vec creates vectors that are distributed numerical representations of word features, features such as the context of individual words. It does so without human intervention. While Word2vec is not a deep neural network, it turns text into a numerical form that deep neural networks can understand.[^4] Its output is a vocabulary in which each item has a vector attached to it, which can be fed into a deep-learning net or simply queried to detect relationships between words.

The purpose and usefulness of Word2vec is to group the vectors of similar words together in vectorspace. That is, it detects similarities mathematically. 

Given enough data, usage and contexts, Word2vec can make highly accurate guesses about a word’s meaning based on past appearances. 
In SeTA, the **Word2Vec** algoritm is used to get the suggestions and similar terms when searching in the user interfaxce search bar.

**Word2Vec** has been used in alongside **Gensim**. ("Generate Similar") is an open-source framework for unsupervised topic modelling and natural language processing written in Python. It is a tool for extracting semantic concepts from documents that is capable of handling large text volumes. As a result, it differs from other machine learning software packages that concentrate on memory processing. To boost processing speed, Gensim also provides efficient multicore implementations for certain algorithms. It includes more text processing features than other packages such as Scikit-learn, R, and others.



### sBERT
<!-- to ask  in which part is used sBERT-->
**sBert** is a modification of the standard pretrained **BERT** network.

Bidirectional Encoder Representations from Transformers, sometimes known as **BERT**, is an open source machine learning framework for natural language processing (NLP). **BERT** uses the text around it to generate context, which enables computers to understand the meaning of ambiguous words in text. A question and answer dataset can be used to fine-tune the **BERT** framework, which was pre-trained using text from Wikipedia.  **BERT** is built on Transformers[^5], a deep learning model in which every output element is connected to every input element and the weightings between them are dynamically determined based on their connection. (In NLP, this procedure is referred to as attention.)[^6]

**sBERT** is a sentence-based model that gives additional training to the model, allowing semantic search for a huge number of sentences. **sBERT** employs a siamese architecture, which consists of two virtually identical **BERT** architectures with the same weights, and **sBERT** analyses two words as pairs during training. While the original study paper attempted numerous pooling approaches, they discovered that mean-pooling was the most effective. Pooling is a strategy for generalising features in a network, and it works in this case by averaging groupings of characteristics in the BERT. We now have two embeddings: one for sentence A and one for phrase B, thanks to the pooling.     
When training the model, **SBERT** concatenates the two embeddings, which are then sent through a softmax classifier and trained with a softmax-loss function. When the model reaches inference — or begins predicting — the two embeddings are compared using a cosine similarity function, which generates a similarity score for the two sentences.
[^7] 

By training the models with new documents as they are published, we can ensure that the knowledge the models contain continues to represent EU documents accurately. 



!!! info "Ontology"
    Ontology shows properties and relations between a set of concepts and categories within a  subject area or domain. It is a branch of linguistics called semantics, the study of meaning. With ontology, a machine can accurately interpret the meaning of the word “diamond” in relation to a baseball player, jeweler, or card suit. It can also help interpret the word “chicken” as either food or an animal or differentiate between “bank” as a place of business or land alongside a river or lake.[^8]

At this point the full text of all documents can be searched through a simple interface, and users are able to target their search either to the individual document collections or to search across all collections in a harmonised way.



[^1]:https://www.elastic.co/what-is/elasticsearch
[^2]:https://plat.ai/blog/what-you-know-about-ai-model/
[^3]:https://www.intel.com/content/www/us/en/analytics/data-modeling.html
[^4]:http://wiki.pathmind.com/word2vec
[^5]:https://blogs.nvidia.com/blog/2022/03/25/what-is-a-transformer-model/
[^6]:https://www.techtarget.com/searchenterpriseai/definition/BERT-language-model
[^7]:https://towardsdatascience.com/an-intuitive-explanation-of-sentence-bert-1984d144a868
[^8]:https://www.expert.ai/blog/how_ontology_works_and_adds_value_to_nlu/
   