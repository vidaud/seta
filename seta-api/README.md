# seta-api 📃

* [results/](../seta-api/results)
* [seta_api/](../seta-api/seta_api)
  * [apis/](../seta-api/seta_api/apis)
  * [index-refactoring/](../seta-api/seta_api/index-refactoring)
  * [infrastructure/](../seta-api/seta_api/infrastructure)
  * [private/](../seta-api/seta_api/private)
  * [static/](../seta-api/seta_api/static)
  * [config.py](../seta-api/seta_api/config.py)
  * [factory.py](../seta-api/seta_api/factory.py)
  * [__init__.py](../seta-api/seta_api/__init__.py)
* [tests/](../seta-api/tests)
  * [functional/](../seta-api/tests/functional)
  * [infrastructure/](../seta-api/tests/infrastructure)
  * [conftest.py](../seta-api/tests/conftest.py)
  * [__init__.py](../seta-api/tests/__init__.py)
* [.dockerignore](../seta-api/.dockerignore)
* [.gitignore](../seta-api/.gitignore)
* [app.py](../seta-api/app.py)
* [app_dev.py](../seta-api/app_dev.py)
* [app_test.py](../seta-api/app_test.py)
* [Dockerfile](../seta-api/Dockerfile)
* [Dockerfile-dev-flask](../seta-api/Dockerfile-dev-flask)
* [Dockerfile-test](../seta-api/Dockerfile-test)
* [gunicorn_conf.py](../seta-api/gunicorn_conf.py)
* [requirements.txt](../seta-api/requirements.txt)



The **seta API**  folder contains the image with the python client that serves to communicates with the docker client in order to elaborate the queries to the Elasticsearch engine that come from the web app. 

It has all the configuration need it to make the data that flows into the elastic search engine from the different sources. In this image is included the functions by which this raw data is parsed, normalized, and enriched before it is indexed in Elasticsearch. 

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