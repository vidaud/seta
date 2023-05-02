

The following diagram describes the workflow of SeTA.
 
1. Everything starts by receiving as input from different sources the data that will fill the database.
2. The data is processed (cleaned, algorithms)
3. The processed data is used to create the AI Models
4. The parsed and labelled data is ready to use for the searching. 



![Screenshot](../img/machine_learning_icons.png)



As described previously, SeTA follows two distinct steps for the creation of the knowledge base: Document collection, cleaning and storage and Text analysis and modelling.



### Corpus preparation

As mentioned, the corpus of the public policy-related European documents comes from the following sources: EUR-LEX, CORDIS, JRC PUBSY, EUROPARL.

All the texts collected are in English only (except for some older legal texts where multiple languages are interleaved on the same page). 

The reasons for this decision are:

- [x] English language sentence dependency parsing is rather straightforward and there are several open source semantic parsers with excellent tuning for this language.

- [x] We are interested in extracting knowledge from plain text and as the translation of, for example, a directive into all EU languages does not create new knowledge, processing a single language well should capture the available information.


#### Taxonomy

In the last years, there is so much information available and easily accessible. This accessibility is mainly thanks to the technology. However, this had lead people to experience difficulties in finding precise, relevant quality information.[^1]    
This problem is also prevalent within areas where volumes of information are stored in unstructured ways in multiple repositories, databases and libraries, often with vague naming conventions that give little insight into the content and its relevance to the user. The development of taxonomy is an attempt to bring structure and deliver productivity through more effective and expeditious retrieval and use.           

Taxonomy isn’t new. It was used as early as 300 BCE in ancient Greece to classify plants.  Taxonomies organize content into logical associations in much the same way that plant and animal species are managed by modern scientists.[^2]  

Taxonomy provides[^3]: 

- Applies structure to content components and the relationships between them.
- Identifies and classifies information into a hierarchical structure so it can be analyzed.
- It’s a system of content management that groups information based on terms stored as metadata.
- It provides a unified view of the data in a system and introduces common terminologies and semantics across multiple systems.
- Formalizes the hierarchical relationships among concepts and specifies the term to be used to refer to each.
- Prescribes structure and terminology.


Is important to maintain, as much as possible, a consistent level of specificity within a category. The taxonomies can be of different types — *flat, hierarchical, network*, etc. Based on experience, a hierarchical structure is most suited. Among the hierarchical types, there are three kinds: 

  1.  Standard Hierarchy     
    Standard hierarchy taxonomy consists of a single root, which is subdivided into categories as necessary to structure the information and is often represented as a tree. It is easy to understand a single hierarchy structure and develop a mental model to find information. 

  2.  Polyhierarchy     
    In a polyhierarchy a term in a taxonomy can be repeated in different categories. 
    It is not recommended because sometimes it causes confusion. Polyhierarchy is against the first and second principles of naming taxonomy terms: "Terms should be unambiguous and mutually exclusive". 

  3. Faceted       
    A faceted classification system is multi-dimensional. It consists of multiple taxonomies or 'facets', whereby the top-level node of each represents a different type of taxonomy, attribute, or context. 


##### How to design a good taxonomy

When creating a taxonomy, consider:       
1. Scope: Decide what your taxonomy needs to cover.    
2. Granularity: Think about how detailed you need the taxonomy to be. Always base this on what's important to you.[^4]    


The following example describes part of a taxonomy:

![Screenshot](../img/taxonomy.png){width=600}

<!--```
  /natural sciences
  /natural sciences/biological sciences
  /natural sciences/biological sciences/ecology
  /natural sciences/biological sciences/ecology/ecosystems
  /natural sciences/biological sciences/zoology
  /natural sciences/biological sciences/zoology/entomology
``` -->

In SeTA, the user can define the taxonomy that is going to be used. After the user selects the terms that represent the broadest category he can then allocate the remaining terms to these categories. The user can setup the new taxonomy through the API interface. 



{++ example of SeTA taxonomy++}




#### Document cleaning pipeline
The document harvesting process is the first part of the whole pipeline. 

Documents are retrieved through different endpoints like SPARQL, SOAP, FTP or HTTP protocol parsing, from a variety of web address (URLs). There is often more than one document per metadata record. 

After metadata have been harvested and interpreted, the documents must be downloaded and processed. 

The typical process to create a general corpus involves:

- Conversion from original formats (PDF, HTML, XML, MSWord, …) to plain text.

- Conversion to Unicode, removal of text conversion artefacts, removal of non-alphanumeric characters, transposition of diacritics to ascii characters.

- De-hyphenation.

- Sentence separation based on dependency parsing (allowing the reconstruction even of sentences split over several lines).

The output of this step is a document repository containing the completely cleaned unified plain text, divided into chunks of 300 words. 

This new document structure is stored within the ElasticSearch (ES) database which allows searching and reproduction for human readers. 


#### Neural networks training

Neural networks can learn any function and only data availability defines how complex the function can be. Therefore, the data preparation, feature engineering and domain coverage become essential elements for obtaining meaningful and analysable results from neural network training.
The EC public knowledge corpus offers a consistent language and thus the features that have been created from chunks instead of words like in general language.


#### Chunk compositionality

**"Chunking"** is the process of grouping different bits of information together into more manageable or meaningful chunks[^5]. 

Three key ingredients are needed for successful chunking:

- Using small, well-organized units.
- Using units of no more than seven items.
- Finding the right level of detail.

The implementation of these steps is performed by extracting titles, abstracts and identified sentences from the whole corpus, identifying, harmonising and replacing phrases and then storing.


#### Actual neural network training

**spaCy** is a free, open-source library for advanced Natural Language Processing (NLP) in Python.[^6] It is designed specifically for production use and helps build applications that process and “understand” large volumes of text. It can be used to build information extraction or natural language understanding systems, or to pre-process text for deep learning.

Based on **spaCy**, we use a powerful python library for language modelling called **textacy**[^7] for the neural network training. It can perform a variety of natural language processing (NLP) tasks, built on the high-performance **spaCy** library. With the fundamentals: *tokenization, part-of-speech tagging, dependency parsing, etc.* delegated to another library, **textacy** focuses primarily on the tasks that come before and follow after.



[^1]: Dilnutt, Rod. (2004). The Role of Taxonomy in Knowledge Management. The International Journal of Knowledge, Culture, and Change Management: Annual Review. 3. 10.18848/1447-9524/CGP/v03/59083. https://www.researchgate.net/profile/Rod-Dilnutt/publication/324233050_The_Role_of_Taxonomy_in_Knowledge_Management/links/5e31376892851c7f7f08d1ed/The-Role-of-Taxonomy-in-Knowledge-Management.pdf?origin=publication_detail
[^2]: https://www.expert.ai/blog/what_are_taxonomies_and-how_can_you_use_them/
[^3]: https://innodata.com/understanding-the-role-of-taxonomies-ontologies-schemas-and-knowledge-graphs/
[^4]: https://kontent.ai/learn/tutorials/manage-kontent-ai/taxonomies/taxonomies-why-and-how/
[^5]: https://www.mindtools.com/a8u1mqw/chunking
[^6]: https://spacy.io/usage/spacy-101 
[^7]: https://pypi.org/project/textacy/




