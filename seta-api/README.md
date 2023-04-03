# seta-api 📃

The **seta API**  folder contains the image with the python client that serves to communicates with the docker client in order to elaborate the queries to the Elasticsearch engine that come from the web app. 

All the data that flows into the elastic search engine from the different sources. In this image is included the functions by which this raw data is parsed, normalized, and enriched before it is indexed in Elasticsearch. 

The process of index in Elasticsearch, it is also included in this image, together with the process of manage complex queries against the data and use aggregations to retrieve complex summaries of the data. 



## Build

The image is build it together with all the images through the execution of the docker-compose:

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