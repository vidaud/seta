
![Screenshot](../img/machine_learning_icons.png)



As described previously, SeTA follows two distinct steps for the creation of the knowledge base: 

1. Document collection, cleaning and storage 

2. Text analysis and modelling 


## 1. Document collection, cleaning and storage

### 1.1 Corpus preparation

#### 1.1.1 The corpus creation
The corpus of the public policy-related European documents counts more than 500.000 documents, coming from the following sources: EUR-LEX, EU Publications, CORDIS, the EU Open Data Portal, JRC PUBSY, EUROPARL.

All the texts collected are in English only (except for some older legal texts where multiple languages are interleaved on the same page). 

The reasons for this decision are:

- [x] English language sentence dependency parsing is rather straightforward and there are several open source semantic parsers with excellent tuning for this language.

- [x] We are interested in extracting knowledge from plain text and as the translation of, for example, a directive into all EU languages does not create new knowledge, processing a single language well should capture the available information.

> #### Taxonomy

> Data taxonomy is the classification of data into categories and sub-categories. It provides a unified view of the data in a system and introduces common terminologies and semantics across multiple systems. Taxonomies represent the formal structure of classes or types of objects within a domain. A taxonomy formalizes the hierarchical relationships among concepts and specifies the term to be used to refer to each; it prescribes structure and terminology.[^1] 

In SeTA, the received metadata from the datasources can be reconfigured, thanks to the dynamic generation of data taxonomy.  In the API, the user can redifine the taxonomy he wants to be used. The process starts with the user defining the structure data that he needs and setting it into the API. 

``` json
"aggregations": {
    "taxonomy": [
      [
        {
          "doc_count": 6,
          "name": "taxonomy1",
          "subcategory": [
            {
              "classifier": "vidas",
              "code": "/25/59/377",
              "doc_count": 6,
              "label": "domain12",
              "longLabel": "domain12",
              "name": "domain1",
              "subcategory": [
                {
                  "classifier": "vidas",
                  "code": "/25/59/377",
                  "doc_count": 6,
                  "label": "mts12",
                  "longLabel": "mts12",
                  "name": "mts1",
                  "subcategory": [
                    {
                      "classifier": "vidas",
                      "code": "/25/59/377",
                      "doc_count": 6,
                      "label": "concept32",
                      "longLabel": "concept32",
                      "name": "concept3",
                      "subcategory": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    ]
  }
```



#### 1.1.2 Document cleansing pipeline
Since there is a variety of web service document retrieval end-points and there are often more than one document per metadata record, a document harvesting process was established as the first part of the whole pipeline. 

Documents are retrieved through SPARQL, SOAP, FTP or HTTP protocol parsing, even though every source has its own specificities.

After metadata have been harvested and interpreted, the documents must be downloaded and processed. 

The fully automated and repeatable data cleaning mechanism, is being constantly improved. We keep learning the needs and requirements of neural networks to produce quality results. 

The typical process to create a general corpus involves:

- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text

- Conversion to Unicode (often not easy), removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters, spacing enforcement.

- De-hyphenation (a rather critical step)

- Sentence separation based on dependency parsing (allowing the reconstruction even of sentences split over several lines)


Adding another corpus is very easy since the general cleansing pipeline has already been implemented, metadata are parsed through abstraction layer for consolidation and processing is very swift.

The output of this step is a document repository containing the completely cleaned unified plain text, divided into chunks of 300 words. 

This new document structure is stored within an ElasticSearch (ES) database which allows searching and reproduction for human readers. 

At this point the full text of all documents can be searched through a simple interface, and users are able to target their search either to the individual document collections or to search across all collections in a harmonised way.

## 2.	Text analysis and modelling 

### 2.1 Neural networks training

This is the pivotal point of the whole analytical process. Neural networks can learn any function and only data availability defines how complex the function can be.  Therefore, the data preparation, feature engineering and domain coverage become essential elements for obtaining meaningful and analysable results from neural network training.
The EC public knowledge corpus sports rather consistent language and thus the features could have been created from chunks instead of words like in general language.

### 2.1.1 Chunk compositionality

**"Chunking"** is the process of grouping different bits of information together into more manageable or meaningful chunks. [^2]. 

Three key ingredients are needed for successful chunking:

- Using small, well-organized units.
- Using units of no more than seven items.
- Finding the right level of detail.


In Seta, this is possibly the single most critical step where textual features in the form of chunks have been engineered.  The implementation of these steps is performed by extracting titles, abstracts and identified sentences from the whole corpus, identifying, harmonising and replacing phrases and then storing.

### 2.1.2 Final text preparation
As the last step before the neural network training is further normalisation: The only character allowed in the text are a-z, 0-9, /, -, _, (space)

All words not containing at least one character a-z are removed.

This general corpus now contains 7 billion words and phrases, about 80 million sentences and 23 GB of plain text.

### 2.1.3	Actual neural network training

We used a powerful python library for language modelling called **textacy**[^3] for the neural network training.

**textacy** is a Python library for performing a variety of natural language processing (NLP) tasks, built on the high-performance **spaCy**[^4] library. With the fundamentals: *tokenization, part-of-speech tagging, dependency parsing, etc.* delegated to another library, **textacy** focuses primarily on the tasks that come before and follow after.

#### Features:

* Access and extend spaCy's core functionality for working with one or many documents through convenient methods and custom extensions

* Load prepared datasets with both text content and metadata

* Clean, normalize, and explore raw text before processing it with spaCy

* Extract structured information from processed documents, including n-grams, entities, acronyms, keyterms, and SVO triples

* Compare strings and sequences using a variety of similarity metrics

* Tokenize and vectorize documents then train, interpret, and visualize topic models

* Compute text readability and lexical diversity statistics, including Flesch-Kincaid grade level, multilingual Flesch Reading Ease, and Type-Token Ratio

!!! note
    This highlights an important point: we are dealing with scientific and technical reports and legal texts and their language bears completely different information from general text. The analyst must be aware of this focus when analysing the content.



[^1]: https://innodata.com/understanding-the-role-of-taxonomies-ontologies-schemas-and-knowledge-graphs/
[^2]: https://www.mindtools.com/a8u1mqw/chunking
[^3]: https://pypi.org/project/textacy/
[^4]: https://spacy.io/usage/spacy-101




