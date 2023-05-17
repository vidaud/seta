# seta-ui 🏁

* [seta_flask_server/](../seta-ui/seta_flask_server)
  * [blueprints/](../seta-ui/seta_flask_server/blueprints)
  * [infrastructure/](../seta-ui/seta_flask_server/infrastructure)
  * [repository/](../seta-ui/seta_flask_server/repository)
  * [bundle.js](../seta-ui/seta_flask_server/bundle.js)
  * [config.py](../seta-ui/seta_flask_server/config.py)
  * [dependency.py](../seta-ui/seta_flask_server/dependency.py)
  * [factory.py](../seta-ui/seta_flask_server/factory.py)
  * [index.html](../seta-ui/seta_flask_server/index.html)
  * [__init__.py](../seta-ui/seta_flask_server/__init__.py)
* [tests/](../seta-ui/tests)
  * [functional/](../seta-ui/tests/functional)
  * [infrastructure/](../seta-ui/tests/infrastructure)
  * [conftest.py](../seta-ui/tests/conftest.py)
  * [__init__.py](../seta-ui/tests/__init__.py)
* [.dockerignore](../seta-ui/.dockerignore)
* [.gitignore](../seta-ui/.gitignore)
* [app.py](../seta-ui/app.py)
* [app_dev.py](../seta-ui/app_dev.py)
* [app_test.py](../seta-ui/app_test.py)
* [changelog.txt](../seta-ui/changelog.txt)
* [Dockerfile](../seta-ui/Dockerfile)
* [Dockerfile-dev-flask](../seta-ui/Dockerfile-dev-flask)
* [Dockerfile-test](../seta-ui/Dockerfile-test)
* [gunicorn_conf.py](../seta-ui/gunicorn_conf.py)
* [requirements.txt](../seta-ui/requirements.txt)




The **seta ui**  folder contains the configuration that enables the access to the web app. \
In the files **seta-flask-server** it is possible to replicate the application across different servers with minimal reconfiguration. \
In this folder it is included the code to support the seta-api to validate the authentication token.


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