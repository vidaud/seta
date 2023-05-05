

The following diagram describes the workflow of SeTA.
 
1. Everything starts by receiving as input from different sources the data that will fill the database.
2. The data is processed (cleaned, algorithms)
3. The processed data is used to create the AI Models
4. The parsed and labelled data is ready to use for the searching. 



![Screenshot](../img/machine_learning_icons.png)



As described previously, SeTA follows two distinct steps for the creation of the knowledge base: Document collection, cleaning and storage and Text analysis and modelling.



## Corpus preparation

As mentioned, the corpus of the public policy-related European documents comes from the following sources: EUR-LEX, CORDIS, JRC PUBSY, EUROPARL.

All the texts collected are in English only (except for some older legal texts where multiple languages are interleaved on the same page). 

The reasons for this decision are:

- [x] English language sentence dependency parsing is rather straightforward and there are several open source semantic parsers with excellent tuning for this language.

- [x] We are interested in extracting knowledge from plain text and as the translation of, for example, a directive into all EU languages does not create new knowledge, processing a single language well should capture the available information.


### Taxonomy

In recent years, access to knowledge has improved and become more widespread, mostly due to technology. However, this had made it difficult for people to locate accurate, timely, and reliable information.      
This issue is also frequent in sectors where large amounts of information are held in unstructured ways in many repositories, databases, and libraries, often with ambiguous naming conventions that provide little insight into the material and its value to the user.      
The implementation of Taxonomy is an effort to provide organization and increase productivity through quicker, more efficient retrieval and use.        
In order to make it simpler to identify related information, Taxonomy uses a regulated vocabulary to represent the formal structure of classes or types of things inside a knowledge domain. Taxonomy aids in the hierarchical organization of the assets and material. It can be much simpler to search for or explore an asset or content management by classifying the content and assets in a Taxonomy. [^1]        


The term **'Taxonomy'** refers to the science of categorizing things. It is currently a common phrase for any system of hierarchical classification or categorization. Thus, a Taxonomy is a controlled vocabulary in which all terms have parent/child or broader/narrower relationships to other terms and belong to a single hierarchical structure. The structure is also referred to as a 'tree'. Non-preferred terms/synonyms may or may not be included in a Taxonomy. Taxonomy has recently gained popularity as a term for any type of controlled vocabulary, whether a term list, authority file, thesaurus, or any hybrid combination. [^2]

To facilitate uniform, precise, and rapid indexing and retrieval of the content of digital assets, Taxonomies are utilised in the descriptive metadata fields. Non-text digital files typically require some type of descriptive tagging in order to be retrieved in subject searches, whereas text documents can be automatically indexed or auto-classified based on search queries matching words within the texts. Uncontrolled keyword tagging frequently produces retrieval results that are inconsistent, inadequate, overly general, and biased. Implementing Taxonomies in the fields of descriptive metadata is the answer for indexing.[^2].    

Consistent, precise, and quick indexing and retrieval of content are made possible by Taxonomies. Vocabulary design must be connected with the metadata approach because Taxonomies offer a variety of metadata fields.


#### Taxonomy provides: 

- Relationships between the structure, content, and component parts.
- Identifies and organises information into hierarchical categories for analysis.
- It is a method of managing material that classifies data according to terms kept in metadata.
- It introduces common terminologies and semantics across various systems and offers a unified view of the data in a system.
- Establishes the terminology to be used for each notion and formalises the hierarchical relationships between them.
- Specifies terminology and structure.
- Improve data quality
- Create an accessible metadata structure.
- Control data assets through data governance.
- Determine trends and patterns through guiding machine learning and data experiences.

It is critical to keep a constant level of precision within a category while constructing a Taxonomy. 

Taxonomies can be of several kind, such as *flat, hierarchical, network*, and so on. For our case we use a hierarchical structure, with a single root that subdivided into categories as needed to organise the information and represented as a tree. A single hierarchical structure is simple to grasp and establish a mental model for finding information.

#### How to design a good Taxonomy

When creating a Taxonomy, consider[^1]:       
1. Decide what topics your Taxonomy must include.    
2. Consider how specific the Taxonomy needs to be.    
3. Provide names for each object in relation to other objects and follow a hierarchical style.     
4. Have particular guidelines that are followed while classifying or categorising any object inside a domain. These guidelines must be comprehensive, consistent, and clear.      
5. Apply strict specification to ensure that any newly discovered object can only belong to one specific category or type of object.      
6. Inherit every property from the class above it and also have the option of adding new properties.      
7. Objects membership attributes in relation to other objects may also be captured.     

The following example describes a simple Taxonomy:

![Screenshot](../img/taxonomy.png){width=600}

<!--```
  /natural sciences
  /natural sciences/biological sciences
  /natural sciences/biological sciences/ecology
  /natural sciences/biological sciences/ecology/ecosystems
  /natural sciences/biological sciences/zoology
  /natural sciences/biological sciences/zoology/entomology
``` -->



#### Taxonomy in SeTA
In SeTA, we have define some Taxonomies that can be used, but you can also define a new Taxonomy if is necessary.    


To create a new Taxonomy, you can use our API interface. After selecting the terms that represent the broadest category, and assigning the remaining terms to the other categories, you can start creating the new Taxonomy.    

From the API interface you will just need to set up the parameters: **code, label, long label, classifier, version, validated**  and later upload the new Taxonomy.  

It is possible to create as many Taxonomies as you need.    

The outcome is a JSON file that reveals the recursive nature of the tree.



{++ example of SeTA Taxonomy++}


The following example describes part of a Taxonomy used in SeTA:

```json
"aggregations": {
    "taxonomy": [
      [
        {
          "doc_count": 7,
          "name": "euro_sci_voc",
          "subcategory": [
            {
              "classifier": "cordis",
              "code": "/23",
              "doc_count": 6,
              "label": "natural sciences",
              "longLabel": "/natural sciences",
              "name": "natural_sciences",
              "subcategory": [
                {
                  "classifier": "cordis",
                  "code": "/23/49",
                  "doc_count": 4,
                  "label": "biological sciences",
                  "longLabel": "/natural sciences/biological sciences",
                  "name": "biological_sciences",
                  "subcategory": [
                    {
                      "classifier": "cordis",
                      "code": "/23/49/335",
                      "doc_count": 2,
                      "label": "ecology",
                      "longLabel": "/natural sciences/biological sciences/ecology",
                      "name": "ecology",
                      "subcategory": [
                        {
                          "classifier": "cordis",
                          "code": "/23/49/335/1009",
                          "doc_count": 2,
                          "label": "ecosystems",
                          "longLabel": "/natural sciences/biological sciences/ecology/ecosystems",
                          "name": "ecosystems",
                          "subcategory": []
                        }
                      ]
                    },
                    {
                      "classifier": "cordis",
                      "code": "/23/49/345",
                      "doc_count": 2,
                      "label": "zoology",
                      "longLabel": "/natural sciences/biological sciences/zoology",
                      "name": "zoology",
                      "subcategory": [
                        {
                          "classifier": "cordis",
                          "code": "/23/49/345/1039",
                          "doc_count": 2,
                          "label": "entomology",
                          "longLabel": "/natural sciences/biological sciences/zoology/entomology",
                          "name": "entomology",
                          "subcategory": []
                        }
                      ]
                    }
                  ]
                },
```


### Document cleaning pipeline
The document gathering process is the initial step in the pipeline's overall procedure. 

Documents are retrieved from a number of web addresses (URLs) via various endpoints such as SPARQL, SOAP, FTP, or HTTP protocol parsing. Per metadata record, there is frequently more than one document. 

The papers must be downloaded and processed after the metadata has been gathered and read. 

The typical process to create a general corpus involves:

- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text.

- Conversion to Unicode, removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters.

- De-hyphenation.

- Sentence separation based on dependency parsing (allowing the reconstruction even of sentences split over several lines).

This stage produces a document repository containing the thoroughly cleaned unified plain text, separated into 300-word chunks. 

This new document structure is saved in the ElasticSearch database, which allows users to search and reproduce it. 


### Neural networks training

Neural networks may learn any function, and the only limitation is the availability of data. As a result, data preparation, feature engineering, and domain coverage become critical components for producing relevant and understandable results from neural network training.     
Weights and thresholds are continuously changed throughout training until training data with the same tags consistently produce results that are similar. 

For SeTA we use chunk compositionality and word embedding for the training.    

By using supervised learning, which involves providing the network with a huge collection of training data comprised of input chunks, we can train neural networks. The activations in each layer of the neural network change after each training iteration. Eventually, it will be able to anticipate the output label that should be assigned to a specific input, even if it has never seen that input before.


### Chunk compositionality

**"Chunking"** is the process of combining several pieces of information into more comprehensible or significant portions.[^3]. 

By selecting chunk shapes and sizes wisely, significant performance benefits can be achieved. Chunking also provides efficient per-chunk compression and efficiently extending multidimensional data along multiple axes. As a result, reading a portion of a compressed variable does not necessitate uncompressing the entire variable.[^4] 

Three key ingredients needed for successful chunking:

- Using small, well-organized units.
- Using units of no more than seven items.
- Finding the right level of detail.

In SeTA we create chunks of 300 words. With this we try to ensure our search results accurately and capture the essence of the user’s query.  For every chunk we create an embedding. 

### Embedding
Word embeddings are numerical vector representations of text that keep track of the semantic and contextual relationships between words in the corpus of texts.  The words in this form are closer to one another in the vector space because they have stronger semantic links. Embeddings can be utilised with other models and, in general, improve the productivity and usability of ML models.

The sentence-transformers model **all-distilroberta-v1** is utilised for the embedding process as it helps on the clustering and the semantic search because it maps sentences and paragraphs to a dimensional dense vector space.


### Semantic search

<!-- to ask  in which part is used sBERT-->
**sBert** is a modification of the standard pretrained **BERT** network.

Bidirectional Encoder Representations from Transformers, sometimes known as **BERT**, is an open source machine learning framework for natural language processing (NLP). **BERT** uses the text around it to generate context, which enables computers to understand the meaning of ambiguous words in text. A question and answer dataset can be used to fine-tune the **BERT** framework, which was pre-trained using text from Wikipedia.  **BERT** is built on Transformers[^5], a deep learning model in which every output element is connected to every input element and the weightings between them are dynamically determined based on their connection. (In NLP, this procedure is referred to as attention.)[^6]

**sBERT** is a sentence-based model that gives additional training to the model, allowing semantic search for a huge number of sentences. **sBERT** employs a siamese architecture, which consists of two virtually identical **BERT** architectures with the same weights, and **sBERT** analyses two words as pairs during training. While the original study paper attempted numerous pooling approaches, they discovered that mean-pooling was the most effective. Pooling is a strategy for generalising features in a network, and it works in this case by averaging groupings of characteristics in the BERT. We now have two embeddings: one for sentence A and one for phrase B, thanks to the pooling.     
When training the model, **SBERT** concatenates the two embeddings, which are then sent through a softmax classifier and trained with a softmax-loss function. When the model reaches inference — or begins predicting — the two embeddings are compared using a cosine similarity function, which generates a similarity score for the two sentences.
[^7] 

By training the models with new documents as they are published, we can ensure that the knowledge the models contain continues to represent EU documents accurately. 


### Pre-processing data

**spaCy** is a Python library for advanced Natural Language Processing (NLP) that is open-source and free.[^8] It helps create applications that process and "understand" massive volumes of text and is specifically created for usage in production. It can be used to create information extraction or systems for interpreting natural language, or it can be used to prepare text for deep learning.     

We train neural networks using **textacy**, a potent Python language modelling package built on the basis of **spaCy**[^9]. It can carry out a variety of natural language processing (NLP) tasks thanks to the **spaCy** library's outstanding performance. The essentials, such as part-of-speech tagging, dependency parsing, and tokenization, are handled by another library, leaving **textacy** to concentrate mostly on the jobs that occur before and after. The pre-processing module of **textacy** has a good number of functions to normalise characters and to handle common patterns like URLs, email addresses, phone numbers, and so on.    



**textacy** features:

- Connect directly and add custom extensions to the main functionality of spaCy for interacting including one or more documents.
- Various similarity measures are used to compare strings and sequences.
- Prior to using spaCy to analyse raw text, clean, normalise, and examine it.
- Documents are tokenized and vectorized, and then topic models are trained, interpreted, and displayed.


libreria usata per adestratere modello gensim con word2vec usata solo per suggestions e similar terms le suggestions sono salvate su ES 




[^1]: https://data.nsw.gov.au/IDMF/data-structure-and-coordination/data-taxonomy
[^2]: https://link.springer.com/article/10.1057/dam.2010.29
[^3]: https://www.mindtools.com/a8u1mqw/chunking
[^4]: https://www.unidata.ucar.edu/blogs/developer/en/entry/chunking_data_why_it_matters
[^5]: https://huggingface.co/learn/nlp-course/chapter1/4
[^6]: https://www.techtarget.com/searchenterpriseai/definition/BERT-language-model
[^7]: https://towardsdatascience.com/an-intuitive-explanation-of-sentence-bert-1984d144a868 
[^8]: https://spacy.io/usage/spacy-101 
[^9]: https://pypi.org/project/textacy/






