This project is made up of two modules:

* The **frontend** 
* The **flask-server** one. 

**Seta-frontend** is a *React* standard workspace enabled application.  
**Seta-middleware** is a standard `maven-archetype-webapp` 
**Seta-flask-server** is a Flask application 

The frontend module contains all the static resources that make up the UI business logic  \
The middleware module contains all the java sources and acts as a proxy / integration layer towards the backend. \
The flask-server module contains all the python sources and acts as a proxy / authentication layer towards the backend.  


All static resources that ensue from `ng build seta-web -c=<environment>` of the the frontend module are copied inside the flask-server **seta-ui** folder's module.  
The end result is a ***seta-flask-server*** folder that contains a Flask application that can be deployed on any web container.  
Flask configurations files are:
 - seta-flask-server/config.py
 - seta-flask-server/.env


###  Methodology

 As described previously, SeTA follows two distinct steps for the creation of the knowledge base: 

a. Document collection, cleaning and storage 

b. Text analysis and modelling 


## 1. Document collection, cleaning and storage

### 1.1 Corpus preparation

#### 1.1.1 The corpus creation
The corpus of the public policy-related European documents counts more than {--500.000 documents--}, coming from the following sources already described in some detail in ==the general overview: EUR-LEX, EU Publications, CORDIS, the EU Open Data Portal, JRC PUBSY, EUROPARL.==

==The auxiliary document repository also contains documents from:== 

==- Full copy of Wikipedia dump (6M articles, 13GB)==

==- 39 million open source scientific articles that were collected by the Allen Institute for Artificial Intelligence15==

==- A full copy (590.000 documents) of the US federal legislation since 199416==


Metadata in various formats are harvested from the document sources, harmonised into a common format and sent to a RabbitMQ pipeline for further processing. The actual document content is downloaded and processed in later steps. 

This approach, processing metadata independently from the document contents, is a key prerequisite for building a unified corpus of documents as this source abstraction layer permits a wide variety of sources to be ingested.


All the texts collected are in English only (except for some older legal texts where multiple languages are interleaved on the same page). 

The reasons for this decision are:

1. English language sentence dependency parsing is rather straightforward and there are several open source semantic parsers with excellent tuning for this language.

2. We are interested in extracting knowledge from plain text and as the translation of, for example, a directive into all EU languages does not create new knowledge, processing a single language well should capture the available information.


#### 1.1.2 Document cleansing pipeline
Since there is a variety of web service document retrieval end-points and there are often more than one document per metadata record, a document harvesting process was established as the first part of the whole pipeline. 

Documents are retrieved through ==SPARQL, SOAP, OAI-PHM, FTP or HTTP protocol parsing==, even though every source has its own specificities.


After metadata have been harvested and interpreted, the documents must be downloaded and processed. 

The fully automated and repeatable data cleaning mechanism, developed over two years is not perfect and is being constantly improved. We keep learning the needs and requirements of neural networks to produce quality results. 

The typical process to create a general corpus involves:

==- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text==

==- Conversion to Unicode (often not easy), removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters, spacing enforcement.==

==- De-hyphenation (a rather critical step)==

==- Sentence separation based on dependency parsing (allowing the reconstruction even of sentences split over several lines)==


Adding another corpus is very easy since the general cleansing pipeline has already been implemented, metadata are parsed through abstraction layer for consolidation and processing is very swift.

The output of this step is a document repository containing the completely cleaned unified plain text, divided into sentences. 

This new document structure is stored within an ElasticSearch (ES) database which allows searching and reproduction for human readers. 

==The original text is also stored in the same database.==

At this point the full text of all documents can be searched through a simple interface, and users are able to target their search either to the individual document collections or to search across all collections in a harmonised way.

## 2.	Text analysis and modelling 

### 2.1 Neural networks training

This is the pivotal point of the whole analytical process. Neural networks can learn any function and only data availability defines how complex the function can be. 

The EC public knowledge corpus sports rather consistent language and thus the features could have been created from phrases instead of words like in general language.

#### 2.1.1 Phrase compositionality
This is possibly the single most critical step where textual features in the form of phrases have been engineered. Many months were spent attempting to create “the best” phrase engine with these results:

+ Word ngrams are useless in a corpus with fixed vocabulary and complicated phrases
 
+ Dependency tagging (e.g. JJ*NN* for a chain of adjectives and nouns) misses many important phrases
    
+	We hoped that the Google Text-Rank algorithm would be able to catch compound phrases

+ Dependency parsing of a noun phrase as produced by the *Stanford CoreNLP17 java engine*[^1] or better *spaCy18*[^2] python library can provide high quality dependency tagging and identify the noun phrase correctly, but catch many artefacts on the way

+ Iteratively cleaned noun phrases created from noun dependency trees can then produce even very high-quality phrases:


All together there are about 1 million phrases with a ==frequency higher than 50 out of 26 million identified cleaned phrases.==

In the next step we harmonise the different variants of common phrases by taking the most commonly occurring variant as canonical, and using it to replace other variants. For example, the variants "real time", "real-time" and "realtime" are all replaced with "real- time", as this has the highest frequency in our corpus. Without this step, the network will become a spell-checker.

Once the final set of phrases has been created, the separate words constituting each phrase are combined into a single token by replacing the spaces separating them with underscores. In this way the phrase "member state" becomes the token "member_state". This step increases the quality of the trained networks, as the meaning of the phrase is encoded separately from the meanings of its constituent words.

The implementation of these steps is performed by extracting titles, abstracts and identified sentences from the whole corpus, identifying, harmonising and replacing phrases and then storing as a text file outside of the ES database. An idea of the scale is given by the size of this text file, around 23 GB. For analysis of term development by (half)decades, separate text files were created for 1950s-1980s, 1990-1994, 1995-1999, 2000-2004, 2005-2009, 2010-2014, 2015-2018.

#### 2.1.2	Final text preparation
As the last step before the neural network training is further normalisation: 

The only character allowed in the text are a-z, 0-9, /, -, _, (space)

All words not containing at least one character a-z are removed.

==This general corpus now contains 7 billion words and phrases, about 80 million sentences and 23 GB of plain text.==

#### 2.1.3	Actual neural network training
We used a powerful python library for language modelling called ==**gensim19[^3]**== for the neural network training.

Currently there are three topologies in use:

==- Skip-gram Word2Vec for similarity queries==

==- Continuous Bag of Words (CBOW) with sub-word information (FastText, Bojanowski 2016) is used for calculations in the vector space==

==- Doc2Vec DM (distributed memory, Le and Mikolov, 2014) for document similarity calculations.==

The training of one network using Word2Vec topology takes about 20 hours on a fast Linux workstation with 36 physical cores and plenty of RAM. Models persisted to hard disk take about 5GB.

The training of one network in FastText topology takes about 80 hours on the same system and the models are also of about 5GB in size.

The training of one network in Doc2Vec topology takes about 8 hours on the same workstation and the models are of about 25GB in size


#### 2.1.4	Verification and accuracy tests
The trained model networks now represent the billions of words and phrases found in the corpus as short mathematical vectors. Derived from the positions of the words in the input corpus, these vectors not only represent each of the words, but also capture some of the meaning of each word, found from the context of surrounding words. This approach means that the meaning captured for each word is strongly dependent on the corpus used for training.

Each of the trained networks is tested against the same similarity test which was designed to match the characteristics of our large, single language corpus.
The first tests involve basic similarity queries to reflect our corpus: the concept most similar to “cap” is not “hat” but “common_agricultural_policy”. “wfd” results in both water_framework_directive and waste_ framework_directive, “eee” in “electrical_and_electronic_equipment”, “wwtp” in “waste_water_treatment_plant” but also in “wwtps” and “municipal_sewage”.

The next test utilises an interesting property of the vector representation of word meanings: it is possible to perform mathematical calculations with the vectors with interesting results. The standard example used to demonstrate this, for a large, general purpose corpus of English, is to calculate the effect of taking the word vector for "king", subtracting that for "man", and adding the vector for "woman": the result is found to be (very close to) the word vector for "queen". This approach is exploited in our text analysis, for example to discover directives in particular fields. For our particular corpus, which mostly contains legal texts, we find that the word vector calculation for king – man + woman does not give queen, but the closest phrases we find are “education officer”, ”member of parliament” and “immigration officer”. Rather than reflecting a gender bias, this (and many other examples tested) seems to reflect the lack of gender information in our corpus of technical and legal texts. The gender vector in our vector space is therefore non-representative.

This highlights an important point: we are dealing with scientific and technical reports and legal texts and their language bears completely different information from general text. The analyst must be aware of this focus when analysing the content.



[^1]: https://stanfordnlp.github.io/CoreNLP/
[^2]: https://spacy.io/
[^3]: https://radimrehurek.com/gensim/ 



