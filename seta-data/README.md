# seta-data 📚


* [models/](../seta-data/models)  - in this folder it is possible to find the related  files for the preparation of the suggestions proposed in the Web App and the API
  * [data-mapping.json](../seta-data/models/data-mapping.json)
  * [json_suggestion_samples.json](../seta-data/models/json_suggestion_samples.json)
  * [suggestion-data-mapping.json](../seta-data/models/suggestion-data-mapping.json)
  * [wv-sg0-hs1.bin](../seta-data/models/wv-sg0-hs1.bin)
  * [wv-sg0-hs1.bin.vectors.npy](../seta-data/models/wv-sg0-hs1.bin.vectors.npy)
  * [wv-sg0-hs1.crc](../seta-data/models/wv-sg0-hs1.crc)
* [src/](../seta-data/src)
  * [app.py](../seta-data/src/app.py)
  * [config.py](../seta-data/src/config.py)
  * [create_w2v_json_export.py](../seta-data/src/create_w2v_json_export.py)
  * [mapping.json](../seta-data/src/mapping.json)
* [.dockerignore](../seta-data/.dockerignore)
* [Dockerfile](../seta-data/Dockerfile)
* [requirements.txt](../seta-data/requirements.txt)



The **seta-data** folder is the image with all necessary files for the creation of the indexes used in the elastic search engine.

An **ElasticSearch index** is a collection of documents that are related to each other. ElasticSearch stores data as JSON documents. Each document correlates a set of keys (names of fields or properties) with their corresponding values (strings, numbers, Booleans, dates, arrays of values, geolocations, or other types of data).

ElasticSearch uses a data structure called an inverted index, which is designed to allow very fast full-text searches. An inverted index lists every unique word that appears in any document and identifies all of the documents each word occurs in.

During the indexing process, Elasticsearch stores documents and builds an inverted index to make the document data searchable in near real-time. Indexing is initiated with the index API, through which you can add or update a JSON document in a specific index. 


## Build
The image is build it together with all the images through the execution of the docker compose:

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License


[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/