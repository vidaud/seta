# seta-data 📚


The **seta-data** folder is the image with all necessary files for the creation of the indexes used in the Elasticsearch engine.

An **ElasticSearch index** is a collection of documents that are related to each other. ElasticSearch stores data as JSON documents. Each document correlates a set of keys (names of fields or properties) with their corresponding values (strings, numbers, Booleans, dates, arrays of values, geolocations, or other types of data).

ElasticSearch uses a data structure called an inverted index, which is designed to allow very fast full-text searches. An inverted index lists every unique word that appears in any document and identifies all of the documents each word occurs in.

During the indexing process, Elasticsearch stores documents and builds an inverted index to make the document data searchable in near real-time. Indexing is initiated with the index API, through which you can add or update a JSON document in a specific index. 





## Build
The image is build it together with all the images through the execution of the docker compose:

```
    docker compose build
```

## Up
After finishing the build, launch the service to initialise the Elasticsearch:

```
    docker compose up seta-data     

```

In order to be sure that the start of service seta-data finishes correctly there must be a message like: 

> data exited with code 0




## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License
Copyright (c) 2023 European Union      
Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission – subsequent versions of the EUPL (the "Licence");     

You may not use this work except in compliance with the Licence.      


You may obtain a copy of the Licence at:      


https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12       
 
Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.             
 
See the Licence for the specific language governing permissions and limitations under the Licence.