# seta-es 🔎

The **seta-es** folder contains the image where the elastic search engine is store.

The **Elasticsearch** engine is fast, with it's logic of placing documents distributed across different containers, it provides redundant copies of the data in case of hardware failure. 

Elasticsearch comes with a wide set of features: *is fast, scalabale, and resilient.* 

It has a number of powerful built-in features that make storing and searching data even more efficient, such as data rollups and index lifecycle management.

The Elasticsearch engine simplifies data ingest, visualization, and reporting. 


## Build
***
The image is build it together with all the images

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